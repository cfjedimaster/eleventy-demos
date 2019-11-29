---
layout: post
title: "createUUID speeded up in ColdFusion 9"
date: "2009-08-31T18:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/31/createUUID-speeded-up-in-ColdFusion-9
guid: 3506
---

At CFUNITED, Hemant (Engineering Manager for ColdFusion) mentioned that createUUID was speed up in ColdFusion 9. CreateUUID isn't the fastest function in the world, and has some possible scary implications in some scenarios (see this excellent <a href="http://www.webapper.com/blog/index.php/2009/05/05/createuuid_friendly_function_or_server_killer/">blog post</a> by Tyson Vanek) but I've made use of it for years now in my open source applications because of how easy it is to use across multiple database platforms. I decided to take a look at the speed changes and I was pretty impressed by what I found.
<!--more-->
So my test case was relatively simple, and to be honest, I am <b>not</b> a big fan of 'loop and time' type tests, but I figured it would be a quick way to check. Here is what I used.

<code>
&lt;cfsetting showdebugoutput="true"&gt;
&lt;cftimer label="createUUID() test" type="inline"&gt;
	&lt;cfloop index="x" from="1" to="20000"&gt;
		&lt;cfset createUUID()&gt;
	&lt;/cfloop&gt;
&lt;/cftimer&gt;
</code>

Running under ColdFusion 8, this takes a little over 20 seconds - which meshes exactly with what Tyson mentioned in his blog post. Running the exact same code in ColdFusion 9? A bit over 2 seconds. A 10 fold increase in speed. Of course, I don't think anyone will need to create twenty thousand UUIDs at once anytime soon, but that's a pretty nifty speed increase. It's the difference between the Enterprise NX-01 and 1701!