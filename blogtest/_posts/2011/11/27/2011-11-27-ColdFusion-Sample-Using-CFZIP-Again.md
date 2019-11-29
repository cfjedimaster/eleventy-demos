---
layout: post
title: "ColdFusion Sample - Using CFZIP (Again)"
date: "2011-11-27T19:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/11/27/ColdFusion-Sample-Using-CFZIP-Again
guid: 4447
---

Yesterday I shared a demo of <a href="http://www.raymondcamden.com/index.cfm/2011/11/26/ColdFusion-Samples--Using-CFZIP">using CFZIP</a> with ColdFusion. In my demo application. users could upload images one at a time or a zip of images. The demo made use of cfzip to read the zip file and extract out the images. In today's blog entry, I'm going to modify the demo to allow you to download multiple images. I'll make use of cfzip to generate a zip file on the fly and then serve it to the user.
<!--more-->
<p>

To begin, I had to make a slight modification to the display portion of the demo. I don't like it when blog entries get off topic and distract yo uwith things that are off topic, but I'm going to break that rule just a bit here. In the first edition, I used the <a href="http://twitter.github.com/bootstrap/#media">"media grid"</a> feature of Bootstrap. (If you haven't noticed yet, I'm a huge fan of Bootstrap for making my ugly demos far less ugly.) Unfortunately, that grid didn't work well when I added in checkboxes. So I switched to a <a href="http://twitter.github.com/bootstrap/#grid-system">normal grid</a>. This required a bit more logic in order to close out the divs right, but the important thing to note here is the use of a checkbox for each image. Here is a snippet:

<p>

<code>
		&lt;h2&gt;Images&lt;/h2&gt;
		&lt;form method="post"&gt;
		&lt;cfloop index="x" from="1" to="#arrayLen(thumbs)#"&gt;
			&lt;cfset image = thumbs[x]&gt;
			&lt;cfoutput&gt;
			&lt;cfif x is 1&gt;
				&lt;div class="row"&gt;
			&lt;/cfif&gt;
			&lt;div class="span8" style="text-align:center"&gt;
				&lt;a href="photos/#getFileFromPath(image)#" class="imageList"&gt;
				&lt;img class="thumbnail" src="thumbs/#getFileFromPath(image)#"&gt;
				&lt;/a&gt;&lt;br/&gt;
				&lt;input type="checkbox" name="download" value="#getFileFromPath(image)#"&gt;
			&lt;/div&gt;
			&lt;cfif x mod 2 is 0&gt;
				&lt;/div&gt;
				&lt;cfif x lt arrayLen(thumbs)&gt;
					&lt;div class="row"&gt;
				&lt;/cfif&gt;
			&lt;/cfif&gt;		
			&lt;/cfoutput&gt;	
		&lt;/cfloop&gt;
		&lt;cfif arrayLen(thumbs) mod 2 is 1&gt;
			&lt;/div&gt;
		&lt;/cfif&gt;
		&lt;input type="submit" name="downloadaction" id="downloadbutton" value="Download" style="display:none" class="btn primary"&gt;
		&lt;/form&gt;
</code>

<p>

Note that I have a submit button that is hidden. I made use of some jQuery to hide/show the button whenever you've selected at least one item:

<p>

<code>
$("input[name='download']").change(function() {
	var sel = $("input[name='download']:checked");
	if(sel.length &gt; 0) $("#downloadbutton").fadeIn(250);
	else $("#downloadbutton").fadeOut(250);
});
</code>

<p>

Here's a quick look:

<p>
 
<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip (Custom).png" />

<p>

Now let's look at the code that handles this form submission:

<p>

<code>
&lt;cfif structKeyExists(form, "downloadaction") and structKeyExists(form, "download")
	  and len(form.download)&gt;
	&lt;cfset dest = getTempDirectory() & "/" & createUUID() & ".zip"&gt;

	&lt;cfzip action="zip" file="#dest#"&gt;
		&lt;cfloop index="f" list="#form.download#"&gt;
			&lt;cfzipparam source="#imageDir#/#f#"&gt;
		&lt;/cfloop&gt;
	&lt;/cfzip&gt; 

	&lt;cfheader name="Content-disposition"  value="attachment;filename=download.zip" /&gt;
	&lt;cfheader name="content-length" value="#getFileInfo(dest).size#" /&gt;
	&lt;cfcontent type="application/zip" file="#dest#" reset="true" /&gt;
&lt;/cfif&gt;
</code>

<p>

First - note the CFIF check. It not only looks for the submit button but also the download field. In theory it's not possible to submit the form if you haven't picked anything, but you should <b>always follow up client side validation with server side validation</b>. I create a destination in the temporary directory. I then use cfzip to create the zip file based on the images you selected. You can cfzip an entire folder if you want, or specify individual files. You can also rename the files in the archive itself. Our use is simpler though. 

<p>

Once created, the zip is served up with a combination of cfheader and cfcontent tags. The two header tags tell the browser we are downloading an attachment with the name download.zip. Providing the content length also helps the browser let the user know how long the download will take. Finally, the cfcontent tag serves up the actual binary data.

<p>

That's it. The entire template of the CFM is below, and I've attached a zip with the complete application.

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

&lt;cfif structKeyExists(form, "downloadaction") and structKeyExists(form, "download")
	  and len(form.download)&gt;
	&lt;cfset dest = getTempDirectory() & "/" & createUUID() & ".zip"&gt;

	&lt;cfzip action="zip" file="#dest#"&gt;
		&lt;cfloop index="f" list="#form.download#"&gt;
			&lt;cfzipparam source="#imageDir#/#f#"&gt;
		&lt;/cfloop&gt;
	&lt;/cfzip&gt; 

	&lt;cfheader name="Content-disposition"  value="attachment;filename=download.zip" /&gt;
	&lt;cfheader name="content-length" value="#getFileInfo(dest).size#" /&gt;
	&lt;cfcontent type="application/zip" file="#dest#" reset="true" /&gt;
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

			$("input[name='download']").change(function() {
				var sel = $("input[name='download']:checked");
				if(sel.length &gt; 0) $("#downloadbutton").fadeIn(250);
				else $("#downloadbutton").fadeOut(250);
			});
		});	
	&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;

	&lt;div class="container"&gt;
	
		&lt;h2&gt;Images&lt;/h2&gt;
		&lt;form method="post"&gt;
		&lt;cfloop index="x" from="1" to="#arrayLen(thumbs)#"&gt;
			&lt;cfset image = thumbs[x]&gt;
			&lt;cfoutput&gt;
			&lt;cfif x is 1&gt;
				&lt;div class="row"&gt;
			&lt;/cfif&gt;
			&lt;div class="span8" style="text-align:center"&gt;
				&lt;a href="photos/#getFileFromPath(image)#" class="imageList"&gt;
				&lt;img class="thumbnail" src="thumbs/#getFileFromPath(image)#"&gt;
				&lt;/a&gt;&lt;br/&gt;
				&lt;input type="checkbox" name="download" value="#getFileFromPath(image)#"&gt;
			&lt;/div&gt;
			&lt;cfif x mod 2 is 0&gt;
				&lt;/div&gt;
				&lt;cfif x lt arrayLen(thumbs)&gt;
					&lt;div class="row"&gt;
				&lt;/cfif&gt;
			&lt;/cfif&gt;		
			&lt;/cfoutput&gt;	
		&lt;/cfloop&gt;
		&lt;cfif arrayLen(thumbs) mod 2 is 1&gt;
			&lt;/div&gt;
		&lt;/cfif&gt;
		&lt;input type="submit" name="downloadaction" id="downloadbutton" value="Download" style="display:none" class="btn primary"&gt;
		&lt;/form&gt;

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
</code><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fzipdemo2%{% endraw %}2Ezip'>Download attached file.</a></p>