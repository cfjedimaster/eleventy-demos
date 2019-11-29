---
layout: post
title: "Two Model-Glue 2 backwards compatability issues to watch out for"
date: "2006-11-25T15:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/11/25/Two-ModelGlue-2-backwards-compatability-issues-to-watch-out-for
guid: 1675
---

Joe has worked very hard to make <a href="http://www.model-glue.com">Model-Glue 2</a> backwards compatible, but I ran into two small issues today I wanted to warn people about. (I've already sent a bug report to Joe.) 

First off - in case it isn't obvious - these issues only occurred with a Model-Glue 1.1 application, and may not involve all MG 1.1 applications, but it did affect the <a href="http://www.coldfusioncookbook.com">ColdFusion Cookbook</a>.

Issue 1: On loading the application, you get an error about a key not defined: rescaffoldKey. This is the URL variable Model-Glue 2 looks for to recreate the scaffolds. I simply added this to my Model-Glue.xml settings block:

<code>
&lt;setting name="rescaffoldKey" value="rescaffold" /&gt;
</code>

Issue 2: It looks as if Model-Glue debugging will display even if you have debugging turned off. I forced it off using this in my Application.cfm file:

<code>
&lt;cfset request.modelGlueSuppressDebugging = true /&gt;
</code>

(For more information on this setting, see <a href="http://ray.camdenfamily.com/index.cfm/2006/9/18/Per-request-debugging-in-ModelGlue">this entry</a>.)

Obviously Model-Glue 2 isn't official yet so you take your own risks deploying it live - but it has been <i>very</i> stable (and fast) for me so far.