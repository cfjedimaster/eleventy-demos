---
layout: post
title: "Proof of Concept - Turning HTML into an Image"
date: "2010-10-01T14:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/10/01/Proof-of-Concept-Turning-HTML-into-an-Image
guid: 3958
---

A few days ago a reader (Andrew Duvall) and I exchanged a few emails about ways one could turn HTML into an image. He wanted to make use of ColdFusion's built in rich text editor as a way for someone to write HTML that would then become an image. I recommended making use of cfdocument. cfdocument can turn HTML into PDF and with the cfpdf tag you can then turn a pdf into an image. He took that advice and ran with it. Here is the simple POC Andrew created. It works - but has one slight drawback.

<p>

<code>
&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;
&lt;head&gt;
&lt;meta http-equiv="Content-Type" content="text/html; charset=utf-8" /&gt;
&lt;/head&gt;

&lt;body bgcolor="#C0C0C0"&gt;

&lt;cfparam name="tdata" default='&lt;span style="font-family: Arial;"&gt;&lt;strong&gt;This&lt;/strong&gt; &lt;em&gt;is a&lt;/em&gt; &lt;strong&gt;test &lt;/strong&gt;&lt;u&gt;to&lt;/u&gt; &lt;span style="color: rgb(255, 153, 0);"&gt;see &lt;/span&gt;&lt;strong&gt;what &lt;/strong&gt;is to &lt;span style="color: rgb(255, 0, 0);"&gt;happen&lt;/span&gt;&lt;/span&gt;'&gt;
&lt;cfset tdata = replace(tdata,'&lt;p&gt;','','all')&gt;
&lt;cfset tdata = replace(tdata,'&lt;/p&gt;','','all')&gt;
&lt;cfif isdefined('sbt')&gt;

	&lt;cfsavecontent variable="PDFdata"&gt;
	&lt;div style="border:1px solid blue; background-color:none; font-size:12px; width:60px; height:80px;"&gt;&lt;cfoutput&gt;#tdata#&lt;/cfoutput&gt;&lt;/div&gt;
	&lt;/cfsavecontent&gt;

	&lt;cfdocument format="pdf" name="data" scaletofit="yes"&gt;&lt;cfoutput&gt;#PDFdata#&lt;/cfoutput&gt;&lt;/cfdocument&gt;
	&lt;cfpdf source="data" 
	       pages="1" 
	       action="thumbnail" 
	       destination="." 
	       format="png" 
	       transparent = "true"
	
	       overwrite="true" 
	       resolution="high" 
	       scale="100" 
	       imagePrefix="Andrew"
	       &gt;
	        
		&lt;cfscript&gt;
		thisImg = ImageRead( expandPath('.') & "/Andrew_page_1.png");
		ImageSetAntialiasing(thisImg,"on");
		
		ImageCrop(thisImg, 44, 48, 62, 80);
		
		ImageWrite( thisImg, expandPath('.') & "/Andrew_page_1.png");
		&lt;/cfscript&gt;
	
		&lt;cfimage action="writeToBrowser" source="#thisImg#"&gt;

&lt;/cfif&gt;

&lt;cfform&gt;
&lt;cftextarea richtext="true" name="tdata"&gt;&lt;cfoutput&gt;#tdata#&lt;/cfoutput&gt;&lt;/cftextarea&gt;
&lt;input name="sbt" type="submit" value="submit"  /&gt;
&lt;/cfform&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Reading from the bottom up - you can see it begins with a simple form that makes use of the richtext version of cftextarea. He defaulted the value with some basic HTML (see line 9). On submit the magic happens. First he wraps the HTML with a div. Let me come back to the that in a minute. He then puts the HTML into the cfdocument tag to create the PDF. Notice he saves it to a variable. There isn't any need to save it to the file system.

<p>

Next he uses cfpdf to convert the pdf into an image. Notice the scale is set to 100. This creates a full scale representation of the pdf. After making the image he does a crop on it (and again, we will come back to that) and then outputs the result. Here is a screen shot of it in action:

<p>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-10-01 at 1.00.35 PM.png" />

<p>

So - what's with the div and the cropping? The technique I originally proposed worked - but left a large white expanse around the rendered image. Since the HTML provided didn't take the whole "page", the resulting image had a lot of white space around it. For his purposes, he was ok with using a div wrapper to set the result to a sized box. He could then crop to that when he got the image.

<p>

To make this <i>totally</i> cool you would need to find a way to make that more generic. I'm not sure how one would do that outside of literally scanning the pixels and removing the blocks of whiteness. You could make the process 3 steps - and use the second step as a preview (with just HTML) so that the user can specify his own height and width.