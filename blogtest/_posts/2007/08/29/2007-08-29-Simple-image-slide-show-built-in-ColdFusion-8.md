---
layout: post
title: "Simple image slide show built in ColdFusion 8"
date: "2007-08-29T19:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/29/Simple-image-slide-show-built-in-ColdFusion-8
guid: 2313
---

I wrote up a quick and dirty slide show application in ColdFusion 8 and thought I'd share the code. While it isn't very pretty (I have a second version to show you tomorrow), it gets the job done. First take a look at the demo, and then I'll describe the code:
<!--more-->
<a href="http://www.raymondcamden.com/demos/mooslideshow/test2.cfm">Demo</a>

The demo makes use of two ColdFusion 8 features - image support and and the cflayout tag. Let me talk first about how the images are handled. I begin by getting a list of all the files in a folder:

<code>
&lt;!--- get my images ---&gt;
&lt;cfdirectory action="list" directory="#folder#" name="images" type="file"&gt;
</code>

Note the new type attribute. This lets you filter a directory listing to just files or directories. Next I run a query of query to filter out just the images. Why not use the filter attribute? The cfdirectory tag only lets you filter by one extension. I wanted to support both GIFs and JPGs so I used the following:

<code>
&lt;!--- filter out jpg and gif and _thumb_* ---&gt;	  
&lt;cfquery name="images" dbtype="query"&gt;
select	name
from		images
where 	(lower(name) like '%.jpg'
or		lower(name) like '%.gif')
and		lower(name) not like '_thumb_%'
&lt;/cfquery&gt;
</code>

Notice the last condition. I'm also going to filter out any file named _thumb_*. Why? I'm getting there.

Next I create a simple layout using the cflayoutarea tag, type=border. I'm not going to bother showing that code here, you can see it at the end. In my left hand menu I want to show all my pictures, but I want to show thumbnails and not a scaled down version of the full image. How do I do that?

<code>
&lt;cfloop query="images"&gt;
	&lt;cfif not fileExists(folder & "_thumb_" & name)&gt;
		&lt;cfimage source="#folder##name#" action="read" name="newimage"&gt;
		&lt;cfset imageScaleToFit(newimage, 100, 100)&gt;
		&lt;cfimage action="write" source="#newimage#" destination="#folder#/_thumb_#name#" overwrite="true"&gt;
	&lt;/cfif&gt;
			
	&lt;cfoutput&gt;&lt;a href="javaScript:setImage('#jsStringFormat(name)#');"&gt;&lt;img src="#folderurl#/_thumb_#name#" border="0" vspace="5" /&gt;&lt;/a&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;		  
</code>

I begin by looping over my images query. For each one, I check for the existence of a thumbnail version. If it doesn't exist, I read in the file using cfimage. I then use the scaleToFit function. This will resize and keep the proportions of my thumbnail. Lastly I write out the scaled down image. That last bit of JavaScript just sets the image for my main display.

Pretty simple, eh? As I said, I got a slightly sexier version to show tomorrow. Here is the complete code for the demo. Note that I abstracted out the URL and folder for images. In theory you could turn this into a simple custom tag.

<code>
&lt;cfsetting showdebugoutput=false&gt;

&lt;!--- what url is the folder, relative from me ---&gt;
&lt;cfset folderurl = "images2"&gt;
&lt;!--- full path to folder ---&gt;
&lt;cfset folder = expandPath("./images2/")&gt;

&lt;!--- get my images ---&gt;
&lt;cfdirectory action="list" directory="#folder#" name="images" type="file"&gt;

&lt;!--- filter out jpg and gif and _thumb_* ---&gt;	  
&lt;cfquery name="images" dbtype="query"&gt;
select	name
from		images
where 	(lower(name) like '%.jpg'
or		lower(name) like '%.gif')
and		lower(name) not like '_thumb_%'
&lt;/cfquery&gt;
		  

&lt;cflayout type="border"&gt;

&lt;cflayoutarea position="left" title="Pictures" size="150" align="center" collapsible="true"&gt;

&lt;script&gt;
function setImage(i) {
	var mImage = document.getElementById('mainImage');
	&lt;cfoutput&gt;
	mImage.src='#folderurl#/'+i;
	&lt;/cfoutput&gt;
}		  
&lt;/script&gt;

&lt;cfloop query="images"&gt;
	&lt;cfif not fileExists(folder & "_thumb_" & name)&gt;
		&lt;cfimage source="#folder##name#" action="read" name="newimage"&gt;
		&lt;cfset imageScaleToFit(newimage, 100, 100)&gt;
		&lt;cfimage action="write" source="#newimage#" destination="#folder#/_thumb_#name#" overwrite="true"&gt;
	&lt;/cfif&gt;
			
	&lt;cfoutput&gt;&lt;a href="javaScript:setImage('#jsStringFormat(name)#');"&gt;&lt;img src="#folderurl#/_thumb_#name#" border="0" vspace="5" /&gt;&lt;/a&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;		  

&lt;/cflayoutarea&gt;

&lt;cflayoutarea position="center" align="center"&gt;

&lt;cfoutput&gt;
&lt;p&gt;
&lt;img src="#folderurl#/#images.name[1]#" id="mainImage"&gt;
&lt;/p&gt;
&lt;/cfoutput&gt;

&lt;/cflayoutarea&gt;

&lt;/cflayout&gt;
</code>