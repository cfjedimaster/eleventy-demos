---
layout: post
title: "ColdFusion 8, MySQL, HostMySite, and NPEs"
date: "2007-09-28T17:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/28/ColdFusion-8-MySQL-HostMySite-and-NPEs
guid: 2376
---

So here is a weird one for you. I've got a bug report over on my <a href="http://www.raymondcamden.com/forums/messages.cfm?threadid=288E1CA2-19B9-E658-9D557449EC547DF6&#top">Soundings forum</a> where a user reports getting NPEs (Null Pointer Exceptions). The errors are random, and go away immediately if you refresh the page. If you read the thread, you will see that HostMySite is saying it is an issue with ColdFusion 8 and MySQL. Their "solution" is to roll back the client to ColdFusion 7. 

Now what's odd is - I have a client who uses HostMySite, and they were having the same issues. Not with Soundings, but just with their CF code in general. (CF8+MySQL)

I finally put two and two together a few minutes ago. Is anyone else experiencing this? I've checked the client's code for obvious issues - and while I found a missing var statement or two - those were all patched up. The site has <i>no</i> load now at all.