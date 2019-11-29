---
layout: post
title: "Fixing \"Browser Has Stopped\" Errors in the Android Simulator"
date: "2016-09-12T17:06:00-07:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2016/09/12/fixing-browser-has-stopped-errors-in-the-android-simulator
---

Before I begin, I want to point out that I encountered this issue both in the "regular" Android simulator (which I don't recommend) and in [Genymotion](https://www.genymotion.com/) (which I *strongly* recommend). The fix came courtesy of [Julien Bolard](https://twitter.com/JulienBolard), an employee of Genymotion. I'm just blogging it to help spread the word in case others run into the issue as well.

So - have you ever tried saving an image from the browser in Genymotion or the Android simulator? First you find your picture:

![The perfect picture](https://static.raymondcamden.com/images/2016/09/geny1.png )

Then you long tap to bring up the context menu:

![Save the kitty!](https://static.raymondcamden.com/images/2016/09/geny2.png )

You select the save option, and then boom!

![This is fine](https://static.raymondcamden.com/images/2016/09/geny3.png )

Oops. So what's the issue? The browser simply doesn't have permission to use your (simulated) device storage and instead of simply prompting you for permission, it craps the bed.

So - go into settings, apps, select Browser, and then permissions. Then simply enable "Storage" and you should be good to go.

![This is better](https://static.raymondcamden.com/images/2016/09/geny4a.png )