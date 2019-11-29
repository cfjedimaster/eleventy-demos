---
layout: post
title: "Note about PhoneGap Build and Splash Screens"
date: "2013-04-23T13:04:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2013/04/23/Note-about-PhoneGap-Build-and-Splash-Screens
guid: 4917
---

I'm currently working on my MAX <a href="https://bit.ly/Wc52VD">Advanced PhoneGap Build</a> presentation (wait, scratch that, of course I'm done already, I mean, who waits to the last minute???) and ran into an interesting issue. Using a splash screen is rather easy via the PhoneGap Build <a href="https://build.phonegap.com/docs/config-xml">config.xml</a> file.
<!--more-->
To test this feature, I used <a href="http://www.placekitten.com">Placekitten.com</a> to quickly create an image sizes 320x480. PhoneGap Build supports multiple splash screens of multiple sizes and densities, but I wanted to see how well a default splash screen would work. I dropped the kitten in my folder and added this to config.xml:

&lt;gap:splash src="splash.png" /&gt;

I zipped up my folder, uploaded to PGB, and everything worked fine. I noticed, though, that my splash screen only lasted for about a second. I did some digging and found that you can disable the automatic hide of the splash screen by doing this:

&lt;preference name="auto-hide-splash-screen" value="false" /&gt;

I then wrote a bit of JavaScript that made use of the PhoneGap Splash Screen API:

<script src="https://gist.github.com/cfjedimaster/5445504.js"></script>

In theory, that should be it, but I noticed something odd. I launched my app, and then saw this:

<img src="https://static.raymondcamden.com/images/2013-04-23 11.43.15.png" />

What the heck? At first I thought I had broken something, but then I noticed the image went away after 5 seconds. I then realized what my issue was... size. 

When using the a default splash screen, PhoneGap is able to size it correctly for any device (afaik), but if you keep the splash screen around, it then reverts to the proper size for the device. In my case, I was testing on an iPhone 5. So I created a new image sized 640 by 1136 and added this to my config.xml:

&lt;gap:splash src="retina.png" width="640" height="1136" /&gt;

And it worked perfectly. You can see via this exciting YouTube video:

<object width="425" height="344"><param name="movie" value="http://www.youtube.com/v/KQpbMmS9JW8&hl=en&fs=1"></param><param name="allowFullScreen" value="true"></param><embed src="http://www.youtube.com/v/KQpbMmS9JW8&hl=en&fs=1" type="application/x-shockwave-flash" allowfullscreen="true" width="425" height="344"></embed></object>

So I guess the take away from this is - while a default splash screen may work on multiple devices, if you are doing anything with the splash screen (like keeping it on screen longer), you want to ensure you build out properly sized images for your supported platforms. Frankly, that's probably the best idea in general anyway.