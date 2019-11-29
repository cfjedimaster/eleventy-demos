---
layout: post
title: "Launching CFWINDOW with a Dynamic Location"
date: "2009-01-16T18:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/01/16/Launching-CFWINDOW-with-a-Dynamic-Location
guid: 3197
---

Over on cf-talk, a user asked if it was possible to use cfwindow without either centering the window or using a hard coded x, y position. Instead they wanted it relative to where the user clicked. This was rather easy to do so I thought I'd share the code.
<p/>
First, we need to take a link and simply call a JavaScript function. In order to know where we clicked, we will use two event values:
<p/>

<code>
This is the test &lt;a href="" onclick="makeWin(event.pageX,event.pageY);return false;"&gt;link&lt;/a&gt;.
</code>
<p/>

The makeWin function then will do:
<p/>

<code>
function makeWin(x,y) {
	ColdFusion.Window.create('mywin','Windows Rules','win.cfm',{% raw %}{x:x+25,y:y+25}{% endraw %});
}
</code>
<p/>

And, um, that's it! I thought it would be a bit more complex. The +25 on both x and y will launch the window 25 pixels to the right and down from where you clicked. Adjust accordingly to taste.
<p/>

<img src="https://static.raymondcamden.com/images//pushedwin.png">
<p/>

The complete template (minus win.cfm) is below:
<p/>

<code>
&lt;cfajaximport tags="cfwindow"&gt;

&lt;script&gt;
function makeWin(x,y) {
	ColdFusion.Window.create('mywin','Windows Rules','win.cfm',{% raw %}{x:x+25,y:y+25}{% endraw %});
}
&lt;/script&gt;

&lt;h2&gt;Content to push stuff down&lt;/h2&gt;

&lt;h2&gt;More content to push stuff down the page vertically...&lt;/h2&gt;

&lt;p&gt;
This is the test &lt;a href="" onclick="makeWin(event.pageX,event.pageY);return false;"&gt;link&lt;/a&gt;.
&lt;/p&gt;
</code>