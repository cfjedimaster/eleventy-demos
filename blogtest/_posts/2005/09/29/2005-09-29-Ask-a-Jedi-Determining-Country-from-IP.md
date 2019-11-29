---
layout: post
title: "Ask a Jedi: Determining Country from IP"
date: "2005-09-29T18:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/29/Ask-a-Jedi-Determining-Country-from-IP
guid: 822
---

A reader asks:

<blockquote>
My question for you is how can we track the country name or country code from IP Address using Coldfusion?
</blockquote>

There are a variety of ways of solving this problem (and I know that my readers, as always, will chime in), so I'll focus on how I solved it for a recent client of ours. We used a product called <a href="http://www.sustainablegis.com/projects/geoLocator/">geoLocator</a>, created by the ColdFusion King of International Issues, Paul Hastings. The geoLocator CFC will return a wealth of information about the user's country, all based on IP, which means it is <b>not</b> perfect, but works "close enough" I'd say for most uses. I had no trouble integrating it into our site, and you can't beat the price (free).