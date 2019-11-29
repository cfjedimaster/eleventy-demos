---
layout: post
title: "Adding a preview to CFFILEUPLOAD"
date: "2010-03-29T20:03:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/03/29/Adding-a-preview-to-CFFILEUPLOAD
guid: 3766
---

A few weeks ago I <a href="http://www.raymondcamden.com/index.cfm/2010/3/5/ColdFusion-9-Multifile-Uploader--Complete-Example">blogged</a> an example of a "complete" cffileupload demo. Most examples of this tag are very simplistic and don't reflect what a typical form would consist of - ie both a multi-file uploader along with other form fields. A reader commented that they were curious if this could be combined with some sort of preview. I had recently done a <a href="http://www.coldfusionjedi.com/index.cfm/2010/3/8/Ajax-Image-Uploads-with-Previews">blog entry</a> on a related JavaScript library but today I've modified the CFFILEUPLOAD one to add a preview. As this uses most of the code from the <a href="http://www.coldfusionjedi.com/index.cfm/2010/3/5/ColdFusion-9-Multifile-Uploader--Complete-Example">original</a> example, I strongly urge you to read that one first. I'll just be explaining the differences and none of the existing code.
<!--more-->
<p/>
To begin, I modified my cffileupload tag to run JavaScript on every file upload. That was as simple as adding the oncomplete argument:

<p/>

<code>

&lt;cffileupload extensionfilter="jpg,jpeg,gif,png,bmp,tiff,pdf" name="portfoliofiles"
	 maxfileselect="5" title="Portfolio Images" url="fileupload.cfm?#urlEncodedFormat(session.urltoken)#"
	 oncomplete="previewfile"&gt;
</code>

<p/>

(By the way, I also added PDF to the list of extensions, more on the later.) The previewfile function will be passed an object containing the filename and the result from our server side code that handles uploads. Our demo code uses the same name as the user's file, so there is no need to worry about the file having a different name on the server. Here is what I did with the result:

<p/>

<code>
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
function previewfile(file) {
	var previewHTML = '&lt;span class="previewSpan"&gt;&lt;img src="preview.cfm?s=' + file.FILENAME + '"&gt;&lt;/span&gt;'
	$("##previewArea").append(previewHTML)
}
&lt;/script&gt;
</code>

<p/>

Pretty complex, eh? All I needed to do was create some simple HTML. I point to a new CFM called preview and pass in the file name. Let's take a look at preview.cfm. 

<p/>

<code>
&lt;cfparam name="url.s" default=""&gt;

&lt;cfif isImageFile(session.myuploadroot & "/" & url.s)&gt;
	&lt;cfimage action="read" source="#session.myuploadroot#/#url.s#" name="img"&gt;
	&lt;cfset ext = listLast(url.s,".")&gt;
	&lt;cfset imageScaleToFit(img,125,125)&gt;
&lt;cfelse&gt;
	&lt;cfimage action="read" source="default.jpg" name="img"&gt;
	&lt;cfset ext = "gif"&gt;
&lt;/cfif&gt;


&lt;cfset bits = imagegetblob(img)&gt;
&lt;cfcontent type="image/#ext#" variable="#bits#"&gt;
</code>

<p/>

So what's going on here? Remember that we use a special folder in the virtual file system for the user's uploads. Because of this we can source a CFIMAGE to the file requested. We can also check to see if the file is a valid image. If it isn't, we can use a default picture instead. The final thing we do is get the actual bits and serve it up via cfcontent. Here is a screen shot of the result. Notice that I could have made this look <i>far</i> nicer. 

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-03-29 at 6.26.26 PM.png" title="Cool screenshot." />

<p/>

Hopefully this makes sense and is useful!