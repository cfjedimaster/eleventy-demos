---
layout: post
title: "cfpresentation and HTML slides"
date: "2011-08-08T12:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/08/08/cfpresentation-and-HTML-slides
guid: 4319
---

This topic came up from a cf-newbie discussion this weekend, but did you know that cfpresentation can be used to create HTML presentations? The reference is a bit confusing on the matter. If you look at the docs for the format attribute, it says this:
<!--more-->
<p>

<blockquote>
Specifies the file format for conversion:
<ul>
<li>ppt<br/>
converts html input provided in cfpresentationslide to a PowerPoint file.
<li>html<br/>
converts ppt to an HTML presentation.
</blockquote>

<p>

The implication being that you can use the tag just to convert a Powerpoint file into HTML. You <i>can</i> do that. But you can also create ad-hoc presentations and feed them right into html. So an example:

<p>

<code>
&lt;cfset dest = expandPath("./mypreso")&gt;
&lt;cfif not directoryExists(dest)&gt;
	&lt;cfset directoryCreate(dest)&gt;
&lt;/cfif&gt;

&lt;cfpresentation title="Ray's Presentation" format="html" destination="#dest#" overwrite="true"&gt;
	&lt;cfpresentationslide title="Slide One"&gt;
		This is my first slide. Epic.
	&lt;/cfpresentationslide&gt;
	&lt;cfpresentationslide title="Slide Two"&gt;
		This is my second slide. Epic.
	&lt;/cfpresentationslide&gt;
	&lt;cfpresentationslide title="Slide Three"&gt;
		This is my third slide. Epic.
	&lt;/cfpresentationslide&gt;
&lt;/cfpresentation&gt;
Done.
</code>

<p>

In this code template, I'm saving the presentation to a directory. You don't have to do that. If you leave off the destination it will render in the browser. I've added "Done" to the end of the script just so I know, well, when the CFM is done. I've got three simple slides. Once done, the output is saved to a folder:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip150.png" />

<p>

The result is a HTML/JavaScript slide viewer. I'll be honest. It isn't... stellar. You can view this yourself here: <a href="http://www.coldfusionjedi.com/demos/aug82011/mypreso2/">http://www.coldfusionjedi.com/demos/aug82011/mypreso2/</a> 

<p>

Sexy, right? Ok, maybe not. But for a quick and dirty result, it's better than nothing. Be careful with it. I tried embedding a PNG chart and while it worked locally, it wasn't available when pushed to production.