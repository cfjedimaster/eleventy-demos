---
layout: post
title: "Another warning about CFCs"
date: "2006-03-11T22:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/11/Another-warning-about-CFCs
guid: 1146
---

Tom Muck wrote a good <a href="http://www.tom-muck.com/blog/index.cfm?newsid=128">blog entry</a> today talking about weirdness he say when he did a structCopy() operation on a CFC. To me, this was obviously a misunderstanding. CFCs aren't structs. But, like I mentioned in my <a href="http://ray.camdenfamily.com/index.cfm/2006/3/8/Reminder-on-duping-CFCs">post</a> a few days ago, it can be confusing. My earlier entry mentioned how duplicate <i>used</i> to work on CFCs, but it returned something that wasn't really a CFC. It seems like structCopy has the same issues. You can see this clearly if you dump a CFC and compare it to the dump of a structCopied CFC.

So - remember - you can't duplicate or structCopy a CFC. Duplicate will throw an error in recent versions. StructCopy, unfortunately, will not. I'm going to file a bug report on this now.