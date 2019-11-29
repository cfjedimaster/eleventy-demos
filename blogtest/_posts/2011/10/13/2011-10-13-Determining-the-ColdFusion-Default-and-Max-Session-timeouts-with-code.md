---
layout: post
title: "Determining the ColdFusion Default, and Max, Session timeouts with code"
date: "2011-10-13T12:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/10/13/Determining-the-ColdFusion-Default-and-Max-Session-timeouts-with-code
guid: 4391
---

How do you determine the current server's default and max session timeouts via code? This question came up on Twitter today and I thought I'd whip up a quick example. The answer is relatively simple - make use of the Admin API. Here's a quick example.
<!--more-->
<p>

<code>
&lt;cfset admin = createObject("component", "CFIDE.adminapi.administrator")&gt;
&lt;cfset admin.login("admin")&gt;
&lt;cfset runtime = createObject("component", "CFIDE.adminapi.runtime")&gt;

&lt;cfset sessionDefaultTimeout = runtime.getScopeProperty("sessionScopeTimeout")&gt;
&lt;cfset sessionMaxTimeout = runtime.getScopeProperty("sessionScopeMaxTimeout")&gt;

&lt;cfoutput&gt;
	The default timeout for sessions is #sessionDefaultTimeout# and the max value is #sessionMaxTimeout#.
&lt;/cfoutput&gt;
</code>

<p>

This results in (well, on my server anyway):

<p>

<blockquote>
The default timeout for sessions is 0,0,20,0 and the max value is 2,0,0,0.
</blockquote>

<p>

Those values are a string where the first number is days, the second is hours, the third is minutes, and the last is seconds. If you need to do math with the numbers, convert it to something real, like minutes:

<p>

<code>
&lt;!--- convert to minutes ---&gt;
&lt;cfset parts = listToArray(sessionDefaultTimeout)&gt;
&lt;!--- my total ---&gt;
&lt;cfset totalMinutes = 0&gt;
&lt;!--- add in days ---&gt;
&lt;cfset totalMinutes += 1440 * parts[1]&gt;
&lt;!--- add in hours ---&gt;
&lt;cfset totalMinutes += 60 * parts[2]&gt;
&lt;!--- add in minutes ---&gt;
&lt;cfset totalMinutes += parts[3]&gt;
&lt;!--- and seconds ---&gt;
&lt;cfset totalMinutes += parts[4]/60&gt;

&lt;p/&gt;
&lt;cfoutput&gt;
	Total minutes for default sessionTimeout is #totalMinutes#.
&lt;/cfoutput&gt;
</code>

<p>

This returns 20 on my server.