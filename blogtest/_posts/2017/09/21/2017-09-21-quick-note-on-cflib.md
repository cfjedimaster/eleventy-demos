---
layout: post
title: "Quick Note on CFLib"
date: "2017-09-21T07:02:00-07:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2017/09/21/quick-note-on-cflib
---

I haven't blogged about ColdFusion, or [CFLib](http://cflib.org/) in a while, but I wanted to give folks a quick update. I migrated CFLib to Node, and then static, years ago. Due to me not really working with ColdFusion anymore and a general slowdown in submissions, I thought it was best to convert it to a static site. 

My intent wasn't to "retire" the site of course. While submissions slowed down, they still trickled in and folks found bugs from time to time. Unfortunately, when I setup the site to be static, the engine I chose ([Harp](http://harpjs.com/)) kind of limited how I designed the setup. The "data" for the site is one large JSON file. That includes all the code for each UDF escaped so it can be properly stored in JSON. 

At the time I thought it wasn't a big deal. But it's made every update, tweak, etc a real pain in the rear. And as this site isn't my number one priority now, I've left some things slide a bit. 

Earlier this week I was thinking about this and did some quick tests with [Jekyll](https://jekyllrb.com/), my favorite static site generator. I've found that I can build CFLib in it and it should be a lot easier to do edits and add new UDFs. I'll still probably rely on GitHub and PRs for stuff, but it will be a heck of a lot easier for folks to help out.

So - I don't have an ETA for this conversion. I've got a busy Fall coming up. But as things usually slow down after Thanksgiving, I'll most likely be able to get it out the door before Christmas. 

Thank you for your patience. :)