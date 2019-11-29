---
layout: post
title: "Quickie ColdFusion Image Viewer"
date: "2006-07-24T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/07/24/Quickie-ColdFusion-Image-Viewer
guid: 1424
---

Need a quick way to add a slide show to a directory of images? I have many times in the past. Here is a simple block of code. It needs to be dropped in the same folder as the images, and it doesn't do anything fancy like thumbnails, but it does let you quickly add an image browser. This is much easier than giving someone an index of images and asking them to go back and forth to view all the images. Comments are inline with the code, but let me know if you have any questions. And yes, obviously, it could be done a lot more fancier. Remember KISS.
<!--more-->
<code>
&lt;!--- param the image to show ---&gt;
&lt;cfparam name="url.image" default="1"&gt;

&lt;!--- directory ---&gt;
&lt;cfset dir = expandPath(".")&gt;

&lt;!--- get all images ---&gt;
&lt;cfdirectory directory="#dir#" filter="*.jpg" name="images"&gt;

&lt;!--- quick sanity checks ---&gt;
&lt;cfif not isNumeric(url.image) or url.image lte 0 or url.image gt images.recordcount or round(url.image) neq url.image&gt;
	&lt;cfset url.image = 1&gt;
&lt;/cfif&gt;

&lt;!--- do we even have images? ---&gt;
&lt;cfif images.recordCount&gt;
	&lt;cfoutput&gt;
	&lt;table align="center"&gt;
		&lt;tr&gt;
			&lt;td colspan="2"&gt;&lt;img src="#images.name[url.image]#"&gt;&lt;/td&gt;
		&lt;/tr&gt;
		&lt;!--- links ---&gt;
		&lt;tr&gt;
			&lt;td&gt;
			&lt;cfif url.image gt 1&gt;
			&lt;a href="#listLast(getCurrentTemplatePath(),"\/")#?image=#url.image-1#"&gt;Previous&lt;/a&gt;
			&lt;cfelse&gt;
			Previous
			&lt;/cfif&gt;
			&lt;/td&gt;
			&lt;td align="right"&gt;
			&lt;cfif url.image lt images.recordCount&gt;
			&lt;a href="#listLast(getCurrentTemplatePath(),"\/")#?image=#url.image+1#"&gt;Next&lt;/a&gt;
			&lt;cfelse&gt;
			Next
			&lt;/cfif&gt;
			&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/table&gt;
	&lt;/cfoutput&gt;
&lt;/cfif&gt;
</code>