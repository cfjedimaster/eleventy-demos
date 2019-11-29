---
layout: post
title: "Ask a Jedi: How long should a query take to run?"
date: "2006-02-23T13:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/02/23/Ask-a-Jedi-How-long-should-a-query-take-to-run
guid: 1120
---

A reader asks:

<blockquote>
Hiya Ray - <br>
Is there any guidelines as to how long a query should take to process?  For example, I have a category column that I have return just 10 rows, but my entire database has 60,000+ records and it takes about 1100ms.  Is this bad?
</blockquote>

It depends. (Tired of me saying that yet? ;) I'd always be wary of saying, "A query should only take X seconds," but I can say 1100 ms is probably way too much. I am <b>not</b> a good DBA. It is something I'm working on improving. But I'd definitely recommend looking into your SQL and trying to figure out why it is taking so long. If you want (and if you still read this blog after I took so long to respond), you can post your code and my readers and I can help debug it.

So what would I use as a general suggestion for the maximum amount of time a query should take? I'd say anything over 50ms should be cause for alarm.  (Well, not alarm, but I'd check it out.)

By the way - <a href="http://ray.camdenfamily.com/projects/starfish">Starfish</a> can help you check how long your queries are taking.