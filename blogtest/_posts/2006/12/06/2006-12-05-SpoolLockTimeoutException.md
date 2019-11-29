---
layout: post
title: "SpoolLockTimeoutException"
date: "2006-12-06T07:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/12/06/SpoolLockTimeoutException
guid: 1696
---

Anyone else run into this lovely error? It totally fried any emails from <a href="http://www.riaforge.org">RIAForge</a> last night. i did some research and found that <a href="http://www.drisgill.com/index.cfm/2005/11/14/ColdFusion-MX6-and-MX7-Mail-Problem-Snuck-up-on-me">Randy</a> also ran into this and it seems to be a known issue on CFMX7/Linux:

<a href="http://www.talkingtree.com/blog/index.cfm?mode=entry&entry=67FD4A34-50DA-0559-A042BCA588B4C15B">ColdFusion MX Mail Spooler Behavior Might Cause SpoolLockTimeoutException</a>

Steven's post is quite old though. Anyone know offhand if this was fixed recently? I restarted ColdFusion and it fixed the problem, but obviously it can happen again.