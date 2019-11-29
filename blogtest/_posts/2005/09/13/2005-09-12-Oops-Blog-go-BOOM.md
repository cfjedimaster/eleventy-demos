---
layout: post
title: "Oops! Blog go BOOM!"
date: "2005-09-13T11:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/13/Oops-Blog-go-BOOM
guid: 769
---

As folks know, I like to share mistakes because, I hope (pray) that I'm not the only one who makes them. I also figure if it "saves" someone from repeating it, then I've helped someone else.

So - if you subscribe to my RSS feed, this morning you may have noticed that I had a few new entires. Over 700. What did I do wrong? 

I was reading Pete Freitag's <a href="http://www.petefreitag.com/item/464.cfm">entry</a> this morning about how Google now accepts <a href="https://www.google.com/webmasters/sitemaps/docs/en/other.html">other formats</a> for sitemaps, including RSS 2. So I whipped up a quick modification to the RSS system for BlogCFC. By default, the generateRSS method puts a limit on how many entries are returned. That limit is 15. For the site map, however, I needed to generate a list of <i>all</i> the entries. 

So, I simply commented out the upper limit, created a new RSS file. I felt like I had covered all my bases. The generation was slow, but I cached the results so it should load up faster when refreshed. I tested it - and it worked.

All of a sudden someone on IRC let me know that my RSS feed was showing a <i>lot</i> of new entries. Turns out - my code that restricted the total number of RSS entries, also happened to set a default. Without a default, my main RSS feed was now showing all of the entries. This had a lovely effect on my CPU usage as well. 

So, for those on my RSS feed, sorry!