---
layout: post
title: "BlogCFC Subscribers and Stats"
date: "2005-09-27T15:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/27/BlogCFC-Subscribers-and-Stats
guid: 812
---

I was asked today, is there a way to see who is subscribed to your blog? The short answer is yes, if you don't mind editing your stats file. I modified my own copy, outside of what you download, so I could see my subscribers, but only if I was logged in. To add the same mod to your code, simply find stats.cfm, and add this:

<code>
&lt;cfif isUserInRole("admin")&gt;
	&lt;cfquery name="getpeople" datasource="#dsn#"&gt;
	select * from tblblogsubscribers
	&lt;/cfquery&gt;
	&lt;cfdump var="#getpeople#"&gt;
&lt;/cfif&gt;
</code>

It isn't pretty, but works great.