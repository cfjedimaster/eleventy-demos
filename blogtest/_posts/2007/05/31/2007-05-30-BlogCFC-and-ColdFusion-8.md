---
layout: post
title: "BlogCFC and ColdFusion 8"
date: "2007-05-31T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/31/BlogCFC-and-ColdFusion-8
guid: 2077
---

So I thought I'd write a quick note to talk about my plans for BlogCFC and ColdFusion 8. First off - there is a bug that prevents BlogCFC from running under CF8. This was due to me writing some code that worked right but should not have under CF7. I've fixed this bug and have checked into into the Subversion repository. The file in question is /org/camden/render/render.cfc. Grab it if you plan on running  BlogCFC under ColdFusion 8.

As for how I plan on using CF8 - right now I don't have many plans. Since my customer base is quite large and covers folks on CF6 and CF7, I don't want to do too much for folks who can't even use it. I can say the first thing I'll do is update Ping support to use cfthread if BlogCFC is running under ColdFusion 8. About the slowest thing in BlogCFC is the ping action. (Well, it is slow if you do a lot of pings.) By using cfthread I can speed up the process quite a bit. 

Later this week I'll be making that change - and when I do, I'll blog the code so folks can see the before and after.