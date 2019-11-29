---
layout: post
title: "BlogCFC 5 development starts..."
date: "2006-04-07T17:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/04/07/BlogCFC-5-development-starts
guid: 1195
---

So it's been quite a long time since the last release of BlogCFC. I've finally started development of version 5. Last night I started on the administrator. The blog uses what is called "designmode" to allow you to edit on the page. This was based off Spectra (may it rest in peace). While this is handy for simply popping up a window and writing a quick article, it really isn't great for administration. As my blog has grown, I've really felt constrained by the decision to not have a "real" admin and now I'm finally doing something about it. 

So far I've got comment editing (and deleting), category editing, and subscriber editing working. All things that are not in the current release. (Category editing is, but it's not terribly nice I think.) 

Along with administration work, I added a new property to blog entries - views. A view is added anytime a person views a particular blog entry - not including reading the entry on the home page. You can see this on my blog in the <a href="http://ray.camdenfamily.com/stats.cfm#topviews">stats</a> portion. The numbers are a bit low since I only turned it on this morning. This change will also let me show what categories are most popular. 

While I'm working on the admin and other behind the scenes stuff, Scott Stroz (Boyzoid) is working on the front end. The goal is to get to a pure CSS layout for BlogCFC, and to simply make it a bit prettier. Simple things like a background color and centering the blog make it look quite a bit nicer. I've also had other a few other people offer to submit their CSS changes, so I will be passing that to Scott to integrate. 

Other changes include: 

<ul>
<li>XML-RPC: From Jake. This will let you write blog entries completely outside of the web site.
<li>Send to a Friend: This is an obvious feature that I should have added a long time ago. Once again it wasn't my idea, but suggested by a friend.
<li>Related Entries: Written by Jeff and CJ. I've had the code for a while now, just haven't had a time to integrate it.
<li>I'm considering a few ways to make it easier to add images to a post. I don't want a HTML editor - but maybe a way to automatically include a picture if it is attached to the entry as an enclosure. 
</ul>

So - there is a lot left to do. The good news is that I'm now using SVN. Once it gets to a stable alpha, I'll open it up for folks to download from and play.