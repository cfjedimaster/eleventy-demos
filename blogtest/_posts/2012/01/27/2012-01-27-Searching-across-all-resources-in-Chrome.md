---
layout: post
title: "Searching across all resources in Chrome"
date: "2012-01-27T17:01:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2012/01/27/Searching-across-all-resources-in-Chrome
guid: 4511
---

Thanks for this goes to <a href="http://paulirish.com/">Paul Irish</a>. For a while now I've been trying to find a way to search for a value across multiple files that are loaded in a browser request. But every time I used the Search field in Chrome Dev tools, it would only search the current file. I'm talking about the highlighted search field below:


<img src="https://static.raymondcamden.com/images/ScreenClip19.png" />

Yes - I know - my MSPaint skills suck. ;) As I said, that only searches the current file. If there are a bunch of JavaScript files in one request, you're screwed unless you feel like manually switching from one to another.

But it turns out there's <i>another</i> search form you can open with ctrl-shift-f (cmd-opt-f on OSX):

<img src="https://static.raymondcamden.com/images/ScreenClip20.png" />

Not only will it search across all files (not just JavaScript), it supports case sensitivity and regex based searches as well. 

Anyway - thanks again to Paul for sharing the tip and I hope it helps others.