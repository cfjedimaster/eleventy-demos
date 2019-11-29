---
layout: post
title: "ColdFusion Admin checks JVM Path"
date: "2009-04-18T15:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/04/18/ColdFusion-Admin-checks-JVM-Path
guid: 3320
---

This week during CFUNITED Atlanta Express, the topic of upgrading the JVM your ColdFusion server uses came up. We talked about the benefits you could get especially in regards to CFC-heavy sites. One of the things I warned folks about was ensuring you correctly updated the value in the admin. In the past, I've pointed to the wrong folder, restarted ColdFusion, and had a server that wouldn't start up. My fault, but frustrating.

I just updated the JVM on a new server and made a slight typo in the folder name. For the first time, I noticed that ColdFusion actually noticed the folder wasn't correct, and that it wasn't a valid JVM path either. This seems to work perfectly, covering both totally wrong folders (non-existent folders) and folders that don't contain a JVM:

<img src="https://static.raymondcamden.com/images//Picture 232.png">

Not sure when this changed, but it looks like the Admin now does a real good job of helping ensure you don't shoot yourself in the foot now. Wonder when this was added?