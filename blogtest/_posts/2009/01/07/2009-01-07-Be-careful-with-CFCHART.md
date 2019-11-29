---
layout: post
title: "Be careful with CFCHART"
date: "2009-01-07T14:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/01/07/Be-careful-with-CFCHART
guid: 3181
---

A while ago I <a href="http://www.raymondcamden.com/index.cfm/2008/1/18/Coolest-CFCHART-Trick-Ever">blogged</a> about a cool cfchart trick that made use of the Java API to the webcharts3d engine. This allowed for customization not possible with the style xml method that I've recommended numerous times in the past. 

Reader Reed Powell made an <a href="http://www.coldfusionjedi.com/index.cfm/2008/1/18/Coolest-CFCHART-Trick-Ever#c49E6AEFA-19B9-E658-9DF6931D0D623A27">interesting comment</a> that I must admit didn't quite register to me at the time. His comment was that if you made use of this way of creating charts, you will end up with a watermark on the chart, and here is the important point, you will also get watermarks on simple charts as well.

It seems as if WebCharts3D is seeing your use as a 'cheat' and then begins to mark <b>all</b> further usage of the engine with the watermark. Reed commented to me personally that he had to actually reinstall ColdFusion to get rid of this watermark. In my tests on OSX, I simply had to restart ColdFusion.

Anyway, something to look out for. I guess, technically, the use of the Java API is not officially supported or documented, so it's ok that it doesn't work well.