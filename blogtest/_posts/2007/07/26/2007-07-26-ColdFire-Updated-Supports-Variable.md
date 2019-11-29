---
layout: post
title: "ColdFire Updated - Supports Variable"
date: "2007-07-26T12:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/26/ColdFire-Updated-Supports-Variable
guid: 2221
---

Today Nathan Mische and I released ColdFire 0.0.802. This update adds basic support for variables. What do I mean by that? ColdFusion's classic debug view lets you turn on various scopes. When you view a page, that entire scope is dumped out. I never cared for that as it typically displayed a lot more information than I needed. While you could get around that by using cftrace, I wanted something a bit better.

ColdFire now supports a Variables tab. You tell ColdFire the variables you want to display and it will then show the values when the page is refreshed. This is the initial release of Variables support and there are a few caveats. First - I only support simple values. It won't be hard to add support for arrays and other complex variables, but I wanted folks to do some quick testing first. Second, you must use full scopes. Don't just type "x", but rather, variables.x. Or url.x. Or form.x. You get the picture. Here is a screen shot:


<img src="https://static.raymondcamden.com/images/coldfire8.png">

Also in this fix are updates by Nathan in the XPI to help with memory leaks and other issues as well.

You can download ColdFire at RIAForge: <a href="http://coldfire.riaforge.org">http://coldfire.riaforge.org</a>