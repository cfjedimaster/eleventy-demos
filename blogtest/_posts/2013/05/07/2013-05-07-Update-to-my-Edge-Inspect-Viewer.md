---
layout: post
title: "Update to my Edge Inspect Viewer"
date: "2013-05-07T16:05:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2013/05/07/Update-to-my-Edge-Inspect-Viewer
guid: 4927
---

Many moons ago I <a href="http://www.raymondcamden.com/index.cfm/2012/11/6/Proof-of-Concept--An-Edge-Inspect-Screenshot-Viewer">blogged</a> about a proof of concept I built that allowed you to view Edge Inspect screen shots via a nice web interface. This was built in Node using the Express framework. I've finally gotten around to doing some updates to it as well as pushing it up to Github.
<!--more-->
First, I applied the <a href="http://topcoat.io/">Topcoat</a> UI framework. This is an open source UI framework for desktop and mobile available for forking on Github. 

Here is a screen shot of the app in action:

<img src="https://static.raymondcamden.com/images/one.png" />

And here is a shot of the detail view (I'd like to add a bit more detail here):

<img src="https://static.raymondcamden.com/images/onepointfive.png" />

New features include the ability to filter by operating system or device. Here's a filter on Android:

<img src="https://static.raymondcamden.com/images/two.png" />

So, like it? As I've said before, I'm still rather new to Node so take this code with a grain of salt. You can download (or fork and improve!) here: <a href="https://github.com/cfjedimaster/inspectviewer">https://github.com/cfjedimaster/inspectviewer</a>