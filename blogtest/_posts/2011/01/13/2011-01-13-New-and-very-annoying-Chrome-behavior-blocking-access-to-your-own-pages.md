---
layout: post
title: "New (and very annoying) Chrome behavior - blocking access to your own pages"
date: "2011-01-13T17:01:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2011/01/13/New-and-very-annoying-Chrome-behavior-blocking-access-to-your-own-pages
guid: 4082
---

So I run the latest and greatest dev version of Chrome (currently 10.0.634.0) so I expect a few... irregularities from time to time. But this one threw me for a loop. I was testing some code on my local server (see <a href="http://www.stephenwithington.com/blog/index.cfm/2011/1/13/Beware-of-Implicit-Structs-Bug-in-ColdFusion-901">this blog post</a> if you are curious about the bug) and ColdFusion was throwing errors left and right. I expected this. But after about 5 reloads all of a sudden I got:

<img src="https://static.raymondcamden.com/images/ScreenClip12.png" />

Read that carefully. Chrome decided to prevent me from "making the situation worse" and prevented me from hitting the site. If I waited a few seconds then I was "allowed" to run the page again. Now luckily the message is very clear on how to get around this. But I wanted to throw this out to my audience in case they run into it, or in case they run into clients reporting it. 

Personally I think this is a huge mistake. I get what they are trying to do here but I can see this backfiring in a big way. You would think it would be smart enough to at least skip the check for localhost.