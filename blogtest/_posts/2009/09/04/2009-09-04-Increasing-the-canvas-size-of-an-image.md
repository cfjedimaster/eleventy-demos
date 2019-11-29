---
layout: post
title: "Increasing the canvas size of an image"
date: "2009-09-04T14:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/04/Increasing-the-canvas-size-of-an-image
guid: 3513
---

In ColdFusion, how would you increase the canvas size of an image without actually stretching the image? I played with this today while eating my peanut butter and jelly (PB&J FTW) and came up with the following solution. The basic idea is pretty simple. You make a new image of the desired canvas size and then just paste in the old image. Here is a simple hard coded example.
<!--more-->
<code>
&lt;cfset img = "/Users/ray/Pictures/darth.jpg"&gt;
&lt;cfset imgOb = imageNew(img)&gt;

&lt;cfset newWidth = "800"&gt;
&lt;cfset newHeight = "800"&gt;

&lt;cfset newImg = imageNew("", newWidth, newHeight, "rgb", "white")&gt;

&lt;cfset imagePaste(newImg, imgOb, 0, 0)&gt;

&lt;!--- make it easy to see the image ---&gt;
&lt;body bgcolor="yellow"&gt;
&lt;cfimage action="writeToBrowser" source="#newImg#"&gt;
</code>

I begin with my source image that is read into a proper image variable. I create my canvas (newImg) with the desired size. Lastly, I paste it in. Because I used a white background I spit out a yellow background on the page to make it stand out a bit more. 

Here is the result - and forgive me - I'm feeling lazy. I resized it for the web page via HTML. If you click you will see the full image in all its glory.

<a href="http://www.raymondcamden.com/images/sep4.png"><img src="https://static.raymondcamden.com/images/cfjedi/sep4.png" border="0" width="400" height="400" /></a>

It works, but what if we want to center the image in the canvas? We just need to add a bit of math.

<code>
&lt;cfset img = "/Users/ray/Pictures/darth.jpg"&gt;
&lt;cfset imgOb = imageNew(img)&gt;

&lt;cfset newWidth = "800"&gt;
&lt;cfset newHeight = "800"&gt;

&lt;cfset newImg = imageNew("", newWidth, newHeight, "rgb", "white")&gt;

&lt;!--- position it in the center ---&gt;
&lt;cfset centerX = (newWidth - imgOb.width)/2&gt;
&lt;cfset centerY = (newHeight - imgOb.height)/2&gt;

&lt;cfset imagePaste(newImg, imgOb, centerX, centerY)&gt;

&lt;!--- make it easy to see the image ---&gt;
&lt;body bgcolor="yellow"&gt;
&lt;cfimage action="writeToBrowser" source="#newImg#"&gt;
</code>

Woot. I'm so happy I took all those calculus classes in college. The result is now centered:

<a href="http://www.coldfusionjedi.com/images/sep4a.png"><img src="https://static.raymondcamden.com/images/cfjedi/sep4a.png" width="400" height="400" border="0"/></a>

Ok, so it works - but maybe we can make it a bit more abstract? Here is a simple UDF that lets you pass in an image, new dimensions, as well as a text-based position, and have it return the new image to you. It should probably use a dynamic color model, and it may barf if you use a smaller image, but it works with my simple tests.

<code>
&lt;cffunction name="resizeCanvas" output="false"&gt;
	&lt;cfargument name="sourceImage" required="true" hint="Can be file, url, or image object."&gt;
	&lt;cfargument name="newWidth" required="true" type="numeric" hint="New canvas width."&gt;
	&lt;cfargument name="newHeight" required="true" type="numeric" hint="new canvas height."&gt;
	&lt;cfargument name="canvasbackgroundcolor" required="false" type="string" hint="BG color for canvas." default="white"&gt;
	&lt;cfargument name="position" required="false" type="string" hint="Where is the image positioned. Values are TL (top left), TR, BL, BR, Center" default="center"&gt;
	
	&lt;cfset var img = ""&gt;
	&lt;cfset var canvas = ""&gt;
	&lt;cfset var centerX = ""&gt;
	&lt;cfset var centerY = ""&gt;

	&lt;!--- first, is our sourceImage a string or an ob? ---&gt;
	&lt;cfif not isImage(arguments.sourceImage)&gt;
		&lt;cfset img = imageNew(arguments.sourceImage)&gt;
	&lt;cfelse&gt;
		&lt;cfset img = arguments.sourceImage&gt;
	&lt;/cfif&gt;

	&lt;!--- now make our canvas ---&gt;
	&lt;cfset canvas = imageNew("", arguments.newWidth, arguments.newHeight, "rgb", arguments.canvasbackgroundcolor)&gt;
	
	&lt;!--- where we paste is based on position ---&gt;
	&lt;cfswitch expression="#arguments.position#"&gt;

		&lt;!--- Top Left ---&gt;
		&lt;cfcase value="TL"&gt;
			&lt;cfset imagePaste(canvas, img, 0, 0)&gt;
		&lt;/cfcase&gt;

		&lt;!--- Top Right ---&gt;
		&lt;cfcase value="TR"&gt;
			&lt;cfset imagePaste(canvas, img, arguments.newWidth - img.width, 0)&gt;
		&lt;/cfcase&gt;

		&lt;!--- Bottom Right ---&gt;
		&lt;cfcase value="BR"&gt;
			&lt;cfset imagePaste(canvas, img, arguments.newWidth - img.width, arguments.newHeight - img.height)&gt;
		&lt;/cfcase&gt;

		&lt;!--- Bottom Left  ---&gt;
		&lt;cfcase value="BL"&gt;
			&lt;cfset imagePaste(canvas, img, 0, arguments.newHeight - img.height)&gt;
		&lt;/cfcase&gt;
		
		&lt;!--- center ---&gt;
		&lt;cfdefaultcase&gt;
			&lt;cfset centerX = (newWidth - img.width)/2&gt;
			&lt;cfset centerY = (newHeight - img.height)/2&gt;

			&lt;cfset imagePaste(canvas, img, centerX, centerY)&gt;
		&lt;/cfdefaultcase&gt;
		
	&lt;/cfswitch&gt;
	
	&lt;cfreturn canvas&gt;
&lt;/cffunction&gt;
</code>

And some sample code to run it:

<code>
&lt;cfset img = "/Users/ray/Pictures/darth.jpg"&gt;

&lt;cfimage action="writeToBrowser" source="#resizeCanvas(img,500,500,'blue')#"&gt;
&lt;cfimage action="writeToBrowser" source="#resizeCanvas(img,500,500,'blue','TR')#"&gt;
&lt;cfimage action="writeToBrowser" source="#resizeCanvas(img,500,500,'blue','BR')#"&gt;
&lt;cfimage action="writeToBrowser" source="#resizeCanvas(img,500,500,'blue','BL')#"&gt;
</code>

Which gives us this lovely montage:

<a href="http://www.coldfusionjedi.com/images/sep4b.png"><img src="https://static.raymondcamden.com/images/cfjedi/sep4b.png" width="400" height="400" border="0"/></a>

Hopefully this will be helpful for others. I may need to add this to the imageUtils project.