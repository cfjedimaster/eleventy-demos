---
layout: post
title: "Windows 7 version of PhoneGap/Cordova"
date: "2012-07-12T19:07:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2012/07/12/Windows-7-version-of-PhoneGapCordova
guid: 4675
---

This is interesting - Intel has created a Windows 7 port of PhoneGap (AKA Cordova). You can grab the bits at the Github project: 

<a href="https://github.com/otcshare/cordova-win7">https://github.com/otcshare/cordova-win7</a>

Right now it is pretty rough, but you can test it using the free <a href="http://www.microsoft.com/visualstudio/en-us/products/2010-editions/visual-cpp-express">Visual C++ 2010 Express</a>. 

Once you download Visual Studio, run it, and open Cordova.sln:

<img src="https://static.raymondcamden.com/images/ScreenClip99.png" />

And then you can simply hit the green button by the word Debug:

<img src="https://static.raymondcamden.com/images/ScreenClip100.png" />

If everything works out, you get an actual Windows application built from the files in the html folder of the project.

<img src="https://static.raymondcamden.com/images/ScreenClip101.png" />

Note that there doesn't seem to be a way to go back from the demos they built. Luckily it's just HTML so I went in and added a link back to index.html:

<img src="https://static.raymondcamden.com/images/ScreenClip102.png" />

The lovely pink markers are my work - wasn't sure if my machine's UUID was something I should share.

Note that using this project requires Internet Explorer 9 to be installed on the machine. I was able to generate a release build (an actual .exe file), but it didn't run properly. That's either the project still being in its infancy or me simply not building it correctly. 

To be clear, this is not new. I've long been a fan of <a href="http://www.adobe.com/devnet/air/articles/getting_started_air_js.html">Adobe AIR and HTML</a> but as a PhoneGap developer, I think this is pretty cool stuff.