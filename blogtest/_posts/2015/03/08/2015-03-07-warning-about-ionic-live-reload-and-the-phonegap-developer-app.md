---
layout: post
title: "Warning about Ionic Live Reload and the PhoneGap Developer App"
date: "2015-03-08T10:23:55+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2015/03/08/warning-about-ionic-live-reload-and-the-phonegap-developer-app
guid: 5787
---

This morning I ran into an odd issue with what should have been relatively simple code. I'm working on a set of demos using <a href="http://www.ionicframework.com">Ionic</a> and <a href="http://cordova.apache.org">Cordova</a> that demonstrate a particular use case of the camera. While testing, I noticed that I couldn't see an image I had selected from the gallery.

<!--more-->

At first, I thought it was the Angular issue (ok, they call it a feature, and I get the reasoning, but I call it a bug and I'm happy to be wrong) where the library will block you from injecting potentially dangerous stuff into the DOM. The fix for that is rather simple - just add a regex to imgSrcSanitizationWhitelist:

<pre><code class="language-javascript">$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?{% raw %}|ftp|{% endraw %}mailto{% raw %}|content|{% endraw %}file|assets-library):/);</code></pre>

However, that didn't work. I had been testing with iOS so I quickly switched to Android and tested there. I noticed I had the same issue. 

At this point I hit a brick wall. I've used the Camera numerous times before with Cordova so I assumed it <i>must</i> have been an Angular issue. I then tried my <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/basic_camera">basic camera</a> demo from my Cordova examples repository - an app I had built a while ago and was as simple as possible - <strong>and that failed too!</strong>

While testing, I was debugging of course, and I noticed this error in the console: <code>Not allowed to load local resource</code>. This is what had originally reminded me to use the sanitization setting in Angular, but I was seeing it in my non-Angular example as well. 

I then did <i>one</i> more test. I had been using Ionic's kick ass live reload feature while testing. On a whim, I stopped, and switched to just doing <code>cordova emulate ios</code>... and it worked. I then realized what the culprit was - live reload. 

When using live reload, you're actually running the assets off the computer and not the device. That means the URIs returned by the camera plugin were referencing URIs on the computer <strong>that did not exist</strong>.

To confirm this was an issue, I also tested with the <a href="http://app.phonegap.com/">PhoneGap Developer App</a> and I had the exact same problem. This makes sense, but is definitely a bit of a bummer if you need to test anything involving the file system. In my particular use case, I <i>could</i> switch to using base64 images, but I'm going to avoid that as it isn't typically recommended. 

To be clear, I'm not suggesting to avoid these features. Ionic's Live Reload is freaking helpful as hell, and the PhoneGap Developer App is the <strong>number one</strong> way to test PhoneGap/Cordova quickly (and will be what I use in presentations in the future), but you want to remember these issues when testing. I opened an <a href="https://github.com/driftyco/ionic-cli/issues/287">ER</a> for the Ionic CLI to warn users about this and I'd appreciate folks input (either for or against) if you are an Ionic user.