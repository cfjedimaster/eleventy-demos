---
layout: post
title: "ColdFusion Administrator Extension - Searcher"
date: "2009-11-01T23:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/11/01/ColdFusion-Administrator-Extension-Searcher
guid: 3584
---

<img src="https://static.raymondcamden.com/images/cfjedi/searcher.jpg" style="padding-right:10px;" align="left" /> Many moons ago, I released a simple one page CF Admin extension that allowed you to perform searches against Verity collections defined on a ColdFusion server. With Solr now being able in ColdFusion 9 I thought I'd update it. I've reworked it now to support ColdFusion 9 (although it should still run in earlier versions) and I gave it quite a bit of jQuery love as well. Hopefully people find this helpful. In case folks are curious - to provide support for earlier versions of ColdFusion while also enabling it to use new ColdFusion 9 attributes, I simply split the ColdFusion 9 code into a separate include that is only loaded when a ColdFusion 9 server is detected. 

You can download the bits from the RIAForge project I set up: <a href="http://cfadminsearcher.riaforge.org/">http://cfadminsearcher.riaforge.org/</a>

<br clear="left">