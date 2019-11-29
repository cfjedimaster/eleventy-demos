---
layout: post
title: "ColdFusion/SlideShare integration tip"
date: "2008-04-25T12:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/25/ColdFusionSlideShare-integration-tip
guid: 2789
---

I'm doing some work integrating <a href="http://www.slideshare.net/">SlideShare</a> with ColdFusion. SlideShare has a rather simple API, but no matter what I did, I kept getting an API failed validation. Turns out the error was rather simple. 

Part of the API requires you to hash a secret key and a Unix time stamp. My code looked like so:

<code>
&lt;cfset thehash = hash(secret & ts,"SHA","UTF-8")&gt;
</code>

Turns out the result needs to be in lowercase for it to work right. When I lcased the result, the API started working immediately. 

<code>
&lt;cfset thehash = hash(secret & ts,"SHA","UTF-8")&gt;
&lt;cfset thehash = lcase(thehash)&gt;
</code>

I'm blogging this for two reasons - others may want to work with SlideShare as well (I'm going to see if I can release any of my code), and while i can't say where, I'm pretty sure I remember some other API having the exact same issue.