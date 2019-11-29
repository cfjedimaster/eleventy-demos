---
layout: post
title: "BlogCFC Update"
date: "2006-01-15T13:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/15/BlogCFC-Update
guid: 1028
---

This is a very minor update - but important for those suffering with trackback spam. Last week, for about three days in a row, I woke up with between 60 to 90 Tb spams. Turns out there was only 2-3 unique TBs, but posted to about 30 different blog entries. I had a "Duh" moment and realized a simple way to stop that. A TB should point to a unique entry and have a unique remote blog/url/title. As I said - duh. When I added this change, the next day I still had TB spam, but only 2-3 unique ones. Since then, the amount of TB spam I've gotten seems to have slown down. I'd like to think the spammers realize now they can't "cluster bomb" my blog, but to be honest I don't think they are smart enough. (I also updated the blog TB spam keyword list.)

Along with this update - I've made another small change. Whenever you post an entry, we do reload() on the opener. If you had just logged in, this means you get that stupid warning about reposting form data. (Why does Firefox think this is so darn important? Why not let me turn that off?) I've changed the logic now to simply reload with a random url variable at the end. I've been wanting to fix that since version 1. 

As always, you can download the updates from the <a href="http://ray.camdenfamily.com/projects/blogcfc">project page</a>.