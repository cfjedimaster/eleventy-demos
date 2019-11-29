---
layout: post
title: "ColdFusion Sample - Using CFZIP"
date: "2011-11-26T19:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/11/26/ColdFusion-Samples-Using-CFZIP
guid: 4446
---

It's been a while since I did a "ColdFusion Sample", so if you've forgotten, the idea of this is blog series to demonstrate a ColdFusion tag or feature in a complete, if simple, application. In this entry, I'm going to demonstrate <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-7695.html">CFZIP</a>. This tag allows for creating, reading, and extracting zip files. In my example I'll be making use of reading and extracting.

<p/>
<!--more-->
I've built a small web application that allows you to upload image. 

<p>

 
<img src="https://static.raymondcamden.com/images/ScreenClip237.png" />

<p>

When you upload a file, the logic is pretty simple. Check to see if it's an image first. If it is, we copy the image to the photos directory, then read in the image and scale it for a thumbnail directory. Checking a file to see if it a valid image as easy as using <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-7978.html">isImageFile</a>. Resizing is also pretty easy with <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-7975.html">imageScaleToFit</a>. You can also resize with <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-7961.html">imageResize</a>, but imageScaleToFit allows you to scale images and keep their proportions. 

<p>

So that portion isn't too complex. But let's ramp it up a notch. What if we allowed folks to upload both images and zips of images. We need to modify our code to check zips for images and extract them as well. Here's the entire template. 

<p>

<code>
&lt;!--- images and thumbs dir are relative ---&gt;
&lt;cfset imageDir = expandPath("./photos") & "/"&gt;
&lt;cfset thumbDir = expandPath("./thumbs") & "/"&gt;

&lt;!--- used to flag if we uploaded crap ---&gt;
&lt;cfset successFlag = false&gt;

&lt;cfif structKeyExists(form, "upload") and len(form.upload)&gt;
	&lt;cfset tempDir = getTempDirectory()&gt;
	&lt;cffile action="upload" filefield="upload" destination="#tempDir#" nameconflict="overwrite"&gt;

	&lt;cfset theFile = file.serverdirectory & "/" & file.serverfile&gt;

	&lt;cfset images = []&gt;

	&lt;cfif file.filewassaved&gt;
		&lt;cfif isImageFile(theFile)&gt;
			&lt;cfset arrayAppend(images,theFile)&gt;
		&lt;/cfif&gt;

		&lt;!--- check for zip ---&gt;
		&lt;cfif file.serverfileext is "zip"&gt;
			&lt;cftry&gt;
				&lt;cfzip action="list" filter="*.jpg,*.png,*.gif" file="#theFile#" name="files"&gt;
				&lt;cfloop query="files"&gt;
					&lt;cfzip action="unzip" entryPath="#name#" destination="#tempDir#" file="#theFile#" overwrite="true"&gt;
					&lt;cfif isImageFile(tempdir & "/" & name)&gt;
						&lt;cfset arrayAppend(images, tempdir & "/" & name)&gt;
					&lt;/cfif&gt;
				&lt;/cfloop&gt;
				&lt;cfcatch&gt;
					&lt;cfdump var="#cfcatch#"&gt;
				&lt;/cfcatch&gt;
			&lt;/cftry&gt;
		&lt;/cfif&gt;
	&lt;/cfif&gt;

	&lt;cfif arrayLen(images)&gt;
		&lt;cfloop index="theFile" array="#images#"&gt;
			&lt;!--- create a UUID based name. Helps ensure we don't conflict ---&gt;
			&lt;cfset newName = createUUID() & "." & listLast(theFile, ".")&gt;
			&lt;!--- copy original to image dir ---&gt;
			&lt;cfset fileCopy(theFile, imageDir & newName)&gt;
			&lt;!--- now make a thumb version ---&gt;
			&lt;cfset imgOb = imageRead(theFile)&gt;
			&lt;cfset imageScaleToFit(imgOb, 200,200)&gt;
			&lt;cfset imageWrite(imgOb, thumbDir & newName)&gt;
		&lt;/cfloop&gt;
		&lt;cfset successFlag = true&gt;
	&lt;/cfif&gt;

&lt;/cfif&gt;

&lt;cfset thumbs = directoryList(thumbDir,true,"name","*.jpg{% raw %}|*.png|{% endraw %}*.gif" )&gt;

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;Zip Demo&lt;/title&gt;
	&lt;meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1" /&gt;	

	&lt;link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.4.0/bootstrap.min.css"&gt;
	&lt;link rel="stylesheet" href="jquery.lightbox-0.5.css" type="text/css" /&gt;
	&lt;script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"&gt;&lt;/script&gt;
	&lt;script type="text/javascript" src="jquery.lightbox-0.5.min.js"&gt;&lt;/script&gt;
	&lt;script type="text/javascript"&gt;
		$(function() {
			$(".imageList").lightBox();
		});	
	&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;

	&lt;div class="container"&gt;
	
		&lt;h2&gt;Images&lt;/h2&gt;
		&lt;ul class="media-grid"&gt;
			&lt;cfloop index="image" array="#thumbs#"&gt;
				&lt;cfoutput&gt;
				&lt;li&gt;
				&lt;a href="photos/#getFileFromPath(image)#" class="imageList"&gt;
				&lt;img class="thumbnail" src="thumbs/#getFileFromPath(image)#"&gt;
				&lt;/a&gt;
				&lt;/li&gt;
				&lt;/cfoutput&gt;
			&lt;/cfloop&gt;
		&lt;/ul&gt;

		&lt;h2&gt;Upload New Image&lt;/h2&gt;
		&lt;form enctype="multipart/form-data" method="post"&gt;
		
		&lt;cfif successFlag&gt;
			&lt;p&gt;
			Image(s) have been uploaded. Thanks!
			&lt;/p&gt;
		&lt;/cfif&gt;
		
		&lt;cfif structKeyExists(variables, "errors")&gt;
			&lt;cfoutput&gt;&lt;p&gt;#variables.errors#&lt;/p&gt;&lt;/cfoutput&gt;
		&lt;/cfif&gt;
		
		&lt;p&gt;
		Select image, or zip file of images: 
		&lt;input type="file" name="upload"&gt;
		&lt;/p&gt;
		
		&lt;p&gt;
		&lt;input type="submit" value="Upload" class="btn primary"&gt;
		&lt;/p&gt;
		
		&lt;/form&gt;

	&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Consider the template as two halves. The bottom half simply handles outputting the images and providing a form. This is just regular HTML although I made use of a <a href="http://leandrovieira.com/projects/jquery/lightbox/">jQuery LightBox</a> plugin to make it sexier.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip238.png" />

Let's focus more on the top portion. First, we wrap our main handling code in a check for an actual file upload. If the form was submitted and nothing was uploaded, we could provide an error. (In fact, you can see where I made use of an error display in the bottom half, but I ended up not bothering creating any errors.) I send the upload to a temp directory <b>outside of web root</b>. Hopefully we all know why. 

<p>

I've created an array, images, that will store all the files I'll be copying and creating thumbs with. My code then branches into two sections. If the file was an image, I just add it to the array. If the file was a zip, and note we check the extension, there is no "isZipFile" in ColdFusion, I use the list operation of cfzip to get all the images contained within it. For each one, I extract it, check it again to ensure it <i>really</i> is an image, and then add it to array.

<p>

At this point I've got an array of images in a temporary directory. I can then simply loop over it and perform my copy/scale operations. Note the use of createUUID(). This provides a new name for the image and allows me to not worry about overwriting an existing image. 

<p>

That's it. I'm not going to post a demo for this as I <i>know</i> some jerk will abuse the upload. I did include a zip of the code base though. You should be able to extract this locally under your web root and just play with it.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fzipdemo%{% endraw %}2Ezip'>Download attached file.</a></p>