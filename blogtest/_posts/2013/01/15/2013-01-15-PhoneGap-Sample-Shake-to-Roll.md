---
layout: post
title: "PhoneGap Sample - Shake to Roll"
date: "2013-01-15T22:01:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2013/01/15/PhoneGap-Sample-Shake-to-Roll
guid: 4830
---

Sorry for being so quiet lately. I've got three presentations this week and two brand new ones in two weeks. Mentally - it has been killing me. As with all things - it will pass. (And I think I'm building some good new presentations as well!) In the meantime, I thought I'd share a simple PhoneGap application I built for my four-hour lab in Ohio a few days back. 

The idea behind the application was to demonstrate the <a href="http://docs.phonegap.com/en/2.3.0/cordova_accelerometer_accelerometer.md.html#Accelerometer">Accelerometer API</a>. This returns movement information along three different axes. 

By itself, the API is easy enough to use. What I was having difficulty with was coming up with a practical example of it. I thought I'd create a simple application that mimicked rolling a die. I'd start off by selecting a random number between one and six. I'd display this on the screen like so.
 
<img src="https://static.raymondcamden.com/images/screenshot55.png" />

(What you're seeing here is the Ripple emulator. I plan on talking about this in a few days.) 

The code for picking and displaying a random number was trivial.

<script src="https://gist.github.com/4544398.js"></script>

What was more difficult was figuring out how to respond to a shake. I mean, seriously, what <i>is</i> a shake, in code terms? 

I did some Googling and discovered that most people simply tracked the X/Y/Z values and then compared them to historical values. I came up with this solution (which is based on what I saw so this isn't some brilliant discovery of mine). 

<script src="https://gist.github.com/4544413.js"></script>

I then used the Ripple emulator to test, and slowly tweaked the numbers until it "felt" right to me. You can see the result below.

<iframe width="640" height="480" src="http://www.youtube.com/embed/tQifkWD7Bk8?rel=0" frameborder="0" allowfullscreen></iframe>

For the full source code (there really isn't much to it), you can see the code in the GitHub repo for the presentation: <a href="https://github.com/cfjedimaster/DevelopingMobileAppsWithPhoneGap/tree/master/labs/6_accelerometer">DevelopingMobileAppsWithPhoneGap/tree/master/labs/6_accelerometer</a>