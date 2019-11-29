---
layout: post
title: "Keyboard Tip for the iOS Simulator"
date: "2015-06-24T15:01:53+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2015/06/24/keyboard-tip-for-the-ios-simulator
guid: 6316
---

I've been using the iOS Simulator for a few years now and never noticed this trick before. Thanks go to <a href="http://blog.devgeeks.org/">Tommy-Carlos Williams</a> for teaching me this. Have you ever noticed that sometimes when you type in a form field inside the simulator that the virtual keyboard doesn't slide up? For example:

<!--more-->

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/iOS-Simulator-Screen-Shot-Jun-24-2015-2.53.18-PM.png" alt="iOS Simulator Screen Shot Jun 24, 2015, 2.53.18 PM" width="337" height="600" class="aligncenter size-full wp-image-6317" />

Notice the cursor in the field? I can type there, but the virtual keyboard isn't up. It just so happened I <i>wanted</i> the virtual keyboard to show up. I was testing a bug in an app where users hitting the Go button were ending up opening an action that was tied to another button. In order to actually get that keyboard, you need disable "Connect Hardware Keyboard" in the Hardware menu:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/Screen_Shot_2015-06-24_at_2_55_27_PM.png" alt="Screen_Shot_2015-06-24_at_2_55_27_PM" width="582" height="315" class="aligncenter size-full wp-image-6318" />

Doing so gets you the virtual keyboard - and obviously requires you to use it:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/iOS-Simulator-Screen-Shot-Jun-24-2015-2.56.51-PM.png" alt="iOS Simulator Screen Shot Jun 24, 2015, 2.56.51 PM" width="337" height="600" class="aligncenter size-full wp-image-6319" />

I'll add that I've seen some gremlins with this. Just a few minutes ago I was testing with a web page search form and it consistently let me type with the keyboard <strong>and</strong> showed a virtual keyboard, but now I can't reproduce it so... yeah... gremlins. Any way, hope this tip helps.