---
layout: post
title: "Ask a Jedi: ColdFusion Debugging"
date: "2005-12-12T11:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/12/Ask-a-Jedi-ColdFusion-Debugging
guid: 967
---

Carl asks:

<blockquote>
What actually happens when you turn on debugging in the CF(MX) administrator? Are you telling the debugging service to START COLLECTING debugging data? Or is it ALWAYS collecting that data, and "turning on" debugging is just telling the service to start handing the data off to the debugging template  to display, etc?

In other words, turning debugging on in our environment (Solaris) causes substantial performance degradation. Is this degradation caused by the act of collecting debug info, or rendering it out at the bottom of the page (and, thus, StarFish would go a long way to alleviate said degradation)?
</blockquote>

So I was pretty sure I knew the answer, but I double checked with my Adobe contacts. When debugging is turned off at the CF Admin, CF is <b>not</b> collecting data. So turning on debugging does both the collection, and the output.

Would Starfish be better on your server? I don't know. I don't think it is the rendering that slows ColdFusion though, but rather the data collection. As a side note, Starfish is definitely <b>not</b> performance-friendly right now. I'd use it with caution (it isn't officially even released yet as it is still less then version 1 :).