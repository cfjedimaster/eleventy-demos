---
layout: post
title: "jQuery Thickbox and ColdFusion Dynamic Image Resizing"
date: "2009-02-17T22:02:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/02/17/jQuery-Thickbox-and-ColdFusion-Dynamic-Image-Resizing
guid: 3242
---

Ok, is it just me, or has JavaScript spoiled me? It seems like almost daily I come across a web page with a long list of image thumbnails. I click on one and the entire page reloads. I click back and get a whole other large page load. I click on another image, and, well, you get the idea. I <b>hate</b> this. I've <a href="http://www.raymondcamden.com/index.cfm/2008/12/17/Early-Christmas-related-excuse-to-test-a-jQuery-Plugin">blogged</a> before about the jQuery <a href="http://jquery.com/demo/thickbox/">Thickbox</a> plugin. It is a great solution to this problem, especially when you team it up with ColdFusion. Here is a great example.
<!--more-->
I want to build a page which will make use of the Thickbox plugin, but I don't want to hard code the images. Instead, I'll let ColdFusion scan a folder and create the list for me. Since I'm using ColdFusion 8, I can also use it to create the thumbnails as well. This means I can copy images right off my camera, dump them in a folder, and leave it at that. I like easy. Let's look at the code. 

<code>
&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;
&lt;head&gt;
&lt;meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /&gt;
&lt;title&gt;Untitled Document&lt;/title&gt;

&lt;script type="text/javascript" src="http://www.coldfusionjedi.com/js/jquery.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="http://www.coldfusionjedi.com/js/thickbox/thickbox.js"&gt;&lt;/script&gt;
&lt;link rel="stylesheet" href="http://www.coldfusionjedi.com/js/thickbox/thickbox.css" type="text/css" media="screen" /&gt;
&lt;/head&gt;

&lt;body&gt;
</code>

This is the header of the page. Most of it comes right from the default template Dreamweaver made for me. What you really want to care about are the 2 JavaScript includes and the CSS file. These are all the requirements needed for Thickbox. 

<code>
&lt;cfset imageFolder = "folder2"&gt;
&lt;cfset imageDir = expandPath("./#imageFolder#")&gt;
&lt;cfdirectory directory="#imageDir#" name="images"&gt;

&lt;!--- make thumbs ---&gt;
&lt;cfif not directoryExists("#imageDir#/thumbs")&gt;
	&lt;cfdirectory action="create" directory="#imageDir#/thumbs"&gt;
&lt;/cfif&gt;
</code>

The variable imageFolder, simply refers to the subdirectory where I'm storing the images. The variable imageDir is a full path version of imageFolder. I need both a real full folder for ColdFusion and a relative one for my HTML later on. The cfdirectory tag simply grabs the files in the folder.

I check for a subdirectory named thumbs. If it doesn't exist, I create it. This should only be run once. If you needed to regenerate the thumbnails for whatever reason you can simply delete the folder.

<code>
&lt;cfloop query="images"&gt;
	
	&lt;!--- valid image? ---&gt;
	&lt;cfif isImageFile("#directory#/#name#")&gt;
		&lt;!--- check for thumbnail ---&gt;
		&lt;cfif not fileExists("#directory#/thumbs/#name#")&gt;
			&lt;cfimage action="read" source="#directory#/#name#" name="image"&gt;
			&lt;cfset imageScaleToFit(image, 125, 125)&gt;
			&lt;cfset imageWrite(image, "#directory#/thumbs/#name#",true)&gt;
		&lt;/cfif&gt;
		
		&lt;cfoutput&gt;	
		&lt;a href="#imageFolder#/#name#" title="#name#" class="thickbox" rel="gallery-ss"&gt;&lt;img src="#imageFolder#/thumbs/#name#" alt="#name#" /&gt;&lt;/a&gt;
		&lt;/cfoutput&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

Now for the complex part (and it really isn't that complex). I loop over the images query returned from the cfdirectory tag. For each file, I check to see if it is a valid image. If so, I then see if the thumbnail exists. If it does not, I read the image in, resize it, and save it in the thumbnails folder. 

The last thing to do is output the HTML. I have to use the proper class/rel attributes for Thickbox but the only real dynamic part is the URL used for the link and image tag. 

And that's it. You can see this code in action <a href="http://www.coldfusionjedi.com/demos/tboxtest/index.cfm">here</a>. I've also zipped the entire thing up and attached it to the blog post. Please download the Thickbox JS code yourself though.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Ftboxtest%{% endraw %}2Ezip'>Download attached file.</a></p>