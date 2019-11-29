---
layout: post
title: "cfwddx doesn't work in script - FYI"
date: "2014-12-15T11:16:43+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/12/15/cfwddx-doesnt-work-in-script-fyi
guid: 5447
---

This will probably impact about three people, but as I ran into it, I thought I'd share. In ColdFusion 11, you were supposed to be able to call pretty much any tag from cfscript. Unfortunately, cfwddx doesn't work. And yeah, I actually need it. (I used it to store some complex data for <a href="http://www.cflib.org">CFLib</a> and I'm working on a migration script to convert it to MongoDB.) Here is the bug report in case anyone wants to vote for it: <a href="https://bugbase.adobe.com/index.cfm?event=bug&id=3909707">https://bugbase.adobe.com/index.cfm?event=bug&id=3909707</a>.

<!--more-->

As a quick aside, I wrote this to get around it. The syntax is actually <i>shorter</i> than what I would have used if the feature worked.

<pre><code class="language-markup">&lt;cffunction name=&quot;decodeWddx&quot;&gt;
	&lt;cfargument name=&quot;input&quot;&gt;
	&lt;cfset var output = &quot;&quot;&gt;
	&lt;cfwddx action=&quot;wddx2cfml&quot; input=&quot;#arguments.input#&quot; output=&quot;output&quot;&gt;
	&lt;cfreturn output&gt;
&lt;/cffunction&gt;
</code></pre>

<strong>Oops</strong> - it DOES work! This is what I get for coding too fast. My issue was trying to do x=cfwddx(...) as opposed to just cfwddx by itself. In my opinion, what I wrote should have worked with x simply being undefined, but, whatever. I'm keeping my UDF as it is quicker to use anyway, but please forgive this misfire on a bug report!