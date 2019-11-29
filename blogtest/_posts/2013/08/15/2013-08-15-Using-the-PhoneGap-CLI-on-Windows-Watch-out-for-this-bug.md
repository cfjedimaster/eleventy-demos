---
layout: post
title: "Using the PhoneGap CLI on Windows? Watch out for this bug."
date: "2013-08-15T19:08:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2013/08/15/Using-the-PhoneGap-CLI-on-Windows-Watch-out-for-this-bug
guid: 5007
---

I've recently spoken to more and more people who are working with PhoneGap on Windows, so I'm trying to get my own environment (well, my own <i>virtual</i> environment) up to shape. I even have an application I'd like to put out on the Windows app store. I ran into some significant issues with it (the app, not PhoneGap in general) with 2.9 but decided to try it again with 3. I ran into an interesting issue and I want to share it in case others run into it as well.
<!--more-->
One of the coolest things about the PhoneGap CLI is that it tells you what SDKs it is ready to use locally. It's a quick way to see if you've got your crap set up right. Here is what I see on my Mac.

<img src="https://static.raymondcamden.com/images/Screenshot_8_15_13_5_27_PM.png" />

Awesome, right? But here is what I see in Windows:

<img src="https://static.raymondcamden.com/images/Screenshot_8_15_13_5_28_PM.png" />

Oh, sad face. Seeing all those question marks, my assumption was that the CLI wasn't able to determine if the SDKs were available or not. Fair enough. I figured I'd check the docs and see if I missed something. 

Unfortunately, it turned out to be something far weirder. Captain Obvious (no, seriously, that's his/her name in the Google Group) pointed out that those question marks were actually high ASCII characters. Sending the result of the PhoneGap CLI to a text file and opening with Notepad++ reveals the truth:

<img src="https://static.raymondcamden.com/images/Screenshot_8_15_13_5_33_PM.png" />

Boom. This is already filed as a bug (<a href="https://github.com/phonegap/phonegap-cli/issues/155">Issue 155</a>) if you want to track it. I'm still having issues with the CLI on Windows, so expect a follow up later this week.