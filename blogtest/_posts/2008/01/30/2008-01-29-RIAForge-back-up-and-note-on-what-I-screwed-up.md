---
layout: post
title: "RIAForge back up (and note on what I screwed up)"
date: "2008-01-30T11:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/30/RIAForge-back-up-and-note-on-what-I-screwed-up
guid: 2623
---

Thanks to everyone for pointing out that RIAForge was down today. Where's all the email when the sites <i>aren't</i> down, eh??? ;)

So what was wrong? The site uses a temporary folder to store data extracted from SVN when folks view/download from Subversion via the web site.

Guess what - that temporary folder had not been emptied since the dawn of Man.

Yes - this is something I've blogged about before - watching disk space - and I've just been bitten by it myself!