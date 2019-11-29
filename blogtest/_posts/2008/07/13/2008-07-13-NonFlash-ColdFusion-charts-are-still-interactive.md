---
layout: post
title: "Non-Flash ColdFusion charts are still interactive"
date: "2008-07-13T23:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/07/13/NonFlash-ColdFusion-charts-are-still-interactive
guid: 2931
---

So this is news to me. In preparation for talking about the Lemonade Stand results tomorrow, I worked a bit more on the reporting for my simulator. Since I love charts, I plopped a chart down at the end that shows each stand and how it performs over all 50 days. I knew I was going to want to share the complete chart on the blog post, so I switched from the default Flash format to PNG. When I moused over the chart though I noticed the tool tips still worked! Here is an example:

<img src="https://static.raymondcamden.com/images/Picture 115.png">

Turns out that for both PNG and JPG formats, the charting engine will actually output an image map and support the same tool tips you get with the Flash version. 

Nice to know. I mean, in my case my plan is to save the PNG/JPG, so it won't help, but if you can't use Flash for other reasons, you can still have an interactive chart. (Note - I just tested the URL property and it works fine as well for PNG/JPG.)