---
layout: post
title: "Regex Help"
date: "2005-12-17T23:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/17/Regex-Help
guid: 977
---

So, I answer a lot of questions here - can I abuse the relationship with you readers and ask for your help? I finally have some folks using <a href="http://ray.camdenfamily.com/projects/canvas">Canvas</a>, my ColdFusion Wiki, and because of this, bugs are cropping up. 

The main bug involves the fact that some Wiki commands, like +...+ for bold, intefere with other commands, like the URL generator. I use [[url]] to create URLs, but if you do [[http://www.cnn.com/foo_mon]] then the parser will find the _ in the URL. If another _ exists later on, then a match is found. 

What I need is to find matches that are not inside HTML. Apparently this is possible using negative lookbehind, which ColdFusion doesn't support. 

Does anyone have any bright ideas? I've noticed other Wikis seem to get around this by using tokens that can't appear in URLs. 

The other problem is that you can't use + and _ in normal text either. So this  "5+5 = 2" would be a problem. I'm thinking for that I may just ask people to escape, i.e., use 5++5=2. That seem ok to folks?