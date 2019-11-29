---
layout: post
title: "Apache Cordova 3.3 and Remote Debugging for Android"
date: "2014-01-02T14:01:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2014/01/02/Apache-Cordova-33-and-Remote-Debugging-for-Android
guid: 5117
---

<p>
A few weeks ago Apache Cordova 3.3.0 was released (you can read the details <a href="http://cordova.apache.org/announcements/2013/12/16/cordova-330.html">here</a>) and one of the things that caught my eye was this:
</p>
<!--more-->
<blockquote>
<a href="https://issues.apache.org/jira/browse/CB-5487">CB-5487</a> Enable Remote Debugging when your Android app is debuggable.
</blockquote>

<p>
Chrome Remote Debugging is a cool feature, but so far it had not been available with PhoneGap apps. I can confirm that with a Cordova 3.3.0 project, this works great. I made a virgin project, launched it (in the emulator), and it showed up right away as a debuggable device. (Note that your emulator has to be using Android 4.4 or higher.)
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_1_2_14__1_25_PM.png" />
</p>

<p>
And just to prove it works, I went into the DOM, modified it, and it showed up live in the app itself.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2014-01-02 at 1.24.35 PM.png" />
</p>