---
layout: post
title: "Very cool trick - CFBuilder extensions and Firebug Lite"
date: "2010-05-28T03:05:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/05/28/Very-cool-trick-CFBuilder-extensions-and-Firebug-Lite
guid: 3833
---

While in Europe, I've now given my presentation on CFBuilder and Extensions three times. I'll be giving it a final time in Zurich tonight. One of the things I've mentioned in all the stops is that - much like AJAX - it can sometimes be difficult to debug problems when working with extensions. Last night when I said this, <a href="http://www.bennadel.com/">Ben Nadel</a> asked if I thought <a href="http://getfirebug.com/firebuglite">Firebug Lite</a> would work within the context of CFBuilder. For those who don't know, Firebug Lite is a JavaScript file you can add to a non-Firebug enabled site to get Firebug features. It is <b>not</b> as feature-rich as the "real" Firebug plugin, but it does quite a bit. Turns out he was on to something. Here is how I tested and what I found.
<!--more-->
<p>
I began by modifying the handler of a very simple extension I built for my presentation. Previously it just checked to see if you had clicked on a file or folder and reported on some user input. My test code was added on top of that.
<p>
<code>
&lt;!---&lt;script type="text/javascript" src="https://getfirebug.com/firebug-lite.js"&gt;&lt;/script&gt;---&gt;
&lt;script src="http://localhost/firebug-lite.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	console.log('loaded')
	$("#foo").load('http://localhost/test2.cfm')
	console.log('fired xhr')
})
&lt;/script&gt;
&lt;p id="foo"&gt;&lt;/p&gt;
</code>

<p>

You can see I originally used the hosted version of Firebug Lite. It worked - but I noticed a definite pause when I used it. I'm sure that was more my connection than anything else. Nonetheless, I copied it to my local system and used it there instead. Next I included jQuery. I wanted a quick and dirty way to do AJAX and obviously I'm a jQuery fan boy so why <i>not</i> use it. Finally - I wrote a few quick tests. I tried the console and an AJAX request to a local file. The result?

<p>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-05-28 at 8.34.47 AM.png" title="Shot One" />

<p>

As you can see, the Firebug Lite icon shows up in the lower right corner. I increased the size of the dialog and then clicked it.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-05-28 at 8.35.48 AM.png" title="Shot Two" />


<p>

<b>Sweet</b> As you can see, I've got both console messages there as well as the XHR request. Clicking to expand the request gives me the data that was returned.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-05-28 at 8.36.54 AM.png" title="Shot Three" />

<b>Sweet Again!</b> So I'm not sure how deeply you would want to use AJAX within a CFBuilder extension, but if you do decide to push the limits, this could be a real boon to your development. Thanks again to Ben for the idea, and thanks to Adobe for the extension feature!