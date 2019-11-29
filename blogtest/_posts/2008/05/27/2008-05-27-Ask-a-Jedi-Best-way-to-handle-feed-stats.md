---
layout: post
title: "Ask a Jedi: Best way to handle feed stats"
date: "2008-05-27T15:05:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2008/05/27/Ask-a-Jedi-Best-way-to-handle-feed-stats
guid: 2843
---

Che asks:

<blockquote>
<p>
Ray, n00b RSS question. I have several hundred RSS feeds not related to blog content, but rather to auto classifieds... how can I tell how many people are subscribing to them? If there are subscribers, I don't see them in Google Analytics. Any ideas would be aprreciated.
</p>
</blockquote>

Good question. If you are like me, you welcomed Google Analytics with open arms as it meant no more need to parse log files. Unfortunately, since Google Analytics requires a JavaScript file on the page, it doesn't help with things like RSS feeds. 

You could go back to simply parsing logs. <a href="http://www.analog.cx/">Analog</a> (a free command line program) has always been pretty good at it. Back when I used to parse my <a href="http://www.deathclock.com">DeathClock</a> logs, it would go through them <i>extremely</i> quickly. (Back when I last ran DeathClock, it got around 4+ million hits per month.) 

The second option is probably the easiest - use <a href="http://www.feedburner.com">FeedBurner</a>. I've been using FeedBurner for a while now and it's a handy way to get your feed stats. You can also use FeedBurner for site stats as well, preventing you from having to use both it and Google Analytics.

As always - I'm open to other suggestions here.