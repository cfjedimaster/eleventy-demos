---
layout: post
title: "Ask a Jedi: Using ehcache with stored procs in ColdFusion"
date: "2010-12-06T07:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/12/06/Ask-a-Jedi-Using-ehcache-with-stored-procs-in-ColdFusion
guid: 4043
---

Hal asked:
<p/>
<blockquote>
Do you know if it's possible to use ehcache with stored procs in CF?
</blockquote>
<p/>
<!--more-->
The answer is yes -  but it is important to be clear that when you use the <b>built in</b> query caching (both cfquery and cfstoredproc have automatic support for caching) you are <b>not</b> using the new ehcache-based caching in ColdFusion. Sure it still caches - but it isn't using ehcache under the covers like the newer caching features added to ColdFusion 9.
<p/>
Can you use the new caching functions to store stored proc results? Of course! Don't forget that the new caching functions take <i>any</i> data, period. So you could easily do something like so (warning - pseudo-code):
<p/>
<code>
&lt;cfif isNull(cacheGet("mystoredproc"))&gt;
  &lt;cfstoredproc procedure="getBeer" result="result"&gt;
  &lt;cfset cachePut("mystoredproc", result)&gt;
&lt;cfelse&gt;
  &lt;cfset result = cacheGet("mystoredproc")&gt;
&lt;/cfif&gt;
</code>