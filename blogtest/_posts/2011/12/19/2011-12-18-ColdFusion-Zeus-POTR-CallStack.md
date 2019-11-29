---
layout: post
title: "ColdFusion Zeus POTW: CallStack"
date: "2011-12-19T09:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/12/19/ColdFusion-Zeus-POTR-CallStack
guid: 4464
---

One of the new language additions to ColdFusion Zeus is the ability to get the current callstack. If that sounds Greek to you, it's simply the ability for a function to know who call it, who called that guy, and so on. It sounds confusing, but a few quick examples will help.
<!--more-->
<p>

In our first example, I've got a call to a UDF that calls another UDF. That UDF runs one of the two new functions introduced in this blog post, callStackGet.

<p>

<code>
&lt;cfscript&gt;
function top() {
	return child();
}

function child() {
	return callStackGet();
}
&lt;/cfscript&gt;

&lt;cfdump var="#top()#"&gt;
</code>

<p>

callStackGet returns an array of "invokers", or basically, how in the heck did we get here. Looking at the code it's easy enough to tell that child was called by top, and top was called by our cfdump. When displayed, this is what we get.

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip.png" />

<p>

Notice the array is ordered from most immediate to the final originator of the caller. Also note that the function is labelled where appropriate. How about a slightly more complex example? Consider the code below.

<p>

<code>
&lt;cfscript&gt;
function grandparent() {
	return parent();
}

function parent() {
	return child(); 
}

function child() {
	return new some().test();
}
&lt;/cfscript&gt;

&lt;cfdump var="#grandparent()#"&gt;
</code>

<p>

This is similar to our earlier code, but now child is invoking a CFC as well. Here is some.cfc.

<p>

<code>
component {

	function test() {
		return callStackGet();
	}

}
</code>

<p>

And the result...

<p>


<img src="https://static.raymondcamden.com/images/ScreenClip1.png" />

<p>

As expected, it picks up on the different file in the CFC. 

<p>

Another option is callstackDump. callstackDump returns a string based version of the callstack. It supports logging to a file, logging to console, or simply printing to the browser. Here's a modified form of the CFM we last tested with.

<p>

<code>
&lt;cfscript&gt;
function grandparent() {
	return parent();
}

function parent() {
	callstackDump(expandPath("./callstack.log"));
	callstackDump("browser");
	return child(); 
}

function child() {
	return new some().test();
}
&lt;/cfscript&gt;

&lt;cfdump var="#grandparent()#"&gt;
</code>

<p>

Notice I've added two calls to callstackDump. Most likely, this is a more real world example as you won't probably ever return a callstack to the user. Here's an example of how it prints to my browser.

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip2.png" />

<p>

And there you have it folks. I'll be posting another Zeus preview before the Christmas break.