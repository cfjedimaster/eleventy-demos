---
layout: post
title: "Session metrics with Application.cfc (2)"
date: "2006-12-20T09:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/12/20/Session-metrics-with-Applicationcfc-2
guid: 1726
---

This is just a quick follow up to <a href="http://ray.camdenfamily.com/index.cfm/2006/12/19/Session-metrics-with-Applicationcfc">yesterday's post</a> on the session logging demo I showed. 

First - David Crowther mentioned that I could cut two database queries down to one by just doing the insert in the onSessionEnd method. I don't think this is such a big deal - but it does make things a bit simpler so I made the change. 

Next - Geoff made a good point. He asked if I was sure session.urltoken was unique over system reboots. Using J2EE sessions I'm pretty darn sure it is - but why take chances when ColdFusion makes it so easy to create a unique ID with createUUID()?

For these new suggestions I added three new session variables (id, entrypage, and entrytime), and you can find the code in the Download.

I also wanted to mention something else. When creating your reports, it may be useful to create a simple function to show nicer names for the URLs. So for example, your code could translate /company/about.cfm to "About our Company". It could translate /company/news.cfm?id=45 to "News: Adobe buys Microsoft". This will create reports that are much easier to read.

Thanks to David and Geoff for the good ideas!<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FApplication%{% endraw %}2Ezip'>Download attached file.</a></p>