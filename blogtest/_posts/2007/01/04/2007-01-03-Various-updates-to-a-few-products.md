---
layout: post
title: "Various updates to a few products"
date: "2007-01-04T09:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/01/04/Various-updates-to-a-few-products
guid: 1749
---

I updated my <a href="http://cfyahoo.riaforge.org">CF Yahoo Package</a> today with an amazing new feature called Documentation. The rumor is that documentation, or "docs" as some people call it, actually helps people use software. All kidding aside, sorry it took so long to provide some proper docs, but I've started at least. The included doc covers installation, getting an application ID, and describes one of the APIs, the Answer service. I also removed my own application key from the code. I had forgotten to do that before. If you are using the code in your application, please remove my application key. (And send me an email - I'd like to include a list of sites using the code.) I'm trying to convince Yahoo to add ColdFusion to their <a href="http://developer.yahoo.com/">developer network</a>, so if anyone has an "in" there, let me know. 

My future plans for this package include looking at the other services I haven't covered yet. My goal is to basically cover <i>everything</i> Yahoo provides in one nice package.

I also fixed a small bug in <a href="http://googlecal.riaforge.org/">GoogleCal</a>. I know I've said it before - but if you want a great comparison of how (and how NOT) to do an API, compare Yahoo's services to Googles. I absolutely hated working with the Google API, while working with the Yahoo services was simple as pie. Shoot, almost boring in it's simplicity. UPS probably falls in the middle - if you ignore all the crap you have to go through to just get started with them.

Here is a question - why go through all the trouble of building an API if you aren't going to make it easy to use it? Well, Google? (Not that I expect anyone from the mother ship to respond.)