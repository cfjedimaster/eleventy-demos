---
layout: post
title: "Even Jedis Make Dumb Mistakes... CFHTTP, Timeouts, and RSSWatcher"
date: "2005-08-17T15:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/17/Even-Jedis-Make-Dumb-Mistakes-CFHTTP-Timeouts-and-RSSWatcher
guid: 706
---

So I'm a big fan of sharing coding mistakes, since I think there are mistakes that many of us make - and are probably too ashamed too admit. This morning all of my web sites were down. The rest of the box was running fine though, so I figured it was probably a ColdFusion issue. (Make that - an issue with one of my ColdFusion pages, not ColdFusion itself.)

One of the sites on the box is <a href="http://www.rsswatcher.com">RSSWatcher.com</a>. This is a simple site that does one thing and one thing only. It allows you to register a search term (or terms) and a set of related RSS feeds. So you could search for "Iran" or "Iraq" and monitor CNN, Fox News, and MSNBC. Whenever an item in one of those news feeds shows up that matches your terms, an email would be sent to you.

Obviously this is done with a lot of CFHTTP calls. I do my best to make this code as light weight as possible. So if two people are using the CNN RSS feed, it will only be fetched once per cycle. 

This worked fine. In general, the template would run slow, but not horribly slow, around 800-900 seconds, which is a bit over ten minutes. The last entry from last night though showed a duration of 5000 seconds. Not good.

So what went wrong? Very simple. I forgot to specify a timeout for the cfhttp call. Pretty dumb. This meant CF would wait forever for a particular HTTP call to end. I reworked the code to include a timeout of 15 seconds, which is more than enough time for a remote RSS feed to respond. 

The docs for <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000272.htm">CFHTTP</a> have this to say about the timeout property for the tag:

<blockquote>
Value, in seconds, that is the maximum time the request can take. If the timeout passes without a response, ColdFusion considers the request to have failed.

If the client specifies a timeout in the URL search parameter (for example, ?RequestTime=120) ColdFusion uses the lesser of the URL timeout and the timeout attribute value; this ensures that the request times out before, or at the same time as, the page.

If the URL does not specify a timeout, ColdFusion uses the lesser of the Administrator timeout and the timeout attribute value.

If the timeout is not set in any of these, ColdFusion waits indefinitely for the cfhttp request to process.
</blockquote>

Another tip - make friends with CFLOG. Intensive use of logging helped me monitor and correct this issue. By the way, the process now runs in under three minutes, which is significantly better.