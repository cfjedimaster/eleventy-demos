---
layout: post
title: "Friday quickie - Example of simple caching of RSS Items"
date: "2007-11-02T10:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/02/Friday-quickie-Example-of-simple-caching-of-RSS-Items
guid: 2448
---

I'm doing a code review for a client (which I've been doing a lot lately and boy is it fun to find bugs in someone <i>else's</i> code for once ;) and noticed his home page was using CFFEED to put CNN's latest articles. However, he wasn't doing any caching at all. I whipped up a quick mod for him to show a simple example of caching. It doesn't have any fancy way to force a refresh, but quickly sped up his home page. So here is a quick code snippet showing simple caching of CFFEED:

<code>
&lt;cfset feedurl = "http://www.mugglenet.com/feeds/news.xml"&gt;
&lt;cfset cacheMinutes = 60&gt;

&lt;!--- check if cached, and not too old ---&gt;
&lt;cfif not structKeyExists(application,"rsscache") or dateDiff("n", application.rsscache.created, now()) gt cacheMinutes&gt;
	&lt;cffeed source="#feedurl#" query="entries"&gt;
	&lt;cfset application.rsscache = structNew()&gt;
	&lt;cfset application.rsscache.data = entries&gt;
	&lt;cfset application.rsscache.created = now()&gt;
&lt;/cfif&gt;

&lt;cfdump var="#application.rsscache#"&gt;
</code>

All I do is check for an application variable. If it doesn't exist, or the 'created' value for the cache is more than cacheMinutes old, I reload from cffeed. While not as fancy as a <a href="http://www.raymondcamden.com/index.cfm/2007/10/15/Doing-HTTP-Conditional-Gets-in-ColdFusion">conditional get</a>, it is certainly a lot simpler.