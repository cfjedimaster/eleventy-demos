---
layout: post
title: "Update to ColdFusionBloggers - and a description of my process change"
date: "2007-07-23T00:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/22/Update-to-ColdFusionBloggers-and-a-description-of-my-process-change
guid: 2212
---

Wow, what an exciting blog title there. I bet you saw "process change" and just jumped for joy. All joking aside, let me talk a bit about how <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers.org </a>used to work and what I just did to help with performance.

Let me start by saying that I <i>think</i> I've made some good changes here. But I'm definitely open to some feedback/criticism/suggestions on how I can do it better. First let me review how the old code worked. 

I grab a list of blogs. I send this list of blogs to <a href="http://paragator.riaforge.org/">Paragator</a>. Paragator used threads to a) grab the feed, b) massage the feed, and c) join the threads and data into one large Uber query. I then loop over the results and see if the entry is new. If so, it gets inserted into the database. I did this in one CFC method to make things simpler.

So in general this seemed to work ok. But I've been having some issues on the box that <i>just</i> started when I launched the site, so I figure it has to be related. So tonight while driving home from my brother-in-laws (with only two beers in my system, so I was still sensible), I came up with what I thought was a <b>much</b> improved process. Here then is CFBloggers.org V2's process mechanism:

Grab all blogs.<br/>
Loop over each blog in a thread.<br/>
Download RSS with CFFEED.<br />
Check the URL of the first entry against an Application cache. If not new, assume feed hasn't changed and exit.
If new, run a Massage UDF which is a subset of Paragator. I removed <b>anything</b> I didn't really need. (Well, mostly.)<br/>
Loop over massaged query and insert into DB if entry is new.

That's it. What's interesting is that now I don't need to join my threads. I don't have an Uber query. So my process.cfm runs in about 100 MS or so. I think this will really help a lot. The cache means that I don't have to massage(edit) the initial feed query after the first time. It also means that I'm not running a bunch of database calls to see if an entry is new or not. In theory it is possible that someone could generate RSS where the top entry wasn't the first entry, but I'm willing to take that chance.

So - what do people think? Good change? I've updated the code zip file on the site. I will say I think process.cfm is a bit ugly now. I tried to comment a lot but it may not be the nicest thing you see come from me. 

Oh - and I made stats.cfm a bit more random. That was totally useless and just for fun.

What are my plans? Well I'm obviously taking this a bit past  "Proof of Concept" stage I think. I'd like to work on the admin later this week and use it as a chance to play with cfgrid and editing of records.