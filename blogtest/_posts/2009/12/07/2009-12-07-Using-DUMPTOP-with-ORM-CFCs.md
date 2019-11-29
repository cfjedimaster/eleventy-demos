---
layout: post
title: "Using DUMP/TOP with ORM CFCs"
date: "2009-12-07T12:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/07/Using-DUMPTOP-with-ORM-CFCs
guid: 3634
---

Lately I've been running into an issue using CFDUMP to display ORM based entities. The problem occurs in entities that are fairly complex. If a resource belongs to a group a group has users and users have groups and groups have resources... well as you can image, the dump can grow rather large. 

The issue isn't infinite recursion - cfdump is smart enough to handle that. The issue is simply that the "link of relationships" (not sure if that is the proper term but I'm going for it now) can go a <b>long</b> way. 

I asked on the <a href="http://groups.google.com/group/cf-orm-dev">cf-orm</a> list if we needed to add a new attribute to cfdump to only display the simple (non-related) properties of an entity. Dennis Clark replied with, "I'd rather have a new attribute in cfdump to limit the number of levels deep to dump." I reminded him that CFDUMP <i>did</i> have a TOP attribute, and that it is mainly used for arrays and queries. However, it does work with structures as well. I never used it for structs because I simply never needed to worry about it. Most of the structs I've made in the past are pretty typical. With ORM and relationships though the structure of data can get huge. Luckily, TOP works <i>perfectly</i>. For example, here is an entity I dumped with TOP=1:

<img src="https://static.raymondcamden.com/images/Picture 342.png" />

As you can see - it just renders the top level data (although it does get information about the data underneath). Switching to TOP=2 fleshes it out a bit more:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 416.png" />

The actual display goes beyond what I posted above, but you get the basic idea.