---
layout: post
title: "ColdFusion 8: Checking to see if a file upload is an image"
date: "2007-05-30T02:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/30/ColdFusion-8-Checking-to-see-if-a-file-upload-is-an-image
guid: 2072
---

Welcome to the very first of my ColdFusion 8 blog postings. (Well, the first since the public release.) My goal for these entries is to look at features, big and small, and show some practical examples. For my first entry, I'm going to talk about something simple - validating that a file uploaded is an image.
<!--more-->
As you probably heard, ColdFusion 8 has about 900 or so image functions. Ok, it isn't quite that much, but there are quite a few of them. (By the way, I'm <a href="http://cfunited.com/go/topics#topic-1403">speaking on image features</a> at CFUNITED.) Probably the most common thing you will need to do is simple validation on a file upload. What do I mean by that?

Imagine a preferences form. It asks you things like your name, email address, and other items. It also lets you upload a picture of yourself. How do you validate that the file is an image? After the file is uploaded, it takes all of one call:

<code>
&lt;cfif not isImageFile(newfile)&gt;
</code>

The isImageFile function simply checks and see if a filename points to an image file that ColdFusion can work with. Here is a slightly larger example:

<code>
&lt;cfif not len(trim(form.picture))&gt;
	&lt;cfset errors = errors & "Avast Ye! Include a picture or walk the plank!&lt;br /&gt;"&gt;
&lt;cfelse&gt;
	&lt;cffile action="upload" destination="#expandPath('./images')#" nameConflict="makeunique" filefield="picture" result="fileupload"&gt;
	&lt;cfif fileupload.fileWasSaved&gt;
		&lt;cfset newfile = fileupload.serverdirectory & "/" & fileupload.serverfile&gt;
			
		&lt;cfif not isImageFile(newfile)&gt;
			&lt;cfset errors = errors & "Avast Ye! Include a VALID picture or walk the plank!&lt;br /&gt;"&gt;
			&lt;!--- clean up ---&gt;
			&lt;cffile action="delete" file="#newfile#"&gt;
		&lt;/cfif&gt;		
	&lt;/cfif&gt;
&lt;/cfif&gt;
</code>

In this code block, I not only check and see if the user selected something to upload, I also handle the upload, check to see if it is an image, and even handle the cleanup if not. Note the special "Pirate" mode for errors. I love that. 

A complete example is included below. Tomorrow I'll follow this up with a simple size check. That would be useful to for preventing users from upload 2 meg pictures or overly large wide/high pictures.

<code>
&lt;cfset errors = ""&gt;
&lt;cfparam name="form.name" default=""&gt;
&lt;cfparam name="form.picture" default=""&gt;

&lt;cfif structKeyExists(form, "save")&gt;
	&lt;cfif not len(trim(form.name))&gt;
		&lt;cfset errors = errors & "Avast Ye! Include a name or walk the plank!&lt;br /&gt;"&gt;
	&lt;/cfif&gt;
	
	&lt;cfif not len(trim(form.picture))&gt;
		&lt;cfset errors = errors & "Avast Ye! Include a picture or walk the plank!&lt;br /&gt;"&gt;
	&lt;cfelse&gt;
		&lt;cffile action="upload" destination="#expandPath('./images')#" nameConflict="makeunique" filefield="picture" result="fileupload"&gt;
		&lt;cfif fileupload.fileWasSaved&gt;
			&lt;cfset newfile = fileupload.serverdirectory & "/" & fileupload.serverfile&gt;
			
			&lt;cfif not isImageFile(newfile)&gt;
				&lt;cfset errors = errors & "Avast Ye! Include a VALID picture or walk the plank!&lt;br /&gt;"&gt;
				&lt;!--- clean up ---&gt;
				&lt;cffile action="delete" file="#newfile#"&gt;
			&lt;/cfif&gt;		
		&lt;/cfif&gt;
	&lt;/cfif&gt;
		
	&lt;cfif errors is ""&gt;
		&lt;cfoutput&gt;
		&lt;p&gt;
		Here is where we would update the database and send the user away...
		&lt;/p&gt;
		&lt;/cfoutput&gt;
		&lt;cfabort&gt;
	&lt;/cfif&gt;
	
&lt;/cfif&gt;

&lt;cfif errors neq ""&gt;
	&lt;cfoutput&gt;
	&lt;p&gt;
	&lt;b&gt;Please correct the following error(s):&lt;br /&gt;
	#errors#
	&lt;/b&gt;
	&lt;/p&gt;
	&lt;/cfoutput&gt;
&lt;/cfif&gt;

&lt;cfoutput&gt;
&lt;form action="imageuploadform.cfm" method="post" enctype="multipart/form-data"&gt;
&lt;table&gt;
	&lt;tr&gt;
		&lt;td&gt;Your Name:&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="name" value="#form.name#"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;Your Picture:&lt;/td&gt;
		&lt;td&gt;&lt;input type="file" name="picture"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;&nbsp;&lt;/td&gt;
		&lt;td&gt;&lt;input type="submit" name="save" value="Save"&gt;&lt;/td&gt;
	&lt;/tr&gt;
&lt;/table&gt;
&lt;/form&gt;
&lt;/cfoutput&gt;
</code>