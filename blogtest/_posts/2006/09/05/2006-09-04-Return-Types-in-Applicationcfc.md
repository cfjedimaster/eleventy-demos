---
layout: post
title: "Return Types in Application.cfc"
date: "2006-09-05T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/09/05/Return-Types-in-Applicationcfc
guid: 1514
---

Peter sent in an interesting question this morning, especially as it relates to my <a href="http://ray.camdenfamily.com/index.cfm/2006/9/1/Applicationcfc-Presentation-Files--Recording-URL--Next-Meeting">last presentation</a>:

<blockquote>
Just wanted to quickly check something about your <a href="http://ray.camdenfamily.com/downloads/app.pdf">App.cfc reference</a>:

The onApplicationStart and onRequestStart functions have a returntype of Boolean, whilst the rest are all Void.

Is there a reason for these two being different
than the others, particularly the onSessionStart function? 
</blockquote>

The fact that you can return true or false in onApplicationStart and onRequestStart simply are ways to let you abort the application start up, or request, based on some condition. The example I believe I gave in my <a href="http://ray.camdenfamily.com/index.cfm/2006/9/1/Applicationcfc-Presentation-Files--Recording-URL--Next-Meeting">presentation</a> was doing a quick database check. If the check fails, then send some kind of message to the admin and prevent the application from starting up. You could do the same in onRequestStart, although it is probably overkill to check every request. What you could do instead is log the last time you checked (in the application scope for example), and check only if sixty minutes have passed. 

Anyone out there using something like this in their Application.cfc files?