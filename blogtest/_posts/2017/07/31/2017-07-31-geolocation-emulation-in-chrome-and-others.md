---
layout: post
title: "Geolocation Emulation in Chrome (and others)"
date: "2017-07-31T15:47:00-07:00"
categories: [development]
tags: []
banner_image: 
permalink: /2017/07/31/geolocation-emulation-in-chrome-and-others
---

This isn't necessarily new, but as I ran into it recently I thought I'd share as it was pretty cool. Last week I blogged about a demo I had built (["Serverless for Vampires"](https://www.raymondcamden.com/2017/07/27/serverless-for-vampires/), you read it, right?) and as part of that demo I had some simple front-end code making use of the [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation). It's a simple enough API, but I specifically needed to test with a few different locations.

I knew that Chrome supported emulating a location, but I was pleasantly surprised to see some nice updates to the tooling. First off, how do you actually find the feature?

If you open up Dev Tools, you probably won't see it:

![Where is it???](https://static.raymondcamden.com/images/2017/7/geo1.jpg)

Click the three dots in the upper right hand corner to open the menu, then "More tools", and then "Sensors":

![Oh look, there it is...](https://static.raymondcamden.com/images/2017/7/geo2.jpg)

This will pop up a... I don't know... "sub panel" of the main dev tools where you can find emulation tools for geolocation, orientation, and touch.

![Woot to the woot](https://static.raymondcamden.com/images/2017/7/geo3.jpg)

Ok, so far so good. But what surprised me is what I saw in the dropdown:

![Sweet](https://static.raymondcamden.com/images/2017/7/geo4.jpg)

While I'm not sure why they don't have the sprawling metropolis of Lafayette, LA, this is a dang handy little feature and incredibly useful. So plus one for Chrome. How about the others?

* Microsoft Edge has emulation for a particular device, UA strings and browser profiles, orientation, resolution, and geolocation. No handy "city dropdown" but you can emulate at least.
* Firefox has nothing like this... outside of orientation support when in responsive mode. Oh - and touch emulation too.
* Safari has nothing. Ok, just joking, let me go to my Mac and check.... ok as far as I can see - no support. I also checked the Technology Preview version.

Anyway - I try to check my devtools for new stuff every now and then, and Chrome is actually being a lot more proactive about sharing new updates. You may not know this, but also under the "three dots"/"More tools" menu is a "What's New" screen. It seems kinda odd to put it under More Tools, but I'm just happy they added it. (I've long had a beef with how Chrome documents their updates, and while this isn't as good as what Firefox does, it is a move in the right direction.)