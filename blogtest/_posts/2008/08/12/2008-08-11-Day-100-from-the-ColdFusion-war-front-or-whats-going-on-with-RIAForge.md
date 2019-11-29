---
layout: post
title: "Day 100 from the ColdFusion war front (or, what's going on with RIAForge)"
date: "2008-08-12T10:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/08/12/Day-100-from-the-ColdFusion-war-front-or-whats-going-on-with-RIAForge
guid: 2969
---

I've blogged quite a bit lately about the issues I've been having with RIAForge. A few days back I decided to take another tact and put <a href="http://www.fusion-reactor.com/fr">Fusion-Reactor</a> on the box. I've told folks before that FR is pretty darn impressive, but I was surprised at how quickly it exposed issues on the server, specifically at the database level. 

My primary sin? Lack of indexes. I enabled the JDBC wrapper for the main database connection and immediately began to see queries that were taking a lot longer than I thought they should. I began adding indexes where appropriate and it's helped quite a bit, but I still have more work to do.

Another interesting thing FR fleshed out was a rather slow XML process. I had removed this some time ago, but I only 'removed' it by switching to JSON. The old event was still there, and picked up by search engines. How often do folks comb through their Model-Glue XML files to ensure they don't have abandoned events?

So where do we stand now? The server still has issues. Both yesterday and today I found Apache crashed and burned. Well, I should say not responding. It was running in the services panel but not responding to requests. A quick restart of Apache brought the site back up. I've done some modifications to the logging to try to flesh out more about what could be harming it. 

I'm also still seeing the Subversion processes as being a pain point. I mentioned before I had worked on a new Subversion wrapper, but encountered a few issues when it went to production. I'm going to try to get that wrapped this month some time. I also have search engines running the Zip action. I need to remember to use those nofollow/noindex tags for links I don't want picked up. I also should consider caching the zipped files. 

One quick note - if you plan to use CF8, FR, and MySQL, and employ the JDBC wrapper, be sure to read this <a href="http://groups.google.com/group/fusionreactor/browse_thread/thread/214430b00c23eb8c/86ded4670b759221?lnk=gst&q=mysql+jdbc+wrapper#86ded4670b759221">thread</a> from the FR support group.

Lastly, I want to thank Intergral for providing a license to let me keep running FR on the <a href="http://www.riaforge.org">RIAForge</a> box!