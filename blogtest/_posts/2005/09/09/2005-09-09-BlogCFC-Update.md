---
layout: post
title: "BlogCFC Update"
date: "2005-09-09T19:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/09/BlogCFC-Update
guid: 762
---

A big thank you goes out to Martin Baur for finding a bug with enclosures. I'm not going to tell you what the bug is - but rather leave it for a ColdFusion 101-style test. First person who can explain the bug (and not laugh at me for making it) will win... um.... well nothing... but hey, it's fun, right?

I did not update the readme, nor the version #. If you are already running the latest version, you just need to copy index.cfm from the client file.

Here is the line that had the bug. Let's see who is first to point the issue out.

<div class="code"><FONT COLOR=GREEN>&lt;a href=<FONT COLOR=BLUE>"enclosures/#getFileFromPath(urlEncodedFormat(enclosure))#"</FONT>&gt;</FONT></div>