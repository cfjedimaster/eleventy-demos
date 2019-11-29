---
layout: post
title: "Getting an error running a Cordova project to iOS?"
date: "2015-10-23T14:15:34+06:00"
categories: [development,mobile]
tags: [cordova]
banner_image: 
permalink: /2015/10/23/getting-an-error-running-a-cordova-project-to-ios
guid: 6988
---

This morning when testing an Ionic project, I got an error trying to emulate iOS. I tested it again in the Cordova CLI and got the same error:

<!--more-->

<pre><code>simctl was not found.
Check that you have Xcode 6.x installed:</code></pre>

My first thought was that it was an XCode 7 issue, but I had run builds earlier in the week. On a whim though I fired up XCode and...

Bam. I had to OK a license agreement change. Because... reasons. So if you ever run into an issue like this before, open up XCode and see if you've got a prompt waiting for you. Apparently you can script your way around this too, but just running XCode was faster.