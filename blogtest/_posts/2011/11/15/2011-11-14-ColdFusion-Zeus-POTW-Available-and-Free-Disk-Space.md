---
layout: post
title: "ColdFusion Zeus POTW: Total and Free Disk Space"
date: "2011-11-15T09:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/11/15/ColdFusion-Zeus-POTW-Available-and-Free-Disk-Space
guid: 4433
---

Continuing on with my ColdFusion Zeus previews, today is yet another small, but useful addition - getTotalSpace and getFreeSpace. Together these functions can tell you how much space you have on a drive versus how much space is actually available. Not exactly rocket science, and it's been possible before via UDFs, but it's nice to see it baked into the language. It also bears repeating something I've said at a few conferences lately - if your site allows for uploads (images, PDFs, etc), are you currently keeping track of your disk space? Sure you may have 50 gigs of space free now, but in a month, how much will be left? Using these functions you could easily create a scheduled task that simply sees if the free space is below a certain threshold. If it is, an email could be fired off to warn you to either clean up old files or find a bigger drive. (Or even better - move to Amazon S3, since ColdFusion 9.0.1 makes that pretty trivial as well.)
<!--more-->
<p>

As a simple example, here's a call to getTotalSpace:

<p>

<code>
&lt;cfoutput&gt;#getTotalSpace("c:/")#&lt;/cfoutput&gt;
</code>

<p>

On my desktop this returns 987339157504. The function does basic checking of the drive sent and will throw an error if you ask for something that doesn't exist, like a z:/ drive for example. Running getFreeSpace works the same:

<p>

<code>
&lt;cfoutput&gt;#getFreeSpace("c:/")#&lt;/cfoutput&gt;
</code>

<p>

That returns 732335194112. I could probably install two more copies of World of Warcraft with that much space. Maybe even a Master Collection as well. You can also run the same functions on the VFS system:

<p>

<code>
&lt;cfset totalVFS = getTotalSpace('ram://')&gt;
&lt;cfset freeVFS = getFreeSpace('ram:/')&gt;
</code>

<p>

By the way, I should point out that Zeus also allows you to set your VFS to be application-specific - something I asked for when VFS was first introduced. I'll demonstrate that in a later post. 

<p>

So, that's pretty much it. Here's a quick example that converts the bytes to megs and renders it in simple chart.

<p>

<code>
&lt;cfset free = round(getFreeSpace("c:/")/1048576)&gt;
&lt;cfset total = round(getTotalSpace("c:/")/1048576)&gt;
&lt;cfset used = total - free&gt;

&lt;cfchart chartheight="500" chartwidth="500" title="Disk Usage (#total# Megs)"&gt;

	&lt;cfchartseries type="pie"&gt;
		&lt;cfchartdata item="Free Space" value="#free#"&gt;
		&lt;cfchartdata item="Used Space" value="#used#"&gt;
	&lt;/cfchartseries&gt;
	
&lt;/cfchart&gt;
</code>

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip226.png" />