---
layout: post
title: "Doing HTTP Conditional Gets in ColdFusion"
date: "2007-10-15T17:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/15/Doing-HTTP-Conditional-Gets-in-ColdFusion
guid: 2414
---

I've been working on performance updates to <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers</a> over the past week or so - and the primary area I'm working on is the aggregator. One item that has been recommended to me by  multiple people is to take a look at HTTP Conditional Gets. What in the heck is that?

Charles Miller has written an <a href="http://fishbowl.pastiche.org/2002/10/21/http_conditional_get_for_rss_hackers">excellent blog post</a> on it. I'd suggest reading it first. My short take on it is this:

<blockquote>
HTTP Conditional Get is a way to ask a web server to return a document only if it hasn't changed. I simply tell the server some information about my last request, and the server will either return the full body, or a header saying nothing has changed.
</blockquote>

Again - read Miller's <a href="http://fishbowl.pastiche.org/2002/10/21/http_conditional_get_for_rss_hackers">post</a> for more information. In order for this to work - the remote server has to support it of course - and has to return special information in the header for your requests. BlogCFC does this for it's RSS feed. So how can we use this in ColdFusion?

First off - you need to check for - and two headers: Etag and Last-Modified. If "result" is the result of a CFHTTP tag, this code would work:

<code>
&lt;cfif structKeyExists(result.responseheader, "etag") and structKeyExists(result.responseheader, "Last-Modified")&gt;
</code>

If we have it - we need to store it obviously. I'm using an Application variable:

<code>
&lt;cfset application.urlcache[attributes.url] = structNew()&gt;
&lt;cfset application.urlcache[attributes.url].etag = result.responseheader.etag&gt;
&lt;cfset application.urlcache[attributes.url].lastmodified = result.responseheader["Last-Modified"]&gt;
</code>

The attributes.url value is just the URL. So at this point - we have our content, but we've also stored the ETag and LastModified. Now what I'll do when I hit the URL again is to pass in the values:

<code>
&lt;cfhttp url="#attributes.url#" method="get" result="result" timeout="10"&gt;
&lt;cfhttpparam type="header" name="If-None-Match" value="#application.urlcache[attributes.url].etag#"&gt;
&lt;cfhttpparam type="header" name="If-Modified-Since" value="#application.urlcache[attributes.url].lastmodified#"&gt;
&lt;/cfhttp&gt;
</code>

Now here is the cool part. All I have to do is check the result header. If the status code is 304, it means nothing changed. If I dump the <i>entire</i> result, I will see no fileContent variable. This means my traffic was reduced quite a bit. If the status code was anything but that - it means either the content changed. I'd then re-update my application cache.

What rocks is that if the remote server doesn't grok this stuff - it doesn't matter. Your GETs will still work. In my unscientific testing in my local copy of ColdFusionBloggers, I think I found that about 40% of my blogs supported it.

So - in working on this code, I found a good article by Pete Freitag on the topic: <a href="http://www.petefreitag.com/item/236.cfm">If-Modified-Since and CFML Part II</a>. One interesting thing about his code is that he only works with one header value: If-Modified-Since. I asked him about that and he said he would respond on the blog. (He is busy now so it may be a bit.)

Later tonight I'm going to share a simple CFC that shows a way to wrap up this logic so you can do:  contents = mycfc.get(someurl) and let the CFC worry about it.