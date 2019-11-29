---
layout: post
title: "New Chrome Extension: Diablo 3 Server Checker"
date: "2012-06-07T12:06:00+06:00"
categories: [video games]
tags: []
banner_image: 
permalink: /2012/06/07/New-Chrome-Extension-Diablo-3-Server-Checker
guid: 4643
---

I built this because I was trying desperately to procrastinate while finishing an article for <a href="http://www.html5rocks.com">HTML5Rocks.com</a>. The Diablo 3 Status Checker does exactly what it says - it pings the English <a href="http://us.battle.net/d3/en/status">server status</a> page and does a bit of regex on the result to see if the American server is up. If it is up - you get a happy face. If not - you get a frowny face. Not exactly rocket science - but it works (especially if you want to avoid writing). Curious about the code? Here is the JavaScript behind it. It is based heavily on one of the existing sample apps.

<script src="https://gist.github.com/2889374.js?file=gistfile1.js"></script>

You can install it via the CRX I Have hosted here...

<a href="http://www.raymondcamden.com/enclosures/diablochecker.crx">http://www.raymondcamden.com/enclosures/diablochecker.crx</a>

I was going to put it up on the Chrome store, but ended up rage-quitting when it asked me for 500 different screen shots of an extension that has two small icons.