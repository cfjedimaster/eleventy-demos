---
layout: post
title: "Quick Notes on OpenWhisk Packages and Defaults"
date: "2017-04-03T08:18:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/04/03/quick-notes-on-openwhisk-packages-and-defaults
---

This post is just to clear up some things that confused me. Everything here is covered in the docs (mostly, although I think bits aren't 100% clear) but I wanted to get this down on (virtual) paper to help me remember.

I am currently working on a set of OpenWhisk actions to work with [Elastic Search](https://www.elastic.co/). I haven't done anything with full text search since I last worked with Lucene and ColdFusion. It's something I always thought was kind of neat, but after moving to Node, I haven't really thought of it. My coworker, [Erin](http://erinmckean.com/), has been singing the praises of Elastic for a while now and this weekend I decided to look into it. 

It's a bit rough to get started since everything requires a REST API call, but I used Postman to make that a bit easier and once I got started, I was pretty impressed. 

Anyway, as I said, I'm working on some actions to work with an Elastic Search instance. You can see the current work here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/elasticsearch

Since there is a great npm package for Elastic Search, my actions are pretty trivial. And hey - that's a great thing. :)

My plan is to share the package once I get it fleshed out a bit more. Currently it only supports adding/updating content and search. But I was concerned about something. I wanted to set some parameters at the package level (the auth info) but I was concerned about what would happen when I shared the package. The docs aren't terribly clear on the point, but here is how this works.

1) If you set default parameters for a package and share it, then those defaults are shared too. I think that's fair and expected.

2) If you bind a package, you can set your own default params. I didn't even know about binding (I swear I read the docs), but you can almost think of binding like creating an alias. That's kinda cool because it lets you convert a long package name to something shorter.

3) And yes, you can bind your own packages to yourself. So this lets me test my Elastic Search package and use my authentication information on the bound package versus the 'real' one.

As an aside, when you run <code>wsk package list</code>, it does *not* flag a bound package versus a non-bound one. Here is an example:

![Screen shot](https://static.raymondcamden.com/images/2017/4/wskpack1.png)

In the shot above, `myelasticsearch` is the bound version of `elasticsearch`. If you get the package summary, you still can't tell it's bound. The only way to know is if you get the entire package, and look at the big JSON package returned. On top, you'll see an annotation about it:

![Screen shot](https://static.raymondcamden.com/images/2017/4/wskpack2.png)

In the screen shot above you can see it listed twice actually. Also note the default params I was able to set for it. 

That's it - I hope this makes sense!