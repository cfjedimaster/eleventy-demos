---
layout: post
title: "Ionic Serve's Lab option"
date: "2015-03-16T09:41:16+06:00"
categories: [development,mobile]
tags: [ionic]
banner_image: 
permalink: /2015/03/16/ionic-serves-lab-option
guid: 5834
---

This isn't new, but as I prep for my <a href="http://fluentconf.com/javascript-html-2015/public/schedule/detail/38903">FluentConf presentation</a> on Ionic I'm remembering cool stuff that I've forgotten over time. If you already use <a href="http://www.ionicframework.com">Ionic</a> then I bet you know this feature, but maybe you don't, and maybe you're waiting for <i>just one more cool feature</i> to be demonstrated before you make the jump. 

<!--more-->

You probably already know that Ionic has a live reload/view in browser feature activated via the command line like so:

<pre><code>ionic serve</code></pre>

Amongst the ten plus options for this feature is the "Lab" feature, activated like so:

<pre><code>ionic serve -l</code></pre>

The CLI help describes it as "Test your apps on multiple screen sizes and platform types". What this means in reality is this:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/ionic11.png" alt="ionic1" width="600" height="517" class="alignnone size-full wp-image-5835" />

As you can see, it shows you both an iOS and Android version of the application. For the Tabs UI, this is especially helpful as you can see how iOS and Android display them differently. You can also click on the platform name to open a new tab with just that platform. What's cool is that live reload continues to work for the first tab and the second as well.

The one thing missing from this feature is sync - and by that I mean when I click on a tab in iOS I'd like the Android version to respond as well. Turns out that's already <a href="https://github.com/driftyco/ionic-cli/issues/153">being considered</a>.