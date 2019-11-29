---
layout: post
title: "ColdFusion 8 Image Resize options"
date: "2008-11-01T10:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/01/ColdFusion-8-Image-Resize-options
guid: 3077
---

From time to time people will ask (either here, or cf-talk, or wherever) about the speed of ColdFusion 8's image resizing. Typically they are asking because the speed can be a bit slow. My normal response is to remind people that Adobe provided numerous ways to resize, ranging from very slow and high quality options to much quicker and less quality options. I've been meaning to write a script that would compare these resize options and I finally got a chance too this morning.
<!--more-->
Before I go into the script, I have to apologize. I normally tell people about the resize options (called interpolation algorithms) and then point out that Adobe ships 17 choices. However I was wrong. The options are grouped into a list of values with generic terms like highPerformance or highestQuality and named ones like lanczos and hanning (which sound like Star Trek names if you ask me). 

Here is where things get a bit weird. You would think there would be a one to one relation between the generic and named options. However there are more named options than generic ones. My assumption is that Adobe mapped some of the generic options to one of the named options. I created the following list would uses both the generic and named options, and should represent a move from highest quality to highest performance.

<ul>
<li>highestQuality
<li>lanczos
<li>highquality
<li>mitchell
<li>mediumPerformance
<li>quadratic
<li>mediumquality
<li>hamming
<li>hanning
<li>hermite
<li>highPerformance
<li>blackman
<li>bessel
<li>highestPerformance
<li>nearest
<li>bicubic
<li>bilinear
</ul>

My script would go through each of these, perform a resize and see how long it took, how big the file was, and output a link to the image so I could see the quality. 

In my first test using a 300k or so JPG, the highest quality resize took a huge amunt of time - close to 4 minutes. In my second test, using a <i>larger</i> image, it took a lot <i>less</i> time. The docs do say that resizing performance/result will depend on the source image, which isn't surprising, but it bares repeating I think. 

Something else I noticed was that - both with the super slow to resize image and the not so slow image - I was not able to visibly tell a difference. It may be that I don't have an artist's eyes. It may also be that when I saved the image, I always used the highest quality setting (so in other words, a range of options for resizing, but always the best for saving). Based on what I saw though - at least for images to be shown on the web - I see no reason to not use the quickest resize. Of course 2 tests isn't very scientific, but it's something to keep in mind. ColdFusion defaults to the highest performance. I'd probably <i>not</i> use that default in my applications.

I've included the script I used below. All you have to do is modify the sourceImage line to test yourself. Here is the results from my last test:

<table border>
<tr><th align='left'>Method</th><th align='left'>Size</th><th align='left'>Time (Seconds)</th></tr><tr><td align='left'>highestQuality</td><td align='left'>425Kb</td><td align='left'>1.703</td></tr>
<tr><td align='left'>lanczos</td><td align='left'>425Kb</td><td align='left'>1.703</td></tr>
<tr><td align='left'>highquality</td><td align='left'>392Kb</td><td align='left'>1.187</td></tr>

<tr><td align='left'>mitchell</td><td align='left'>392Kb</td><td align='left'>1.188</td></tr>
<tr><td align='left'>mediumPerformance</td><td align='left'>392Kb</td><td align='left'>1.203</td></tr>
<tr><td align='left'>quadratic</td><td align='left'>367Kb</td><td align='left'>0.938</td></tr>
<tr><td align='left'>mediumquality</td><td align='left'>390Kb</td><td align='left'>0.704</td></tr>
<tr><td align='left'>hamming</td><td align='left'>390Kb</td><td align='left'>0.688</td></tr>

<tr><td align='left'>hanning</td><td align='left'>398Kb</td><td align='left'>0.687</td></tr>
<tr><td align='left'>hermite</td><td align='left'>397Kb</td><td align='left'>0.703</td></tr>
<tr><td align='left'>highPerformance</td><td align='left'>390Kb</td><td align='left'>0.687</td></tr>
<tr><td align='left'>blackman</td><td align='left'>407Kb</td><td align='left'>0.687</td></tr>
<tr><td align='left'>bessel</td><td align='left'>385Kb</td><td align='left'>1.828</td></tr>

<tr><td align='left'>highestPerformance</td><td align='left'>433Kb</td><td align='left'>0.031</td></tr>
<tr><td align='left'>nearest</td><td align='left'>435Kb</td><td align='left'>0.016</td></tr>
<tr><td align='left'>bicubic</td><td align='left'>433Kb</td><td align='left'>0.032</td></tr>
<tr><td align='left'>bilinear</td><td align='left'>414Kb</td><td align='left'>0.031</td></tr>

</table>

Notice that there seems to be no real difference in file size. At most 50k or so separates them. Also notice that bessel is oddly slow compared to the algorithms near it. That may be one to avoid.

In case you want to see the images themselves (I felt they were too big to include on this blog entry), I've linked the original, highest quality, and highest performance images:

<ul>
<li><a href="http://www.raymondcamden.com/images/DSC00014.jpg">Original</a>
<li><a href="http://www.coldfusionjedi.com/images/highestQuality_DSC00014.jpg">Highest Quality</a>
<li><a href="http://www.coldfusionjedi.com/images/bilinear_DSC00014.jpg">Bilinear</a>
</ul>

<code>
&lt;cfscript&gt;
/**
* Will take a number returned from a File.Filesize, calculate the number in terms of Bytes/Kilobytes/Megabytes and return the result.
* v2 by Haikal Saadh
*
* @param number      Size in bytes of the file. (Required)
* @return Returns a string.
* @author Kyle Morgan (admin@kylemorgan.com)
* @version 2, August 7, 2006
*/
function fncFileSize(size) {
    if ((size gte 1024) and (size lt 1048576)) {
        return round(size / 1024) & "Kb";
    } else if (size gte 1048576) {
        return decimalFormat(size/1048576) & "Mb";
    } else {
        return "#size# b";
    }
}
&lt;/cfscript&gt;

&lt;cfset methods = "highestQuality,lanczos,highquality,mitchell,mediumPerformance,quadratic,mediumquality,hamming,hanning,hermite,highPerformance,blackman,bessel,highestPerformance,nearest,bicubic,bilinear"&gt;

&lt;cfset results = queryNew("method,size,time")&gt;
	
&lt;cfset sourceImage = expandPath("./DSC00014.jpg")&gt;

&lt;cfset finfo = getFileInfo(sourceImage)&gt;
&lt;cfset img = imageRead(sourceImage)&gt;
&lt;cfset iinfo = imageInfo(img)&gt;

&lt;cfdump var="#iinfo#" label="File Size in Bytes: #finfo.size#"&gt;

&lt;cfimage action="writeToBrowser" source="#sourceImage#"&gt;

&lt;hr/&gt;

&lt;cfloop index="m" list="#methods#"&gt;
	&lt;cfoutput&gt;
	&lt;h2&gt;Resize Method: #m#&lt;/h2&gt;
	&lt;cfset newImage = duplicate(img)&gt;
	&lt;cfset timer = getTickCount()&gt;
	&lt;cfset imageScaleToFit(newImage, 700, 700, m)&gt;
	&lt;cfset total = getTickCount() - timer&gt;
	&lt;cfset filename = m & "_" & getFileFromPath(sourceImage)&gt;
	&lt;cfset imageWrite(newImage,expandPath(filename),1)&gt;
	&lt;cfset finfo = getFileInfo(expandPath(filename))&gt;
	&lt;cfoutput&gt;&lt;p&gt;#fncFileSize(finfo.size)# bytes at #total/1000# seconds&lt;/p&gt;&lt;/cfoutput&gt;
	&lt;img src="./#m#_#getFileFromPath(sourceImage)#"&gt;
	&lt;/cfoutput&gt;
	&lt;cfset queryAddRow(results)&gt;
	&lt;cfset querySetCell(results, "method", m)&gt;
	&lt;cfset querySetCell(results, "size", fncFileSize(finfo.size))&gt;
	&lt;cfset querySetCell(results, "time", total/1000)&gt;
	&lt;cfflush&gt;
&lt;/cfloop&gt;

&lt;cftable query="results" border colHeaders htmlTable&gt;
	&lt;cfcol header="Method" text="#method#"&gt;
	&lt;cfcol header="Size" text="#size#"&gt;
	&lt;cfcol header="Time (Seconds)" text="#time#"&gt;
&lt;/cftable&gt;
</code>