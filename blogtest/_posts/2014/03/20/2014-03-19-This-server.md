---
layout: post
title: "This server..."
date: "2014-03-20T09:03:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2014/03/20/This-server
guid: 5179
---

<p>
A few days ago I <a href="http://www.raymondcamden.com/index.cfm/2014/3/14/This-blog">blogged</a> about how I was unhappy with the stability of my blog. I discussed how I was looking to simplify and reduce the "moving parts" here and that as part of that plan, I was going to switch to a static site.
</p>
<!--more-->
<p>
In the meantime though, the good folks at <a href="http://www.edgewebhosting.net/">Edge Web</a> continued to look at my site. To be clear, I didn't ask them to, I didn't pay them to, they just did it. I don't even consider this their responsibility. It was my VM and therefore (most likely) 100% my fault (or the fault of something I installed). 
</p>

<p>
Turns out - they believe they fixed the issue. An engineer there, Ryan Mathus, discovered that the Sophos AV program was causing issues. Specifically, he removed scanning on the conf, errors, logs, and manual folders and since that change, the box has been up for 72 hours. I kinda remember hearing about AV programs causing issues on servers in the past, but this is certainly not something I would have found on my own. 
</p>

<h2>Edge Web - you are awesome!</h2>

<p>
<img src="https://static.raymondcamden.com/images/starwars-awesome.jpg" />
</p>

<p>
As an FYI, I <i>still</i> plan on "static-ifying" this site. Mainly because - well - I like to tinker. ;)
</p>