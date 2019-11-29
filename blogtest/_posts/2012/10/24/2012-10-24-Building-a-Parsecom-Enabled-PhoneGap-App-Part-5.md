---
layout: post
title: "Building a Parse.com Enabled PhoneGap App - Part 5"
date: "2012-10-24T18:10:00+06:00"
categories: [development,html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2012/10/24/Building-a-Parsecom-Enabled-PhoneGap-App-Part-5
guid: 4768
---

Welcome to my final entry on using <a href="http://www.parse.com">Parse.com</a> services with <a href="http://www.phonegap.com">PhoneGap</a>. I apologize for taking so long to get this entry out the door. Blame Germany. (I blame the <a href="http://en.wikipedia.org/wiki/Ma{% raw %}%C3%{% endraw %}9F">Maß</a>.) In this entry I'll be wrapping things up and discussing what should be done to get the application to market. Both on the PhoneGap side as well as Parse. Let's begin with the PhoneGap side.
<!--more-->
<h2>Preparing Your PhoneGap App</h2>

I mentioned that I was making use of <a href="http://build.phonegap.com">PhoneGap Build</a> to create applications out of my source code. In order to publish to the Android and iOS markets, you need certificates for both. Instructions for how to do that are beyond the scope of this blog entry, but you can find good documentation for both.

<a href="http://developer.android.com/tools/publishing/app-signing.html">Android - Signing Your Applications</a><br/>
<a href="https://developer.apple.com/appstore/index.html">iOS - App Store Resources</a>

The Android set up is relatively simple and can be done in about 5 minutes. For iOS you will need a developer account ($99) to even read the docs behind the link above. I find the iOS certificate process quite a bit more confusing than Android, but after doing it a few times, I've gotten it down to about a half hour process.

The good news is that once you have created the certificates for both platforms, PhoneGap Build makes it super easy to use them. You simply upload the proper documents and then edit your project to ensure they point to them.

<img src="https://static.raymondcamden.com/images/ScreenClip146.png" />

Once you've done that, you can generate release builds just as you would any other build. Simply update your code and PhoneGap Build will do the hard work for you.

Submitting to the various app stores is also a bit out of scope for this post. As we all know, Android makes this relatively easy. You're app can be public in about half an hour. iOS is more of a waiting game. (Details on my own app at the end of this entry.)

<h2>Locking Down Parse</h2>

In this series (and other blog entries), I've raved about how darn cool Parse is. But you may be wondering - if code can be used to generate any type of object, what happens when someone gets a hold of my JavaScript code and creates ad hoc data? Thankfully, Parse's dashboard has a way to handle this.

The very first thing you will want to do is go into your application setting and <b>disable</b> "Allow client class creation."

<img src="https://static.raymondcamden.com/images/ScreenClip147.png" />

This will prevent hackers and ne'er-do-wells from adding random types of data to your storage. (In case you're wondering - I did this for my application.)

The second option you have is a bit more involved. Parse allows for full ACLs (Access Control Lists) over data. By default it's free for all. Anyone can make anything. You can disable this globally in the settings by disabling anonymous users:

<img src="https://static.raymondcamden.com/images/ScreenClip148.png" />

But most likely you want to provide more fine-grained control. Parse allows you to control access at the type and object level. Here is a screen shot of the permissions screen for the TipObject.

<img src="https://static.raymondcamden.com/images/ScreenClip149.png" />

As you can see, you have incredible control over your data and how people will be able to interact with it. I disabled both Delete and Add Fields. But you have many more options here. You can assign users and roles to specific permissions based on whatever your application's needs are.

The main point is - even with this being an open source JavaScript-based application - Parse.com still allows me to lock down access to prevent people from going crazy with the application. That's an awesome feature and truly makes the service worthwhile I think.

<h2>Wrap Up</h2>

So - I actually did submit my application to both the Google app store and iOS. Unfortunately, Apple turned me down. Why?

<blockquote>
We found that your app encourages fraudulent or reckless activity, which is not in compliance with the App Store Review Guidelines.
</blockquote>

In all fairness, they're probably right. Most cow tipping would probably involve a bit of trespassing, which is, technically, against the law. 

Luckily Google ain't a prude like those fellows over at Apple!

<img src="https://static.raymondcamden.com/images/ScreenClip150.png" />

You can download the app <a href="https://play.google.com/store/apps/details?id=org.camden.cowtipline&feature=search_result#?t=W251bGwsMSwyLDEsIm9yZy5jYW1kZW4uY293dGlwbGluZSJd">right now</a> if you're really, really into actually tipping cows. 

So - that's the end of this series. I do plan on doing more blog posts though. Specifically, I'd like to demonstrate how to connect PhoneGap/Parse.com apps to Facebook. I imagine that would be of interest to folks. I'm also open to any suggestions about what topics to cover. Just let me know!