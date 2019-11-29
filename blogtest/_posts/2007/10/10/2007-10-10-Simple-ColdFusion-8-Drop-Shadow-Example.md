---
layout: post
title: "Simple ColdFusion 8 Drop Shadow Example"
date: "2007-10-10T17:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/10/Simple-ColdFusion-8-Drop-Shadow-Example
guid: 2402
---

I'm definitely <b>not</b> the first person to do this - but I've been itching to do drop shadows ever since I started playing with ColdFusion 8's new image functionality. My UDF is rather simple. It takes an image and duplicates it. It fills the canvas with white - and than adds an offset black square the same size as the original image. It does a blur, and then pastes on the original image.

That by itself isn't too interesting, but what was interesting is why I had to duplicate the original image. When I first wrote the code, I simply used imageNew. However, whenever I tried to imageOverlay the original image onto the new one, I got:

<h2>Overlay operation requires the two sources to match in number of bands and data type.</h2>

Stumped - I dumped imageInfo on both. I wasn't sure what bands meant - but colormode_type on my original image was "ComponentColorModel" ,and the value in my new image made from scratch was "PackedColorModel". That made as much sense to me as arithmetic would make to Paris Hilton. So for the heck of it, I just tried imageNew using ARGB. I figured grayscale wouldn't work. Using ARGB didn't help at all.

So does anyone know how you would make an image from scratch that would work with a (as far as I know) average JPG? 

The code is pasted at the very bottom. Let me show some examples of the output. First the original image.

<p align="center">
<img src="https://static.raymondcamden.com/images/s1.PNG"><br>
<b>Writing PHP is hard!</b>
</p>

Now to make the drop shadow:

<code>
&lt;cfset myimage=makeShadow("sadgirl.jpg",5,5)&gt;
&lt;cfimage action="writeToBrowser" source="#myimage#"&gt;
</code>

<p align="center">
<img src="https://static.raymondcamden.com/images/cfjedi/s2.PNG"><br>
<b>.Net makes Mommy and Daddy fight.</b>
</p>

And finally an example with what I call the blood red shadow:

<code>
&lt;cfset myimage=makeShadow("sadgirl.jpg",5,5, "90,0,0")&gt;
&lt;cfimage action="writeToBrowser" source="#myimage#"&gt;
</code>

<p align="center">
<img src="https://static.raymondcamden.com/images/cfjedi//s3.PNG"><br>
<b>Rails broke all my toys and Ruby killed my dog!</b>
</p>

And finally - the UDF. Enjoy:

<code>
&lt;cffunction name="makeShadow" returnType="any" output="false"&gt;
	&lt;cfargument name="image" type="any" required="true"&gt;
	&lt;cfargument name="offset" type="numeric" required="true"&gt;
	&lt;cfargument name="blur" type="numeric" required="true"&gt;
	&lt;cfargument name="shadowcol" type="string" required="false" default="145,145,145"&gt;
	&lt;cfargument name="backgroundcol" type="string" required="false" default="white"&gt;
	
	&lt;cfset var newwidth = ""&gt;
	&lt;cfset var newheight = ""&gt;
	&lt;cfset var shadow = ""&gt;
	
	&lt;!--- if not image, assume path ---&gt;
	&lt;cfif not isImage(arguments.image) and not isImageFile(arguments.image)&gt;
		&lt;cfthrow message="The value passed to makeShadow was not an image."&gt;
	&lt;/cfif&gt;
	
	&lt;cfif isImageFile(arguments.image)&gt;
		&lt;cfset arguments.image = imageRead(arguments.image)&gt;
	&lt;/cfif&gt;

	&lt;cfset newwidth = arguments.image.width + (2*offset)&gt;
	&lt;cfset newheight = arguments.image.height + (2*offset)&gt;

	&lt;!--- make a black image the same size as orig ---&gt;
	&lt;cfset shadow = duplicate(arguments.image)&gt;
	&lt;cfset imageResize(shadow, newwidth, newheight)&gt;
	&lt;cfset imageSetDrawingColor(shadow,arguments.backgroundcol)&gt;
	&lt;cfset imageDrawRect(shadow, 0, 0, newwidth, newheight, true)&gt;
	&lt;cfset imageSetDrawingColor(shadow,arguments.shadowcol)&gt;
	&lt;cfset imageDrawRect(shadow, arguments.offset, arguments.offset, arguments.image.width, arguments.image.height, true)&gt;
	
	&lt;cfset imageBlur(shadow, arguments.blur)&gt;
	
	&lt;!--- copy orig ---&gt;
	&lt;cfset imagePaste(shadow,arguments.image,0,0)&gt;
	
	&lt;cfreturn shadow&gt;
&lt;/cffunction&gt;
</code>