---
layout: post
title: "Apache Cordova SplashScreen Change"
date: "2016-01-25T16:16:10-06:00"
categories: [mobile,development]
tags: [cordova]
banner_image: /images/2016/01/apache-cordova.opt.png
permalink: /2016/01/25/cordova-splash-screen-change
---

A few days ago I began to notice something odd with my Apache Cordova tests. When the application would launch, the splash screen would fade away as opposed to just disappearing. I thought this seemed familiar so I double checked the Apache Cordova blog and re-read the last [plugins release](http://cordova.apache.org/news/2016/01/19/plugins-release.html) post. I had read it when it was published, but not terribly closely. In it, it mentions that the SplashScreen plugin was updated to 3.1.0. In the notes, you can see "Implementing FadeSplashScreen feature for Android" and something similar for iOS. 

If you head over to the [SplashScreen plugin](https://github.com/apache/cordova-plugin-splashscreen) doc though, this update isn't mentioned in the main Preferences section. Rather, you have to scroll down to "Android and iOS Quirks" to see that both a FadeSplashScreen and FadeSplashScreenDuration preference were added. (I've logged a bug about documenting this up in the top preferences section.) 

As the docs say - the default is true, so if for some reason you don't like this new behavior, you'll need to add this to your config.xml:

<pre><code class="language-markup">
&lt;preference name="FadeSplashScreen" value="false" /&gt;
</code></pre>

Want to see what this new feature looks like in action? Check out the video I created.

<iframe width="640" height="360" src="https://www.youtube.com/embed/F1yrrvgbyJc" frameborder="0" allowfullscreen></iframe>