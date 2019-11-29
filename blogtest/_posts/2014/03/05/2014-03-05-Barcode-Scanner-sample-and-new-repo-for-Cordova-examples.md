---
layout: post
title: "Barcode Scanner sample, and new repo for Cordova examples"
date: "2014-03-05T13:03:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2014/03/05/Barcode-Scanner-sample-and-new-repo-for-Cordova-examples
guid: 5170
---

<p>
Phillip recently asked me for a simple barcode scanner example in Cordova, so I thought it would be a good opportunity to fire up another GitHub repo just for sample apps. I've got a couple of repos for presentations with PhoneGap/Cordova examples, but nothing dedicated. I created a new one, <a href="https://github.com/cfjedimaster/Cordova-Examples">Cordova Examples</a>, just for that purpose.
</p>
<!--more-->
<p>
Right now it contains only one example, a <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/barcode">barcode scanner</a> example. The readme for the demo tells you <i>exactly</i> what to do to use the demo and hopefully this format makes sense. I'm only including the www bits since the platform directories are a) huge and b) platform dependent (obviously). Remember that the Cordova CLI lets you create a new project and copy in assets instead of using the regular Hello World app. 
</p>

<p>
The barcode scanner is a pretty trivial app, but it did bring up an interesting issue. I initially tried to use the "official" (and yes, that's in quotes) barcode scanner plugin: <a href="http://plugins.cordova.io/#/com.phonegap.plugins.barcodescanner">com.phonegap.plugins.barcodescanner</a>. This plugin does <strong>not</strong> work. It is an outdated copy and should be avoided - until it gets updated. Luckily I was able to reach the original author and use his version instead. He also mentioned the official copy will be updated soon. Just something to keep in mind. The "official" plugins may not always be what you want to use.
</p>

<p>
Oh - one more quick note. As much as I push folks to using the iOS Simulator because of how darn fast it is, one thing it <i>doesn't</i> do is emulate the camera. You can't use it for this demo.
</p>