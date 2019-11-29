---
layout: post
title: "Where I want to go with Node next..."
date: "2015-11-30T08:52:22+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2015/11/30/where-i-want-to-go-with-node-next
guid: 7169
---

This post probably isn't terribly useful to anyone else but me, but I wanted to write this down to help direct me and keep me on target. I've been spending a lot of time with <a href="http://www.strongloop.com">StrongLoop</a> lately and while I feel like I've covered the "API stuff" pretty well, I want to turn my attention to performance stuff - both in StrongLoop of course and generically across the Node.js ecosystem. Let me give some context.

<!--more-->

As folks may know, I spent most of my development life working with ColdFusion. I'm mostly moved away from that and outside of side work for clients I don't write any new code in it. It should come as no surprise that I now recommend Node.js to developers looking to build server-side applications. It is easy to pick up, for the most part, and free and open source. There's one thing that ColdFusion did really well though that I'd like to replicate on the Node.js side. 

Out of the box, you could enable server-side reporting of performance metrics in your ColdFusion application. This was reported in an easy to read format at the bottom of a CFM page. This report would break down all kinds of useful information:

<ul>
<li>How long did the entire request take to process?</li>
<li>Given your request called various component methods, how long did they take to execute?</li>
<li>Given your request called a database, what queries were used, how many records were returned, and how long did they take to process?</li>
</ul>

As an example, I could see when a request wasn't performing well because it was calling the database for the same data multiple times in one request. That seems like a silly mistake to make, but as we all know, an application grows over time and is touched by many developers. Sometimes you may not realize you're repeating the same method calls and basically refetching the same request every time. 

Another example - you may see that a database query is performing slowly when it doesn't make sense that it should. That could be a number of things - but probably a bad index. Yes - this is something MySQL itself can tell you, but you may not even realize you have a problem till you see the numbers in front of you. Or perhaps your returning N rows when you realize you should be returning 1. Again, a "simple" mistake that can be overlooked.

The service ColdFusion provided was also configurable in terms of what was reported and you could modify it to add your own flair to it. 

All in all - it is a darn good feature. While it doesn't cover everything and doesn't replace "deep" tools like <a href="http://www.fusion-reactor.com/">Fusion Reactor</a>, it is good for getting a quick look at your site performance and making some immediate fixes. That's where I want to go with Node next. I'm assuming it may not be as easy, but I can hope, right?