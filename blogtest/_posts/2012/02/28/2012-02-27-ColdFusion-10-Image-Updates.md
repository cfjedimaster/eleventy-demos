---
layout: post
title: "ColdFusion 10 Image Updates"
date: "2012-02-28T07:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/02/28/ColdFusion-10-Image-Updates
guid: 4542
---

ColdFusion 10 provides a few updates to image handling that may be useful to folks. Here's a brief run down of what's new in ColdFusion 10 and image handling.
<!--more-->
<p/>

The first feature I'll demonstrate is imageColorTransparent. This takes an image and a color and returns a new image with said color now transparent. So for example:

<p/>

<code>

&lt;cfset img = imageRead("untitled.png")&gt;

&lt;div style="float:left"&gt;
&lt;h2&gt;Original&lt;/h2&gt;
&lt;cfimage action="writeToBrowser" source="#img#"&gt;
&lt;/div&gt;

&lt;cfset img2 = imageMakeColorTransparent(img,"##ff0000")&gt;

&lt;div style="float:left"&gt;
&lt;h2&gt;Modified&lt;/h2&gt;
&lt;cfimage action="writeToBrowser" source="#img2#"&gt;
&lt;/div&gt;
</code>

<p>

Nice and simple right? Here's the result:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip28.png" />

<p>

The next function we'll look at is imageMakeTranslucent, which, as you can probably guess, makes an image more transparent. Here's an example:

<p>

<code>
&lt;cfset img = imageRead("thorshark.jpg")&gt;

&lt;div style="float:left"&gt;
&lt;h2&gt;Original&lt;/h2&gt;
&lt;cfimage action="writeToBrowser" source="#img#"&gt;
&lt;/div&gt;

&lt;cfset img2 = imageMakeTranslucent(img,"50")&gt;

&lt;div style="float:left"&gt;
&lt;h2&gt;Modified&lt;/h2&gt;
&lt;cfimage action="writeToBrowser" source="#img2#"&gt;
&lt;/div&gt;
</code>

<p>

The function takes in an image as the source and a number from 0 to 100 for how translucent to make it. Here's the result:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip29.png" />

<p>

Another new function provides support for creating CAPTCHAs via cfscript:

<p>

<code>
&lt;cfscript&gt;
	//also supports font/fontsize
	cImage = imageCreateCaptcha(50, 200, "Beer","medium");
&lt;/cfscript&gt;

&lt;cfimage action="writeToBrowser" source="#cImage#"&gt;
</code>

<p>

We all know what CAPTCHAs look like so I won't bother sharing a screen shot. Now for something pretty darn cool. One of the issues with image manipulation is handling dynamic text. ColdFusion made it easy to write dynamic text on an image, but wasn't easy was determining if the text actually <i>fit</i> on the image. (This is one of the things the open source <a href="http://imageutils.riaforge.org/">ImageUtils</a> project at RIAForge handles.) ColdFusion 10 now lets you get information about text written to an image. Consider this code:

<p>

<code>
&lt;cfset img = imageNew("",300,300)&gt;

&lt;cfset res = imageDrawText(img, "My name is Tron", 0, 0, {% raw %}{size:12,style:"bold"}{% endraw %})&gt;

&lt;cfdump var="#res#" label="12, bold"&gt;

&lt;!--- slightly bigger... ---&gt;
&lt;cfset res = imageDrawText(img, "My name is Tron", 0, 0, {% raw %}{size:13,style:"bold"}{% endraw %})&gt;

&lt;cfdump var="#res#" label="13, bold"&gt;

&lt;!--- back to 12, but not bold ---&gt;
&lt;cfset res = imageDrawText(img, "My name is Tron", 0, 0, {% raw %}{size:12}{% endraw %})&gt;

&lt;cfdump var="#res#" label="12, non bold"&gt;
</code>

<p>

You can see we've got 3 different types of text. The actual text is the same, but the display is different because of the font attributes. Here are the results:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip30.png" />

<p>

As expected, changes to bold attributes impact the size. Now, there's one thing to keep in mind. To use this new feature you have to actually draw out the text. In a real application, I'd consider using a blank canvas like I did above and not writing on a real file. So given a banner of a certain width and height, simply make a new one  with the same size (totally virtually, not store on disk), write the dynamic text and see if it fits, and if so, then read in the real image, do your write, and save that version.

<p>

Another update is to imageOverlay. You can supply both a rule and an alpha to the overlay. In the past, there were no options at all. For an example of the rules, see <a href="http://docs.oracle.com/javase/tutorial/2d/advanced/compositing.html">Compositing Graphics</a>. I've also included a sample in the zip file attached to this blog entry.

<p>

So what else changed? The cfimage/captcha option tag can now return it's data into a variable. Useful if you need to store the CAPTCHA in a variable. The cfimage tag also supports interpolation attributes for resize actions. 

<p>

Another cool change - if you don't specify a font for the CAPTCHA tag/function, ColdFusion 10 will  now fallback to a default font instead of throwing an error. This makes it easier to write code that will work across multiple systems. 

<p>

All code from this blog entry is available via the download link below. Enjoy.

<p>

<b>Edited at 7:50AM:</b> Just a quick note. One of the Adobe engineers, Chandan Kumar, shared an interesting fact about imageMakeColorTransparent. You can actually run it multiple times to make multiple colors transparent. Ie:

<p>

<code>
&lt;cfimage action="writeToBrowser" source="#img#"&gt;

&lt;cfset img = imageMakeColorTransparent(img,"##EC1C24")&gt;
&lt;cfset img = imageMakeColorTransparent(img,"##EC1F26")&gt;
&lt;cfset img = imageMakeColorTransparent(img,"##ED2931")&gt;
&lt;cfset img = imageMakeColorTransparent(img,"##EC1D25")&gt;
&lt;cfset img = imageMakeColorTransparent(img,"##EC1E26")&gt;
&lt;cfset img = imageMakeColorTransparent(img,"##EC1F27")&gt;
&lt;cfset img = imageMakeColorTransparent(img,"##EC1B23")&gt;
&lt;cfset img = imageMakeColorTransparent(img,"##F1545A")&gt;
&lt;cfset img = imageMakeColorTransparent(img,"##F2555B")&gt;
</code><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2012%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fimages%{% endraw %}2Ezip'>Download attached file.</a></p>