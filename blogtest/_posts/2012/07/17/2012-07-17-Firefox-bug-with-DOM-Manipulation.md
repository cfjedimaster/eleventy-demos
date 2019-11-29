---
layout: post
title: "Firefox bug(?) with DOM Manipulation"
date: "2012-07-17T17:07:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2012/07/17/Firefox-bug-with-DOM-Manipulation
guid: 4680
---

I was working on a new project today when I ran into an odd bug with Firefox. Firefox is not my primary browser, but I've been trying to use it a bit more lately as it seems to be adding some new features. But this bug.... wow. It seems, and let me be clear here, it <b>seems</b> so incredibly stupid that I have to imagine that I'm doing something wrong. I can't imagine a browser doing something like this without it being some setting that maybe I tweaked in the past. That being said, here is a simple example of it that you can try yourself. I'm more than willing - shoot - I'm <i>hoping</i> I'm wrong.

<script src="https://gist.github.com/3131732.js?file=gistfile1.html"></script>

Basically - the page has one button. I use jQuery to create a click listener for it that simply disables the button. Nothing magic, right? You can run my version here: <a href="http://raymondcamden.com/demos/2012/jul/17_3/test2.html">http://raymondcamden.com/demos/2012/jul/17_3/test2.html</a>

Run this in Chrome. Click the button. Confirm it disables. Then reload. Everything is cool, right?

Run this in Firefox. Click the button. Confirm it disables. Then reload. WTF. You clearly see a new console message with the right date, but the button stays disabled. To get around this I have to press Enter in the URL bar. 

Firefox reran the JavaScript but kept the DOM unchanged from its last stage.

I cannot begin to imagine by what logic this makes sense, but.... maybe one of you smart people can tell me what I'm seeing here?