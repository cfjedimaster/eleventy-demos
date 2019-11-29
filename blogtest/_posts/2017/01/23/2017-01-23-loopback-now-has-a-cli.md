---
layout: post
title: "LoopBack now has a CLI!"
date: "2017-01-23T09:39:00-07:00"
categories: [javascript]
tags: [loopback]
banner_image: 
permalink: /2017/01/23/loopback-now-has-a-cli
---

The title pretty much says it all. For some time now, you used <code>slc</code> to work with LoopBack apps. 
 <code>slc</code> came from StrongLoop and did quite a few other things on top of working with LoopBack apps, 
 but now that we recommend folks make use of [LoopBack](http://loopback.io/) and [API Connect](https://developer.ibm.com/apiconnect/), having
 a CLI focused on <i>just</i> LoopBack is a big plus. 

 To install, simply run:

 <code>npm install -g loopback-cli</code>

 This will give you the <code>lb</code> command, *which is ONE CHARACTER LESS THAN SLC!* (Ok, maybe I'm a bit too
 excited about that. ;)

 You can than either use <code>lb -l</code> to list all available commands or use <code>lb -h</code> for a more 
 traditional help display. <code>lb</code> by itself will kick off the process to scaffold a new LoopBack application.

![Boring Screen Shot](https://static.raymondcamden.com/images/2017/1/lbcli.png)

For the most part, everything is just the same in terms of how you work with LoopBack apps, but now you've got
a CLI focused on *just* LoopBack work, which I think is a great thing. If video's are your thing, here's a video
of me demonstrating the CLI in action:

<iframe width="560" height="315" src="https://www.youtube.com/embed/qGu1S8M73m0?rel=0" frameborder="0" allowfullscreen></iframe>

Want to know more? You can read the [official announcement blog post](https://strongloop.com/strongblog/announcing-the-loopback-cli/) for more about
IBM's commitment to LoopBack. You can also follow the [GitHub repo](https://github.com/strongloop/loopback-cli) for the CLI
to add suggestions or report bugs. Enjoy!