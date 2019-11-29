---
layout: post
title: "Testing PhoneGap, Parse, and Push? Read This"
date: "2013-03-07T10:03:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2013/03/07/Testing-PhoneGap-Parse-and-Push-Read-This
guid: 4875
---

Back in October of last year I wrote a <a href="http://www.raymondcamden.com/index.cfm/2012/10/10/PhoneGap-Parsecom-and-Push-Notifications">guide</a> to integrating PhoneGap, <a href="http://www.parse.com">Parse</a>, and push notifications. Recently a reader noticed that my guide no longer worked and asked me to dig into it. I did today and have found the root of the issue.
<!--more-->
I began by creating a new PhoneGap 2.5.0 project at the command line and adding in the Android platform. I then followed the directions from my blog post. Since I wasn't testing intents, just notifications, I only followed about half of the guide. Basically the portions where I updated AndroidManifest.xml and the Java source. 

I deployed this to my Android device, went to the Parse dashboard, and sent a push. As my reader noted, the push did <b>not</b> show up. I began my investigation by looking at the Data Browser. Part of the Data Browser is a grid of "Installation" objects. These are all the people who have installed your app. It also includes a channels array that signifies what push channels, if any, the device is subscribed to.

<img src="https://static.raymondcamden.com/images/screenshot73.png" />

Notice that every single device is subscribed to "", which represents the broadcast channel. I.e., everyone should get it. On a whim, I decided to try subscribing to a channel called foo. You can see it in the list above. I did this by simply adding one additional line of Java code:

PushService.subscribe(this, "", testpush2.class);<br/>
PushService.subscribe(this, "foo", testpush2.class);

I then went to the Parse dashboard and tweaked "Send to" to specify a segment.

<img src="https://static.raymondcamden.com/images/screenshot74.png" />

Notice that foo shows up. That's cool. It meant my Java code was definitely working, and Parse recognized that foo was a possible channel. I selected foo, entered some text, hit send, and...

Boom. It worked. WTF, right?

I then wondered - what would have happened if I had selected "Broadcast" in the drop down? I did... and it worked!

From what I can tell, something about Parse's dashboard has changed. The default option to send to everyone wasn't the same as sending to the Broadcast channel, but it was in the past. Here's a visual representation of my tests. 

<img src="https://static.raymondcamden.com/images/screenshot75.png" />

So as far as I know, everything still works just the same as before, it is just the dashboard that has changed in terms of how you test. I'm going to post to Parse's forums about this to see what the specific difference is and if I get an answer, I'll post a link to it in the comments below.