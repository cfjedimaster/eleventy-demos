---
layout: post
title: "Preachin' the VAR Scope Gospell"
date: "2007-06-11T15:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/11/Preachin-the-VAR-Scope-Gospell
guid: 2112
---

Ok, so I know I go on about VAR scoping like I'm a raving lunatic, but I wanted to share the following "testimonial" from a reader today:

<blockquote>
Hey, I just wanted to say thanks for your constant "harping" on var scoping in cfcs.  I am still a horrible newbie when it comes to Coldfusion, and before the newest contest (in which I am participating), I did not know of var scoping.
I have been recently developing a large application (well, large for me!) and I was absolutely stumped on why I could not get my cfc to return the value I had
specified.  I fiddeled with it for about two hours to no avail.  Finally, I decided to add a simple <cfset var q = ""> to my cfc.  Surprise, surprise, it
started working!

Well, enough rambling.  I thank you for your insistence on
this issue, and especially appreciate the time that you have devoted to highlighting the need and utilization of this simple coding practice.
</blockquote>

Nice. This is also a good time to remind folks about the <a href="http://code.google.com/p/var-scope-checker-fb/">VarScopeChecker </a> tool. Last time I used the tool it dug up a bunch of missing var statements.