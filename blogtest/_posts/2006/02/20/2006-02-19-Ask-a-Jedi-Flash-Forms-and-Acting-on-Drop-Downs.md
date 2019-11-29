---
layout: post
title: "Ask a Jedi: Flash Forms and Acting on Drop Downs"
date: "2006-02-20T07:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/02/20/Ask-a-Jedi-Flash-Forms-and-Acting-on-Drop-Downs
guid: 1112
---

A reader asks:

<blockquote>
Not sure this is quite normal, but I have a CF Form, flash format, that based on options selected, submit to different action pages.

My Question is, do you know how to access and modify the "action" attribute of a CFForm using ActionsScript from  a function in '&lt;cfformitem type="script"&gt;' function?
</blockquote>

It may very well be possible to change the action of a Flash Form. However, I wasn't sure of how to do that, so I simply used the onsubmit method. Consider the following code block:

<code>
&lt;cfform format="flash" width="200" height="200" onsubmit="return goURL()"&gt;

	&lt;cfformitem type="script"&gt;
	function goURL() {
		var url = destination.value.toString();
		getURL(url);
		return false;
	}
	&lt;/cfformitem&gt;
	
	&lt;cfselect name="destination"&gt;
	&lt;option value="http://www.cflib.org"&gt;CFLib&lt;/option&gt;
	&lt;option value="http://www.coldfusioncookbook.com"&gt;ColdFusion Cookbook&lt;/option&gt;
	&lt;option value="http://ray.camdenfamily.com"&gt;My Blog&lt;/option&gt;
	&lt;/cfselect&gt;
	
	&lt;cfinput type="submit" value="Go There!" name="submit" /&gt;
	
&lt;/cfform&gt;
</code>

This relatively simple block of code does a few things. First, it specifies an action to take on form submission. Notice I used "return goURL()" instead of just "goURL()", this was because I wanted the default form submission to not fire. My goURL() function is contained with a script form item block. This is only allowed in ColdFusion 7.0.1. The ActionScript code simply grabs the value of the form below it (which will be a URL), and then calls getURL() to load it.