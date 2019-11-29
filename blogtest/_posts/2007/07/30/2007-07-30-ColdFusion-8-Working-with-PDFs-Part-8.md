---
layout: post
title: "ColdFusion 8: Working with PDFs (Part 8)"
date: "2007-07-31T00:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/30/ColdFusion-8-Working-with-PDFs-Part-8
guid: 2236
---

Time for the last entry concerning the &lt;CFPDF&gt; tag. This isn't the end of the series - just the last post I'll be writing about the tag. After this we move on to PDFs and Forms which should be pretty darn exciting as well. 

Today's entry involves the thumbnails feature of &lt;CFPDF&gt;. I talked about this in the past when I created my <a href="http://www.raymondcamden.com/index.cfm/2007/6/13/ColdFusion-8-URL-Thumbnails">getThumbnail</a> UDF. This UDF used the feature that I'll be discussing today.
<!--more-->
Let's start by talking about how the thumbnails work. ColdFusion provides you with the following main options for thumbnails:

<ul>
<li>For formats - you can use TIFF, JPEG, or PNEG
<li>You have two resolution options - low and high. This is a bit surprising since most other image related options give you more finer control, but hey, sometimes simpler is better.
<li>You can scale the image from 1 to 100% of the PDF size.
<li>You can specify which page to generate thumbnails from. My getThumbnails UDF simply used the first page.
</ul>

Along with these options, you have a few other settings as well I'll discuss later. Let's look at a simple example:

<code>
&lt;cfset dir = expandPath("./thumbs")&gt;
&lt;cfif not directoryExists(dir)&gt;
	&lt;cfdirectory action="create" directory="#dir#"&gt;
&lt;/cfif&gt;

&lt;cfdocument format="pdf" name="mypdf"&gt;
&lt;h1&gt;Top 10 Reasons why ColdFusion 8 Kicks Rear&lt;/h1&gt;

&lt;p&gt;
10. Ajax UI controls make my design suck less.&lt;br /&gt;
9. 500{% raw %}% faster. Seriously - 500%{% endraw %} faster. That's like... fast.&lt;br /&gt;
8.  &lt;cfajaxproxy&gt; - Couldn't Adobe make Ajax easier? No.&lt;br /&gt;
7. Debugging. Not that CF developers make mistakes.&lt;br /&gt;
6. No more d*** custom MySQL drivers.&lt;br /&gt;
5. PDF toolset that makes PDF sexy. And that's saying a lot.&lt;br /&gt;
4. Interaces. Yeah, I said Interfaces. Whooyah.&lt;br /&gt;
3. Server Monitor - and it's all Flex.&lt;br /&gt;
2. Server Monitor API - in case you don't want it all Flex.&lt;br /&gt;
1. It's not Dot Net.&lt;br /&gt;
&lt;/p&gt;
&lt;/cfdocument&gt;

&lt;cfpdf action="thumbnail" source="mypdf" destination="#dir#" resolution="high" scale="50" overwrite="true"&gt;
</code>

Most of the code isn't terribly relevant to thumbnails. I start off creating a thumbs folder if it doesn't exist. Then a PDF document variable is created. (Go ahead. Read. Laugh. I'm going to make a tee shirt I think.) The critical line is the last one. I specify the thumbnail action for my CFPDF tag. The source is the PDF I created in memory earlier. CFPDF needs to know where to store it - so I pass in the "dir" folder I created earlier. I used a high resolution and a scale of 50 and lastly set overwrite to true. That generated this graphic (note I cropped the image a bit):


<img src="https://static.raymondcamden.com/images/cfjedi/thumbnail_page_11.jpg">

Let me point out something. The name of this file is thumbnail_page_1.jpg. Where did this name come from? ColdFusion automatically uses a name of the format:

prefix_page_N.TYPE

You can overwrite the prefix by suppling the imagePrefix attribute. If you used ray, for example, you would end up with images named ray_page_1.jpg, ray_page_2.jpg, etc. If you leave imagePrefix blank, it defaults to thumbnail, <b>unless</b> your source is a PDF file. In that case the filename is used instead. Consider this modification to the previous example:

<code>
&lt;cfpdf action="thumbnail" source="mypdf" destination="#dir#" resolution="high" scale="50" overwrite="true" imagePrefix="t"&gt;
</code>

This will generate file names like: t_page_1.jpg, t_page_2.jpg, etc.

So what's cool about this? You can provide image previews of PDFs before users download them. You could even wrap a link to a PDF with a &lt;cftooltip&gt; tag that shows the image as a tool tip. As an example:

<code>
&lt;cftooltip tooltip="&lt;img src='thumbs/t_page_1.jpg'&gt;"&gt;
&lt;a href="mypdf.pdf"&gt;My PDF&lt;/a&gt;
&lt;/cftooltip&gt;
</code>