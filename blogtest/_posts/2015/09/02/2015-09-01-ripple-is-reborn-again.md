---
layout: post
title: "Ripple is Reborn (Again!)"
date: "2015-09-02T08:54:58+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2015/09/02/ripple-is-reborn-again
guid: 6718
---

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/ripple-logo-square.png" alt="ripple-logo-square" width="150" height="150" class="alignleft size-full wp-image-6719" />  Almost two years ago I blogged (<a href="http://www.raymondcamden.com/2013/11/05/Ripple-is-Reborn">Ripple is Reborn</a>) about the relaunch of the Ripple emulator. Ripple lets you test Apache Cordova applications in the browser. It mocks many of the built in plugins (device, geolocation, accelerometer and more) and can be a good way of debugging your hybrid mobile applications. Unfortunately, about a year or so ago something on the Cordova side changed that had a negative impact on Ripple. Whenever I would use it, I'd get an infinite loop in the console that would effectively kill the browser tab. 

<!--more-->

I pretty much gave up on Ripple, but still paid attention to the Apache project (<a href="http://ripple.incubator.apache.org/">Apache Ripple</a>) to keep up to date with its progress. They recently had an update so I thought I'd check it out again. I'm happy to say it is working again! In general, it just plain works. I still see the issue where it defaults to Android and if you only have iOS you'll need to switch platforms to not get an error initially. I do <i>not</i> see the issue where I had to rerun the emulation CLI to refresh the code which is really freaking nice. Note that... oddly... ctrl+r did not refresh the view but hitting the reload icon in the browser did work. 

As a reminder, if you have the old Chrome extension, kill it. Ripple does NOT use a browser extension anymore - it is entirely setup via the CLI. You can find out more, and how to install it, at the site: <a href="http://ripple.incubator.apache.org/">http://ripple.incubator.apache.org/</a>.

p.s. There is a new Twitter account for the product: <a href="https://twitter.com/apacheripple">@ApacheRipple</a>.