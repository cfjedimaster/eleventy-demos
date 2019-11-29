---
layout: post
title: "cfcache user? Watch out for this mistake!"
date: "2011-08-11T09:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/08/11/cfcache-user-Watch-out-for-this-mistake
guid: 4323
---

I was talking with <a href="http://www.cfgothchic.com/blog/">Daria Norris</a> this morning about an odd cfcache issue she was seeing when I discovered a simple mistake that could completely break cfcache in your application. This isn't a bug, but it could be considered a backwards compatibility issue you want to look out for. For fun, I'll post her code, and you see if you can find the issue. You don't need to save it to your file system, just know that the the result is a page that never seems to cache.
<!--more-->
<p>

<code>
&lt;cfcache timespan="#createTimeSpan(0,0,10,0)#" usequerystring="true" /&gt;

&lt;cfoutput&gt;
    This page was generated at #now()#&lt;br&gt;
&lt;/cfoutput&gt;

&lt;cfparam name="url.id" default="no URL parm passed"&gt;
&lt;cfoutput&gt;The value of url.id = #url.id#&lt;/cfoutput&gt;
</code>

<p>

Figured it out yet? ColdFusion 9 added the ability to use cfcache as a wrapper tag. This allows you to cache part of a file. So for example:

<p>

<code>
Normal, fast code.
&lt;cfcache timespan="#createTimeSpan(0,0,10,0)#"&gt;
Slow code
&lt;/cfcache&gt;
Fast code again.
</code>

<p>

In the block above, ColdFusion would save the result of the generated output inside the tag and cache it. Very handy for cases where you only need to cache part of a page. And yes - you can do it more than once on a page. So given that? Do you see the error?

<p>

<code>
&lt;cfcache timespan="#createTimeSpan(0,0,10,0)#" usequerystring="true" /&gt;
</code>

<p>

It's the trailing /. To ColdFusion, this is the same as:

<p>

<code>
&lt;cfcache timespan="#createTimeSpan(0,0,10,0)#" usequerystring="true"&gt;&lt;/cfcache&gt;
</code>

<p>

So technically, ColdFusion was caching - but it was caching an empty fragment. Now - I know some people are kinda anal about using xhmlt looking code. I'm not. But even I will use that syntax from time to time. If you have a ColdFusion 8 site you want to quickly scan it for this before updating to ColdFusion 9.