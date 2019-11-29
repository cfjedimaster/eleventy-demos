---
layout: post
title: "Trouble downloading from RIAForge? Read this"
date: "2010-01-29T07:01:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/01/29/Trouble-downloading-from-RIAForge-Read-this
guid: 3701
---

In the past few weeks, I've gotten around 10 or so emails from people having issues downloading projects at <a href="http://www.riaforge.org">RIAForge</a>. Because RIAForge allows folks to point to external download locations, I typically just check to see if that is the issue. However - I've never been able to replicate any of the problems the users are having. They typically report that they get about half way through the download and it then simply stops. 

When it was only a few users, I was willing to blame a bad network on their side - but now it is apparent that <i>something</i> is up. I just wanted to give folks a heads up that I'm looking into it. If any of my readers have seen a problem like this before and have some advice, I'd love to hear it.

RIAForge uses Apache 2.2, and for the most part, it just always works. (Although last night it stopped running for some reason. I haven't seen it to do that ever.) When project admins edit their projects and enable or disable SVN, we do perform a graceful restart, but as far as I know, that does not impact downloads.