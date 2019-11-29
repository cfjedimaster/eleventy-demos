---
layout: post
title: "ColdFusion 8: Checking the size of an image"
date: "2007-05-30T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/30/ColdFusion-8-Checking-the-size-of-an-image
guid: 2073
---

Yesterday (well, early this morning), I <a href="http://ray.camdenfamily.com/index.cfm/2007/5/30/ColdFusion-8-Checking-to-see-if-a-file-upload-is-an-image">blogged</a> about how you can use ColdFusion 8 for the rather simple (and common) task of verifying that a file uploaded is a valid image. In today's post I'll expand on this a bit and show how you can check the size of the image.
<!--more-->
First and foremost - what do we mean by size? Do we mean file size or image dimensions? It has always been easy to check the size of an upload files. Consider this check:

<code>
&lt;cfelseif fileupload.filesize gt 50000&gt;
    &lt;cfset errors = errors & "Avast Ye! Your image cannot be larger than 50k!&lt;br /&gt;"&gt;		
</code>

In this code block, fileupload was the result of my CFFILE/Upload tag. So as you can see, that is easy enough. But we also want to check the size of the image. For our sample application, we will only allow images up to 100 pixels high or wide. 

To begin - we first need to create a ColdFusion Image variable. Images are a new type of variable in ColdFusion 8. Since we have an uploaded file, we can create the Image variable like so:

<code>
&lt;cfset cfImage = imageNew(newfile)&gt;
</code>

(You can also use imageNew() by itself to create blank images.) So now that we have an Image variable, we can then use the imageInfo() function to get information about the image:

<code>
&lt;cfset imageData = imageInfo(cfImage)&gt;
</code>

This returns a structure that includes information about the image, including:

<ul>
<li>colormodel - This is a structure with data about the colors of the image, including things like color depth, transparency, etc.
<li>width, height - The width and height of course.
<li>source - The filename of the image.
</ul>

So once we have this structure, it is trivial to check the height and width:

<code>
&lt;cfif imageData.width gt 100 or imageData.height gt 100&gt;
    &lt;cfset errors = errors & "Avast Ye! Image cannot be more than 100 pixels wide or tall!&lt;br /&gt;"&gt;
&lt;/cfif&gt;
</code>

As before - I've included the full template below. Enjoy.

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
         &lt;cfelseif fileupload.filesize gt 50000&gt;
            &lt;cfset errors = errors & "Avast Ye! Your image cannot be larger than 50k!&lt;br /&gt;"&gt;		
		 &lt;cfelse&gt;
		 	&lt;!--- check the dimensions ---&gt;
		 	&lt;cfset cfImage = imageNew(newfile)&gt;
		 	&lt;cfset imageData = imageInfo(cfImage)&gt;
		 	&lt;cfif imageData.width gt 100 or imageData.height gt 100&gt;
	            &lt;cfset errors = errors & "Avast Ye! Image cannot be more than 100 pixels wide or tall!&lt;br /&gt;"&gt;
			&lt;/cfif&gt;
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