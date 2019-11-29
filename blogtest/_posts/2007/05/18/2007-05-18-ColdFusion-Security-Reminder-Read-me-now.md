---
layout: post
title: "ColdFusion Security Reminder - Read me now"
date: "2007-05-18T11:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/18/ColdFusion-Security-Reminder-Read-me-now
guid: 2047
---

I know I've blogged this before, and it's covered in my <a href="http://ray.camdenfamily.com/coldfusionsecuritychecklist.cfm">security checklist</a>, but folks, stop what you are doing and make these changes <b>right now</b> on your production server:

<ul>
<li>In the ColdFusion Admin, Debug Settings, turn <b>off</b> Enable Robust Exception Info.
<li>In the ColdFusion Admin, Settings, set a site-wide error handler. You only need to do this if you didn't bother to use onError or &lt;cferror&gt;. You don't need a pretty page. You can just say 'Error!' and be done. This is still 10x better than exposing an error page to your user.
</ul>

The above changes will take you - approximately - 2 minutes. So please do this.... now.