---
layout: post
title: "iOS Simulator not refreshing with Cordova (PhoneGap)? Read this."
date: "2014-06-20T12:06:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2014/06/20/iOS-Simulator-not-refreshing-with-Cordova-PhoneGap-Read-this
guid: 5249
---

<p>
About a month or two ago I noticed something odd with my Cordova tests. I'd fire off a call to the iOS simulator by doing <code>cordova emulate ios</code>. The first time, it worked fine. But as I edited I noticed something odd. Subsequent calls to the emulator would end up in a blank screen in the emulator. If I watched carefully, I'd see my app load for a split second before going black.
</p>
<!--more-->
<p>
Apparently, this is a bug with ios-sim, the command line tool used to talk to the simulator. If you know to check out the <a href="https://github.com/phonegap/ios-sim">GitHub repo</a> for it you will see a tip suggesting this command to fix it: <code>killall launchd_sim</code>
</p>

<p>
This works like a charm, and since I normally just "edit, alt-tab to terminal, click up, enter" in my dev cycle, I just switched my command to this: <code>killall launchd_sim && cordova emulate ios</code>
</p>