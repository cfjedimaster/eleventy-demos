---
layout: post
title: "Adobe Groups is now ColdFusion"
date: "2010-04-13T20:04:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/04/13/Adobe-Groups-is-now-ColdFusion
guid: 3780
---

<img src="https://static.raymondcamden.com/images/cfjedi/adobegroups.png" title="Adobe Groups, the new hotness. Cooler than the iPad." align="left" style="margin-right:10px" /> For many months now I've been tweeting about a project called Picard. Today, it finally went live. Picard was the code name for the new version of <a href="http://groups.adobe.com">Adobe Groups</a>. For folks who don't know, Adobe Groups is a site that helps Adobe User Group managers communicate with their user group members. It supports blogs, forums, event calendars, and other resources. I was approached by Adobe last fall to recreate the site. Previously it was a hosted CMS system built on PHP. Before being approached by Adobe, I had not really dug deep into Groups. As I researched and built - I became pretty darn impressed by the older system. It is a quite complex CMS and it took quite a bit of work to build it from scratch. It was also a pretty intense "trial by fire" in terms of ORM. I made use of many ColdFusion 9 features while building it and I hope to blog more later on about the details behind what I did. (And you better believe I added quite a bit of jQuery sugar to the mix as well!)

The actual launch was a bit... rough. I forgot to disable the reload attribute of the Model-Glue framework. This brought the site down pretty quickly when I tweeted it - but luckily that was easy enough to fix. The other issues we ran into were network/DNS related, but we were able to get them corrected in time. (Note to self - I really need to have a more formal "push to production" plan in the future!)

Now I've got plenty of bug reports/enhancement requests from Adobe User Group Managers and hopefully they will all get fixed in the next few weeks. It's definitely still a bit "rough around the edges" but Adobe now has a system all of their own that we can continue to improve and build upon. (I've already been able to add some new features like nicer URLs and group manager emails to members.)
<br clear="left">