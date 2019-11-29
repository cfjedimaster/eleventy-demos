---
layout: post
title: "Some quick NativeScript tips"
date: "2016-09-28T13:10:00-07:00"
categories: [development]
tags: [nativescript]
banner_image: /images/banners/nativescript.png
permalink: /2016/09/28/some-quick-nativescript-tips
---

After attending (and rather enjoying) [NativeScript Developer Day](http://developerday.nativescript.org/) last week, I'm trying to get back up to speed with NativeScript development. I've got some demos planned for integration with IBM services that I think will be pretty interesting, but I'm a bit rusty so I'm going through the docs again before I leap into making a new app. I ran into a few things today that are 100% documented, well known, etc, but still tripped me up, so I figured I'd document it purely for my own sake. All of the stuff below I figured out by first screwing it up and then getting help from [Brad Martin](http://bradmartin.net). Thanks Brad!

<!--more-->

Don't work in the platforms folder
===

Yeah, so this was especially dumb, but while debugging an issue I was having with Android, I tried modifying some code under the `platforms` folder even though I knew the CLI was going to blow it away. Cordova does the same thing. Stay out of platforms. 

Disabling TypeScript checking (maybe!)
===

When I first [played with NativeScript](https://www.raymondcamden.com/2016/05/16/thoughts-on-nativescript-20/), I went the NS+JavaScript route. This time I did the [TypeScript and Angular 2](http://docs.nativescript.org/angular/tutorial/ng-chapter-0) route, which I strongly recommend. In general it worked fine, but I ran into some code that had issues with TypeScript, essentially it was using something that wasn't defined or imported. I knew it was going to work in runtime, but VS Code kept complaining and the CLI itself would prevent builds from happening since TypeScript was erroring out. 

While this doesn't smell like the best fix, you can tell the CLI to skip over TypeScript errors by editing your `tsconfig.json` file and seeing `noEmitOnError` to false. That seems a bit weird. My only guess is that "emit" in this context means to say the error and don't actually throw it. It's true by default, so set it to false. You'll still see the errors in your console, but they won't stop your build.

Again, this feels like a bad solution, but it got me around a bug in my project.

LiveSync does not create new builds
===

Ok, this one was a bit subtle. The docs tell you that livesync is appropriate for view/JS type changes, but not 'deeper' stuff like plugins and the like. That makes sense. However, my thought was that when you ran livesync, it initially did a new build. What I mean is - imagine I've got livesync running and realize I need a new plugin. I kill livesync, add the plugin, and then run livesync again. In my mind, the first run <strong>in that session</strong> would do a new build. It does not. So for me, I got used to doing `tns build android` when I did, well, 'deep' stuff.

Messing with permissions? Uninstall first
===

This would apply to Cordova as well. If you are doing anything with permissions, you want to ensure you uninstall the app from the device/simulator after you've made that change. That was a big blocker for me until I figured it out.