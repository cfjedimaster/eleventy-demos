---
layout: post
title: "ColdFire Update"
date: "2008-04-08T10:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/08/ColdFire-Update
guid: 2760
---

While not the most <a href="http://www.raymondcamden.com/index.cfm/2008/4/8/I-hit-level-35-today-IRL">important news</a> today, Nathan has released a new update to <a href="http://coldfire.riaforge.org">ColdFire</a>. He talks about the update here:

<a href="http://www.mischefamily.com/nathan/index.cfm/2008/4/7/ColdFire-115159-Released">ColdFire 1.1.51.59 Released</a>

While there are a number of changes, the big one is the request queue. This means that if you hit a ColdFusion page with Ajax requests, you can introspect all of the ColdFusion debugging information for everything in the browser. This doesn't work well with ColdFusion 8's built in Ajax requests since they pass flags to disable debugging, but for your own Ajax code (like Spry sites) this is awesome!