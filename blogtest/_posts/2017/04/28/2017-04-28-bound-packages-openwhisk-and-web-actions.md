---
layout: post
title: "Bound Packages, OpenWhisk, and Web Actions"
date: "2017-04-28T09:08:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/04/28/bound-packages-openwhisk-and-web-actions
---

Hey folks, this is just a warning to other users in case they run into the same issue I did. As you (may) know, OpenWhisk supports the idea of packages. Packages let you organize actions into a cohesive unit, much like packages in other languages/platforms. Packages can also have default parameters that apply to every action in the package.

Packages can also be shared, which makes them callable by other users. And even cool, you can then "bind" a package locally to yourself. Why would you do this? First, it would let you make an simpler alias of someone else's package. Second, and I think this is the big part, it lets you specify your own default parameters.

So I've got a package for ElasticSearch (you can see the code here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/elasticsearch). I put this in a package called, wait for it, `elasticsearch`, and I then shared it publicly. 

For my use, I bound it as `myelasticsearch` and set default parameters for my ElasticSearch authentication. Ok, so here's where things went a bit heywire. I could easily test `myelasticsearch/search` via my authenticated CLI calls, but I wanted to expose it as an anonymous API. 

Turns out - you can't. The basic issue is that my bound copy is - essentially - an alias. While I'm allowed to overwrite default parameters, I'm not allowed to overrule the "Is this a web action" setting. I think that makes sense, but I've forgotten this twice now so that's part of the reason I'm blogging it.

So what's the fix? [Rodric Rabbah](https://ibm.biz/rrabbah) (fellow IBMer) suggested a simple fix - making a sequence. A sequence is a chain of actions that acts like one action. I can then web enable *that* one. I could actually make a new sequence of one action and web enable it, but for the specific demo I'm doing (hopefully out on a blog post today), there is a bit of stuff I can do there to make using the API simple.

Let me know in the comments below if any of this doesn't make sense!