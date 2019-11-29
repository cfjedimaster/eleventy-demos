---
layout: post
title: "PhoneGap 1.9 Released"
date: "2012-06-29T23:06:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2012/06/29/PhoneGap-19-Released
guid: 4662
---

A few minutes ago (although according to the blog post this happened tomorrow), <a href="http://phonegap.com/2012/06/30/phonegap-1-9-0-released/">PhoneGap 1.9.0</a> was released. The post details the fixes and updates and I encourage you to read it for the full list. One thing in particular stood out for me - build scripts. Back when I used Eclipse, I had an additional plugin that would handle the proper inclusion of PhoneGap files and mods in a stock Android application. When I stopped using Eclipse, I resorted to the manual process, which isn't difficult but I had hoped someone would get around to creating a simple script to handle it for me. And the PhoneGap guys did. They rock. 

Once you download the bits, you can find a <b>create</b> script for Android, iOS, and Blackberry. I tested the Android one just now. After first ensuring I had the Android SDK in my path, I simply ran the script and it generated a complete Android+PhoneGap project. 

<img src="https://static.raymondcamden.com/images/screenshot10.png" />

If you don't use any options it just uses a set of defaults but you can tweak the folder where the code is created, the package name for the application, and the activity. The generated HTML includes code that demonstrates a variety of PhoneGap APIs, including device info, accelerometer, geolocation, and others.

Once generated, you can also quickly send it to your device or your emulator with another few command line calls. 

For details, look in &lt;extracted zip&gt;/lib/android/README.md.