---
layout: post
title: "Having trouble emulating iOS with Cordova/Ionic?"
date: "2016-12-21T16:27:00-07:00"
categories: [mobile]
tags: [cordova]
banner_image: 
permalink: /2016/12/21/having-trouble-emulating-ios-cordova-ionic
---

Ok, so this one was a doozie. A few days ago, I got a bit ticked off that whenever I emulated iOS I was getting an iPhone 5 device. I know it's just a simulation, but I wanted an iPhone 6 or higher to be the default. It's easy enough to pass a flag to the emulate command to tell it what device/sdk to use ([Important note for targeting iOS Emulators in Cordova](https://www.raymondcamden.com/2015/10/13/important-note-for-targeting-ios-emulators-in-cordova])), but as I have the memory of a kitten, I thought it might be easier to simple *delete* the older emulators.

So I did that. Because why not? If you're curious how that's done - open up XCode, go to Window/Devices. 

<img title="Devices" src="https://static.raymondcamden.com/images/2016/12/cordova1.png" class="imgborder">

Then just right click on a device and select delete:

<img title="I'm not building for a damn TV!" src="https://static.raymondcamden.com/images/2016/12/cordova2.png" class="imgborder">

So yeah, I did that, and then a day or so later began getting errors trying to emulate iOS:

![Error](https://static.raymondcamden.com/images/2016/12/cordova3.png)

You'll notice that I'm calling out something specific here - the iPhone5 target. For some reason, Cordova was trying to use the iPhone 5 even though I had deleted it. I confirmed this was the issue by opening up the XCode project Cordova had created and I could emulate just fine from there.

Long story short - I filed a bug report ([CB-12287](https://issues.apache.org/jira/browse/CB-12287)) and Cordova contributor and all around kick ass dev [Kerri Shotts](https://www.photokandy.com/) figured out the problem. Turns out one script has a hard coded call to iPhone 5 while another script was updated to use the 'last of a list' of valid emulators. So basically it's a real bug (and not just something else I did stupid). 

Kerri provided a workaround: 

	cordova emulate ios --buildFlag="-destination platform=iOS Simulator,name=iPhone 7 Plus"


Or do what I did - in the project I'm working on I simply modified the script to use the iPhone 7.