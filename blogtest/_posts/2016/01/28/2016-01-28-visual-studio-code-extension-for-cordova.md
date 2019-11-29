---
layout: post
title: "Visual Studio Code extension for Cordova"
date: "2016-01-28T17:27:24-07:00"
categories: [mobile,development]
tags: [cordova]
banner_image: /images/2016/01/taco.png
permalink: /2016/01/28/visual-studio-code-extension-for-cordova
---

Earlier today Microsoft released a set of updates for [TACO](http://taco.tools/index.html). TACO stands
for "Tools for Apache Cordova" and has been around for a little while yet, but I've not had a chance to give it proper review on the blog. I still plan on doing so, but I wanted to specifically call out part of what was released today - [tooling support](https://marketplace.visualstudio.com/items?itemName=vsmobile.cordova-tools) for Visual Studio Code.

<!--more-->

Obviously this only helps you if you are a Visual Studio Code user, and if you are not, I highly suggest you take a look at the rest of the [TACO](http://taco.tools/index.html) site to look at the other parts of the suite. As I said - there is some impressive stuff here. If you do use Visual Studio Code though you'll want to grab this extension right away.

The extension provides three main features:

* First, you get a debugger for iOS and Android. You can debug applications running on both the simulator and a real device. 
* Second, you get Cordova commands in the command palette. Right now this is just Build and Run, but it's something. 
* Third, and my favorite, you get intellisense for the plugin APIs. This provides code completion for Cordova plugins. Even cooler - the extension is smart enough to know what plugins you have installed in the current project. So if you don't have the Camera plugin installed, you won't get code completion. How does it look? Here is a quick example:

![Visual Studio Code completion](https://static.raymondcamden.com/images/2016/01/cordovaext1.png)

To give you an idea of how the debugger looks, I did a quick video. I'm coming down with a bit of a cold, so forgive the somewhat scratchy voice.

<iframe width="480" height="360" src="https://www.youtube.com/embed/9o-U0vH-5DI" frameborder="0" allowfullscreen></iframe>