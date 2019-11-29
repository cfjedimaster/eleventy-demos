---
layout: post
title: "IIS6 Bug with CFLOCATION"
date: "2005-10-09T00:10:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2005/10/08/IIS6-Bug-with-CFLOCATION
guid: 839
---

So, I've been trying to debug an issue with Galleon that I only saw on this server, not my local box. For some reason, whenever an IE browser posts a new message, instead of the current thread reloading, the user was pushed to the home page. (You won't see this now as I've disabled the cflocation.) I couldn't understand why, so I added some debugging.

When a new message is created, I use cflocation to reload the page so that a refresh of the browser won't repost the message. The message was being created, and the cflocation was running, but when the page reloaded, the value of the Thread ID wasn't valid anymore. Why? Because the anchor in my cflocation URL, #top, was being appended to the url value.

In other words, in Firefox, when the cflocation ran and the page loaded, url.threadid was the right string. In IE, doing the exact same operation, the value of url.threadid was theid#top. 

I tried like heck to replicate this locally, but couldn't do so. Finally I created a simple test. Go to <a href="http://ray.camdenfamily.com/demos/test.cfm">http://ray.camdenfamily.com/demos/test.cfm</a> in Firefox and you will be pushed to test2.cfm?x=1#top. The dump you see is the URL scope. Notice that all you see is X and 1. Hit the exact same URL with IE and the value of x is not 1#top. 

I did some Googling, and I did find one other user who saw the exact same thing in a .Net application under IIS6. Is anyone else seeing it?