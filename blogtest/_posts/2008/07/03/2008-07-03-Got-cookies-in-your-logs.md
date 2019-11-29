---
layout: post
title: "Got cookies? (in your logs)"
date: "2008-07-03T15:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/07/03/Got-cookies-in-your-logs
guid: 2914
---

I recently noticed a large of odd messages in my coldfusion-event.log. They all looked something like so:

06/26 14:47:27 error Cannot create cookie: domain = .riaforge.org

This error was <i>not</i> on the RIAForge box but my own personal server (this machine). I asked about this on a listserv and got a lot of good responses, but it seems like the final answer is this:

<a href="http://jochem.vandieten.net/2008/07/03/reserved-names-for-cookies/">Reserved Names for Cookies</a>

I'm sharing this in case others run into it as well. When I say "large", I mean quite a bit. In fact it seemed to be the primary content of the entire log.

Please post comments on Jochem's blog though. I've already posted a followup question there myself.