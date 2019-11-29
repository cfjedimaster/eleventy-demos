---
layout: post
title: "Responding to tab changes with CFLAYOUT"
date: "2011-10-25T10:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/10/25/Responding-to-tab-changes-with-CFLAYOUT
guid: 4407
---

Pete asked an interesting question about ColdFusion's CFLAYOUT tags. He was making use of a tabbed layout within a border layout control. He needed to refresh one of the layout panels when the tab control was modified. As with all questions in this area, I did my research by looking into the  Ext docs, which, unfortunately, Sencha makes it a pain in the rear to find. Here's the docs for <a href="http://docs.sencha.com/ext-js/3-4/">3.4</a>, but keep in mind ColdFusion is using 3.1. (<b>Edit:</b> Twitter user Maertsch sent me this <a href="http://extjs.cachefly.net/ext-3.1.1/docs/">link</a> for Ext 3.1.1 docs. It looks to be off the official Sencha site though. Anyone care to explain why Sencha is hiding their docs?) I knew there would be a way to listen in for tab changes, I just had to research what the event type was and how to listen for it. Here's how I solved Pete's question.

<p>
<!--more-->
<p>

First, I created the layout. My code has a border style layout for the page as a whole, and one of the panels is a tab.

<p>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;cflayout type="border"&gt;

	&lt;cflayoutarea position="left" size="250" name="left" source="left.cfm" /&gt;

	&lt;cflayoutarea position="center" &gt;

		&lt;cflayout type="tab" name="tabset"&gt;
			&lt;cflayoutarea title="Tab A"&gt;
				Tab A
			&lt;/cflayoutarea&gt;
			&lt;cflayoutarea title="Tab B"&gt;
				Tab B
			&lt;/cflayoutarea&gt;
			&lt;cflayoutarea title="Tab C"&gt;
				Tab C
			&lt;/cflayoutarea&gt;
		&lt;/cflayout&gt;

	&lt;/cflayoutarea&gt;


&lt;/cflayout&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

I made left.cfm a bit dynamic so I could test my changes later on. All it does is cfdump the URL scope so I won't bother sharing that one line of code.

<p>

My first change was to register a JavaScript function to run when the client-side code was done running. ColdFusion supports this with a ajaxOnLoad function:

<p>

<code>
&lt;cfset ajaxOnLoad("init")&gt;
</code>

<p>

And then here is the init function:

<p>

<code>
function init(){
	mytabs = ColdFusion.Layout.getTabLayout("tabset");
	mytabs.on('tabchange',function(tablayout,tab) {
		console.log('tab changed');
		ColdFusion.navigate("left.cfm?tab="+tab.title, "left");
	});
}
</code>

<p>

Not much, right? ColdFusion provides a helper function to retrieve the underlying Ext objects for all it's UI elements. This includes the tab layout of course. Once I have the "real" object it's a matter of checking the Ext docs. If you've never seen Ext's code before you can still figure out what the above is doing. I've added a handler to listen to the tab change event. Ext passes the tab layout and the tab itself. For my demo, I simply take out the title of the tab and pass it to the left panel by using ColdFusion.navigate function. I've pasted the entire template below and you can play with the demo here.

<p>

<a href="http://coldfusionjedi.com/demos/2011/oct/25/test2.cfm"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

<code>

&lt;html&gt;

&lt;head&gt;
&lt;script&gt;
function init(){
	mytabs = ColdFusion.Layout.getTabLayout("tabset");
	mytabs.on('tabchange',function(tablayout,tab) {
		console.log('tab changed');
		ColdFusion.navigate("left.cfm?tab="+tab.title, "left");
	});
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;cflayout type="border"&gt;

	&lt;cflayoutarea position="left" size="250" name="left" source="left.cfm" /&gt;


	&lt;cflayoutarea position="center" &gt;

		&lt;cflayout type="tab" name="tabset"&gt;
			&lt;cflayoutarea title="Tab A"&gt;
				Tab A
			&lt;/cflayoutarea&gt;
			&lt;cflayoutarea title="Tab B"&gt;
				Tab B
			&lt;/cflayoutarea&gt;
			&lt;cflayoutarea title="Tab C"&gt;
				Tab C
			&lt;/cflayoutarea&gt;
		&lt;/cflayout&gt;

	&lt;/cflayoutarea&gt;


&lt;/cflayout&gt;

&lt;/body&gt;
&lt;/html&gt;

&lt;cfset ajaxOnLoad("init")&gt;
</code>