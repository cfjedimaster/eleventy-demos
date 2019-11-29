---
layout: post
title: "Did you know you could verify DSNs with ColdFusion code?"
date: "2009-04-15T13:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/04/15/Did-you-know-you-could-verify-DSNs-with-ColdFusion-code
guid: 3316
---

We are slowly wrapping lunch here at CFUnited Express, and the guy next to me brought up the issue of handling a database that is down. He was considering running a query wrapped in try/catch on every request, but that would be a bit slow. I did a quick check and was pleasantly surprised to see that DSN verification (the same thing you get in the ColdFusion Administrator) is available via the Admin API. Specifically, datasource.cfc, method verifyDSN. You can have it optionally return a message with error details if things go wrong. Here is a quick sample:

<code>
&lt;cfscript&gt;
adminObj = createObject("component","cfide.adminapi.administrator");
adminObj.login("admin");

datasource = createObject("component", "cfide.adminapi.datasource");
res = datasource.verifyDSN("peanutbutterjellytime", true);
&lt;/cfscript&gt;

&lt;cfdump var="#res#"&gt;
</code>

Obviously the admin password would be different in production, but you get the idea. The result was: 

<blockquote>
<p>
coldfusion.sql.DataSourceFactory$DataSourceException: Datasource peanutbutterjellytime could not be found. 
</p>
</blockquote>

Setting the second argument to false makes the method just return a simple false.