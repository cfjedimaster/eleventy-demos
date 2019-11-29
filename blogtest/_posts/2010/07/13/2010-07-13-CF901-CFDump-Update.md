---
layout: post
title: "CF901: CFDump Update"
date: "2010-07-13T14:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/07/13/CF901-CFDump-Update
guid: 3876
---

I just blogged a few minutes ago about the new ColdFusion 9.0.1 release so I thought I'd make my first detailed blog post a bit simple - updates to CFDUMP. CFDUMP is one of those tags that is almost never used in production, but is pretty much <b>essential</b> to your day to day development. Therefore any and all small little update to the tag could be incredibly helpful. Back when TOP was added I cheered - and yet folks still don't know about it today. While there weren't any new features added, 9.0.1 does correct a few issues that may be important to you.
<!--more-->
1) First - the bug I <a href="http://www.raymondcamden.com/index.cfm/2009/11/4/Interesting-CFDUMP-Bug">mentioned</a> back in November of last year has been fixed. The "leakage" of methods from one CFC into another no longer occurs. 

2) Another bug (<a href="http://www.coldfusionjedi.com/index.cfm/2010/1/27/Bug-with-CFDUMPoutput-impacts-XMLJSON-services">mentioned here</a> back in Janaury) with "leaking" CSS is also corrected. 

3) And finally - not a bug - but a welcome change. When you cfdump a CFC, the methods are now alpha sorted. Now you may ask - why is that a big deal - don't you normally know what methods are in a CFC? Sure - normally you do. But ORM-based CFCs could have quite a few methods auto created by CF. Also, some of the CFCs Adobe ships (like for Query in cfscript) contain methods you may not be very familiar with yet. So the little act of alpha sorting the methods is a real improvement!

<img src="https://static.raymondcamden.com/images/cfjedi/cfdump.png" title="cfdump screen shot" />