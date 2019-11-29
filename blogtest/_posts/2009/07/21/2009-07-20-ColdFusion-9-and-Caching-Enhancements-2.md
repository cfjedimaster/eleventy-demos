---
layout: post
title: "ColdFusion 9 and Caching Enhancements (2)"
date: "2009-07-21T09:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/21/ColdFusion-9-and-Caching-Enhancements-2
guid: 3454
---

As a follow up to my first <a href="http://www.raymondcamden.com/index.cfm/2009/7/18/ColdFusion-9-and-Caching-Enhancements">first CF9 caching post</a>, today I want to share a simple example that addresses the issue of using the session scope and caching. 

As I mentioned in the last post, the caching API in ColdFusion 9 is application based. That means the cache with ID "foo" will be the same for every visitor to your application. How can we get around this? Well don't forget that every session has a unique identifier in the URLTOKEN value. This is really meant to be used for supporting cookie-less browsers, but it works well as a simple unique identifier. Here is a pretty trivial example showing this in action.
<!--more-->
<code>
&lt;cfset myUniqueId = session.urltoken & "totalorders"&gt;
&lt;cfset myOrders = cacheGet(myUniqueId)&gt;
&lt;cfif isNull(myOrders)&gt;
	&lt;!--- fake slow process again ---&gt;
	&lt;cfset sleep(1000)&gt;
	&lt;cfset myOrders = randRange(1,100) & " " & createUUID() & " " & randRange(1,100)&gt;
	&lt;cfset cachePut(myUniqueId, myOrders)&gt;
&lt;/cfif&gt;

&lt;cfoutput&gt;Session specific cache value: #myOrders#&lt;/cfoutput&gt;
</code>

I create a key based on both the urltoken and another value that represents the data I want to cache (totalorders). I then grab this from the cache. Rob had made the <a href="http://www.coldfusionjedi.com/index.cfm/2009/7/18/ColdFusion-9-and-Caching-Enhancements#c905521A5-FA2B-646D-181EAEE84AABD338">comment</a> in my last post that I should simply grab the value and see if it existed. I had avoided that at first because I forgot about the addition of isNull, but as you can see, this makes the code somewhat simpler now. 

The actual code inside the CFIF is not important - it just fakes a slow process. But note that when I store the value I use the ID based on my session.urltoken and the string, "totalorders".

You can view this demo here: <a href="http://cf9.coldfusionjedi.com/caching/test4.cfm">http://cf9.coldfusionjedi.com/caching/test4.cfm</a> 

Remember in the last entry I built a generic 'dumper' for all the caches in the current application. If you view that <a href="http://cf9.coldfusionjedi.com/caching/test2.cfm">here</a>, you should see it slowly grow as more people visit the blog entry.

So you may ask - why bother? Session data already persists and will be cleaned up when the session expires. That's definitely true. However, if you want more fine control over the duration of the data (something less than normal session timeout) or if you want to introspect all of the cached data across sessions, then this would be a nice option. You can also use the idleTime support. For sessions from robots, which typically don't persist past the first hit, avoiding the "pure" session scope for them means the data you store can expire earlier than a normal session expiration if the idleTime is set well. Just thinking out loud here of course!