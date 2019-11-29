---
layout: post
title: "ColdFusion 8 - Automatic Thumbnail/Preview Demo"
date: "2009-04-23T17:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/04/23/ColdFusion-8-Automatic-ThumbnailPreview-Demo
guid: 3326
---

This is a neat little piece of code sent to me by Miles Jordan. He credited Dave Watts for the original idea. The code makes use of the CFTOOLTIP tag, one of ColdFusion 8's Ajax features. The tag allows you to easily provide tooltip information for items on the page. What's cool is that the tooltip can be both simple text and HTML. He makes use of this by feature by simply using the larger version of the image as the tooltip. Check it out:

<code>
&lt;cfset image_path = "/Users/ray/Pictures/sad.jpg" &gt;
&lt;cfimage name="large_preview" source="#image_path#"&gt;
&lt;cfset imageScaleToFit(large_preview,600,600,'bicubic')&gt;
&lt;cfsavecontent variable="tooltip_image"&gt;
	&lt;cfimage source="#large_preview#" action="writeToBrowser"&gt;
&lt;/cfsavecontent&gt;

&lt;cftooltip tooltip="#tooltip_image#" autodismissdelay="5000"&gt;
	&lt;cfimage name="small_preview" source="#image_path#"&gt;
	&lt;cfset imageScaleToFit(small_preview,120,120,'bicubic')&gt;
	&lt;cfimage source="#small_preview#" action="writeToBrowser"&gt;
&lt;/cftooltip&gt;
</code>

He begins with an initial image resize to a decent, but still large, size. Notice the saves the HTML created by the writeToBrowser action. This HTML is then used in the tooltip.

Altogether, you get this effect when you mouseover the image:

<img src="https://static.raymondcamden.com/images//moo.png">

Pretty nifty. Just one nit - I'd save the resized images. Image resizing on the fly for every request is typically a bad idea.