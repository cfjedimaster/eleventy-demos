---
layout: post
title: "ScopeCache on RIAForge"
date: "2008-02-28T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/28/ScopeCache-on-RIAForge
guid: 2679
---

Last night I released <a href="http://scopecache.riaforge.org/">ScopeCache</a> on RIAForge. This isn't new code. It's the caching custom tag I've had for a few years now. Charlie Arehart mentioned to me that it wasn't possible to find the code anymore (outside of BlogCFC), so now I have a place for folks to find it.

I also did some small updates to it, including giving it the ability to cache in the request scope. 

For folks who don't know what this tag is, it's a basic way to quickly add caching to a page. So imagine the following slow code:

<code>
&lt;cfset sleep(9000)&gt;
Done sleeping.
</code>

I can cache the result of this code (the output) by adding the custom tag:

<code>
&lt;cf_scopecache scope="application" name="mycodeisntslow" timeout="3600"&gt;
&lt;cfset sleep(9000)&gt;
Done sleeping.
&lt;/cf_scopecache&gt;
</code>

Pretty simple, right? There are more options of course. See the documentation in the tag itself.