---
layout: post
title: "Guest Blog Post: Solr in a multi-instance setup"
date: "2012-07-18T00:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/07/17/Guest-Blog-Post-Solr-in-a-multiinstance-setup
guid: 4681
---

Michael Dawson sent this to me and asked if I could help let others know. I rarely use multi-instances myself so I haven't run into this, but hopefully this will help others. (And if Michael is wrong, let us know!)

From Michael:

<blockquote>
This is just an observation that you might already know, but it may be worth blogging about since your site usually tops the list in search engine results.

I have two CF 10 instances running on a Windows 2008 (IIS) web server.  I have confirmed the two instances are separate.

I created a Solr collection in "one" of the CF instances.  However, the collection appears in "both" of the CF instances.

I originally wanted to refer to one collection name, "maincontent", when moving from test to production, however, this doesn't appear possible without installing separate instances of the Solr engine.

That was too much work, so my workaround was to prepend the instance name to the name of the collection: wwwdevmaincontent, for example.

There is very little documentation about this particular issue other than one page I found that suggested installing multiple instances of Solr and using its web services.

I hope this can be helpful to you.
</blockquote>