---
layout: post
title: "Spry's HTML Panel (2)"
date: "2007-11-06T09:11:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/11/06/Sprys-HTML-Panel-2
guid: 2456
---

A few days ago I <a href="http://www.raymondcamden.com/index.cfm/2007/11/4/Sprys-HTML-Panel">blogged</a> about Spry's HTML panel. This is a rather cool, and simple, way to load content into a region of your web page via Ajax. Kin Blas of the Spry team pointed out that I missed one of the cooler features - States. Spry's Data Set feature includes a simple way to handle error and loading states. You can use some specially named DIVs and Spry will handle hiding/showing what it needs to. Turns out - the HTML panel system supports the same thing! Let's look at an example.
<!--more-->
First off - here is a simple HTML page, based on the versions I worked on in the earlier example:

<code>
&lt;html&gt;

&lt;head&gt;
	&lt;script src="/spryjs/SpryHTMLPanel.js" language="javascript" type="text/javascript"&gt;&lt;/script&gt;
	&lt;link href="/sprycssSpryHTMLPanel.css" rel="stylesheet" type="text/css"&gt;
	&lt;style type="text/css"&gt;
	.HTMLPanelLoadingContent, .HTMLPanelErrorContent {
		display: none;
	}
	&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;h2&gt;State Test&lt;/h2&gt;

&lt;p&gt;
&lt;b&gt;
	&lt;a href="htmltest.cfm?slow=likeparis" onClick="panel.loadContent(this.href); return false"&gt;Test Slow&lt;/a&gt; / 
	&lt;a href="htmltest.cfm?bad=likelindsey" onClick="panel.loadContent(this.href); return false"&gt;Test Error&lt;/a&gt; /
	&lt;a href="htmltest.cfm" onClick="panel.loadContent(this.href); return false"&gt;Test Good&lt;/a&gt; 	
&lt;/b&gt;
&lt;/p&gt;

&lt;div id="panel"&gt;
&lt;p&gt;
	Please click something!
&lt;/p&gt;
&lt;div class="HTMLPanelLoadingContent"&gt;Plesse stand by - loading important content...&lt;/div&gt;
&lt;div class="HTMLPanelErrorContent"&gt;Something went wrong. I blame Microsoft.&lt;/div&gt;
&lt;/div&gt;

&lt;script type="text/javascript"&gt;
var panel = new Spry.Widget.HTMLPanel("panel");
&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

The first thing I want to point out is 2 new CSS elements: HTMLPanelLoadingContent and HTMLPanelErrorContent. I manually set their display to none. (I'm not sure why these aren't defined in SpryHTMLPanel.css) Next look at my links:

<code>
&lt;a href="htmltest.cfm?slow=likeparis" onClick="panel.loadContent(this.href); return false"&gt;Test Slow&lt;/a&gt; / 
&lt;a href="htmltest.cfm?bad=likelindsey" onClick="panel.loadContent(this.href); return false"&gt;Test Error&lt;/a&gt; /
&lt;a href="htmltest.cfm" onClick="panel.loadContent(this.href); return false"&gt;Test Good&lt;/a&gt; 	
</code>

For my demo I linked to the same page 3 times, with different URL parameters in each one. I've got a 'slow' test, an error test, and a simple good test. Next look in my panel. I added 2 new DIVs:

<code>
&lt;div class="HTMLPanelLoadingContent"&gt;Please stand by - loading important content...&lt;/div&gt;
&lt;div class="HTMLPanelErrorContent"&gt;Something went wrong. I blame Microsoft.&lt;/div&gt;
</code>

The rest of the code is not changed. Spry will notice these 2 classes on load and when the specific state occurs (loading content, or an error), it will show and hide the divs. Pretty simple, right? The CFM code is nothing complex:

<code>
&lt;cfif structKeyExists(url, "slow")&gt;
	&lt;cfset sleep(2000)&gt;
&lt;/cfif&gt;

&lt;cfif structKeyExists(url, "bad")&gt;
	&lt;cfthrow message="Holy errors, Batman!"&gt;
&lt;/cfif&gt;

&lt;cfoutput&gt;
Here is the CFM page. It's Business Time!
&lt;/cfoutput&gt;
</code>

As you can see, I simply check for the URL parameters and either intentionally slow the page down or throw an error. You can see a live demo of this <a href="http://www.coldfusionjedi.com/demos/spryform/test_html3.html">here</a>.