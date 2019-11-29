---
layout: post
title: "Preselecting a tab via the URL in ColdFusion 8"
date: "2007-08-08T08:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/08/Preselecting-a-tab-via-the-URL-in-ColdFusion-8
guid: 2260
---

A quick and simple tip - ColdFusion 8 lets you set a default selected tab by using selected="true" in the tab. Here is a simple example:

<code>
&lt;cflayout type="tab"&gt;

	&lt;cflayoutarea title="Tab 1"&gt;
	&lt;p&gt;
	This is the first tab.
	&lt;/p&gt;
	&lt;/cflayoutarea&gt;
	
	&lt;cflayoutarea title="Tab 2" selected="true"&gt;
	&lt;p&gt;
	This is the second tab.
	&lt;/p&gt;
	&lt;/cflayoutarea&gt;
	
&lt;/cflayout&gt;
</code>

In this example, the second tab will be selected when the page loads, as opposed to the first one which is the default. But what if you wanted more control over the selected tab? Here is a way to do it so that you can control the selected tab in the URL itself.

<code>

&lt;cflayout type="tab"&gt;

	&lt;cflayoutarea title="Tab 1" selected="#isDefined('url.tab1')#"&gt;
	&lt;p&gt;
	This is my tab. There are many like it but this one is mine. My tab is my best friend. It is my life. I must master it as I must master my life. 
	Without me, my tab is useless. Without my tab I am useless. I must fire my tab true. I must shoot straighter than my enemy, who is trying 
	to kill me. I must shoot him before he shoots me. I will. Before God I swear this creed: my tab and myself are defenders of my country, we 
	are the masters of my enemy, we are the saviors of my life. So be it, until there is no enemy, but peace. Amen. 
	&lt;/p&gt;
	&lt;/cflayoutarea&gt;
	
	&lt;cflayoutarea title="Tab 2" selected="#isDefined('url.tab2')#"&gt;
	&lt;p&gt;
	This is the second tab.
	&lt;/p&gt;
	&lt;/cflayoutarea&gt;
	
&lt;/cflayout&gt;
</code>

In this example, each tab has a selected attribute that looks like so:

<code>
selected="#isDefined('url.tabX')#"
</code>

To load the page with tab 2 selected, you would simply go to this URL:

<blockquote>
http://localhost/test.cfm?tab2
</blockquote>

Notice that you don't need to actually pass a value as the code just checks for the existence of the value.