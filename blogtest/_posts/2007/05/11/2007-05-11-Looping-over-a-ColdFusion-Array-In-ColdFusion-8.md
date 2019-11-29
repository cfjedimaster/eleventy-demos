---
layout: post
title: "Looping over a ColdFusion Array (In ColdFusion 8)"
date: "2007-05-11T15:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/11/Looping-over-a-ColdFusion-Array-In-ColdFusion-8
guid: 2026
---

Wednesday I <a href="http://ray.camdenfamily.com/index.cfm/2007/5/9/Variable-Type-Gotchas--ColdFusion-Arrays-and-Missing-Indexes">blogged </a> about ColdFusion arrays and today I got permission to mention another new feature in ColdFusion 8 - Array-based CFLOOP. In the past you would loop over an array like so:

<code>
&lt;cfloop index="x" from="1" to="#arrayLen(arr)#"&gt;
   &lt;cfoutput&gt;#arr[x]#&lt;br /&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

ColdFusion 8 adds a new array attribute to cfloop so you can do this instead:

<code>
&lt;cfloop index="x" array="#arr#"&gt;
   &lt;cfoutput&gt;#x#&lt;br /&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

I don't think this has been shared yet publicly, so enjoy, and remember that I was given permission to share this. This weekend I think I'll resurrect my 'Known Facts' blog post and update it with all the juicy bits that have been revealed lately.