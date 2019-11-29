---
layout: post
title: "ColdFusion 101: Picking a random image or rotating over each one"
date: "2006-08-15T07:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/08/15/ColdFusion-101-Picking-a-random-image-or-rotating-over-each-one
guid: 1471
---

A reader asked me how he could show a random image to visitors. This is simple enough, so I thought I'd show an example of that along with an example of how you could rotate over a set of images and ensure the user sees each one.

First, here is an example of how to display a random image from a directory.
<!--more-->
<code>
&lt;!--- Get full path to images. ---&gt;
&lt;cfset imageDirectory = expandPath(".")&gt;

&lt;!--- Get directory ---&gt;
&lt;cfdirectory action="list" directory="#imageDirectory#" name="images" filter="*.jpg"&gt;

&lt;!--- Do we have any images? ---&gt;
&lt;cfif images.recordCount gt 0&gt;

	&lt;!--- How many images? ---&gt;
	&lt;cfset totalImages = images.recordCount&gt;
	
	&lt;!--- Pick one ---&gt;
	&lt;cfset pickedIndex = randRange(1, totalImages)&gt;
	
	&lt;!--- get the file ---&gt;
	&lt;cfset image = images.name[pickedIndex]&gt;
	
	&lt;!--- display it ---&gt;
	&lt;cfoutput&gt;&lt;img src="#image#"&gt;&lt;/cfoutput&gt;

&lt;/cfif&gt;
</code>

In this example, I get a directory of images using the cfdirectory tag. You could also use a database of images. Since both return a ColdFusion query object, the only thing you would need to change is the first two lines. Outside of that though the rest of the code is trivial. Check to see we have any images, and then use the randRange() function to select a random row. Simple, right? Now look at a slightly different version.

<code>
&lt;cfapplication name="img" sessionManagement="true"&gt;

&lt;!--- Get full path to images. ---&gt;
&lt;cfset imageDirectory = expandPath(".")&gt;

&lt;!--- Get directory ---&gt;
&lt;cfdirectory action="list" directory="#imageDirectory#" name="images" filter="*.jpg"&gt;

&lt;!--- Do we have any images? ---&gt;
&lt;cfif images.recordCount gt 0&gt;

	&lt;!--- How many images? ---&gt;
	&lt;cfset totalImages = images.recordCount&gt;

	&lt;!--- param a session var ---&gt;
	&lt;cfparam name="session.pickedIndex" default="0"&gt;
	
	&lt;!--- Add one to the index ---&gt;
	&lt;cfset session.pickedIndex = session.pickedIndex + 1&gt;

	&lt;!--- if past end, restart ---&gt;
	&lt;cfif session.pickedIndex gt images.recordCount&gt;
		&lt;cfset session.pickedIndex = 1&gt;
	&lt;/cfif&gt;	
		
	&lt;!--- get the file ---&gt;
	&lt;cfset image = images.name[session.pickedIndex]&gt;
	
	&lt;!--- display it ---&gt;
	&lt;cfoutput&gt;&lt;img src="#image#"&gt;&lt;/cfoutput&gt;

&lt;/cfif&gt;
</code>

In this example, we don't select a random image. Instead, we use a session variable named pickedIndex. We increment the value on every hit, and if the value is higher than the number of images in the query, we reset it to 1. This means that as the user visits the page, they will see each image in order.