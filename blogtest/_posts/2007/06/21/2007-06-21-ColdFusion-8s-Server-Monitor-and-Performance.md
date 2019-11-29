---
layout: post
title: "ColdFusion 8's Server Monitor and Performance"
date: "2007-06-21T19:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/21/ColdFusion-8s-Server-Monitor-and-Performance
guid: 2140
---

A few days ago I blogged about the Server Monitor API (<a href="http://www.raymondcamden.com/index.cfm/2007/6/14/ColdFusion-8-Server-Monitor-API">ColdFusion 8: Server Monitor API</a>) and I mentioned that I removed the link to the online demo as it seemed as enabling Server Monitoring had a negative impact on my server. I said I wasn't sure - but I was worried. 

I shared these concerned on <a href="http://carehart.org/blog/client/index.cfm/2007/6/15/cf8_monitor_impact_on_prod">Charlie Arehart's blog</a> and tried to be clear that I could be wrong. 

After working with Adobe a bit and actually finding a bit more time to say - I can definitely say I agree with Adobe and Charlie's post - enabling profiling and monitoring has minimal impact on your server. 

I've had it on all day now and have yet to see anything slow down. Here is the <a href="http://www.coldfusionjedi.com/demos/apitest.cfm">demo</a> I mentioned in my API post. 

In case folks are curious - this server is a vserver, but I'll be moving to a dedicated box in the next few weeks.