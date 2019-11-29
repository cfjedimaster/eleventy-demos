---
layout: post
title: "Verity Technote : Indexing Limit"
date: "2005-08-16T13:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/16/Verity-Technote-Indexing-Limit
guid: 701
---

A new technote was released yesterday concerning Verity:

<a href="http://www.macromedia.com/cfusion/knowledgebase/index.cfm?id=cb2d5c2f"> ColdFusion MX 7: Verity custom collection indexing limit of 65520 rows</a>

If you are indexing huge record sets, this will apply to you. Of course, do not forget that CFMX Standard has a limit of 125k records per box, and CFMX Enterprise has a limit of 250k records. That is per box - not just collection. Of course, if your records are that big - you are probably a candidate for the full Verity solution, and you can still use ColdFusion with it of course.