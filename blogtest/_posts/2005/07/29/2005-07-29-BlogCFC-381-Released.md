---
layout: post
title: "BlogCFC 3.8.1 Released"
date: "2005-07-29T17:07:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2005/07/29/BlogCFC-381-Released
guid: 654
---

This is an important update, so please read the following notes:

<ul>
<li>There was a bug that prevented people from subscribing. It is an interesting bug, and dumb move on my part, so let me explain it so folks can laugh - I mean learn... I use a tag called ScopeCache (<a href="http://ray.camdenfamily.com/downloads/scopecache.zip">Download</a>) to cache the display of the blog. The cache is smart enough to know when to use different versions of the cache. So for example, a different cached is used for the <a href="http://ray.camdenfamily.com/index.cfm?mode=cat&catid=395FA1CE-D93A-60DF-CBD9B942C80F06B0">ColdFusion Category</a> display compared to the main display. What the cache was <b>not</b> smart about is noticing when someone used the form on the right hand side to subscribe to the blog. In fact, it would simply ignore the request. Now the cache will simply not be used when a form post is made.
<li>Another ScopeCache issue - and thanks to a user for finding this. A user noticed that sometimes, the calendar would show yesterday highlighted, almost as if the blog didn't notice that it was a new day. Well, the blog is set to cache forever. That means when the day passes, the cache still holds onto the display. This was easy enough to fix. Since ScopeCache allows you to specify a timeout, we now tell it to cache till midnight. Or to be precise, 23:59:59. 
<li>And finally, a feature, not a bug fix: A few versions back I added ping support. The only ping we supported was HTTP GET. Basically, you enter a URL, and on a new entry, we hit it. Steven Erat had added <a href="http://www.technorati.com">Technorati</a> support to his blog some time ago, so I stole his code. (What's he going to do, he is on <a href="http://www.talkingtree.com/blog/index.cfm?mode=entry&entry=63514BD4-50DA-0559-A06469B1A2629BEE">sabbatical</a>! Muhahah!) To ping Technorati, simply add @technorati to your pingURLs setting in the blog.ini file.
</ul>

Enjoy.