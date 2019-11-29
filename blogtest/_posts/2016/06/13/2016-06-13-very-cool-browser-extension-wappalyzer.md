---
layout: post
title: "Very cool browser extension - Wappalyzer"
date: "2016-06-13T08:08:00-07:00"
categories: [development]
tags: []
banner_image: 
permalink: /2016/06/13/very-cool-browser-extension-wappalyzer
---

This is normally the kind of thing I'd just Tweet about, but the more I thought about it the more I wanted to ensure I reached out to people who don't use Twitter. A few days ago I discovered an incredibly cool browser extension called [Wappalyzer](https://wappalyzer.com/). The extension (natively supporting Firefox and Chrome but available as a bookmarklet too) serves a simple purpose: Given the current site you're on - what technologies are being used?

<!--more-->

So that may seem a bit weird, so let me share a few examples. First, here's what you see on raymondcamden.com:

<img src="https://static.raymondcamden.com/images/2016/06/wapp1.png" class="imgborder">

As you can see, it's reporting on the various JavaScript libraries I use - which is easy enough to figure out - but it also determined that I'm using Hugo for my static site generator, which frankly blogs my mind. Here is another example - IBM.com:

<img src="https://static.raymondcamden.com/images/2016/06/wapp2.png" class="imgborder">

And here is Adobe.com:

<img src="https://static.raymondcamden.com/images/2016/06/wapp3.png" class="imgborder">

Ok, so what's the big deal? As a web developer, I'm fascinated by how people build sites. As we know, there's an incredible amount of options there for the modern web developer and sometimes it's useful to see where these things are actually used in the wild. This is one of the reasons I built my own Chrome extension, [LocalStorage Monitor](https://chrome.google.com/webstore/detail/localstorage-monitor/bpidlidmmmnapeldonddkjmmjkpeiabi), that lets me know when a site is making use of LocalStorage. It wasn't that I couldn't find this on my own (DevTools makes that trivial), but I wanted my browser to alert me to when a site was using the feature so I could see how they did it. (As an aside, I've already filed a request with Wappalyzer to add a similar feature.) 

In the same way, you could just view source. While "view source" is probably one of the best things you can do as a new web developer, I love that the extension makes it a bit simpler to see the details while browsing.

Anyway - I think this is pretty darn cool and I definitely recommend adding it to your browser!