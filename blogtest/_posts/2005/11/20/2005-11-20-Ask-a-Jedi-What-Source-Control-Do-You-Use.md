---
layout: post
title: "Ask a Jedi: What Source Control Do You Use?"
date: "2005-11-20T21:11:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2005/11/20/Ask-a-Jedi-What-Source-Control-Do-You-Use
guid: 925
---

A reader asks:

<blockquote>
Ray, I assume you use some type of versioning / revision control system.  What do you use?  I have tried Subversion (which felt very cumbersome) and Eclipse's automatic change log (which is perfect, but I don't think it works for multiple people)  Can you enlighten us as to what you use and why?
</blockquote>

There are a couple of answers to this. As a 'corporate' decision, <a href="http://www.mindseye.com">Mindseye</a> uses Microsoft Visual Source Safe. I've used that for my personal projects in the past and it is very, very easy. However, it's also hasn't been updated in years (although I believe the new Visual Studio.Net has an updated version). I've also heard of people having problems with VSS data simply blowing up and not being restorable. At Mindseye, we haven't seen that. Another drawback to VSS is that it doesn't work over the internet unless use a mapped drive over VPN. However - that can be extremely slow. To get around that, we use <a href="http://www.sourcegear.com/sos/index.html">SourceOffSite</a> by SourceGear. This is basically a VSS wrapper for the net. It works very well. In fact, I typically tell the engineers in my department to use SOS even when they are in the office. 

So - that's work. At home, I use Subversion and <a href="http://tortoisesvn.tigris.org">TortoiseSVN</a>. TortoiseSVN simply adds Explorer integration with Subversion. I will agree with you that SVN isn't the simplest thing to use - at first. Give it some time. To be honest, I've barely scratched the surface of SVN. I simply use it to version my files. It is also handy to help me keep track of what files have changed in my projects. I'll be honest with you. I've never read much of the documentation for SVN. I use the Quick Start guide to setup projects since I always forget the exact process. 

I also use the Eclipse built-in versioning system. It is something I would have loved to have seen in the late-great HomeSite+.