---
layout: post
title: "ColdFusion page timeouts and scheduled tasks"
date: "2012-07-03T11:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/07/03/ColdFusion-page-timeouts-and-scheduled-tasks
guid: 4665
---

Thanks to Micah Brown for checking into this. He emailed me a few days ago with an interesting question. Given that your server may be set to timeout requests after 10 seconds, will the timeout in the settings of your scheduled task override it? When he asked this, I simply told him what I'd do. Set your server timeout setting to a nice low number, like 10, set your scheduled task to a higher number, like 20, and then drop in a simple sleep() command in your CFM:

&lt;cfset sleep(15000)&gt;

He tested it... and yes - the setting in your scheduled task can override the server-side setting. I'll also remind people that outside of scheduled tasks, you can also use the <a href="http://help.adobe.com/en_US/ColdFusion/10.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-7d68.html">cfsetting</a> tag to override the setting.