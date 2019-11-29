---
layout: post
title: "Ask a Jedi: Run a callback on every ColdFusion.navigate/AjaxLink"
date: "2009-01-20T10:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/01/20/Ask-a-Jedi-Run-a-callback-on-every-ColdFusionnavigateAjaxLink
guid: 3202
---

Emil asks:

<blockquote>
<p>
I was wondering if there is a way to set a global callbackHandler for "Coldfusion.navigate" when using the
"AjaxLink()" function. You see, I'm using sIFR and I wanted to put the "sIFR.replace()" inside the callbackHandler-function.
</p>
</blockquote>
<!--more-->
Unfortunately there is no built in way to always run a callback for ColdFusion.navigate. Nor is there anyway to do a callback at all for AjaxLink(). What I'd recommend is simply using a wrapper function to handle calling ColdFusion.navigate() and setting up a callback. For example:

<code>
&lt;cfajaximport /&gt;
&lt;script&gt;
function load(url,con) {
	document.getElementById('loadingdiv').innerHTML = "Loading content..."
	ColdFusion.navigate(url,con,handleResult);	
}

function handleResult() {
	document.getElementById('loadingdiv').innerHTML = ""
}
&lt;/script&gt;

&lt;div id="somediv"&gt;&lt;/div&gt;
&lt;div id="loadingdiv"&gt;&lt;/div&gt;

&lt;a href="" onclick="javaScript:load('foo.cfm?x=1','somediv');return false"&gt;x=1&lt;/a&gt;&lt;br&gt;
&lt;a href="" onclick="javaScript:load('foo.cfm?x=2','somediv');return false"&gt;x=2&lt;/a&gt;&lt;br&gt;
&lt;a href="" onclick="javaScript:load('foo.cfm?x=3','somediv');return false"&gt;x=3&lt;/a&gt;&lt;br&gt;
</code>

This example uses a custom function, load, that simply wraps the setting of a loading message (a bit redundant since ColdFusion.navigate will show a spiner) and calling ColdFusion.navigate with the callback.

Nice and simple I think.