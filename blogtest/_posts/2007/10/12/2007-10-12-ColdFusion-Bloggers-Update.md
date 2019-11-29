---
layout: post
title: "ColdFusion Bloggers Update"
date: "2007-10-12T13:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/12/ColdFusion-Bloggers-Update
guid: 2407
---

I want to send a quick shout out to <a href="http://www.cfsilence.com/blog/client/index.cfm">Todd Sharp</a>. He wrote up a quick AJAX-y admin for <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers.org</a>, making it much easier to add blogs to the system. I should be caught up with the requests by end of day.

In a day or so I'll also be posting an update to the main processor. Right now I suck down all 300+ feeds at once. This update makes use of CFHTTP and etag/lastmodified headers to only grab feeds that have been updated. This should both reduce the amount of bandwidth the site uses, and mean less work for poor old CFFEED. 

I have a blog entry describing what I did planned for later today, although I may push that out as I've got a few surprises for later on.

Oh - and yes - I do plan on adding ping very soon. I've got it down to one file (in my head), I just need to write it out.