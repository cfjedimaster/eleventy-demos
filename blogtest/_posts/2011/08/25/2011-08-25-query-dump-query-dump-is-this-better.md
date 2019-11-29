---
layout: post
title: "query, dump, query, dump - is this better?"
date: "2011-08-25T17:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/08/25/query-dump-query-dump-is-this-better
guid: 4341
---

I'm working on an application where I don't (yet) have access to the database schema. It's a complex application with lots of data and isn't the most... how shall I say it.. well structured set of data I've even seen. To help me dig into the database and figure out what's going where, I'm doing a bunch of cfquery calls followed up by a cfdump. 

<p/>

While working, I accidentally found myself typing something that wasn't valid ColdFusion, but it just <i>felt</i> right at the time:

<p/>

<code>
&lt;cfdump query="select * from thetable" top=5 label="get test 5"&gt;
</code>

<p/>

What do you think? Would that be useful? I know a <i>large</i> majority of my dumps are queries, but they tend to be queries I'm going to keep using. This is one of those rare times where I won't be keeping most of my queries around once I'm done digging.

<p/>

P.S. If top and label are new to you, check out my <a href="http://www.raymondcamden.com/index.cfm/2011/3/24/Exploring-CFDUMP-AKA-an-Ode-to-Dump">ode to a dump</a> blog post.