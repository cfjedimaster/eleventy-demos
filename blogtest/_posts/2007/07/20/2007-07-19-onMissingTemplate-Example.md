---
layout: post
title: "onMissingTemplate Example"
date: "2007-07-20T09:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/20/onMissingTemplate-Example
guid: 2206
---

I just added onMissingTemplate support to <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers.org</a>. This is something we should all do with ColdFusion 8 sites as it is so simple it doesn't make sense <i>not</i> to. To test, simply visit:

<a href="http://www.coldfusionbloggers.org/parishiltonisfetch.cfm">http://www.coldfusionbloggers.org/parishiltonisfetch.cfm</a>

Here is what I added to my Application.cfc file:

<code>
&lt;cffunction name="onMissingTemplate" returnType="boolean" output="false"&gt;
	&lt;cfargument name="thePage" type="string" required="true"&gt;
	&lt;cflog file="cfblgogersmissingfiles" text="#arguments.thePage#"&gt;
	&lt;cflocation url="404.cfm?thepage=#urlEncodedFormat(arguments.thePage)#" addToken="false"&gt;
&lt;/cffunction&gt;
</code>

The first thing I do is log the request. As I've mentioned before, logging the 404 can be handy as you may see people requesting the same file again and again. It may be worthwhile to add that page and put a redirect there or some other content. I then cflocate to a handler. My handler is rather simple (I've trimmed out some of the silly text):

<code>
&lt;cfparam name="url.thePage" default=""&gt;

&lt;cfif not len(trim(url.thePage))&gt;
	&lt;cflocation url="index.cfm" addToken="false"&gt;
&lt;/cfif&gt;

&lt;cf_layout title="File Not Found"&gt;

&lt;h2&gt;These are not the droids you are looking for...&lt;/h2&gt;

&lt;p&gt;
Sorry, but the page you requested, &lt;cfoutput&gt;#url.thePage#&lt;/cfoutput&gt;, was not
found on this site. 
&lt;/p&gt;

&lt;/cf_layout&gt;
</code>

As you can see, I check for the existence of the URL variable (in case people visit the 404 page directly) and print out a message telling the user that their file didn't exist.

I've updated the code zip on ColdFusionBloggers.org. It now contains this change and the "auto refreshing div" modification I made yesterday.