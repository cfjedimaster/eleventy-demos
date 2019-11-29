---
layout: post
title: "RIAForge back up"
date: "2008-01-03T08:01:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2008/01/03/RIAForge-back-up
guid: 2571
---

I got a bunch of emails about RIAForge being down so I thought I'd respond here. Thanks to everyone who wrote. Turns out the drive had run out of space. Apache's logs had grown into something huge. I shutdown Apache, killed the logs, and half my drive space returned. I'll keep any eye out for them and see if they start growing huge again. I also need to make the logs have names based on dates so I don't have to shut down the server to clean them up.