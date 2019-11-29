---
layout: post
title: "My first Chrome Extension"
date: "2011-09-15T12:09:00+06:00"
categories: [html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/09/15/My-first-Chrome-Extension
guid: 4365
---

Yesterday for some unknown reason<sup>*</sup>, I decided to take a look at how extensions are built in Chrome. I had always wanted to check them out in Firefox, but as I'm a Chrome user pretty much full time now, I decided to see how Chrome folks did it. To me surprise, it was incredibly easy. It's a bit wonky at times in terms of permissions and communications. As you can expect, extensions are powerful and therefore have some restrictions in what each part can do. But if you can write HTML and JavaScript, you can write a Chrome Extension. I recommend hopping over to the main <a href="http://code.google.com/chrome/extensions/index.html">documentation</a> page under Google Labs and taking a look at the <a href="http://code.google.com/chrome/extensions/getstarted.html">Getting Started</a> tutorial. 

<p/>

For my extension, I decided to do something with HTML5 Local Storage. I thought it would be kind of cool if I could get a visual indicator of when a site was making use of the feature. Technically I could just run with my DevTools open all the time, but I don't like to waste all that space. Plus, I'm just curious how sites are making use of the feature in general. My extension does the following:

<p>

First, it uses a visual icon with a number to show how many items are being stored. The numbers go from 0-9.

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip180.png" />

<p>

I didn't have an icon for 9+, but you can control the mouse over text very easy.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip181.png" />

<p>

And yes - that page was using 59 items. It was a test page though so don't panic. If you click on the icon, you get a nice (well, tabular) report. Here's my test page:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip182.png" />

<p>

And here is what <a href="http://jsbin.com">JSBin</a> was using:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip183.png" />

<p>

As I said, for the most part, this was pretty simple to do. The difficult aspect was controlling the communication between all the moving parts. I've got a script that is injected into the DOM. I've got a background page that notices tab changes. Lastly, I've got a popup HTML page. Each of these have certain restrictions about what they are allowed to touch. Luckily there is a messaging system that let's you pass the buck around to other parts so they can handle the meat of it.

<p>

I've released the code for this up on GitHub: <a href="https://github.com/cfjedimaster/Local-Storage-Monitor">https://github.com/cfjedimaster/Local-Storage-Monitor</a>. I've also added it to the Chrome Store. Let me just state that I <i>hated</i> having to make icons and screen shots. The ones I put up are total and complete crap. If anyone wants to create better ones I'll take them. But for now I just wanted something quick and dirty.

<p>

Well shoot. Looks like I need to wait a bit until Google decides to process my order. They took my 5 bucks quickly enough, but apparently the technology to recognize they have my money is still a bit delayed. (I'm sure my extension will get published before Apps accounts get Profiles though!) As soon as it is live, I'll publish the URL here. Note - you can still run my extension. Download the code from GitHub, and in your Chrome Tools/Extensions view, use the "Load Unpacked Extension" option. Point it to the folder where my code exists. 

<p>

* Ok, time to be honest. I've got two presentations that I <b>really</b> need to finish, so this was my way of procrastinating. I'm sure no one here does that though.