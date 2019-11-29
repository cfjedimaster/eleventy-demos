---
layout: post
title: "Looking for (mainly) non-American testers for RIAForge"
date: "2009-11-27T09:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/11/27/Looking-for-mainly-nonAmerican-testers-for-RIAForge
guid: 3624
---

A few months back Mark Mandel wrote me about an odd issue he was having with <a href="http://www.riaforge.org">RIAForge</a>. Every time he tried to visit the site he got an empty page. Not a ColdFusion error, but an empty page. I wasn't aware of any possible thing it could be, so I wasn't able to do anything. A few weeks back I got another email from a user who was in a similar situation. This user was also outside America (although in Switzerland, a bit far away from Australia) so I began to think it may be some kind of network security system at the host level. I checked with the host - but they said nothing like that was in place.

To make things even more interesting - it isn't just a RIAForge issue. Any CFM file on the box (CFInsider is there as well as the ColdFusion Portal) is blocked for Mark. Yet a non-CFM file loads! 

So the question is - why would CFM files be blocked for a very small minority of users? Any clues? I'm tempted to go ahead and update to ColdFusion 9 today just to see what happens.