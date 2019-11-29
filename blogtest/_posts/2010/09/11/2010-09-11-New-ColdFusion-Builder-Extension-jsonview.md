---
layout: post
title: "New ColdFusion Builder Extension - jsonview"
date: "2010-09-11T15:09:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/09/11/New-ColdFusion-Builder-Extension-jsonview
guid: 3938
---

I'm not sure how useful this is, but earlier today I needed to quickly turn a JSON string into formatted data. I could do this in ColdFusion with one line of code, but I wanted it even <i>faster</i>. I found a great online viewer here: <a href="http://jsonviewer.stack.hu/">http://jsonviewer.stack.hu/</a> but I thought it would be kind of fun to build it into CFBuilder as well. I whipped up the following extension in about 20 minutes: <a href="http://jsonview.riaforge.org">http://jsonview.riaforge.org</a>. It allows you to enter either a URL or a block of JSON:

<img src="https://static.raymondcamden.com/images/Screen shot 2010-09-11 at 1.49.33 PM.png" />

Once entered, you just submit the form and can then see the rendered JSON:


<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-09-11 at 1.50.22 PM.png" />

Probably not very useful - but heck - once again let me just say how much I fracking love the fact that I was able to extend ColdFusion Builder to meet my needs!