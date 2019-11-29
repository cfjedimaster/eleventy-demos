---
layout: post
title: "JavaScript Errors and the Firefox Console"
date: "2013-08-16T08:08:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2013/08/16/JavaScript-Errors-and-the-Firefox-Console
guid: 5008
---

This may fall into the category of "so obvious I'm the only one who didn't get it", but I just had to share it. I'm preparing a blog post where I've got an intentional error in my JavaScript code. I noticed that it wasn't showing up in the Firefox console though. I added a console.log message before the error - and it showed up - but my error never did.
<!--more-->
Check out the screen shot below:

<img src="https://static.raymondcamden.com/images/Screenshot_8_16_13_7_04_AM.png" />

Notice that CSS warnings are showing up - which is cool - and "1" is my console.log message. But my JavaScript error isn't there. I clicked the console drop down to see what options were there:

<img src="https://static.raymondcamden.com/images/Screen Shot 2013-08-16 at 7.06.24 AM.png" />

Yep - logging of errors is enabled. So what the heck? Turns out I had to <strong>also</strong> check the options on the JavaScript tab:

<img src="https://static.raymondcamden.com/images/Screen Shot 2013-08-16 at 7.07.25 AM.png" />

Ugh. I can't imagine why Errors would be turned off, but maybe it's a sensible default for some reason. That complaint aside - I have to say I <strong>really</strong> like the look of the console.