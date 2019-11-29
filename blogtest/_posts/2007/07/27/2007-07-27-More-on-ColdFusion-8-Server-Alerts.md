---
layout: post
title: "More on ColdFusion 8 Server Alerts"
date: "2007-07-27T18:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/27/More-on-ColdFusion-8-Server-Alerts
guid: 2227
---

A few days ago I blogged about <a href="http://www.raymondcamden.com/index.cfm/2007/7/25/Server-Monitor-Alerts-in-ColdFusion-8">server monitor alerts</a> in ColdFusion 8. I wanted to share a bit more information about them that I discovered this morning. Thanks to Tom Jordhal of Adobe for the help. 

I was looking at alerts on my system today when I found that I needed to restart ColdFusion. When I did - and returned to my Server Monitor page, the alerts were gone! Turns out the list is stored in RAM and if you restart ColdFusion, the list goes away.

But there are two other places where you can look for information. First off - all events are logged to a file named monitor.log. Here are a few sample lines from my own server:

<code>
"Information","scheduler-2","07/24/07","15:32:00",,"X:\ColdFusion8\logs\monitor.log initialized"
"Information","scheduler-2","07/24/07","15:32:00",,"Alert: jvmmemoryalert: Dumped snapshot to file: X:\ColdFusion8\logs\snapshots\snapshot_sysgen_1185305520296.txt"
"Information","scheduler-2","07/24/07","15:32:00",,"Alert: JVM memory allocation has gone over threshold 300 MB"
"Information","scheduler-2","07/24/07","15:32:01",,"Alert: jvmmemoryalert: Email notification sent."
"Information","scheduler-2","07/24/07","15:33:01",,"Alert: JVM memory allocation recovered to under 300 MB"
"Information","scheduler-2","07/24/07","15:33:01",,"Alert: jvmmemoryalert: Email notification sent."
</code>

So there you can see the alerts as they were fired. But I was really concerned about the snapshots. Turns out they are stored to the file system, which is kind of obvious since I was able to view them in the broswer. As you can see from the log above, they are stored to:

&lt;coldfusion root directory&gt;/logs/snapshots

Lastly - I'm hoping next week to get a working example of a Jabber-based IM alert. Although something tells me that won't be the biggest news next week...