---
layout: post
title: "CFCACHE and the Fall of Rome"
date: "2008-04-17T16:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/17/CFCACHE-and-the-Fall-of-Rome
guid: 2775
---

I'm not a huge fan of the CFCACHE tag. It's a blunt instrument and I wish CF would natively roll in a nicer caching system (like, oh say, <a href="http://scopecache.riaforge.org">ScopeCache</a>, not that I'm biased or anything). A user wrote in with a question about CFCACHE. Turns out that when you use cfcache, it outputs a HTML comment before the text which can totally break some browsers.

Luckily - this was actually one of the things fixed in 8.0.1. 

Unluckily for the user - he was still on ColdFusion 7.

I thought I'd try to get fancy and use onRequest - another feature I'm not a big fan of - but this seemed like a perfect use for it. I tried something like so:

<code>
&lt;cffunction name="onRequest" returnType="void"&gt;
	&lt;cfargument name="thePage" type="string" required="true"&gt;
	&lt;cfset var content = ""&gt;
	&lt;cfsavecontent variable="content"&gt;&lt;cfinclude template="#arguments.thePage#"&gt;&lt;/cfsavecontent&gt;
	&lt;!--- look for comment at beginning ---&gt;
	&lt;cfset content = rereplace(content, ""^&lt;!--.*?--&gt;$"", "")&gt;
	&lt;cfoutput&gt;#content#&lt;/cfoutput&gt;
&lt;/cffunction&gt;
</code>

At first - this did nothing. Then I remember that the default behavior of cfcache is to cache both on the client and the server. I switched my cfcache tag to use action=servercache, but unfortunately, you can't use cfcache inside custom tags, and that includes tags like cfsavecontent.