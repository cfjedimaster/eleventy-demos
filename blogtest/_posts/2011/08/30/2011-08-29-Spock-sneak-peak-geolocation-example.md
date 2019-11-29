---
layout: post
title: "Spock sneak peak / geolocation example"
date: "2011-08-30T10:08:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2011/08/30/Spock-sneak-peak-geolocation-example
guid: 4347
---

Spock, the next release of <a href="http://groups.adobe.com">Adobe Groups</a>, is nearing completion. Today I finished work on topic home pages. This is a new feature that let's people find user groups based on a particular topic. User groups will be able to register themselves as belonging to any number of topics. Once they've selected their topics, folks looking for one particular topic will be able to find them.

To make finding them even easier, I decided to add a bit of geolocation to the page. As soon as you hit the topic page, we try to find out where you are, and if we can, we then find user groups, and events, near you. Here's a video. I apologize for the roughness of it. The geolocation happens so fast (it's been cached) that it looks a bit fake, but trust me, it is doing a look up.

By the way - the headers you see are <b>temporary</b> - Adobe isn't buying Marvel anytime soon.

<a href="http://www.raymondcamden.com/downloads/2011-08-30_0850.swf"><img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip170.png"></a>