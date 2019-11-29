---
layout: post
title: "ColdFusion 9, Caching, IP_ADD_MEMBERSHIP Error"
date: "2010-05-06T13:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/05/06/ColdFusion-9-Caching-IPADDMEMBERSHIP-Error
guid: 3807
---

I ran into a truly weird error today. I was building a very simple test script to load up my cache system with a lot of crap. This was the script I used:

<p>

<code>
&lt;cfloop index="x" from="1" to="3000"&gt;
       &lt;cfset id = "cache_#x#"&gt;
       &lt;cfset cached = cacheGet(id)&gt;
       &lt;cfif isNull(cached)&gt;
               &lt;cfset value = createUUID() & createUUID() & createUUID() &
repeatString("foo", 250)&gt;
               &lt;cfset cachePut(id, value)&gt;
       &lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

<p>

Nothing crazy there, right? Well upon running this code I immediately got:

<p>

<blockquote>
<b>IP_ADD_MEMBERSHIP failed (out of hardware filters?)</b><br/>
net.sf.ehcache.CacheException: IP_ADD_MEMBERSHIP failed (out of
hardware filters?)<br/>
       at <br/>net.sf.ehcache.distribution.MulticastRMICacheManagerPeerProvider.init(MulticastRMICacheManagerPeerProvider.java:93)<br/>
       at net.sf.ehcache.CacheManager.init(CacheManager.java:241)<br/>
       at net.sf.ehcache.CacheManager.<init>(CacheManager.java:221)<br/>
</blockquote>

<p>

I googled - and ran across a few things, but nothing made sense until <a href="http://www.briankotek.com/blog/">Brian Kotek</a> pointed out the following URL: 

<p>

<a href="http://stackoverflow.com/questions/2534551/error-on-multicastsocket-joingroup">Error on MulticastSocket.joinGroup()</a>

<p>

This led to the following Microsoft Tech Note: 

<p>

<a href="http://support.microsoft.com/kb/239924">How to disable the Media Sensing feature for TCP/IP in Windows</a>

<p>

And that did the trick. This "Media Sense" feature (which by the way impacted my Windows machine but not a coworker) was the culprit. As soon as I did the regedit (wow, it's been a long time since I did one of those) and rebooted, everything worked perfectly.