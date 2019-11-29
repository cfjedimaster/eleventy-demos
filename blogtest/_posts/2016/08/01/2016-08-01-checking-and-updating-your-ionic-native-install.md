---
layout: post
title: "Checking (and updating) your Ionic Native install"
date: "2016-08-01T10:14:00-07:00"
categories: [development]
tags: [ionic]
banner_image: /images/banners/ionic_native_update.jpg
permalink: /2016/08/01/checking-and-updating-your-ionic-native-install
---

Ok, so this falls under the "pretty obvious" category, but as I had to figure it out 
this morning I figured I'd blog it to help myself remember. I've been playing with 
[Ionic Native](http://ionicframework.com/docs/v2/native/) as I learn Ionic 2. I wrote up my first
experience with it a few weeks ago (["Working with Ionic Native - Shake, Rattle, and Roll"](https://www.raymondcamden.com/2016/07/07/working-with-ionic-native-shake-rattle-and-roll/). As I work on my next couple of examples, I ran into a few issues.

First off - I did the right thing and filed a bug report on the [Ionic Native](https://github.com/driftyco/ionic-native/issues) GitHub repo. If you run into issues with the code, don't forget to start there. 

Secondly - Ionic Native is installed via npm. That means you can use regular npm commands to both check for and perform updates. So first off - to see what version of Ionic Native you have, simply do <code>npm list ionic-native</code>:

![Example](https://static.raymondcamden.com/images/2016/08/in1.jpg)

And then you can check against the published version by using <code>npm info ionic-native version</code>:

![Example](https://static.raymondcamden.com/images/2016/08/in2.jpg)

And then just <code>npm update ionic-native</code> to get the bits.

![Example](https://static.raymondcamden.com/images/2016/08/in3.jpg)

So yeah, this is pretty much the same you would do for any npm package, but I thought it might be helpful for Ionic folks who may not be terribly familiar with npm. Don't forget that you'll want to <code>ionic build</code> to regenerate your code, or just emulate/run.