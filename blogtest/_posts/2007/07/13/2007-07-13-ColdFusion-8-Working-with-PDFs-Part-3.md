---
layout: post
title: "ColdFusion 8: Working with PDFs (Part 3)"
date: "2007-07-13T11:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/13/ColdFusion-8-Working-with-PDFs-Part-3
guid: 2192
---

So today's CFPDF entry will detail how you can add a watermark to a PDF. Why would you do that? You may want to mark a PDF for security reasons. As an example, this weeks episode of Entourage featured M. Night Shyamalan (will his movies ever be good again?) giving Ari (a hollywood agent) a copy of his latest script. On every single page of the script, Ari's name was printed across the text. That way if the script was leaked to the Internet, M. Night would know exactly who to blame.
<!--more-->
ColdFusion 8 gives up multiple ways to work with watermarks. 

<ul>
<li>First off - you can use an existing PDF or an image for your watermark. I had some issues with images which I'll talk about at the very end. 
<li>You can set your watermark to be in the background or foreground.
<li>You can make your watermark only show up on screen and not in print.
<li>You can set a rotation.
<li>You can set opacity.
<li>You can position where the watermark is applied.
<li>You can put the watermark only on certain pages.
</ul>

So as you can see, you have a lot of options. Let's start with a simple example. First I'll create a PDF for my movie script:

<code>
&lt;cfdocument format="pdf" name="mydocument"&gt;
&lt;cfloop index="x" from="1" to="20"&gt;
&lt;p&gt;
doloras lorem upsom doloras paris hilton is my hero loreum ipsom dsoio foom an to dht end of the world
will anyone actually read this probably not but let me put more realtext in so it flows a bit nicely
&lt;cfloop index="y" from="1" to="#randRange(1,9)#"&gt;This sentence will appear a random amount of time.&lt;/cfloop&gt;
&lt;/p&gt;
&lt;/cfloop&gt;
&lt;/cfdocument&gt;
</code>

Now I'll create a watermark. I'm going to use a PDF which means I'll need to save it to the file system as well:

<code>
&lt;cfdocument format="pdf" name="watermark"&gt;
&lt;h1&gt;Raymond Camden&lt;/h1&gt;&lt;br /&gt;
&lt;h1&gt;&lt;cfoutput&gt;#dateformat(now(),"short")# #timeformat(now(), "short")#&lt;/cfoutput&gt;&lt;/h1&gt;
&lt;/cfdocument&gt;

&lt;cfset wfile = getTempFile(getTempDirectory(), "wfile")&gt;
&lt;cffile action="write" file="#wfile#" output="#watermark#"&gt;
</code>

All I've done here is used my name and the current date and time. I then save it to a temporary file using ColdFusion's built in getTempFile/getTempDirectory functions.

Now let me add it as a watermark:

<code>
&lt;cfpdf action="addWatermark" copyFrom="#wfile#" rotation="30" foreground="true" source="mydocument" name="mydocument" showonprint="true" overwrite="true" position="200,0"&gt;
</code>

The copyFrom attribute tells CFPDF to copy the watermark from a file. I've set a rotation of 30 degrees and put the watermark in the foreground. My source is a PDF in memory (the one built above). I also set the watermark to show up when printing as well. Lastly I've positioned where the PDF shows up. I've attached the PDF to this blog entry as an attachment. Pretty simple, eh? Here is the complete template.

<code>
&lt;cfdocument format="pdf" name="mydocument"&gt;
&lt;cfloop index="x" from="1" to="20"&gt;
&lt;p&gt;
doloras lorem upsom doloras paris hilton is my hero loreum ipsom dsoio foom an to dht end of the world
will anyone actually read this probably not but let me put more realtext in so it flows a bit nicely
&lt;cfloop index="y" from="1" to="#randRange(1,9)#"&gt;This sentence will appear a random amount of time.&lt;/cfloop&gt;
&lt;/p&gt;
&lt;/cfloop&gt;
&lt;/cfdocument&gt;

&lt;cfset wfile = getTempFile(getTempDirectory(), "wfile")&gt;
&lt;cfdocument format="pdf" name="watermark"&gt;
&lt;h1&gt;Raymond Camden&lt;/h1&gt;&lt;br /&gt;
&lt;h1&gt;&lt;cfoutput&gt;#dateformat(now(),"short")# #timeformat(now(), "short")#&lt;/cfoutput&gt;&lt;/h1&gt;
&lt;/cfdocument&gt;

&lt;cffile action="write" file="#wfile#" output="#watermark#"&gt;


&lt;cfpdf action="addWatermark" copyFrom="#wfile#" rotation="30" foreground="true" source="mydocument" name="mydocument" showonprint="true" overwrite="true" position="200,0"&gt;


&lt;cfcontent type="application/pdf" reset="true" variable="#toBinary(mydocument)#"&gt; 
</code>

So I mentioned that I had a few issues with images. Here is what I found, and I want to thank Adobe for their help in hashing this out. First - if you want to use an image you create on the fly, it must be grayscale. If you have an image on the file system, it can be any color model. Another problem I ran into was rotating the image using imageRotate. When I did it created a background that messed with the PDF. But I was able to switch to using CFPDF's rotate instead. I'm pasting the image example below for folks who want to see how that looks.

<code>
&lt;cfdocument format="pdf" name="mydocument"&gt;

&lt;cfloop index="x" from="1" to="20"&gt;
&lt;p&gt;
doloras lorem upsom doloras paris hilton is my hero loreum ipsom dsoio foom an to dht end of the world
will anyone actually read this probably not but let me put more realtext in so it flows a bit nicely
&lt;cfloop index="y" from="1" to="#randRange(1,9)#"&gt;This sentence will appear a random amount of time.&lt;/cfloop&gt;
&lt;/p&gt;
&lt;/cfloop&gt;

&lt;/cfdocument&gt;

&lt;cfset textImage=ImageNew("",500,500,"grayscale","white")&gt;

&lt;cfset ImageSetDrawingColor(textImage,"black")&gt;

&lt;cfset attr=StructNew()&gt;
&lt;cfset attr.size=50&gt;
&lt;cfset attr.style="bold"&gt;
&lt;cfset attr.font="ArialMT"&gt;

&lt;cfset ImageSetAntialiasing(textImage, "on")&gt;

&lt;cfset ImageDrawText(textImage,"Raymond Camden",50,50,attr)&gt;

&lt;cfpdf action="addWatermark" image="#textImage#" rotation="30" foreground="true" source="mydocument" name="mydocument" showonprint="true" overwrite="true"&gt;


&lt;cfcontent type="application/pdf" reset="true" variable="#toBinary(mydocument)#"&gt; 
</code><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fparis%{% endraw %}2Epdf'>Download attached file.</a></p>