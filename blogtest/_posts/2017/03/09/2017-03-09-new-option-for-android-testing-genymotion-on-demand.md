---
layout: post
title: "New Option for Android Testing - Genymotion on Demand"
date: "2017-03-09T08:54:00-07:00"
categories: [development,mobile]
tags: [cordova]
banner_image: 
permalink: /2017/03/09/new-option-for-android-testing-genymotion-on-demand
---

I've been talking about Genymotion (technically [Genymotion Desktop](https://www.genymotion.com/desktop/)) for a while now as a speedier alternative to the horribly slow native Android simulator. While Android's default simulator has gotten a lot better lately, I still think Genymotion Desktop is worth your time checking out if you are doing any work at all with Android. 

The folks behind this cool tool have just recently released another new service, [Genymotion on Demand](https://www.genymotion.com/on-demand/). Basically, this is an EC2-based virtualized Android device you can run from your browser. Here is a screen shot of it in action:

![Genymotion on Demand](https://static.raymondcamden.com/images/2017/3/geny1.png)

If you've never seen Genymotion Desktop before, I'll point out that the icons all on the right all help you work with the virtualized Android device and support cool things like specifying GPS and battery values. 

Getting my Android build up there was a simple matter of asking Cordova to generate a build and then dragging and dropping the APK onto the browser. 

![Snazzy upload](https://static.raymondcamden.com/images/2017/3/geny2.png)

While a developer could use this instead of managing SDKs locally, the fact that it's available in the browser really opens things up, especially for testing. You just pay by the hour for when your running the instance so you can ramp up just as quickly as you need. I think this will be especially useful in larger companies. 

For some more examples, check out the [tutorial videos](https://www.genymotion.com/help/on-demand/tutorial/).

I only played with it a bit, but it worked rather well, and as a fan of the desktop solution, I feel confident recommending folks at least give it a try. (Or if you think it is too much and you've never tried the desktop version, it's definitely time to try that!)