---
layout: post
title: "Cool use of CFPOD"
date: "2009-01-07T23:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/01/07/Cool-use-of-CFPOD
guid: 3183
---

Earlier today I <a href="http://www.raymondcamden.com/index.cfm/2009/1/7/2008--ColdFusionBloggersorg">blogged</a> about ColdFusionBloggers and the category stats for 2008. I made a passing reference to how it would be nice to have a simple scrollable table for the stats. CFGRID would work, but I just wasn't in the mood for it. Andy Sandefer <a href="http://www.coldfusionjedi.com/index.cfm/2009/1/7/2008--ColdFusionBloggersorg#cB41A4954-19B9-E658-9D6586C5958C01D6">suggested</a> cfpod and cflayout.
<!--more-->
I tend to dismiss CFPOD when I discuss ColdFusion 8 Ajax features, but I gave it a quick shot with my giant HTML table from the earlier post. 

<code>
&lt;cfpod height="300" width="500" title="Stats"&gt;
11,813 entries.
&lt;p/&gt;
&lt;table border="1" cellpadding="10"&gt;
lots of html here....
&lt;/table&gt;
&lt;/cfpod&gt;

&lt;p&gt;
Footer...
&lt;/p&gt;
</code>

It worked rather well:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 131.png">

Ok, so I know a bit of CSS can turn a div into a scrollable region, but this seemed like a nice use of the tag and it was easy to implement.