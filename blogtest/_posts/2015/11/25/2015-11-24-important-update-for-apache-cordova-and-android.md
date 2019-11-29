---
layout: post
title: "Important update for Apache Cordova and Android"
date: "2015-11-25T08:58:59+06:00"
categories: [development,mobile]
tags: [cordova]
banner_image: 
permalink: /2015/11/25/important-update-for-apache-cordova-and-android
guid: 7140
---

Those of us who work with Apache Cordova are well aware of the issues surrounding the Android simulator. Calling it "slow" does not properly describe the painful experience of actually trying to use it. In fact, every now and then when I accidentally launch it via the Cordova CLI, I say something out loud that I don't usually include in my blog posts. (Hint - it rhymes with duck.) How bad is it? I've actually recommended folks go out and buy cheap Android devices instead of using the simulator. Of course, you should always test on real devices. My point is, I'd suggest using a real device instead of the simulator since it was actually <i>slower</i> than going to the real device. Of course, even when I have a real device, half of my USB cables don't properly let adb connect to it. Apparently I'm using the "wrong" USB cables. This is why I use iOS about 99% of the time for my Cordova work. I also recommend <a href="https://www.genymotion.com/#!/">Genymotion</a> - a free/commercial Android simulator. 
<!--more-->

Anyway, this past week Google announced the beta release of a new version of <a href="http://developer.android.com/tools/studio/index.html">Android Studio</a>. Android Studio is an IDE specifically for building Android applications. It is free, and kinda nice in the few times I've used it. As part of the update, the emulator was also improved. I didn't pay much attention to this because "much improved slow crap" doesn't really entice me, but then I came across this article: <a href="http://thenextweb.com/dd/2015/11/23/the-new-emulator-in-android-studio-2-0-is-50-times-faster-than-before/">The new emulator in Android Studio 2.0 is 50 times faster than before</a>. 50 is a big number so I figured, let me check it out.

First off, it was a bit hard for me to actually find the beta download. You can find it <a href="http://tools.android.com/download/studio/canary">here</a> on Android Studio's Canary channel. I downloaded and installed the bits. I fired up the app and went to Tools/Android/AVD Manager. 

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot16.png" alt="shot1" width="750" height="444" class="aligncenter size-full wp-image-7141" />

I had one pre-existing AVD that was marked as needing repairing, so to make things easy I just deleted it and created a new one. Over all, the UI is a bit refresher and easier to use, but I pretty much just took defaults for my new device.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/11/shot23.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot23.png" alt="shot2" width="750" height="303" class="aligncenter size-full wp-image-7142" /></a>

Anyway, I then dropped down to the CLI, made a new Cordova project, added Android, and told Cordova to emulate it. Surprise surprise, the new emulator popped up just fine. I suppose that is to be expected, but it was nice to see it work well.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot33.png" alt="shot3" width="417" height="750" class="aligncenter size-full wp-image-7143" /> 

The first launch is still not exactly speedy compared to iOS, but as I've seen it take 5 or so minutes in the past, it was a heck of a lot faster. The second launch was really speedy - I'd say less then 10 seconds - on par with Genymotion. (I haven't done scientific testing, but I figure once you get below 10 seconds, it doesn't much matter.) Genymotion though has additional benefits on top of the simulator though so you still want to check it out. 

Thanks go to Mike Hartington for letting me know the new emulator worked well with Cordova, and even more thanks to Mike for sharing a video of this in action.

<iframe width="560" height="315" src="https://www.youtube.com/embed/ztQnhAwijT0" frameborder="0" allowfullscreen></iframe>

As an additional FYI, it can be a bit difficult to control the Android simulator in terms of rotation and stuff like that. The program menus for it are pretty much completely blank. I Googled around a bit and found results to help: <a href="http://www.shortcutworld.com/en/win/Android-Emulator.html">Android Emulator Shortcuts</a>. But I'm surprised the app itself seems to provide no help. 

Anyway - if you've avoided the Android emulator like the plague over the past few years, it's time to finally give it a shot again.