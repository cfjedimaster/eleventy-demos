---
layout: post
title: "\"Full\" sample of IndexedDB in action"
date: "2012-04-30T11:04:00+06:00"
categories: [development,html5,javascript]
tags: []
banner_image: 
permalink: /2012/04/30/Full-sample-of-IndexedDB-in-action
guid: 4601
---

After a bit more sweat and tears, I've now got a "full" (if ugly) example of an IndexedDB application. It allows you to create and delete simple notes. You can view this demo here:

<a href="http://www.raymondcamden.com/demos/2012/apr/30/test5.html">http://www.raymondcamden.com/demos/2012/apr/30/test5.html</a>

Right now this demo is Firefox only. It doesn't work in Chrome because of the bug I <a href="http://www.raymondcamden.com/index.cfm/2012/4/26/Sample-of-IndexedDB-with-Autogenerating-Keys">mentioned</a> in my earlier blog post. Here's the code - and again - I want to mention (and credit) the excellent <a href="https://developer.mozilla.org/en/IndexedDB/Using_IndexedDB">MDN tutorial</a> for making this easier to build.

<script src="https://gist.github.com/2559021.js?file=gistfile1.html"></script>

Nothing too scary, right? Using method chaining makes the code a bit more palatable and simpler to work with. 

After getting this working, I began to look at how you can retrieve data. I guess I shouldn't be surprised (and @thefalken pointed it out to me), but you are limited to primary key lookups only.

So let me make sure that is clear. <b>This is not a replacement for WebSQL. You cannot search.</b> I guess - technically - you could search if you load everything up and iterate over it, but that's not really efficient. You can do range based filters, so for example, given a set of names I could go from Bob to Mary, but if I wanted to quickly find all the objects with property X set to Y and property Z set to A, then I'm out of luck. I was really thinking this was a Mongo-ish type solution, but I was wrong.

I don't know about you - but this is kind of disappointing. Maybe my opinion will change, but right now I'm sad that WebSQL is being dumped for this.