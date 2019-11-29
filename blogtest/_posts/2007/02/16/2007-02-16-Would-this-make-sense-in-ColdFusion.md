---
layout: post
title: "Would this make sense in ColdFusion?"
date: "2007-02-16T17:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/02/16/Would-this-make-sense-in-ColdFusion
guid: 1844
---

So I work on a site (<a href="http://www.riaforge.org">RIAForge</a>) that has a few components that exist in kind of a "virtual application" mode. That's not a great way to describe it - but what I mean is that there is one code base that is used by multiple applications. So consider the blogs that each RIAForge project can use. This is all one code base but each instance will use it's own Application space.

So this runs well - except when I do a code update. All of the projects have their own scoped version of the code. If I push up a bug fix, all of the projects that had a cached version of the code in RAM won't be updated.

Obviously I can just restart the server (which I'm about to do by the way), but it would be nice (I think) if the Administrator had a way to dump (and I don't mean display, but remove) all data from the server, application, and session scopes. A RAM dump I suppose. 

I could do this by cheating and writing a script to get all the applications, but does this make sense as something to suggest to Adobe?