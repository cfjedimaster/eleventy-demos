---
layout: post
title: "What the heck is Application ''?"
date: "2012-04-25T10:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/04/25/What-the-heck-is-Application-
guid: 4596
---

I'm working on an update to <a href="http://www.cflib.org">CFLib</a>. Nothing that end users will actually see, but rather all behind the scenes. The current code base makes use of Model-Glue and Transfer. I'm rebuilding it for ColdFusion 10 and making use of Framework One and ORM. It's been a while since I've gotten to use <a href="https://github.com/seancorfield/fw1/wiki">FW/1</a> and I forgot how much of a pleasure it is to use. 

I did run into one issue that threw me for a loop. Whenever I work with an ORM-based site, I know I'll need to call ormReload and applicationStop on demand, so I whip up code that looks like this.

<script src="https://gist.github.com/2489907.js?file=gistfile1.cfm"></script>

Normally I put this within onRequestStart. However, in my FW/1 Application.cfc, I didn't have any of the methods I normally do. So I simply placed it as is within the file. 

When I added ?init to my URL to force a refresh, I got this error:

<h2>Application '' does not exist.</h2>

I had absolutely no idea why this occurred since obviously my application did have a name. I filed a bug and after exchanging a few emails with Adobe engineer Sagar H Ganatra, he discovered the issue. 

At the time my code ran, the application wasn't properly "ready" yet. When the code block is moved into onRequestStart, that's when you can run an applicationStop call properly.

We both agreed that the error message wasn't helpful, and the bug has been updated to correct the message and make it more clear what the issue is.