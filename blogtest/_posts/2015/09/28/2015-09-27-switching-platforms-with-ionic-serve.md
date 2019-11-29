---
layout: post
title: "Switching platforms with Ionic Serve"
date: "2015-09-28T05:36:50+06:00"
categories: [development,mobile]
tags: [ionic]
banner_image: 
permalink: /2015/09/28/switching-platforms-with-ionic-serve
guid: 6821
---

Yesterday a question came up in an Ionic session I was attending involving <code>ionic serve</code> and platforms. When you use <code>ionic serve</code>, it will fire up the project in your Chrome browser. You may not be aware of it, but by default it uses the iOS CSS styles. This becomes more obvious when you use the lab option. Here is the tabs template by itself:

<!--more-->

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/shot14.png" alt="shot1" width="529" height="750" class="aligncenter size-full wp-image-6823 imgborder" />

And here it is with the lab option - you can now see that the iOS one was used by default.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/shot22.png" alt="shot2" width="750" height="670" class="aligncenter size-full wp-image-6824" />

Ok, so the question was - how do you ionic serve to just Android? Turns out, you can use the platform attribute with ionic serve. This was added (<a href="https://github.com/driftyco/ionic-cli/issues/314">[Request] ionic serve --platform="android"</a>) back in May. Simply do<code> ionic serve --platform android</code>:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/shot3.png" alt="shot3" width="396" height="750" class="aligncenter size-full wp-image-6825 imgborder" />

In case you're curious, this works without needing to actually add the Android platform. (And on the flip side, if you don't have iOS, the default behavior for ionic serve is to still show the iOS CSS.)