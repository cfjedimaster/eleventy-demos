---
layout: post
title: "Caching options in ColdFusion"
date: "2006-07-19T08:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/07/19/Caching-options-in-ColdFusion
guid: 1411
---

This morning (last night?) on cf-talk there was a good <a href="http://www.houseoffusion.com/cf_lists/messages.cfm/forumid:4/threadid:46832">thread</a> started about caching options in ColdFusion. While you have <a href="http://www.techfeed.net/cfQuickDocs/?cfcache">cfcache</a> and query caching out of the box, there are more options out there for advanced caching. On the thread these were mentioned:

<a href="http://www.pixl8.co.uk/index.cfm/pcms/site.products.CF_Hypercache/">Hypercache</a>

<a href="http://www.hotfusion.co.uk/TurboCache/index.htm">Turbocache</a>

<a href="http://blogs.sanmathi.org/ashwin/2006/07/01/memory-sensitive-caching-for-cf/">Softcache</a> - This one is by Ashwin of the ColdFusion engineering team!

<a href="http://www.bpurcell.org/blog/index.cfm?mode=entry&entry=963">CF_Accelerate</a>

And lastly, <a href="http://ray.camdenfamily.com/downloads/scopecache.zip">ScopeCache</a> - This is my own tag and it is used in BlogCFC.

Lots of options out there, and I bet there are more, so please share. And it goes without saying (I hope), that simply dropping a cache onto a page is <b>not</b> the way you solve performance problems. It is the "Final Solution" only and should be used if you have determined, absolutely, that there is no other way to speed up the page.