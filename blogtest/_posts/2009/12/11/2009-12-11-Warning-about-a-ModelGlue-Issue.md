---
layout: post
title: "Warning about a Model-Glue Issue"
date: "2009-12-11T15:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/11/Warning-about-a-ModelGlue-Issue
guid: 3643
---

For a while now I've seen an odd issue with <a href="http://www.cflib.org">CFLib</a>. It only occurred after a reboot and I was always able to make it go away with a reinit, so I put it on my queue of things to fix "one day" and promptly let it idle there (it's right next to BlogCFC 6). Earlier this week however a user of <a href="http://lighthousepro.riaforge.org">LighthousePro</a> reported the <i>exact</i> same error so I decided to dig a bit deeper. I had been convinced the CFLib issue was simply a minor bug in my code, and while I could easily make the mistake in two sets of code, it seemed a bit unlikely. 

The issue was an odd one. During the application's start up, something goes wrong. Let's say a timeout for example. After that initial error, any request to the site would result in Model-Glue stating that there was no event handler for X (X being whatever the default event is for the site). Now I knew for a fact that X was a valid event so I was a bit perplexed. It was almost as if the Model-Glue framework loaded up with a bit of amnesia.

I decided to go ahead and ask on the Model-Glue listserv. You can read the thread <a href="http://groups.google.com/group/model-glue/browse_thread/thread/5ec36476b1f791f6">here</a>. I'm glad I did. Not only did a few people confirm seeing the same issue. Even better, Dennis Clark was able to focus in on the bug and suggest a fix. 

I've logged a bug for it at the Model-Glue trac site. For now I'm not sure what to suggest for current sites. Obviously you know how to fix it (run the reinit), but it would be nice to have a way to automate that until the bug is fixed in the framework itself.