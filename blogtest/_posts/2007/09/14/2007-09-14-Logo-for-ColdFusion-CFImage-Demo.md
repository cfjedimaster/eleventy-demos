---
layout: post
title: "Logo for ColdFusion - CFImage Demo"
date: "2007-09-14T16:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/14/Logo-for-ColdFusion-CFImage-Demo
guid: 2348
---

A long time ago - in a place far, far away (sorry, couldn't resist), I remember seeing a cool little program on the Apple 2c that taught kids programming by having them move a little turtle around a screen. This was based on the <a href="http://en.wikipedia.org/wiki/Logo_{% raw %}%28programming_language%{% endraw %}29">Logo</a> programming language. Someone mentioned it on a thread yesterday in CF-TALK, and me being the crazy person I am I decided - what the heck - let me try to recreate this in ColdFusion.

So with that - I present CF_LOGO. This is a custom tag that lets you create a canvas and then issue commands for the turtle (or pen) to draw. For example:

<code>
&lt;cf_logo&gt;
forward 100
right 90
forward 60
right 90
forward 90
right 90
forward 50
left 90
forward 99
home
forward 100
&lt;/cf_logo&gt;
</code>

This tells the turtle/pen to move, turn, move, etc. The home command simply returns the turtle to the center of the canvas. This creates the following image:

<img src="https://static.raymondcamden.com/images/turtle1.png">

The language supports many operations, but my tag supports the following commands:

<p>
<table border="1" cellpadding="5">
<tr>
	<td>forward/fd X</td>
	<td>Move the pen forward X pixels.</td>
</tr>
<tr>
	<td>right x</td>
	<td>Turn to the right X degrees. Currently X is ignored and all turns are 90 degrees.</td>
</tr>
<tr>
	<td>left x</td>
	<td>Turn to the left X degrees. Currently X is ignored and all turns are 90 degrees.</td>
</tr>
<tr>
	<td>clearscreen/cs</td>
	<td>Clears the screen.</td>
</tr>
<tr>
	<td>home</td>
	<td>Moves the pen to the center of the canvas.</td>
</tr>
<tr>
	<td>penup/pu</td>
	<td>Lifts the pen. Any future drawing operations won't be displayed.</td>
</tr>
<tr>
	<td>pendown/pd</td>
	<td>Lowers the pen. Any future drawing operations will be displayed.</td>
</tr>
</table>

The custom tag allows you to specify a height and width, a background and pen color, and you can even tell it to return the image as a CFImage object:

<code>
&lt;cf_logo variable="test"&gt;
forward 100
right 90
forward 60
right 90
forward 90
&lt;/cf_logo&gt;

&lt;cfset imageScaleToFit(test,100,100)&gt;
&lt;cfimage action="writetobrowser" source="#test#"&gt;
</code>

Finally, I've set up a demo that lets you issue commands one at a time, to basically draw a picture online:

<a href="http://www.coldfusionjedi.com/demos/logo/test3.cfm">http://www.coldfusionjedi.com/demos/logo/test3.cfm</a>

You can download the test files, the demo, and the custom tag below. 

And yes - this is a <b>complete and utter waste of time</b>. That's what made it fun.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Flogo%{% endraw %}2Ezip'>Download attached file.</a></p>