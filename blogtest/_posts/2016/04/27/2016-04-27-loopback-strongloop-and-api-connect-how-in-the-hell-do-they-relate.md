---
layout: post
title: "LoopBack, StrongLoop, and API Connect - how in the heck do they relate?"
date: "2016-04-27T13:43:00-07:00"
categories: [development]
tags: [strongloop]
banner_image: /images/banners/loopbak.jpg
permalink: /2016/04/27/loopback-strongloop-and-api-connect-how-in-the-heck-do-they-relate
---

So first and foremost - let me start off by being explicitly clear that what follows is 100{% raw %}% not IBM-approved material at all. Yeah, I work for IBM, but I think folks know that when I blog, I have my own voice and my own way of saying things. I'll include links to all the <strike>boring</strike>official resources for folks who want that side of the story, but what follows is 100%{% endraw %} my own words only.

<!--more-->

So earlier today I was sent the following tweet:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/raymondcamden">@raymondcamden</a> what is diff between loopback &amp; API connect? SL docs say use apiconnect but loopback.io says use Strongloop</p>&mdash; Justin James (@digitaldrummerj) <a href="https://twitter.com/digitaldrummerj/status/725367106892488704">April 27, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Justin is referring to a product, API Connect, that I haven't yet discussed on the blog. It is a big deal, and I've been trying to get up to speed on it (along with LoopBack and StrongLoop), which is why I haven't blogged on it yet. If you haven't heard about it, well, that's part of my job, and you will be seeing me present on it and blog about it more (both here and on the [StrongBlog](https://strongloop.com/strongblog/). But for now, let me give you some context to how these three products relate.

![LoopBack](https://static.raymondcamden.com/images/2016/04/loopback_logo.jpg)

I've blogged (and presented) on LoopBack a bunch of times now. LoopBack is an open source Node.js/Express-based framework for rapidly building APIs. What that means is I can quickly create a REST-based API based on a model, where a model represents the content I'm working with. If I'm a cat web site, I can quickly create a full API around getting cat data. We're talking five minutes from concept to an API. That's super powerful.

Of course, in the real world, you need custom business logic, security, etc. LoopBack supports all of that. 

In a nutshell though - LoopBack is what lets you build the API. It's open source and 100% free.

More details at [http://loopback.io](http://loopback.io).

![StrongLoop](https://static.raymondcamden.com/images/2016/04/strongLoop_logo.png)

"StrongLoop" by itself means the company that IBM consumed a few months ago. Many people, including myself, use StrongLoop as a way to referring to the 'product' but technically the product name is "StrongLoop Node.js API Platform". That's a mouthful, hence people simply saying "StrongLoop" generally. 

StrongLoop is a commercial product that uses LoopBack. It has:

* A visual composer for working with LoopBack models and datasources. LoopBack's CLI can do the same, and you can just edit JSON files, but the web-based version may be simpler for folks.
* A process manager and deployment system that lets you push out your application to a production server as well as handling clusters.
* Metrics, tracing, and profiling services for debugging and performance tuning your application.

So basically - you built your cool LoopBack application, but now you want support in terms of ensuring it can handle load and for deploying to production. This is where you pay money for the added benefit. You *can* use StrongLoop for free, but only the visual composer and process manager features.

Not to be confusing, but to work with LoopBack, you actually npm install strongloop. This gives you the `slc` command line that you use when working with LoopBack apps. If you watch my videos, you'll see me use it. To be clear, you do *not* need to use this CLI. You can add the right crap to package.json yourself, but the CLI is what you want to use, and it is free too.

Ok, so technically you can find out more at [https://strongloop.com/](https://strongloop.com/), but here's where things get a bit weird. You can't buy StrongLoop licenses anymore because the future is API Connect. On to the future!

![API Connect](https://static.raymondcamden.com/images/2016/04/apiconnect_logo.png)

API Connect, sorry, *IBM* API Connect, is a new offering, but the evolution of an older one called IBM API Management. So API Connect (APIC) is version 5, even though it is new (well mostly new).

This will be a gross oversimplification, but APIC can serve as the way you bring a LoopBack-created API from your local machine into the real world. What do I mean?

* With APIC, I can take an API I made with LoopBack and require you to get a key before using it - like most APIs out there today. With APIC, the entire "register and here is your damn key" aspect is baked in. Done.
* With that same key, I can also say that you get X hits per day. Or maybe Y. Whatever.
* How do I know I should give you X? With APIC, I can look at stats and see which APIs are being used over others. 
* Updating your APIs? You can group together your current APIs as v1 and create a new grouping for v2. 
* LoopBack has a nice 'explorer' which provides documentation and testing. APIC comes with the ability to create an entire "Developer Portal" out of the box.
* Oh yeah, it can do Java and SOAP too, but, ugh, gross.

So as I said - I see LoopBack as being awesome for rapid prototyping. It does more, but, let's just go with that. I look at APIC as the "lets release this to the world" part. And yes, this part costs money (although you can test it and run it locally, forever, *for free*), but if you want to build all that yourself and just use LoopBack, be my guest.

You can find out more at [https://developer.ibm.com/apiconnect/](https://developer.ibm.com/apiconnect/).

So... here's where things get a bit weird (again). StrongLoop is going to 'merge' into APIC. For example, you can visually build APIs with APIC right now. The profiling/debugging stuff is *not* available. We (we being IBM, I said I don't speak for IBM but let that go for a moment) haven't announced yet what the formal plan for those parts are yet.

Roundup (tl;dr)
---

LoopBack is an open source framework for building APIs. StrongLoop ARC adds performance/deployment tools on top. APIC adds the ability to manage and secure APIs.

I'm leaving a *lot* out, but that's the elevator pitch. Got questions?