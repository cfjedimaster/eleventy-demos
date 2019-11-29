---
layout: post
title: "Ionic 1.2.0 Released"
date: "2014-09-04T11:09:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2014/09/04/Ionic-120-Released
guid: 5299
---

<p>
Yesterday the <a href="http://www.ionicframework.com">Ionic</a> folks released version 1.2.0. They've got a nice <a href="http://ionicframework.com/blog/live-reload-all-things-ionic-cli/">blog entry</a> taking about the update, but I want to share the cool bits here as well. Definitely read their blog post for <i>all</i> the updates, but here are the ones that I think are <strong>really</strong> cool.
</p>
<!--more-->
<p>
First and foremost is the new LiveReload feature. Previously Ionic supported automatic reloading in the browser via <code>ionic serve</code>. You type - you save - and the browser reloads. Cool. But now you can do this on an actual emulator - or device. That's right. You skip the whole part of rebuilding to the emulator. Admittedly that saves you just 30 seconds - but as soon as you start using this feature you really, really appreciate it. One caveat - it requires a device/os that supports web sockets so you can't test this with older Androids/iOS versions. Here is an incredibly short video showing this in action.
</p>

<iframe width="750" height="422" src="//www.youtube.com/embed/LUjM5vdRpLQ?rel=0" frameborder="0" allowfullscreen></iframe>

<p>
The other cool feature is support for console logs in terminal. Now - I typically use <a href="https://www.genuitec.com/products/gapdebug/">GapDebug</a> for everything lately, but sometimes if I just need a quick view of logs, I like having the option to see it show up in the terminal as well. I <a href="http://www.raymondcamden.com/2014/7/15/Yet-another-CordovaPhoneGap-Debugging-Tip">blogged</a> about using <code>tail -f</code> on the console log the Cordova CLI creates, and that's also an option, but again, this is even simpler. Just pass a flag to the Ionic CLI and it will show up directly in the Terminal:
</p>

<p>
<img src="https://static.raymondcamden.com/images/a1.png" />
</p>

<p>
Note that currently console.dir doesn't work. I mentioned this to one of the Ionic creators and he mentioned it would be added later. In the meantime, don't forget you can simply <code>console.log(JSON.stringify(something))</code> as well.
</p>

<p>
Anyway, there's more to 1.2.0 (including CodePen support), so definitely upgrade. What's nice is that the CLI will actually <strong>tell you</strong> that an update is available so it is nice and obvious.
</p>