---
layout: post
title: "RSS.cfc Update"
date: "2005-05-10T19:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/05/10/RSScfc-Update
guid: 554
---

I've been working on a single CFC to handle RSS work for about 6 months now. (Not straight of course, off and on.) The parsing bit is working quite well I think (with a lot of help from Roger B), but the generating part has been going slowly. I did a bit more work on it today and have got it now generating valid RSS 0.91, RSS 0.92, and RSS 1.0 feeds. It doesn't support <i>all</i> the options available in these feeds, but the idea was to keep it simple. I assume most folks will use it to syndicate simple content. There are no docs - and this is <b>not</b> the 1.0 release (so excuse any guly code), but I thought I'd share what I have so far. The code, and a badly documented example, can be downloaded <a href="http://ray.camdenfamily.com/downloads/rss.zip">here</a>.