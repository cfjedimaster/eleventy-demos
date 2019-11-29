---
layout: post
title: "Did You Know: Searching for PhoneGap/Cordova Plugins"
date: "2014-01-03T10:01:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2014/01/03/Did-You-Know-Searching-for-PhoneGapCordova-Plugins
guid: 5118
---

<p>
I discovered this yesterday which means it has probably been around forever and I'm the last one to get a clue. As you should (hopefully) know by now, PhoneGap 3.0 majorly changed how you use core features. (I discussed these changes in detail here: <a href="http://www.raymondcamden.com/index.cfm/2013/7/19/PhoneGap-30-Released--Things-You-Should-Know">PhoneGap 3 Released - Things You Should Know</a>.) The biggest change that will trip developers over (and yes, it still trips me up) is the requirement to add plugins for core features like geolocation, camera support, etc.
</p>
<!--more-->
<p>
Luckily it takes all of two seconds to do this. The issue I run into myself is that I can never remember the names of the plugins. They all have fairly simple names, like org.apache.cordova.camera for camera. But then you run into things like this: org.apache.cordova.device-motion. What feature is that?  The accelerometer. Makes sense - but I would have guessed org.apache.cordova.accelerometer.
</p>

<p>
What I normally do is just pop open a tab to <a href="http://docs.cordova.io">docs.cordova.io</a>, find my feature, and copy out the name. The docs put the plugin name right up there at the top so it is easy to find. As simple as that is, I just yesterday discovered that the Cordova CLI supports searching for plugins. For example:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_1_3_14__10_16_AM.png" />
</p>

<p>
This searches the entire set of plugins at <a href="http://plugins.cordova.io">Cordova Plugins</a> so it includes more than just the "core" set. If you want to list all the core plugins, you can try searching for org.apache.cordova, but this includes a few additional ones as well.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_1_3_14__10_18_AM.png" />
</p>

<p>
Unfortunately this isn't perfect. Using my accelerometer example above it won't actually find a match if you try searching for "accel". I'm going to ask around to see if there is a way to flesh out the descriptions for plugins so that searches could be a bit more useful. 
</p>

<p>
p.s. I should point out that there is another PhoneGap plugin registry as well - but I'll cover that later today.
</p>