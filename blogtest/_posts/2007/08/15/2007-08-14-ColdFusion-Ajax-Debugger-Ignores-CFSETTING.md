---
layout: post
title: "ColdFusion Ajax Debugger Ignores CFSETTING"
date: "2007-08-15T08:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/15/ColdFusion-Ajax-Debugger-Ignores-CFSETTING
guid: 2280
---

I'm not quite sure I'd call this a security risk, but it is something you should be aware of. I typically use this line in my open source applications to ensure that debug information doesn't show up, even if the server has it enabled:

<code>
&lt;cfsetting showDebugOutput="false"&gt;
</code>

This will suppress any debugging information from showing up in the browser. However - it doesn't seem to work with ColdFusion Ajax debugger. If the Ajax debugger is enabled in the ColdFusion Administrator and if you pass ?cfdebug=1 in the URL, it will always show up, even with the setting. (A bug is already filed with Adobe on this one.)

FYI - this was logged as bug 70324.