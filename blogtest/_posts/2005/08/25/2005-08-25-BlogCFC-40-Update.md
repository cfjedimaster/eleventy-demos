---
layout: post
title: "BlogCFC 4.0 Update"
date: "2005-08-25T22:08:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2005/08/25/BlogCFC-40-Update
guid: 729
---

It's been a few weeks since my <a href="http://ray.camdenfamily.com/index.cfm/2005/8/12/BlogCFC-39-Released--BlogCFC-40-Specs">3.9 Release/4.0 Announcement</a> so I thought I'd give folks an update. Here is the original list of 4.0 specs and my progress on each:

<ul>
<li><i>Trackbacks</i><br>
I've got two examples of track back implementations I can look at. My main concern is TB spam, so the first thing I'll make sure to do is create an option to completely turn the feature off.</li>
<li><i>Hour offset. Your live in CST. Your blog lives in EST. Let's get them together, shall we?</i><br>
Done, and running here.</li>
<li><i>Code clean up: Mainly just slimming down blog.cfc and breaking it up a bit. Zero impact on readers or users, but will help my sanity when doing code editing.</i><br>
I spent some time working on breaking apart blog.cfc, but because I didn't want to change the API, it just got messy. I did do some clean up, and plan on visiting every page in the zip to make sure things are up to snuff.</li>
<li>New colored code. A user submitted a new version of the colored code custom tag, which is quite old. I also want to play with the CSS a bit so it uses scroll bars.<br>
Not yet.</li>
<li><i>Potential rewrite of code generated to make it XHTML compliant.</i><br>
Ditto.</li>
<li><i>Potential use of Aura.</i><br>
Not yet. ;)</li>
</ul>

My blog is now running what I'm calling the 4.0 Alpha. When it gets into slightly better shape I'll post a zip for people to play with.