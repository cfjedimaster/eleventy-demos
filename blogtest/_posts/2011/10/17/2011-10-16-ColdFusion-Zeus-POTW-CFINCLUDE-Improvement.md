---
layout: post
title: "ColdFusion Zeus POTW: CFINCLUDE Improvement"
date: "2011-10-17T10:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/10/17/ColdFusion-Zeus-POTW-CFINCLUDE-Improvement
guid: 4394
---

Welcome to the first ColdFusion Zeus POTW (Preview of the Week). This is a new blog series where I'll be highlighting one feature a week from the upcoming new version of ColdFusion code-named Zeus. As with any preview, you should remember that <b>things may, and probably will</b>, change a bit before the final product is released. That being said, this is your early opportunity to voice your opinion. Some POTWs will be deep dives into large topics. Some, like today, will be simple, small changes that are meant to improve your day to day coding life. What I'm about to show is <i>really</i> small. But it's one of those nice things that I think you will really appreciate.
<!--more-->
<p/>

Any one who has made use of cfinclude in the past has probably run into situations where they've accidentally included the same template twice. Some times this isn't a big deal. Other times it can lead to bugs or just having your site run a bit slower than expected. 

<p/>

ColdFusion Zeus adds a simple way to ensure your includes are never run more than once. Consider the template below:

<p/>

<code>
&lt;cfinclude template="include_target.cfm" runonce="true"&gt;
&lt;cfinclude template="include_target.cfm" runonce="true"&gt;
</code>

<p/>

We've added a new attribute, runonce, that when set to true, will ensure the target of the include is only executed once. This is request-level intelligent as well. So given this CFM:

<p/>

<code>
&lt;cfinclude template="include_target.cfm" runonce="true"&gt;

&lt;cfinclude template="include_test.cfm"&gt;
</code>

<p/>

If include_test.cfm contains the include statements you saw above, then they recognize that they were already run before in the parent. Hopefully that didn't come out as confusing as it sounds. ;)