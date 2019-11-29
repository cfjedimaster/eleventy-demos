---
layout: post
title: "Reminder - You don't need AppCache for PhoneGap/Cordova"
date: "2015-02-26T05:59:59+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2015/02/26/reminder-you-dont-need-appcache-for-phonegapcordova
guid: 5734
---

I've seen this come up a few times recently, and it was mentioned in a presentation I attended yesterday on PhoneGap, but just as a reminder, <strong>stop worrying about AppCache</strong> and PhoneGap/Cordova. It may not be entirely clear to people new to hybrid mobile development, but your application is <strong>on the device</strong> itself. AppCache makes no sense in this regard. It is a bit like having an HTML file on your desktop. Whether you are online or not <strong>does not matter!</strong>

However...

<!--more-->

You obviously <i>do</i> need to care about if the user is offline or not. First - if you are using a CDN for jQuery or some other library - stop. Just download the bits locally to your application and point to them there. 

Secondly, if you are using any remote APIs, then certainly you need to check the device's online/offline status. Make use of the <a href="http://plugins.cordova.io/#/package/org.apache.cordova.network-information">Network Information</a> plugin (*) and spend time to ensure your application responds correctly to different network conditions. I covered this way back in 2013 (<a href="http://www.raymondcamden.com/2013/03/18/building-robust-phonegap-applications">Building "Robust" PhoneGap Applications</a>) and I discuss it in my <a href="http://manning.com/camden/">Cordova book</a>.

* As just a quick aside, I know some folks have had reliability issues with the Network Information plugin. I've seen some people actually write a simple XHR utility to hit a known URL and check the result. I've not had this issue myself, but I wanted to bring it up as just a warning that the plugin may not be perfect. Even if a user is reported as being online, I would hope you build your API calls with error handling. Heck, the API provider may be down themselves. 

<iframe src="https://www.flickr.com/photos/mlleghoul/14782326131/player/" width="640" height="469" frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>