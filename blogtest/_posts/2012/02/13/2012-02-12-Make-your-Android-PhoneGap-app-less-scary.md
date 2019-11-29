---
layout: post
title: "Make your Android PhoneGap app less scary"
date: "2012-02-13T09:02:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2012/02/13/Make-your-Android-PhoneGap-app-less-scary
guid: 4523
---

For folks who are used to doing native Android development, this is old news, but for folks who may be new to it and coming from a PhoneGap perspective, I wanted to share a quick tip with you to help make your apps a bit less "scary" for your users. What am I talking about? Whenever you install an Android application, the device checks the app's descriptor file to see what permissions the app needs to run. By default, a PhoneGap Android app will simply have them all enabled. This means your users may see this...
<!--more-->
<p>

<img src="https://static.raymondcamden.com/images/holyshit1.png" />

<p>

And...

<p>

<img src="https://static.raymondcamden.com/images/holyshit2.png" />

<p>

But wait, there's more....

<p>

<img src="https://static.raymondcamden.com/images/holyshit3.png" />

<p>

That's three pages of text that most users won't bother reading, and those that do care will freak out since it's the app equivalent of a stranger asking to move into your house, become best friends with your dog, eat your food, and screw your spouse. 

<p>

To change this, open up AndroidManifest.xml. Depending on your editor, you may get the plain text or a fancy editor. I recommend switching to plain text so you can see the following...

<p>

<code>
    &lt;uses-permission android:name="android.permission.CAMERA" /&gt;
    &lt;uses-permission android:name="android.permission.VIBRATE" /&gt;
    &lt;uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" /&gt;
    &lt;uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" /&gt;
    &lt;uses-permission android:name="android.permission.ACCESS_LOCATION_EXTRA_COMMANDS" /&gt;
    &lt;uses-permission android:name="android.permission.INTERNET" /&gt;
    &lt;uses-permission android:name="android.permission.RECEIVE_SMS" /&gt;
    &lt;uses-permission android:name="android.permission.RECORD_AUDIO" /&gt;
    &lt;uses-permission android:name="android.permission.RECORD_VIDEO"/&gt;
    &lt;uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" /&gt;
    &lt;uses-permission android:name="android.permission.READ_CONTACTS" /&gt;
    &lt;uses-permission android:name="android.permission.WRITE_CONTACTS" /&gt;   
    &lt;uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" /&gt;   
    &lt;uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" /&gt;
    &lt;uses-permission android:name="android.permission.GET_ACCOUNTS" /&gt;
    &lt;uses-permission android:name="android.permission.BROADCAST_STICKY" /&gt;
</code>

<p>

This is - obviously - where your device would get the list of permissions it thinks the app requires. The docs do not make it very clear what the minimum requirements are, but from what I know (and Google), the minimum requirements are:

<p>

<code>
&lt;uses-permission android:name="android.permission.INTERNET" /&gt;
</code>

<p>

Most Google results mention android.permission.READ_PHONE_STATE as well, but that's not available in the 2.3.3 project I just created. Keep it in mind though as it may be present in other SDK versions. Here's how the install screen looks after this change:

<p>


<img src="https://static.raymondcamden.com/images/thatsbetter.png" />