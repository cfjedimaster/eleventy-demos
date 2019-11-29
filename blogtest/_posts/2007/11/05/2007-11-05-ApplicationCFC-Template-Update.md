---
layout: post
title: "Application.CFC Template Update"
date: "2007-11-05T15:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/05/ApplicationCFC-Template-Update
guid: 2454
---

Someone asked me today when I was going to update my Application.cfc reference (linked to in the Guides pod to the left) for ColdFusion 8. I went ahead and did so. You can see the new guide here:

<a href="http://www.raymondcamden.com/enclosures/application.txt">http://www.raymondcamden.com/enclosures/application.txt</a>

You will notice I changed to a text file for this one. I always found it bothersome that when I copied from the PDF, I lost my tabs. Since I'm a bit anal retentive about tabbing, I figured a simple txt file would be better. Shoot, this whole PDF thing is probably just a fad anyway.

I also included comments in this template. I didn't do it before because - well - I wanted folks to have something they could just cut and paste into a new file (or into a CFEclipse Snippet). But I figured one line comments can't hurt. If folks think it is a mistake, let me know. Again the intent here is to serve as a template, not really a learning guide. You will notice that in the official docs, they forgot some of the items you can include. For example, the reference guide forgot customtagpaths and mappings. The dev guide has them - but forgot the other new This scope items like secureJSON. (I've logged bugs for both of these issues.)

Lastly - I've kept the CF7 version linked as well.