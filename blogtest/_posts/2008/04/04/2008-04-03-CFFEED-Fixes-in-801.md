---
layout: post
title: "CFFEED Fixes in 8.0.1"
date: "2008-04-04T09:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/04/CFFEED-Fixes-in-801
guid: 2752
---

I mentioned yesterday that ColdFusion 8.0.1 fixes issues in CFFEED. Here is a run down of what has been done.

<ul>
<li>The bug concerning gziped sources has been fixed, which is great for people who need to aggregate dynamic feeds. This was probably the biggest bug with cffeed and having it fixed really helps out. I'll still use cfhttp for <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers</a> though as it gives me finer control over my headers and lets me do more caching.

<li>Another odd issue with some feeds, but not others, involves dates. You would suck down the feed and the date column would be blank. I know for a fact that Hal Helm's blog over at cfcommunity suffered from this. Once I patch my server his feed will start aggregating.

<li>The silly bug with columnMap needing upper case values is fixed.

<li>Looks like maybe a few issues were fixed in creating feeds with iTunes extensions. The release notes are a bit unclear if this is one fix or another, but if you have done work in this area, look for the changes.
</ul>

So there you have it. Personally, I still think cffeed needs work. I especially think it needs to be simplified down. Any tag that returns a query with 80 columns (ok, maybe not 80...) should have a simpler form as well. I'd also like to see the tag help with time zones and date parsing as well. But - I'm just happy it saw some lovin'!

<b>Edit by Raymond Camden, a few hours later:</b> I forgot this other fix. To be lazy I'm just going to copy right from the release notes: 

Setting the skipdays metadata in the properties attribute of an RSS cffeed tag would generate all-lowercase text that caused the RSS to not validate properly.