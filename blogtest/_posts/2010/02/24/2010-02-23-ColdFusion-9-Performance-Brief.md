---
layout: post
title: "ColdFusion 9 Performance Brief"
date: "2010-02-24T10:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/02/24/ColdFusion-9-Performance-Brief
guid: 3732
---

<img src="https://static.raymondcamden.com/images/cfjedi/pbp1.png" title="Performance Brief - the sexiest brief you will read today." style="float:left;margin-right:5px" />I just twittered this, but figured I'd share it here as well. Adobe has released a ColdFusion 9 Performance Brief. You can download the PDF here:

<a href="http://bit.ly/CFFast">http://bit.ly/CFFast</a>

If all you care about is overall server performance, then the numbers are impressive. ColdFusion 9 comes in at 40% faster than ColdFusion 8. Compared to ColdFusion 7 (sorry, "MX" 7), ColdFusion 9 is <b>six times</b> faster. 

I'd suggest digging into the brief though as it goes into details about what features were worked on. CFC object creation is a big one - clocking in at <b>8</b> times after than ColdFusion 8. I've already talked about the createUUID() improvements, which probably don't matter quite so much, but it's cool to see a <b>10,000{% raw %}%</b> improvement there anyway. I <i>really</i> like the 800%{% endraw %} Flash Remoting improvement. Flash Remoting is already a great way to seed data to your RIA and that type of improvement just makes it even better.

You should also make note of the <i>new</i> caching features. The brief calls them out separately. For example, using "Cache Template in Request" can improve performance by 50X. I need to dig into that a bit more but it seems like that plus "Trusted Cache" could be pure gold for a production server. 
<br clear="all">