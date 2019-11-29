---
layout: post
title: "LoopBack 3.0 Released"
date: "2016-12-21T09:55:00-07:00"
categories: [javascript]
tags: [nodejs,loopback]
banner_image: /images/banners/loopbak.jpg
permalink: /2016/12/21/loopback-30-released
---

Christmas arrived early for [LoopBack](http://loopback.io/) developers - today LoopBack 3.0 was released. To update, go into terminal and run the following:

	npm install -g strongloop

Then create a new application. Notice that 3.x is now marked as current, but isn't the default. I'm filing a bug report for that now.

![Screen shot](https://static.raymondcamden.com/images/2016/12/lb31.png )

So what changed? You can read a complete list of release notes here: [3.0 Release Notes](http://loopback.io/doc/en/lb3/3.0-Release-Notes.html)

Note that as of *right now*, the notes say 3.0 is still in pre-release, this should be removed really soon. 

To me, two changes stand out as particularly important. The first is ["Cleanup in conversion and coercion of input arguments"](http://loopback.io/doc/en/lb3/3.0-Release-Notes.html#cleanup-in-conversion-and-coercion-of-input-arguments) and the second is ["CORS is no longer enabled"](http://loopback.io/doc/en/lb3/3.0-Release-Notes.html#cors-is-no-longer-enabled). Both of these changes help lock down and secure LoopBack APIs a bit more and feel like really smart ideas. 

Another change I like revolve around [strict mode](http://loopback.io/doc/en/lb3/3.0-Release-Notes.html#settings-strict-validate-and-strict-throw-were-removed). I just discovered recently that by default, you can pass additional properties to a model and LoopBack will accept them. By using strict:true, you can disable this. The change in 3.0 (I liked to it at the beginning of the paragraph) just simplifies the new behavior.

And finally - a new CLI focused *just* on LoopBack is in the works. I'll post more when it gets closer to release!