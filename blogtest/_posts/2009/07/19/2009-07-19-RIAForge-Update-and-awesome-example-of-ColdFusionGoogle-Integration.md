---
layout: post
title: "RIAForge Update, and awesome example of ColdFusion/Google Integration"
date: "2009-07-19T19:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/19/RIAForge-Update-and-awesome-example-of-ColdFusionGoogle-Integration
guid: 3451
---

Today I pushed a new update to <a href="http://www.riaforge.org">RIAForge.org</a>, and it's something I think that even non-RIAForge users may be interested in. A few weeks ago, Todd Sharp released <a href="http://cfgoogle.riaforge.org/">ColdFusion Google API</a>, a set of packages to integrate with Google. I've played a bit in this area as well, and Todd made use of a bit of my code as well (the benefits of sharing code, everyone wins). Part of his package is the ability to integrate with Google Analytics.

I've long used Google Analytics to monitor RIAForge, and it occurred to me that I could use his code to provide information about projects. Since every project has a unique base URL (something.riaforge.org), it made it easy to filter the data. Since I'm a lazy jerk, I asked Todd if he would mind whipping up a quick demo for me to use within RIAForge. He went way beyond that and basically wrote 90% of the code. All I had to do was cut, paste, and create the view page. 

Currently these stats are secured, but here are a few screen shots to give you an idea. As much as I love Google Analytics, it isn't always the most simple interface to use. It also requires you to login to another site to view the reports. Todd work allows you to integrate all of this within your application itself. (In fact, I'm hoping to add this support to a little <a href="http://www.blogcfc.com">project</a> of my own.) Huge kudos to Todd for doing this. Anyway, enough praise, here are some simple screen shots from the BlogCFC project. (And yes, I realize the tables are a bit... meh... but I'm going to worry about that later. I think RIAForge is due for a facelift anyway.)



<a href="http://www.raymondcamden.com/images/ga1.png" title="Downloads" class="thickbox" rel="gallery-gass"><img src="https://static.raymondcamden.com/images/cfjedi/ga1_small.png" alt="Downloads" /></a> 


<a href="http://www.coldfusionjedi.com/images/ga2.png" title="Keywords" class="thickbox" rel="gallery-gass"><img src="https://static.raymondcamden.com/images/cfjedi/ga2_small.png" alt="Keywords" /></a> 

<a href="http://www.coldfusionjedi.com/images/ga3.png" title="Views" class="thickbox" rel="gallery-gass"><img src="https://static.raymondcamden.com/images/cfjedi/ga3_small.png" alt="Views" /></a> 

<a href="http://www.coldfusionjedi.com/images/ga4.png" title="Traffic Sources" class="thickbox" rel="gallery-gass"><img src="https://static.raymondcamden.com/images/cfjedi/ga4_small.png" alt="Traffic Sources" /></a>