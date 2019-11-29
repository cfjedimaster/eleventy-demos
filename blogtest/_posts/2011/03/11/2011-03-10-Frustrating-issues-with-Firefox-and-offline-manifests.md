---
layout: post
title: "Frustrating issues with Firefox and offline manifests"
date: "2011-03-11T00:03:00+06:00"
categories: [html5]
tags: []
banner_image: 
permalink: /2011/03/11/Frustrating-issues-with-Firefox-and-offline-manifests
guid: 4153
---

I'm working on a demo that makes use of the HTML5 offline manifest feature (nicely described <a href="http://diveintohtml5.org/offline.html">here</a>), and I'm having a hell of a time getting things to update in Firefox now that I've begun playing with things. I thought I had my demo ready to go. Whenever I changed my code I went into the cache manifest file and modified my header so that the server would see that the file was updated. This didn't always work, so I'd also go into Firefox settings (Tools/Options/Offline storage)and run Clear Now.

So in theory - that should tell Firefox that the next time I fetch my site it should rerun my cache manifest and update it's offline cache.

But here is where things are getting me. My final bit of code was failing because a file, find.html, was being sent from the cache, and not being updated, even though I had changed the file. 

I updated my manifest file but that didn't work.

I then requested find.html directly in my browser - and even that didn't work.

I cleared cache, restarted Firefox, Apache, cleared cache again, and then this is where I noticed something odd. find.html has no mention of a cache manifest. At all. But when I request find.html in my browser, Apache loads a HTTP request was for my manifest file. So Firefox "knows" the file used to be in the cache and is asking for the manifest even though my HTML in find.html clearly does <i>not</i> tell it to load. 

If I add ?x=1 to the URL, it works. But obviously I need a better solution.

So does anyone have any clues as to what this could be? To be clear, ./find.html is in the manifest, but if I make a direct HTTP request for find.html then why would my manifest be requested instead?