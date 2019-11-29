---
layout: post
title: "Having issues sending a Cordova app to an iOS device? Seeing lldb?"
date: "2014-09-11T19:09:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2014/09/11/Having-issues-sending-a-Cordova-app-to-an-iOS-device-Seeing-lldb
guid: 5306
---

<p>
Yesterday I ran into an odd issue with an Ionic demo. I was trying to run it on an iOS device and it kept hanging. After about 5 seconds of hanging, I'd see <code>(lldb)</code> and then nothing else would happen. I switched to using the Cordova CLI and confirmed the same thing happened there. After a bit of Googling, I found myself on the Ionic forums at this thread: <a href="http://forum.ionicframework.com/t/error-when-doing-ionic-run-ios/3117/9">Error when doing 'ionic run ios'</a>. Long story short, there is a process, lldb, that is hanging around and blocking access to the device. Use the suggested <code>pkill lldb</code> command and you should be good to go.
</p>