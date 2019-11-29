---
layout: post
title: "ImageScaleToFit goes both ways"
date: "2007-10-25T15:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/25/ImageScaleToFit-goes-both-ways
guid: 2434
---

Ok, so this is probably me having a "Duh" moment here, but I forgot that imageScaleToFit goes both ways. What do I mean by that? If you are using the code to create a thumbnail, like so:

<code>
&lt;cfset imageScaleToFit(myImage,255,255,"highestQuality")&gt;
</code>

and the image is <i>less than</i> 255 tall or wide than ColdFusion will increase the size of the image. As I said - duh. Luckily this is simple enough to solve:

<code>
&lt;cfif myImage.width gt 255 or myImage.height gt 255&gt;
	&lt;cfset imageScaleToFit(myImage,255,255,"highestQuality")&gt;
&lt;/cfif&gt;
</code>

You could also make a simple UDF out of this as well but not sure if it is worth the trouble.