---
layout: post
title: "Ask a Jedi: Using ColdFusion Image functions and ImageUtils to create dynamic banners"
date: "2010-05-19T18:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/05/19/Ask-a-Jedi-Using-ColdFusion-Image-functions-and-ImageUtils-to-create-dynamic-banners
guid: 3822
---

Michael asks:

<blockquote>
I have a logo area that is generated from a background image and some data from a database.<br/>
<br/><br/>
&lt;div id="logo_area"&gt;  &lt;!---Logo Area---&gt;<br/>
           &lt;div id="logotext"&gt;<br/>
                   &lt;span style="font-size:36px; white-space: nowrap;"&gt;&lt;cfoutput&gt;#Session.TeamName#&lt;/cfoutput&gt;&lt;/span&gt;&lt;br/&gt;<br/>
                   &lt;cfoutput&gt;#Session.City#&lt;/cfoutput&gt;,&nbsp;&lt;cfoutput&gt;#Session.State#&lt;/cfoutput&gt;<br/>
           &lt;/div&gt;<br/>
&lt;/div&gt;<br/>
<br/>
<br/>
I wondering if there is any way to take an image snap shot of this area.   I need it to be a jpeg or gif for use somewhere else.
</blockquote>
<!--more-->
That's an interesting question. My first suggestion was probably overkill. Remember that you can use cfdocument to wrap HTML to create a PDF. Once you have the PDF, you can then get the thumbnail. That would - technically - allow you to render HTML out to an image. I took a look at his HTML and it seemed like he was simply creating a "template" and I decided to see if we could build it with image functions. Let's begin by taking a look at the source image, our banner. (And I should note - his original banner was a GIF 1k pixels wide. I used Acorn to shrink it down a bit. Any issues you see with the source are from me doing a quick and dirty resize.)

<p>

<img src="https://static.raymondcamden.com/images/original.PNG" />

<p>

Given this source, we want to have a line of text on top that is slightly larger followed by a second line of text below that. Both should be centered in the banner. Now - as we know, ColdFusion makes it trivial to write text on an image. Unfortunately, there is no real support for <i>centering</i> an image. This is where <a href="http://imageutils.riaforge.org/">imageUtils</a> comes into play. This is a component created by Ben Nadel, myself, and others, that collects various utility methods around image management. We have two methods specifically that can be of help to us. First is getCenteredTextPosition. As you can guess, this will tell you where to drop a line of text so that it is centered on the image. The second is getTextDimensions. This returns the width and height of a block of text. Let's look at an example of getCenteredTextPosition first. 

<p>

<code>
&lt;!--- location of banner ---&gt;
&lt;cfset bannerFile = "/Users/ray/Downloads/banners9.gif"&gt;

&lt;cfset img = imageNew(bannerFile)&gt;

&lt;cfset imageSetAntialiasing(img,"on")&gt;
&lt;cfset imageSetDrawingColor(img,"black")&gt;

&lt;cfset line1 = "Camden's BBQ"&gt;

&lt;!--- draw the first line of text ---&gt;
&lt;cfset font = "AndaleMono"&gt;
&lt;cfset style = "bold"&gt;
&lt;cfset size = 28&gt;
&lt;cfset pos = imageUtils.getCenteredTextPosition(img, line1, font, style, size)&gt;
&lt;cfset tProps =  {% raw %}{ style=style, size=size, font=font }{% endraw %}&gt;
&lt;cfset imageSetDrawingColor(img,"black")&gt;
&lt;cfset imageDrawText(img, line1, pos.x, pos.y, tProps)&gt;
&lt;cfimage action="writeToBrowser" source="#img#"&gt;
</code>

<p>

Ok, so I begin by creating a new source image pointing to the source banner. I then set two miscellaneous settings, anti aliasing (makes prettier text) and the drawing color. Next I set my variables. line1 will be the text. The next three variables represent my font attributes (I picked AndaleMono by random). Finally we run the getCenteredTextPosition method. This returns a structure with an X and Y value. Once we have that, it's child's play to actually draw the text. The result?

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/v11.PNG" />

<p>

Works nicely. Unfortunately, now we run into a problem. We have two lines of text - both at different sizes. How do we place them? The getCenteredTextPosition method assumes you want the direct center. What we want is the horizontal center, but we need to space them out vertical wise. It took me a few minutes to get the math right, and I'm still not quite sure it <i>is</i> right, but I think I got it. I also discovered a slight bug with imageUtils. It is rendering the size of the text differently in getCenteredTextPosition versus getTextDimensions. I ended up using a mixture of both. Here's the code I have now:

<p>

<code>

&lt;!--- location of banner ---&gt;
&lt;cfset bannerFile = "/Users/ray/Downloads/banners9.gif"&gt;

&lt;cfset img = imageNew(bannerFile)&gt;
&lt;cfset imageSetAntialiasing(img,"on")&gt;

&lt;cfset line1 = "Camden's BBQ"&gt;
&lt;cfset line2 = "Because salad is what dinner eats."&gt;

&lt;cfset fontLine1 = {% raw %}{font="AndaleMono", style="bold", size=28}{% endraw %}&gt;
&lt;cfset tsizeLine1 = imageUtils.GetTextDimensions(line1,fontLine1)&gt;

&lt;cfset fontLine2 = {% raw %}{font="AndaleMono", style="bold", size=18}{% endraw %}&gt;
&lt;cfset tsizeLine2 = imageUtils.GetTextDimensions(line2,fontLine2)&gt;

&lt;!--- used to pad the two lines ---&gt;
&lt;cfset vspace = 0&gt;
&lt;cfset totalHeight = tsizeLine1.height + tsizeLine2.height + vspace&gt;

&lt;cfset topYForLine1 = ((imageGetHeight(img) - totalHeight) / 2) + tsizeline1.height/2&gt;
&lt;cfset topYForLine2 = (imageGetHeight(img) - totalHeight)/2 + totalHeight&gt;
&lt;cfset xForLine1 = (imageGetWidth(img) - tsizeLine1.width) / 2&gt;
&lt;cfset xForLine2 = imageGetWidth(img)/2 - tsizeLine2.width / 2&gt;

&lt;cfset tempPos = imageUtils.getCenteredTextPosition(img, line2, fontLine2.font, fontline2.style, fontline2.size)&gt;
&lt;cfset xForLine2 = tempPos.x&gt;

&lt;cfset imageDrawText(img, line1, xForLine1 , topYForLine1, fontLine1)&gt;
&lt;cfset imageDrawText(img, line2, xForLine2 , topYForLine2, fontLine2)&gt;

&lt;cfimage action="writeToBrowser" source="#img#"&gt;
</code>

<p>

So you can see where I create two font structures and then determine the sizes for each. For my Y positions, I figure out how tall both text blocks are together. I use that along with the total size of the image and basically split it up. This worked ok - but again - I noticed something odd with the sizing of the second line of text. It was being reported as about 30 pixels more than it should be. Therefore I used tempPos as a workaround to get the right X position. The result?

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/v21.PNG" />

<p>

And of course, once you have it working, you can then make the text dynamic:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/v3.PNG" />

<p>

Thoughts? I'm not convinced my math is 100% right (but hey, at least I haven't crashed a robot into the surface of Mars lately) so I'm definitely open to some suggestions here.