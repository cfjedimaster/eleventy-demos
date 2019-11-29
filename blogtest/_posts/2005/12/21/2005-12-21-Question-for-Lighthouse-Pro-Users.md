---
layout: post
title: "Question for Lighthouse Pro Users"
date: "2005-12-21T14:12:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2005/12/21/Question-for-Lighthouse-Pro-Users
guid: 987
---

I know I've asked this before - but I'm on the edge now and want a "sanity" check before I jump. Lighthouse Pro makes extensive use of Flash Forms. In some cases, it does so for simply stuff like the editing of project loci (this just means the bug area). The only time where it makes <i>great</i> use of it is the project view. However, I'm running into trouble trying to make some simple changes to it. For example - if you filter by Open, then edit a bug, then submit, the grid comes back with all items selected. The guys over at <a href="http://www.asfusion.com">ASFusion</a> sent me a nice example of how to get around that, but it is becoming problematic. 

It occurs to me I could switch to a simple HTML form and just be done with it. I'd lose the filtering and sorting w/o a server refresh though. Filtering could be down with a simple auto-reload, and it would probably be nice and fast. Sorting should be fast as well.

Now - before you ask - I know I could AJAX (flavor of the year) and some fancy DHTML, but I'm not. My goal here is to keep it simple. 

Would there be anyone using LHP now who would <i>stop</i> if I removed the Flash Forms? Would there be people who would <i>start</i> if I did?