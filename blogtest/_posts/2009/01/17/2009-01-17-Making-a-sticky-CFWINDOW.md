---
layout: post
title: "Making a \"sticky\" CFWINDOW"
date: "2009-01-17T17:01:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2009/01/17/Making-a-sticky-CFWINDOW
guid: 3198
---

Ok, I'm not <i>really</i> a huge fan of CFWINDOW, despite this being the <a href="http://www.raymondcamden.com/index.cfm/2009/1/16/Launching-CFWINDOW-with-a-Dynamic-Location">second blog post</a> in a row about them. That being said, I thought I'd recreate a trick (see PS below) with CFWINDOW that maybe some folks will find useful. The trick involves keeping CFWINDOW in a position and making it stick there as you scroll. It is probably best if you see it live:

<a href="http://www.coldfusionjedi.com/demos/stalker/wintest.cfm">http://www.coldfusionjedi.com/demos/stalker/wintest.cfm</a>

Scroll down and note the CFWINDOW will adjust itself back to the original position. The code simply uses JavaScript to do the following:

<ul>
<li>Notice scrolls
<li>When they scroll, note the position of the scroll and start an interval
<li>Figure out how far 'off' the CFWINDOW is from where it should be and go 90% of the way there.
<li>If the distance is less than some threshold, just set it and stop the interval
</ul>

A bit silly, but fun! The complete code is here:

<code>
&lt;cfajaximport tags="cfwindow" /&gt;
&lt;html&gt;

&lt;head&gt;
&lt;script&gt;
var origx = 50;
var origy = 50;
var origheight = 200;
var targety = "";
var moving = false;

function init() {
	ColdFusion.Window.create('mywin','Windows Rules','win.cfm',{% raw %}{x:origx,y:origy,width:200,height:origheight,draggable:false}{% endraw %});
	window.onscroll = handleScroll;
}

function handleScroll(e) {
	var cury = window.scrollY;
	var win = ColdFusion.Window.getWindowObject('mywin');
	//var newy = origy+curY;
	//console.log('set y to '+newy)
	//win.moveTo(origx,newy);
	targety = origy+cury;
	if (!moving) {
		moving = true;
		heartbeat = window.setInterval('moveit()', 10);
	}
}

function moveit() {
	
	var win = ColdFusion.Window.getWindowObject('mywin');
	var pos = win.xy;
	//find out how far I'm away from target
	//console.log('my targety is '+targety+' and my current y is '+pos[1])
	var distance = targety - pos[1];
		
	if (distance == 0) {
		window.clearInterval(heartbeat);
		moving = false;
		return;
	}

	//we want to go X{% raw %}%, unless the X%{% endraw %} is &lt; threshhold of &, then just go there
	if(distance &gt; 3 || distance &lt; -3) var tomove = Math.round(0.09 * distance);
	else var tomove = distance;
	var newy = pos[1]+tomove;
	//console.log('my newy is '+newy)
	win.moveTo(origx,newy);
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;h2&gt;Header&lt;/h2&gt;
&lt;cfoutput&gt;#repeatString("&lt;br/&gt;",200)#&lt;/cfoutput&gt;
&lt;h2&gt;Footer&lt;/h2&gt;

&lt;/body&gt;
&lt;/html&gt;

&lt;cfset ajaxOnLoad("init")&gt;
</code>

p.s. Ok, so this effect has been done before, and probably with better JavaScript, but I think, stress <i>think</i> I was the first one to do it. Way back in the old days, around 96 or so, the company I worked for did a lot of custom web development for Netscape. One day we were tasked to do a company timeline for them. The timeline was a very wide graph inside a frame. The timeline tracked 3 things I think, and they wanted a little control you could click to turn on/off the lines. The problem was that as you scrolled along the timeline, you lost the little control doohicky.

I created what I called the Stalker, a bit of JS code that simply did, well, what I described above. I was pretty surprised when it actually worked. Later on I wrote an IE compatible version and eventually wrapped it into a custom tag for the Allaire ColdFusion tag gallery. Unfortunately the company I worked for back then wasn't really into the OS thing so the tag was encrypted and it belonged to them. Anyway, not trying to brag (ok, maybe I am) but I thought it was an interesting story. 

Ok, another quick side story to this side story. I did some Perl work at Netscape and would, from time to time, check their intranet. They had a stats page for netscape.com. If I remember right the #s were insane, something like millions and millions of hits per day - all from folks who didn't know how to change their homepage. The Perl project is a story for another day.