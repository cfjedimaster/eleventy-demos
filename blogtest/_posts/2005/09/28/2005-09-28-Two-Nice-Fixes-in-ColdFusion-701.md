---
layout: post
title: "Two Nice Fixes in ColdFusion 7.0.1"
date: "2005-09-28T15:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/28/Two-Nice-Fixes-in-ColdFusion-701
guid: 819
---

I double checked the release notes and didn't see a mention of this - but two nice bug fixes are in ColdFusion 7.0.1 that relate to Application.cfc. 

First - remember the <a href="http://ray.camdenfamily.com/index.cfm?mode=entry&entry=ED9D4058-E661-02E9-E70A41706CD89724">bug</a> where cflocation calls would run onError? That is fixed.

The second <a href="http://ray.camdenfamily.com/index.cfm?mode=entry&entry=8CD20E0E-0CAA-BA34-9709A45CE9C90886">bug</a> involved onSessionEnd. If you did not specify a specific session timeout value and relied on the default in the ColdFusion Admin, the onSessionEnd event would never fire. This has been fixed as well.