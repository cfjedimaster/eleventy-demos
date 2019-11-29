---
layout: post
title: "Using ColdFusion to check available disk space"
date: "2013-01-22T09:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/01/22/Using-ColdFusion-to-check-available-disk-space
guid: 4836
---

I mentioned this in a presentation last week but I thought I'd bring it up with a concrete example. For those of you who allow file uploads to your server, how many of you actively check your free space on your server? Even if you don't use that feature, do you monitor free space anyway? Log files, in particular, can suck up quite a bit of space. Here is an incredibly simple ColdFusion template that checks for a minimum number of gigs of free hard drive space. If it is less than that threshold, or at 0, which didn't happen to me yesterday, honest, then it fires off an email.

<script src="https://gist.github.com/4595234.js"></script>

Set this up to run hourly and you should be good to go. You could also make this check multiple drives if your server makes use of them.

So yeah -this <i>so</i> didn't bite me in the ass. Honest.