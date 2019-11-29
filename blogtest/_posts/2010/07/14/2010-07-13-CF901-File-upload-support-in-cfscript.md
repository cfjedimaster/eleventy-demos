---
layout: post
title: "CF901: File upload support in cfscript"
date: "2010-07-14T08:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/07/14/CF901-File-upload-support-in-cfscript
guid: 3877
---

Here is another "kinda small, kinda darn useful" update for ColdFusion 901 - support for file uploads in CFScript. CF901 adds both a FileUpload and a FileUploadAll function. FileUpload handles the fairly common process of processing a file upload while FileUploadAll mimics the "uploadAll" action added to ColdFusion 9. I've yet to use that in production yet, but if you have multiple file uploads to process, it probably makes sense to. Here is a quick and simple example I whipped up last night.
<!--more-->
<p>

To begin, I created a simple form that posts to itself. 

<p>

<code>
&lt;cfif structKeyExists(form, "newavatar")&gt;
	&lt;cfset fileService = new fileService()&gt;
	&lt;cfset result = fileService.storeImage()&gt;
	&lt;cfdump var="#result#"&gt;
&lt;/cfif&gt;

&lt;form action="test2.cfm" enctype="multipart/form-data" method="post"&gt;
	&lt;input type="file" name="newavatar"&gt;&lt;br/&gt;
	&lt;input type="submit"&gt;
&lt;/form&gt;
</code>

<p>

I've got a form with one field, newavatar, that is a file type. I check for this when the page is loaded, and if it exists, I create a new instance of a fileService component and run a storeImage function. That particular name, "storeImage", was picked by random. I was imagining the user uploading a new image to represent his avatar for the system. Obviously any name is fine here. Now let's look at the component.

<p>

<code>
component {
	
	public any function storeImage() {
		var result = fileUpload(getTempDirectory());
		if(result.fileWasSaved) {
			var theFile = result.serverdirectory & "/" & result.serverFile;
			if(!isImageFile(thefile)) {
				fileDelete(theFile);
				return false;
			} else {
				var img = imageRead(thefile);
				imageScaleToFit(img, 250, 250);
				imageWrite(img);
				return true;
			}
		} else return false;
	}

}
</code>

<p>

The method begins with the fileUpload call. You may not notice this at first, but I actually don't need to tell the tag which form field had the upload. That's kinda cool. I'm assuming ColdFusion simply looks at the form data and determines which one represents the upload. Once I've processed it, the result value matches the CFFILE structure you get when using the cffile tag. So this gives me a set of variables including the location on the server. Using that I do a bit of processing (not really important to the entry at hand) and return a boolean if the file was an image. 

<p>

This "works", but has one small problem. If the user uploads the same image again, you'll get an error trying to overwrite it. You can tell fileUpload (and fileUploadAll) to make a unique file name, but to do that, you need to pass additional paramaters first. Built in ColdFusion functions do not allow for named arguments. We can't do: foo(arg1="a", arg3="b"). The nameConflict argument is the fourth possible argument so we have to add arguments 2 (form field name) and 3 (mime types to accept). I modified the code a bit so that it now takes in the field name as an argument. This is a good idea anyway so we can be a bit more specific. 

<p>

<code>
component {
	
	public any function storeImage(required string field) {
		var result = fileUpload(getTempDirectory(),arguments.field, "image/*", "makeUnique");
		if(result.fileWasSaved) {
			var theFile = result.serverdirectory & "/" & result.serverFile;
			if(!isImageFile(thefile)) {
				fileDelete(theFile);
				return false;
			} else {
				var img = imageRead(thefile);
				imageScaleToFit(img, 250, 250);
				imageWrite(img);
				return true;
			}
		} else return false;
	}

}
</code>

<p>

Now my method works with name conflicts. The result.serverFile value will reflect the new name if there was a conflict. On the calling side, I simply made this small modification.

<p>

<code>
&lt;cfset result = fileService.storeImage("newavatar")&gt;
</code>

<p>

All in all a rather small little, but welcome, update to the ColdFusion language. In my last ColdFusion 9 project (<a href="http://groups.adobe.com">Adobe Groups</a>), file uploading ended up being the one and only CFC that I had to write in cfscript. Now I can "fix" that.