---
layout: post
title: "Got a new Chrome? Got a joystick? Check out the Gamepad API"
date: "2012-08-01T17:08:00+06:00"
categories: [html5,javascript,video games]
tags: []
banner_image: 
permalink: /2012/08/01/Got-a-new-Chrome-Got-a-joystick-Check-out-the-Gamepad-API
guid: 4691
---

The latest release of Chrome (21.0.1180.57, you know, one of the fifty or so updates that were released over the past week) includes preliminary support for two very cool APIs: WebRTC, the Audio/Video one I've blogged about before, and the <a href="https://dvcs.w3.org/hg/gamepad/raw-file/default/gamepad.html">Gamepad API</a>, which gives you access to game controllers via JavaScript. Roll that around a bit in your game for a second and think about how cool that is. When I built a demo with this API a few weeks back and showed my son, he immediately declared that I was the coolest person he knew and that I should sell the app for money. Luckily he isn't reading this blog so he won't see how uncool I am.
<!--more-->
The Gamepad API contains two basic areas of support. First - you have access to a new property under the navigator object called "gamepads". This is an array of all attached gamepads. Since you could - in theory - connect multiple pads via USB it's nice that there is support for working with any number of them. Note that in Chrome this is currently prefixed by "webkit", so the actual property is navigator.webkitGamepads. Inspecting the gamepad object gives you access to the name, up to 16 button states, and the axis values for 4 joysticks. 

The second part to the API is event driven. This lets you listen for events like a gamepad being connected or a button being pressed. Unfortunately, Chrome doesn't yet support this part of the API. 

Want to quickly test if your Chrome is working right with the API? Chrome developer Scott Graham whipped up a super simple demo. Check out the code first:

<script src="https://gist.github.com/3230529.js?file=gistfile1.js"></script>

And here is a quick screen shot from my machine running it:

<img src="https://static.raymondcamden.com/images/ScreenClip107.png" />

And finally - you can run the JSBin version Scott set up here: <a href="http://jsbin.com/acuhig">http://jsbin.com/acuhig</a>. Note that <i>sometimes</i> I've had to click a button first before it triggered.

So given that we don't have the simpler events yet in Chrome, it still isn't terribly difficult to add support to a game. Consider the game below...

<img src="https://static.raymondcamden.com/images/ScreenClip108.png" />

While I won't be quitting my job anytime soon to go build games, it was a good way for me to practice with Canvas. (See - I don't <i>totally</i> hate the tag!) I had the logic done already so I was curious how difficult it would be to add in support for the gamepad. 

First, here is a <b>subset</b> of the code I had initially:

<script src="https://gist.github.com/3230573.js?file=gistfile1.js"></script>

You can see the event handlers for the keyboard and a loop function that handles animation. The paddle.move() function (not included above) simply checks the value of "input" to know if it needs to move the paddle left or right. Now here's the modified form of loop to support the gamepad:

<script src="https://gist.github.com/3230580.js?file=gistfile1.js"></script>

That is a little over 10 lines of code. And again - when I showed my son this he was amazed and - in all fairness - it does make the game a heck of a lot more fun to play. 

Want to check it out? Try here: <a href="http://www.raymondcamden.com/demos/2012/jul/31/test3.html">http://www.raymondcamden.com/demos/2012/jul/31/test3.html</a>. I'll warn you - the code is messy. Also - I've noticed that I have to reload sometimes for the game to 'notice' the pad. 

Want more information? You can find the spec <a href="https://dvcs.w3.org/hg/gamepad/raw-file/default/gamepad.html">here</a> and read up on the API at MDN as well: <a href="https://wiki.mozilla.org/GamepadAPI">GamepadAPI</a>. Note that gamepad support for Firefox is in one build. No, I don't mean the "Alpha" version. Literally one nightly build. 

p.s. By the way, to test this I had to pick up (research!) a XBox controller that had a USB connection. All I had were wireless controllers. I picked up the most gaudy one I could find...

<img src="https://static.raymondcamden.com/images/2012-08-01 15.39.25.jpg" />