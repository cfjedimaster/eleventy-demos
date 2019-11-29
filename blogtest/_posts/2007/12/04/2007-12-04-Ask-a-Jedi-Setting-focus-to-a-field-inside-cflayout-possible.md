---
layout: post
title: "Ask a Jedi: Setting focus to a field inside cflayout - possible?"
date: "2007-12-04T17:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/04/Ask-a-Jedi-Setting-focus-to-a-field-inside-cflayout-possible
guid: 2515
---

JC asks:

<blockquote>
<p>
Have you had any success placing focus on a text field inside a
cflayoutarea?  Is this possible or am I chasing a red herring?
</p>
</blockquote>

I had not tried this before, but it wasn't too hard. First consider a simple CFLAYOUT page:

<code>
&lt;cflayout type="border"&gt;

	&lt;cflayoutarea position="left" align="center" 
			size="400" collapsible="true" title="Menu"&gt;
	&lt;p&gt;
	Menu 1
	&lt;/p&gt;
	&lt;p&gt;
	Menu 2
	&lt;/p&gt;
	&lt;p&gt;
	Menu 3
	&lt;/p&gt;
	&lt;/cflayoutarea&gt;

	&lt;cflayoutarea position="center"&gt;
	&lt;p&gt;
	&lt;form id="someform"&gt;
	&lt;input type="text" name="username" id="username"&gt;
	&lt;/form&gt;
	&lt;/p&gt;
	&lt;/cflayoutarea&gt;
	
&lt;/cflayout&gt;
</code>

Notice I've placed a form inside the main layout box. I want to run code to set focus when the page loads, and ColdFusion provides a function for this - ajaxOnLoad():

<code>
&lt;cfset ajaxOnLoad("setfocus")&gt;
</code>

The code for setfocus is no different than any other JavaScript code to set focus:

<code>
&lt;script&gt;
function setfocus() {
	var myfield = document.getElementById("username");
	myfield.focus();
}
&lt;/script&gt;
</code>

The only thing to watch out for is that ajaxOnLoad is a bit picky. It requires your JS function to be inside &lt;HEAD&gt; tags. So a complete example would be:

<code>
&lt;html&gt;
&lt;head&gt;
&lt;script&gt;
function setfocus() {
	var myfield = document.getElementById("username");
	myfield.focus();
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;cflayout type="border"&gt;

	&lt;cflayoutarea position="left" align="center" 
			size="400" collapsible="true" title="Menu"&gt;
	&lt;p&gt;
	Menu 1
	&lt;/p&gt;
	&lt;p&gt;
	Menu 2
	&lt;/p&gt;
	&lt;p&gt;
	Menu 3
	&lt;/p&gt;
	&lt;/cflayoutarea&gt;

	&lt;cflayoutarea position="center"&gt;
	&lt;p&gt;
	&lt;form id="someform"&gt;
	&lt;input type="text" name="username" id="username"&gt;
	&lt;/form&gt;
	&lt;/p&gt;
	&lt;/cflayoutarea&gt;
	
&lt;/cflayout&gt;

&lt;cfset ajaxOnLoad("setfocus")&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>