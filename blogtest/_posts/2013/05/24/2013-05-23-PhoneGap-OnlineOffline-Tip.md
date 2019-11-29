---
layout: post
title: "PhoneGap Online/Offline Tip"
date: "2013-05-24T10:05:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2013/05/24/PhoneGap-OnlineOffline-Tip
guid: 4943
---

A few months ago I wrote a blog post that talked about <a href="http://www.raymondcamden.com/index.cfm/2013/3/18/Building-Robust-PhoneGap-Applications">"robust"</a> PhoneGap applications. Basically it was a look at the types of things you should consider to make your PhoneGap application more of an app and less of a wrapped web page.
<!--more-->
One of the main topics of that blog post was about handling connection status. PhoneGap gives you access to the type of connection the device has as well as events that let you respond to online and offline states. These are important features that (most likely) every single PhoneGap app should be using. 

I want to point out though a small issue with the code I shared. It isn't broke, but how I did things could be done slightly different. Consider this code block:

<script src="https://gist.github.com/cfjedimaster/5190645.js"></script>

I want you to notice two things. I've got event listeners for my connection status. Then I have an immediate check. My thinking was, "I want to know when things change in the future but I also need to know what's going on right now."

However, it turns out that this isn't actually necessary. If you add event listeners for the online/offline events in the main body load event (<strong>not the PhoneGap device ready</strong>), then the appropriate event will be fired automatically.

If you read the docs for the events (<a href="http://docs.phonegap.com/en/2.7.0/cordova_events_events.md.html#online">http://docs.phonegap.com/en/2.7.0/cordova_events_events.md.html#online</a>) closely you will see that they demonstrate using the body load event. What may not be clear from the docs though is that even though your connection may not change, the event really is fired for you. Here is an example that I've slightly modified from the docs.

<script src="https://gist.github.com/cfjedimaster/5643739.js"></script>

Using this way of handling the events, I would not need a check in onDeviceReady. Thanks go to fellow Adobian <a href="http://shazronatadobe.wordpress.com/">Shazron</a> for pointing this out.

So... do you <i>have</i> to use this way of handling it? To be honest, I prefer my way. It is a bit more coding, but I'd rather not have an onload event with logic and an ondeviceready. My way just "feels" better to me, but I reserve the right to change my mind in the next five minutes. ;)