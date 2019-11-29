---
layout: post
title: "Date/Time issue with CFINDEX and SOLR"
date: "2013-03-11T18:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/03/11/DateTime-issue-with-CFINDEX-and-SOLR
guid: 4878
---

I'm not sure if this is a bug or totally expected, but as it hit my blog, I figured I'd share it. A reader (thank you Aaron!) noted that searches on my blog were all returning dates in 2000 and 2001:
<!--more-->
<img src="https://static.raymondcamden.com/images/screenshot78.png" />

I noticed that the months and dates were right, it was just the year that was off. I then noticed that most of my posts were in the AM, including some at 1 and 3AM. Now, I'm not that great of a sleeper, but even I need to sleep some time. 

I first looked at the code I used to index my data. (By the way, did I mention I switched to SOLR-based searching here? Well, I did. :) This is the code used to query the database and store the results in the index. I only use this when I need to blow away everything and start fresh, but similar code is used for atomic inserts as well.

<script src="https://gist.github.com/cfjedimaster/5138026.js"></script>

Note the use of the custom field, posted_dt. This tells cfindex to store data using the dt format, which according to the docs, is...

<blockquote>
Note: _dt supports only the date formats supported by ColdFusion.
</blockquote>

Since the dates from the database were being used already by ColdFusion in my entry display, I assumed I was ok. Here is an example of one of the dates from my blog:

2011-12-22 10:22:00.0

I then went to the front end and added a dump to my search results. This is where I noticed something odd. Here is what one of my results looked like from cfsearch:

Thu Dec 15 12:30:00 CST 2011

That passes isDate, but if I parseDateTime the string, I get:

{% raw %}{ts '2001-12-15 02:30:00'}{% endraw %}

So it appears as if I can pass into cfindex a value that ColdFusion can handle correctly, but SOLR returns something that ColdFusion <i>cannot</i> handle correctly. Luckily I've got no issue just printing exactly what SOLR returned. It doesn't exactly match how I show dates elsewhere, but frankly, I don't care. I could have gotten around this - possibly - by storing the value with the postfix _s instead (ie, simple string), but again, I'm happy just displaying the result as is.