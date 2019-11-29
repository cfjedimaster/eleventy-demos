---
layout: post
title: "Ask a Jedi: MVC too much work?"
date: "2008-03-26T12:03:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2008/03/26/Ask-a-Jedi-MVC-too-much-work
guid: 2728
---

Darren asks:

<blockquote>
<p>
I've been doing some reading into design patterns specifically mvc, it all started as I got into flex, it all seems a bit scary as well , i've never thought about it for coldfusion and as I come from a design/flash background i've never had any formal programming training, i'm just self taught. I guess i can see the benefits of code reuse but it seems alot of work for normal websites, where do you sit on the issue, do you use design patterns at all. Do you think its worth learning, most of the time I work on my own or with one other person so I don't have large development teams to worry about. 
</p>
</blockquote>

I don't know Darren - can't we discuss something less controversial like politics or religion? ;) 

This comes up from time to time in discussions of using a framework. Obviously if you are building a guest book (remember those?) a framework may be overkill. But one thing to keep in mind is that - at least in my experience - very few projects move from complexity to simplicity. Most projects start simple and grow in complexity. With that in mind - I tend to always use a framework like <a href="http://www.model-glue.com">Model-Glue</a> to help me manage the complexity.

I'm very much pro-framework for this reason alone. Having the framework help me organize and set up my application means I'm thinking less about crap and more about business logic. 

So to focus on 'is it worth it for normal web sites', I'd say absolutely yes. Is it worth it for a 2 page application on a brochure-ware site? Nope.