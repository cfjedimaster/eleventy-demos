---
layout: post
title: "Ionic's ISAPI Rewrite Filter"
date: "2006-05-19T19:05:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2006/05/19/Ionics-ISAPI-Rewrite-Filter
guid: 1280
---

I've been using ISAPI_Rewrite on this machine for some time now to support friendly urls at the <a href="http://www.coldfusioncookbook.com">ColdFusion Cookbook</a> and it has worked well. (By the way, notice how many entries we have at the cookbook now!) I wanted to refresh the beta copy of CFLib2006 on here to get some folks testing, and knew I had to do something with ISAPI_Rewrite. While it is free for one box, you can't apply rules just for one virtual server unless you pay for the commercial version. 

To be fair, the commercial version is only 69 dollars, but as a cheap person, I couldn't abide by that. I did some googling and came across another ColdFusion user who recommended <a href="http://cheeso.members.winisp.net/IIRF.aspx">IIRF</a>, Ionic's ISAPI Rewrite Filter. This took all of ten minutes to setup. I had both the beta version of CFLib running it's own rules and the cookbook as well. Best of all - you can't beat the price - free. 

I can definitely recommend it for folks using IIS and desiring nice URLs. Of course, if you have Apache, it's built-in. Maybe Microsoft will add it to IIS one day, like when they add virtual servers for XP Pro, or multiple versions of IE on one box. (Keep repeating - The Mac is coming... The Mac is coming...)