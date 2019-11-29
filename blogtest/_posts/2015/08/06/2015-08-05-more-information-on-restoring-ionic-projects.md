---
layout: post
title: "More information on restoring Ionic projects"
date: "2015-08-06T08:35:22+06:00"
categories: [development,mobile]
tags: [ionic]
banner_image: 
permalink: /2015/08/06/more-information-on-restoring-ionic-projects
guid: 6612
---

Back in April I blogged about a new feature that was added to Ionic (<a href="http://www.raymondcamden.com/2015/04/20/ionic-adds-a-new-state-feature">Ionic adds a new State feature</a>). Yesterday I had a conversation with <a href="https://twitter.com/mhartington">Mike Hartington</a> of the Ionic team about <em>another</em> version of this feature - the app.json file. It was pretty confusing to me at first, but after talking with Mike for a bit I think I have a handle on it and wanted to share this with others. Everything below is thanks to Mike and any mistakes in transcription are my fault.

<!--more-->

Ok, so what exactly is app.json support? The app.json file lets an Ionic project define plugins, bower packages, and SASS support, for an Ionic project. That sounds like package.json and the "State" feature, right? There is an important difference though.

You use Ionic's State feature when you have an <strong>existing</strong> Ionic project. It can restore both platforms and plugins.

You use Ionic's app.json feature when <strong>creating</strong> a new Ionic project. In other words, when you do: <code>ionic start directoryname remoteurlOrlocalpath</code> and the remote URL or local path contains an app.json file, it will be executed as part of the creation process.

The app.json file is a bit different from the package.json feature. The app.json feature can enable plugins, can download bower packages, and enable/disable SASS support. You can see an example of this in the <a href="https://github.com/driftyco/ionic-starter-push">starter Push template</a>:

<pre><code class="language-javascript">{
  "plugins": [
    "org.apache.cordova.device",
    "org.apache.cordova.console",
    "com.ionic.keyboard",
    "https://github.com/phonegap-build/PushPlugin.git"
  ],
  "sass": false
}</code></pre>

In this sample, four plugins will be installed and SASS will not be enabled. What about bower support? You would just add a bower key to the JSON:


<pre><code class="language-javascript">{
  "plugins": [
    "org.apache.cordova.device",
    "org.apache.cordova.console",
    "com.ionic.keyboard",
    "https://github.com/phonegap-build/PushPlugin.git"
  ],
  "bower":[
    "angularfire",
    "ngCordova"
  ]
  "sass": false
}</code></pre>

In case your wondering why you may not have heard of this yet - that's because this feature isn't actually documented yet. (I've filed a bug for it: <a href="https://github.com/driftyco/ionic-cli/issues/556">556</a>.) 

Hopefully this makes sense for folks. It took me a bit to wrap my head around it. Just to be sure I'm clear, I'm going to repeat myself. The package.json/State feature is for an existing project and lets you restore plugins and platforms. The app.json feature is for setting up a new project.