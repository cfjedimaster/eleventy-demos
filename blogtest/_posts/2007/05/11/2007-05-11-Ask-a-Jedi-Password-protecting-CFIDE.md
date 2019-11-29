---
layout: post
title: "Ask a Jedi: Password protecting CFIDE"
date: "2007-05-11T11:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/11/Ask-a-Jedi-Password-protecting-CFIDE
guid: 2025
---

Andy asks:

<blockquote>
What directories under CFIDE should be blocked/protected from public access on a public ColdFusion server?  Is only
preventing access to CFIDE/administrator good enough?  How about CFIDE/adminapi? Any others that should be blocked?  I tried searching the Adobe website, but I could only turn up a note regarding ColdFusion 4 and 4.5!
</blockquote>

I'm pretty surprised by the fact that this hasn't been updated lately. I took a quick look at <a href="http://livedocs.adobe.com/coldfusion/7">Livedocs</a>, but didn't see anything that related to this.

I haven't done this myself in a while (I admit it - I'm lazy), but I'd think you would want to lock down these subfolders:

administrator<br>
adminapi<br>
classes (no need for folks to browse it)<br>
componentutils<br>

So I'm with you on administrator and adminapi. I mention classes and componentutils because there is no need for them to be visible anyway. But you can probablyg et away with just locking down the first two.

Any comments on this?