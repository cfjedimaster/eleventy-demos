---
layout: post
title: "Critical Android/PhoneGap issue"
date: "2012-08-09T12:08:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2012/08/09/Critical-AndroidPhoneGap-issue
guid: 4699
---

Ugh. I spent a few hours this week trying to figure out why a previously-working PhoneGap app was having an odd issue in one small part of the application. The issue involved a set of buttons that linked to a detail page. Each link pointed to the same HTML file and used a URL parameter to pass along information. In other words, something like detail.html?id=1 or detail.html?id=2. I've <a href="http://www.raymondcamden.com/index.cfm/2012/2/24/Getting-URL-parameters-in-a-jQuery-Mobile-page">blogged</a> about this before.
<!--more-->
As I said - this worked fine until this week. Admittedly this part of the application wasn't something I had used in a long while but the other users of the application weren't seeing any issue at all.

Turns out - Honeycomb and higher Android versions do not support this type of URL anymore. You can read more about the bug here: <a href="http://code.google.com/p/android/issues/detail?id=17535">http://code.google.com/p/android/issues/detail?id=17535</a>. 

Frankly I'm in awe that something so simple is still broken over a year later. Why didn't I see the issue before? Simple - my last phone wasn't ICS. Ditto for the other folks testing the application. As it stands, Kyle Dodge warned me about this in a comment on my blog post, but it didn't really sink in. (Sorry Kyle!) 

There is a <a href="https://github.com/apache/incubator-cordova-android/pull/21">pull request</a> with Cordova to fix this issue, but from my reading it appears to "fix" it by removing the parameters. (I could be wrong on that!) That isn't a fix to me. 

For now - I'm going to:

1) Use data-foo to store the value.
2) Use a click handler to notice the click and store the value in LocalStorage
3) Update the code to get the value from LocalStorage