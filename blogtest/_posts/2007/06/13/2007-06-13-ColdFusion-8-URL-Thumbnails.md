---
layout: post
title: "ColdFusion 8: URL Thumbnails"
date: "2007-06-13T14:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/13/ColdFusion-8-URL-Thumbnails
guid: 2119
---

A reader asked me this morning if ColdFusion 8 can create images from URLs. This is often used to provide a snap shot of a remote site. Turns out this is relatively easy. Damon Cooper of Adobe showed an example of this a few weeks ago. It takes all of two tags:

<more />

<code>
&lt;cfdocument src="http://www.raymondcamden.com" name="pdfdata" format="pdf" /&gt;
&lt;cfpdf source="pdfdata" pages="1" action="thumbnail" destination="." format="jpg" overwrite="true" resolution="high" scale="25"&gt;
</code>

The first line simply uses cfdocument with the src attribute. I point to a URL (in this case, my blog) and store the result in a PDF variable.

Next I use the cfpdf tag to create a thumbnail. I specify the JPG format, use a high resolution, and set a scale to 25% just for the heck of it. Also note I only do page 1. By default the cfpdf/action="thumbnail" tag will create a thumbnail for each page of the PDF, but all we really want is the first page.

That's it. Done. Complete. Simple as pie. But of course I had to go a bit crazy and make a UDF out of it. The code below allows you to pass a URL (and an optional scale). It will then handle making the image, reading it into a CF8 Image object, deleting the file, and returning the object. You can then save it, or do whatever. For my tests, I did:

<code>
&lt;cfset myimage = getThumbnail("http://www.coldfusionjedi.com",30)&gt;
&lt;cfimage action="writeToBrowser" source="#myimage#"&gt;
</code>

The "writeToBrowser" action lets me test without actually saving a file, but I believe it doesn't work in IE. (Not that I care.) Enjoy, and let me know how it works for you. I'll probably add options to let you specify an image type as well.

The image quality is pretty good I think. It is <b>not</b> the same as what you see from Firefox, but for a thumbnail, I think it works ok:

<img src="https://static.raymondcamden.com/images/cfjedi/geturl.png">

<code>
&lt;cffunction name="getThumbnail" returnType="any" output="false"&gt;
	&lt;cfargument name="url" type="string" required="true"&gt;
	&lt;cfargument name="scale" type="numeric" required="false" default="25"&gt;
	
	&lt;cfset var pdfdata = ""&gt;
	&lt;cfset var prefix = replace(createUUID(),"-","_","all")&gt;
	&lt;cfset var myimage = ""&gt;
	
	&lt;!--- make the pdf ---&gt;
	&lt;cfdocument src="#arguments.url#" name="pdfdata" format="pdf" /&gt;
	
	&lt;!--- write out the image ---&gt;
	&lt;cfpdf source="pdfdata" pages="1" action="thumbnail" destination="." format="jpg" overwrite="true" 
		   resolution="high" scale="#arguments.scale#" imagePrefix="#prefix#"&gt;
	
	&lt;!--- read it in ---&gt;
	&lt;cfset myimage = imageNew(expandPath('./#prefix#_page_1.jpg'))&gt;

	&lt;!--- clean it up ---&gt;
	&lt;cffile action="delete" file="#expandPath('./#prefix#_page_1.jpg')#"&gt;
	&lt;cfreturn myimage&gt;
&lt;/cffunction&gt;
</code>