---
layout: post
title: "Aggregator CFC updated, hosted, and named"
date: "2007-06-11T12:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/11/Aggregator-CFC-updated-hosted-and-named
guid: 2111
---

This weekend <a href="http://cfsilence.com/blog/client">Todd Sharp</a> and I worked up some modifications to the Aggregator CFC I released last week. The CFC has been updated with the following changes:

<ul>
<li>Now every result in the query will contain feed title and feed descriptions. This will mean a bit of duplicate data, but with multiple feeds it is darn useful.
<li>Added a utility function, opmlToFeedArray. This converts an OPML listing into an array (that can then be passed to Aggregate)
<li>Search now is case insensitive. There is an optional third argument to make it case sensitive. 
<li>Based on recommendations from other, I no longer use createUUID() to name my threads. Did you know that you could only do 64 createUUIDs per second? I had heard that a while ago but had forgotten it. I now use the Request scope. ColdFusion 8 supports a new scope in CFLOCK - Request.
</ul>

And I've got it hosted up at RIAForge:

<a href="http://paragator.riaforge.org">Paragator</a>

Yes, Paragator is the project name. That was developed with the combined intelligence of folks on IM and IRC, so you know it must be a good idea.

Oh - and how fast is ColdFusion 8? In Todd's test script, he was searching <b>all</b> of MXNA's ColdFusion feeds. This CFC can aggregate 330 RSS feeds in... 45 seconds. Dang. That's fast.