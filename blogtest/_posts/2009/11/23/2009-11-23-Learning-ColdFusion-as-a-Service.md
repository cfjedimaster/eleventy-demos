---
layout: post
title: "Learning ColdFusion as a Service"
date: "2009-11-23T17:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/11/23/Learning-ColdFusion-as-a-Service
guid: 3619
---

Two weeks ago I was honored to give a presentation on ColdFusion as a Service (CFaaS) at <a href="http://www.riaunleashed.com">RIAUnleashed</a>. I chose that topic because I had not yet played with this new ColdFusion 9 feature and I thought it would be an excellent opportunity to ramp up quickly. I had a lot of fun, and made some cool demos (all of which I'll be posting in the next few weeks) but I ran into a few issues actually learning how stuff works. I tend to attack docs in a shotgun, scattered approach so it may be just me, but I found that - as a whole - the feature was a bit fragmented doc wise. So in order to help others learn, here is what I discovered and how I recommend approaching CFaaS.
<!--more-->
1) You want to begin with <a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSfd7453be0f56bba4-27c63377122e3f5e296-8000.html">Using ColdFusion Web Services</a> which is found in the <b>Using Web Elements and External Objects</b> section of the ColdFusion developer guide. This talks about CFaaS from a pure service perspective and discusses security. The examples are in other languages (PHP, Java, .Net) since it wouldn't really make sense to demonstrate CFaaS with ColdFusion. There is one <b>important</b> thing you should note though. While the docs focus on the "web service" aspect, you can use CFaaS as a REST based service as well. I built a jQuery/AIR CFaaS demo that uses CFaaS over simple HTTP requests. It may be obvious to others, but it wasn't to me. Maybe most folks will use Flex and AIR with CFaaS, but I like to build HTML AIR applications as well.

2) The previous documentation makes absolutely no mention of the Flex support for CFaaS. That was really confusing for me. Turns out - Adobe simply split up the documentation. You can find information about Flex and CFaaS in the <a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WS45F7E41F-825B-4fcd-B96D-D5B7E2107E7E.html">Proxy ActionScript Classes for ColdFusion Services</a> chapter within the <b>Flex and AIR Integration in ColdFusion</b> section. This chapter demonstrates how to add the CFaaS swc to your projects and demonstrates Flex-based CFaaS examples. 

3) Now - while Flex Builder has real nice hinting, I wanted to know more about what the swc file added. I found the ActionScript docs here: <a href="http://help.adobe.com/en_US/AS3LCR/ColdFusion_9.0/">Adobe ColdFusion 9 Language Reference</a>. I forget where I found this link, but I can certainly say that the title would <i>not</i> have been obvious to me. Also note this documentation mentions LDAP support which did <b>not</b> ship with ColdFusion 9.

4) Lastly, and this kind of falls into the obvious category, but don't forget that all CFaaS calls go through CFC files on your server. You can always open up the CFC in your browser and view the automatically generated documentation. Unfortunately you can't view the source as these CFCs as encrypted, but the documentation provided out of the box by the files themselves proved helpful during my tests.