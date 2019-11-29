---
layout: post
title: "Server Monitor Alerts in ColdFusion 8"
date: "2007-07-25T11:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/25/Server-Monitor-Alerts-in-ColdFusion-8
guid: 2219
---

So this isn't exactly old news, but while I've played quite a bit with the new Server Monitor in ColdFusion 8, I never really took a good look at the Alerts section. This week I finally took some time to play with alerts. Alerts are a great way to monitor your box without having to have the Server Monitor constantly running in a browser window. As you can guess, alerts will monitor various different things on your server and let you know if something goes wrong. 

<a href="http://www.raymondcamden.com/images/smalerts1.png"><img src="https://static.raymondcamden.com/images/cfjedi/smalerts1_thumb.jpg" align="left" style="margin-right: 15px" title="Alerts Screen - Click for Large Image"></a>

Out of the box you can monitor the following: 

<ul>
<li>Unresponsive Server: Checks your server to see if it is acting up and not responding well.
<li>Slow Server: Lets you see if the average response time for a request is more than a threshold amount.
<li>JVM Memory: Let's you throw an alert if the amount of memory being used goes over a certain amount.
<li>Timeouts: This is an interesting one. It lets you fire an alert if you have X amount of timeouts within Y seconds.
</ul>

When an alert is fired, you have a variety of options. Some of the alert types have slightly different options, but in general they all allow for:

<ul>
<li>Sending an Email. 
<li>Dumping a snapshot. This is the same as the manual snapshots you can perform in the Server Monitor.
<li>Kill threads that take longer than a certain amount.
<li>Reject new requests
</ul>

There is also another option which is pretty darn cool. An alert can trigger an "Alert CFC." This is a CFC that you write that contains two methods: onAlertStart and onAlertEnd. This allows you to do any custom handling of the alert that you want. You could log to the database. You could use the Instant Messenger Event Gateway to send you an IM. You can send an SMS message. The point is - you aren't limited to the options listed above. You can basically handle the alert with anything ColdFusion can do.

You can browse alerts in the Server Monitor as well:

<img src="https://static.raymondcamden.com/images/cfjedi/smalerts2.png">

The above screen shows that I have one alert. Double clicking on the alert lets me see the snapshot since I enabled that option. ColdFusion will also alert you when the status reverts to normal:

<img src="https://static.raymondcamden.com/images/cfjedi/smalerts3.png">

In order for snapshots to work, you must enable Server Monitoring, which as <a href="http://carehart.org/blog/client/index.cfm/2007/6/15/cf8_hiddengem_monitoring_incredibleinfo">Charlie has blogged</a> will add minimal overhead to your server. I also pinged Adobe about any impact from alerts in general and was told there was no impact that folks would need to be concerned about. 

I'm currently using this myself - mainly to monitor the issues I've had lately with <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers</a> but also for curiosity's sake as well. Is anyone out there using this yet? Anyone written a custom alert CFC? (Would folks like to see an example of one?)