---
layout: post
title: "Slideshow with Flair"
date: "2007-08-31T11:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/31/Slideshow-with-Flair
guid: 2317
---

A few days ago I <a href="http://www.raymondcamden.com/index.cfm/2007/8/29/Simple-image-slide-show-built-in-ColdFusion-8">blogged</a> about a simple slide show built using CFIMAGE and CFLAYOUT. While this worked ok, it wasn't very sexy. It had no flair. And as everyone knows, I'm all about the flair, so let's take a look at a cooler version. First I'll show the demo than talk about how it was built.
<!--more-->
<p/>
<a href="http://www.coldfusionjedi.com/demos/mooslideshow/test.cfm">Demo</a>
<p/>
So how was this built? First off - none of the flair comes from me. It comes from a script called <a href="http://www.phatfusion.net/slideshow/index.htm">Slide Show</a>. This code is pretty neat and I wish I could credit the guy who built it - but like <b>far</b> too many people out there, he doesn't have a "About Page". Do check out his other <a href="http://www.phatfusion.net/">demos</a> though as they are just as cool as this one. As Paris would say - that's hot.
<p/>

The code uses <a href="http://mootools.net/">mootools</a>, an interesting JavaScript library. I haven't looked at it a lot - but it seems pretty nice. Although I will flaw them one thing - the download page nicely lets you select which libraries you want to grab. It will even compress them. But there is no "get all" option. As a developer, I wanted to just grab everything so I can play with it when I have time.
<p/>

The ColdFusion code behind this is not really different than what I did last time. The only change was to remove the cflayouts. I used the same HTML he did for his demo and that was pretty much it. The complete code is below. It is a bit messy as I was just playing with it, but hopefully you get the idea. I think this goes to show that if you <i>don't</i> like ColdFusion 8's built in Ajaxy-goodness, you can definitely still play well with other Ajax libraries.
<p/>

<code>
&lt;html&gt;
&lt;head&gt;
&lt;script type="text/javascript" src="mootools.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="BackgroundSlider.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="slideshow.js"&gt;&lt;/script&gt;
&lt;link href="slideshow.css" rel="stylesheet" type="text/css" /&gt;
&lt;style&gt;
	body {
    font: normal 91%/1.2 Helvetica,Arial,Verdana,Sans-serif;
	background-color: #fff;
	color: #999;
	padding-top: 30px;
	text-align: center;
}
&lt;/style&gt;

&lt;/head&gt;

&lt;body&gt;

	  &lt;div id="thumbnails"&gt;
		  
		  &lt;cfset folderurl = "images2"&gt;
		  &lt;cfset folder = expandPath("./images2/")&gt;
		  &lt;cfdirectory action="list" directory="#folder#" name="images"&gt;
		  
		  &lt;cfquery name="images" dbtype="query"&gt;
		  select	name
		  from		images
		  where 	(lower(name) like '%.jpg'
		  or		lower(name) like '%.gif')
		  and		lower(name) not like '_thumb_%'
		  &lt;/cfquery&gt;
		  
		  &lt;cfloop query="images"&gt;
			&lt;cfif not fileExists(folder & "_thumb_" & name)&gt;
			  &lt;cfimage source="#folder##name#" action="read" name="newimage"&gt;
			  &lt;cfset imageScaleToFit(newimage, 100, 100)&gt;
			  &lt;cfimage action="write" source="#newimage#" destination="#folder#/_thumb_#name#" overwrite="true"&gt;
			&lt;/cfif&gt;
			
		  &lt;cfoutput&gt;&lt;a href="#folderurl#/#name#" class="slideshowThumbnail"&gt;&lt;img src="#folderurl#/_thumb_#name#" border="0" /&gt;&lt;/a&gt;&lt;/cfoutput&gt;
		  &lt;/cfloop&gt;		  
		  &lt;p&gt;&lt;a href="#" onclick="show.play(); return false;"&gt;Play&lt;/a&gt; {% raw %}| &lt;a href="#" onclick="show.stop(); return false;"&gt;Stop&lt;/a&gt; |{% endraw %} &lt;a href="#" onclick="show.next(); return false;"&gt;Next&lt;/a&gt; | &lt;a href="#" onclick="show.previous(); return false;"&gt;Previous&lt;/a&gt;&lt;/p&gt;

		  &lt;/div&gt;
		  
		  &lt;div id="slideshow" class="slideshow"&gt;&lt;/div&gt;

			&lt;script type="text/javascript"&gt;
		  	window.addEvent('domready',function(){
				var obj = {
					wait: 3000, 
					effect: 'fade',
					duration: 1000, 
					loop: true, 
					thumbnails: true,
					backgroundSlider: true
				}
				show = new SlideShow('slideshow','slideshowThumbnail',obj);
				show.play();
			});
		  &lt;/script&gt;
	
	&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>