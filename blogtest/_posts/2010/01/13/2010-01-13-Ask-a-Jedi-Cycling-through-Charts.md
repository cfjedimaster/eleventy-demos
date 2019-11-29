---
layout: post
title: "Ask a Jedi: Cycling through Charts"
date: "2010-01-13T17:01:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/01/13/Ask-a-Jedi-Cycling-through-Charts
guid: 3682
---

Alison asks:

<p>

<blockquote>
Do you have any code for cycling through multiple cfcharts?  Basically, I need to see one chart at a time, that changes every few seconds.  Any help would be awesome and much appreciated!
</blockquote>
<!--more-->
<p>

I didn't have anything like that handy, but I figured it would be trivial in jQuery. I also assumed that there were probably a few hundred plugins that would do this already, but wanted to see if I could write this myself. Here is what I came up with. Feel free to tear it to bits with suggestions!

<p>

First, let's assume you have a block that contains the items you want to cycle through:

<code>
&lt;div id="slideshow"&gt;

&lt;p&gt;First para&lt;/p&gt;
&lt;p&gt;
Second para
&lt;/p&gt;
&lt;p&gt;
Third para
&lt;/p&gt;

&lt;/div&gt;
</code>

<p>

In this example, I want each paragraph to act like a slide. My code is going to assume that all of the children of the main block are <i>also</i> block level elements. 

<p>

Ok, so given our HTML, here is the jQuery code I came up with:

<code>
&lt;script&gt;
var currentPosition = -1
var blocks
var lastBlock

$(document).ready(function() {

	blocks = $("#slideshow").children()

	if(blocks.length) {
		$(blocks).each(function() {
			//hide them
			$(this).hide()
		})
		window.setInterval("showNext()", 2000)
	}
})

function showNext() {
	currentPosition++
	if(currentPosition == blocks.length) currentPosition = 0
	if(lastBlock) $(lastBlock).fadeOut('normal',function() {% raw %}{$(blocks[currentPosition]).fadeIn() }{% endraw %})
	else $(blocks[currentPosition]).fadeIn()

	lastBlock = blocks[currentPosition]
}
&lt;/script&gt;
</code>

<p>

Reading from the top to bottom, I begin with a few global variables that I'll be using throughout the rest of the script. My document.ready block takes care of defining blocks as the children of my div. If I actually have children then I immediately hide them. (If this were for a real site I'd use some CSS to ensure they were hidden initially. Without that you're going to get a 'flash' of content before the script runs.) Next I setup an interval to run showNext.

<p>

The showNext function simply increments currentPosition, determines if it needs to hide a previous item and then shows the next one. Pretty simple. You can see this in action here: <a href="http://www.raymondcamden.com/demos/jan132010/test4a.cfm">http://www.coldfusionjedi.com/demos/jan132010/test4a.cfm</a>

<p>

Ok, so now let's take it a step further and actually add the charts in. The first thing I noticed is that when the code cycled through the entire set and returned to the beginning, I got the imfamous 'image has expired' issue. That was easy enough to fix by switching to PNG charts, but the quality took a nosedive. You could tweak this a bit - but honestly, I'd just either live with it or try one of the many other charting alternatives there are out there. I also took the opportunity to fix the initial pause. Now my code runs the first slide immediately and then begins the interval. Here is the entire sample with hard coded charts:

<code>
&lt;!---
&lt;cfchart format="flash" xaxistitle="Department" yaxistitle="Salary" title="2002"&gt;
	&lt;cfchartseries type="bar"&gt;
		&lt;cfchartdata item="Sales" value="90000"&gt;
		&lt;cfchartdata item="IT" value="20000"&gt;
		&lt;cfchartdata item="Marketing" value="110000"&gt;
	&lt;/cfchartseries&gt;
&lt;/cfchart&gt;
---&gt;

&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
var currentPosition = -1
var blocks
var lastBlock

$(document).ready(function() {

	blocks = $("#slideshow").children()

	if(blocks.length) {
		$(blocks).each(function() {
			//hide them
			$(this).hide()
		})
		showNext()
		window.setInterval("showNext()", 4000)
	}
})

function showNext() {
	currentPosition++
	if(currentPosition == blocks.length) currentPosition = 0
	if(lastBlock) $(lastBlock).fadeOut('normal',function() {% raw %}{$(blocks[currentPosition]).fadeIn() }{% endraw %})
	else $(blocks[currentPosition]).fadeIn()

	lastBlock = blocks[currentPosition]
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;h2&gt;Testing&lt;/h2&gt;

&lt;div id="slideshow"&gt;

&lt;p&gt;
&lt;cfchart format="png" xaxistitle="Department" yaxistitle="Salary" title="2002" chartheight="400" chartwidth="400"&gt;
	&lt;cfchartseries type="bar"&gt;
		&lt;cfchartdata item="Sales" value="90000"&gt;
		&lt;cfchartdata item="IT" value="20000"&gt;
		&lt;cfchartdata item="Marketing" value="110000"&gt;
	&lt;/cfchartseries&gt;
&lt;/cfchart&gt;
&lt;/p&gt;
&lt;p&gt;
&lt;cfchart format="png" xaxistitle="Department" yaxistitle="Salary" title="2003" chartheight="400" chartwidth="400"&gt;
	&lt;cfchartseries type="bar"&gt;
		&lt;cfchartdata item="Sales" value="99000"&gt;
		&lt;cfchartdata item="IT" value="24000"&gt;
		&lt;cfchartdata item="Marketing" value="120000"&gt;
	&lt;/cfchartseries&gt;
&lt;/cfchart&gt;
&lt;/p&gt;
&lt;p&gt;

&lt;cfchart format="jpg" xaxistitle="Department" yaxistitle="Salary" title="2004"  chartheight="400" chartwidth="400"&gt;
	&lt;cfchartseries type="bar"&gt;
		&lt;cfchartdata item="Sales" value="88000"&gt;
		&lt;cfchartdata item="IT" value="32000"&gt;
		&lt;cfchartdata item="Marketing" value="100000"&gt;
	&lt;/cfchartseries&gt;
&lt;/cfchart&gt;
&lt;/p&gt;

&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

You can see this running here: <a href="http://www.coldfusionjedi.com/demos/jan132010/test4b.cfm">http://www.coldfusionjedi.com/demos/jan132010/test4b.cfm</a>

<p>

p.s. I recently got a wishlist item (Dragon America) with a note asking me to contact the person. However, their name was obscured on the packing slip. From time to time I get gifts from my <a href="http://www.amazon.com/gp/registry/wishlist/ref=cm_gift_gno_wl_hp">wish list</a> and I can't find a way to contact the person. So if your in that group, accept my apology and thanks!