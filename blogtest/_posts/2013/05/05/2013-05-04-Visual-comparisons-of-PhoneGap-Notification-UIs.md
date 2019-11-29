---
layout: post
title: "Visual comparisons of PhoneGap Notification UIs"
date: "2013-05-05T10:05:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2013/05/05/Visual-comparisons-of-PhoneGap-Notification-UIs
guid: 4925
---

If you are a PhoneGap users,  hopefully you know about the various aspects of the <a href="http://docs.phonegap.com/en/2.7.0/cordova_notification_notification.md.html">Notification API</a>. The Notification API allows for visual, audio, and tactile notifications. In this post I want to focus on the visual notifications and how they differ from the built in web view notifications.
<!--more-->
To begin, I created a simple HTML interface with buttons that would let me test <strong>alerts, confirms, and prompts</strong>. These are the three forms of visual notifications both in vanilla JavaScript as well as PhoneGap's Notification API.

<script src="https://gist.github.com/cfjedimaster/5520779.js"></script>

I used my epic CSS skills to make this a bit more touch friendly:

<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot May 5, 2013 7.57.40 AM.png" />

Now let's look at the JavaScript.

<script src="https://gist.github.com/cfjedimaster/5520791.js"></script>

The first three event handlers are for the vanilla JavaScript notifications. Notice how in confirm and prompt the result is handed back to a variable. The only real customization available is with the prompt method which allows for a default.

Here is the alert being fired:

<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot May 5, 2013 7.57.45 AM.png" />

Here is the confirm:

<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot May 5, 2013 7.57.51 AM.png" />

And finally the prompt:

<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot May 5, 2013 7.57.56 AM.png" />

Now let's consider the native options. First note that they allow for customization. In each one you can tweak the button (or buttons) as well as the title. Be aware that confirm takes a list of button labels while prompt takes an array. (I consider that a bug and I hope they fix that soon.) Also note that all three have callbacks for handling button presses. I've used null as a way of signifying I don't want to do anything, but you would normally have some kind of logic there.

Here is the native alert:

<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot May 5, 2013 7.58.07 AM.png" />

Here is the native confirm:

<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot May 5, 2013 7.58.13 AM.png" />

And lastly, the native prompt:

<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot May 5, 2013 7.58.19 AM.png" />

Just to be clear, do remember that you can build your own alerts, confirms, and prompts as well if you feel like it.