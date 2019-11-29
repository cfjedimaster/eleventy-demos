---
layout: post
title: "RIAForge Update"
date: "2008-05-30T08:05:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2008/05/30/RIAForge-Update
guid: 2848
---

I continue to monitor and - if not work on - at least think about - the issues RIAForge is dealing with. Today I woke up to 5000 (yes, really) errors messages. The errors mentioned the inability to write a temp file related to SQL. I thought maybe my drive was full, but it wasn't even close. I opened up MySQL administrator where I discovered that I could no longer open up a database. I forgot the error unfortunately (just having my coffee now), but MySQL wasn't able to get information about any database.

At this point I thought my MySQL server was dead... but on a whim, I just restarted MySQL and now everything is perfect.

Now - I'm no MySQL expert (if you've seen my MySQL install scripts you know this), but in all the years I've used MySQL, I've never had it just die and magically work better after a restart. I mean - we all know that's a common fix for things, but again, I've never had to do it to MySQL.

Is it Miller time yet? -sigh- Outside of this - my current theory is that the Subversion front end stuff (library and history browsing) may be the main server issues. I'm looking into SVNKit as a replacement just for the front end stuff. I got some simple Java code working last night, and I'm going to convert it into a nice CFC.

Any way - I do thank people for their patience. Remember that this is something I've got to take care of during my off hours so I can't always rush to fix it.