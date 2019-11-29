---
layout: post
title: "Quick note on what I did to RIAForge"
date: "2008-12-03T09:12:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2008/12/03/Quick-note-on-what-I-did-to-RIAForge
guid: 3129
---

I thought I'd give folks an update on what I did to RIAForge yesterday. First, huge thanks to <a href="http://www.jeffcoughlin.com/blog/index.cfm/">Jeff Coughlin</a> for his help. Considering all the crap I give him in regards to FarCry (which is a good CMS, but I do like to tease him about it!) I'm surprised he offered to help anyway! 

Anyway, the first thing I tried to do was separate the SVN HTTP service away from the rest of the web sites on the box (RIAForge also runs Jason Delmore's blog, Kristen's blog, coldfusionportal.org). It is easy enough to set up a second Apache service using another config file, but stupid me - I forgot that you can't have two services trying to use the same port. I considered - briefly, just putting SVN up on port 81. But I didn't want to tick off my project owners by making them reset up their connections.

After speaking with Jeff, I figured this may be a good chance to just upgrade everything. So I updated Apache to the latest version, and updated the Subversion server as well. Lastly, I installed ServersAlive. ServersAlive is a good program, but the UI is the suck, and it goes out of it's way to make it hard to install over RDP, which is sad because I can see a lot of people getting turned off by that. SA is set up to automatically restart the Apache service if it fails. 

So far so good, and as always, I'll let folks know if things change. To be honest, I think RIAForge needs a full time developer on it. I'd love to quit my day job but I think the bank may have an issue with that. ;)