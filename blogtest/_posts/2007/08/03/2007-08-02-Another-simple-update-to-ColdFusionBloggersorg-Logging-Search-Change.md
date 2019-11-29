---
layout: post
title: "Another simple update to ColdFusionBloggers.org - Logging Search Change"
date: "2007-08-03T08:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/03/Another-simple-update-to-ColdFusionBloggersorg-Logging-Search-Change
guid: 2248
---

I just pushed up another small change to <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers.org</a>. With all the *ahem* interesting searches going on, it occurred to me that I needed to make a basic change for the stats to be a bit more appropriate. In the initial release, every single search was logged. This included the search form as well as links from the stats page or the stat pod. So people just interested in seeing what the top searches returned were actually making those top searches even more popular. The same thing happened when you would paginate. Every page was a new search. In theory that one wasn't so bad. But all in all - I needed a change. 

Now I only log when you use the form and even then I only log on the very first hit. This is a modification that exists in <a href="http://blogcfc.riaforge.org">BlogCFC</a> as well.

As always, I updated the code.zip file. I also added a slick <a href="http://www.reybango.com/index.cfm/2007/8/1/ColdFusion-8-Powered-By-Logos-Get-Em-While-Theyre-Hot">Powered by CF</a> logo to the site as well (in case it wasn't obvious).

I swear now - no more front end changes. I'll start work on the admin next so I can start adding blogs to the system.