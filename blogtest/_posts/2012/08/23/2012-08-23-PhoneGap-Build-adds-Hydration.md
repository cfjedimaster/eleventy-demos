---
layout: post
title: "PhoneGap Build adds Hydration"
date: "2012-08-23T18:08:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2012/08/23/PhoneGap-Build-adds-Hydration
guid: 4713
---

After getting a snazzy UI upgrade a few weeks ago, <a href="http://build.phonegap.com">PhoneGap Build</a> today released their new Hydration feature. You can read more about it at the <a href="https://build.phonegap.com/docs/hydration">docs</a>, but essentially Hydration makes rebuilding much quicker and makes it easier to notify testers of new builds. Let's look at a quick example.
<!--more-->
Hydration is enabled/disabled in the settings area of your app. It can be used with old or new apps but only supports PhoneGap 1.8 and higher and just iOS and Android.

<img src="https://static.raymondcamden.com/images/ScreenClip110.png" />

I created a quick HTML file, saved it as index.html to my desktop, and uploaded it to Build. I opened up Build on my phone, navigated to my app, and clicked the Android icon to download it.

<img src="https://static.raymondcamden.com/images/device-2012-08-23-165209.png" />

After installing the application, I told my device to open it. Immediately you will notice a different loading experience:

<img src="https://static.raymondcamden.com/images/device-2012-08-23-165319.png" />

On the first load, it will prompt you to reload. (Technically this is the very first load, so it isn't really an update per se, but you get the idea.)

<img src="https://static.raymondcamden.com/images/device-2012-08-23-165327.png" />

The user has the option to update and restart or ignore. Once you update to the latest, the application loads as normal:

<img src="https://static.raymondcamden.com/images/device-2012-08-23-165826.png" />

Perfect. Let's say I edit the HTML a bit (it really needs something more). I upload the file, close the app and restart it, and it recognized a new build immediately. This was approximately 5 seconds after I hit upload. I'm not sure you can count on it <i>always</i> being the fast, but, I'm an evangelist so I'll go ahead and promise it! 

The point is - if you have folks testing - they can get the new updates quicker and without having to go to Build or download an APK. It recognizes the new version exists and does everything for you. Awesome!

<img src="https://static.raymondcamden.com/images/device-2012-08-23-170206.png" />

And voila - my new version is here with the one thing it was missing...


<img src="https://static.raymondcamden.com/images/device-2012-08-23-170248.png" />