---
layout: post
title: "Ask a Jedi: Caching CFC Instances"
date: "2005-11-08T09:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/08/Ask-a-Jedi-Caching-CFC-Instances
guid: 904
---

Sam asked:

<blockquote>
Ray, In your blog software you put certain cfc's in the application scope.  I've tried this in some of my code but noticed no performance benefit suggesting that I did something wrong and/or did not understand what to put in application scope.  Can you explain?
</blockquote>

So - first thing's first. I've said it before and I'll say it again. I like my blogware - I think it is "good", but I do not think it is 100% best practices. Of course, nothing is perfect, but I do think that if I were starting from scratch, I would do things differently. I would most likely use Model-Glue and would definitely not have one giant Uber-CFC.

Speaking of the Uber-CFC, if you look at blog.cfc, it is currently close to 1500 lines. That is pretty significant and would definitely lead to a performance benefit if cached. If your CFC is much smaller, though, you won't see a lot of benefit by caching it in the application scope.

However - that being said - I kinda feel like if something only needs to be created one - why create it again? Consider the simple application variable. I typically have a variable for my datasource name. That is just a string. If I were to stop using the Application scope and just set it in the request scope, my application would probably only be about 0.0001% slower, if that. However - there just isn't a need to keep setting it on every request. 

Something else to keep in mind - my blog.cfc started off small and slowly grew into the monster it is today. Because I started off caching it, I didn't have to go back and change things around later on when blog.cfc went off the deep end size-wise.