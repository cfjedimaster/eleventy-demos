---
layout: post
title: "Need to test a service that doesn't use CORS? There's a plugin for that."
date: "2015-03-09T12:35:07+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2015/03/09/need-to-test-a-service-that-doesnt-use-cors-theres-a-plugin-for-that
guid: 5801
---

Just a quick note - if you are trying to test a service that does <strong>not</strong> use CORS and want to hit via your desktop browser, there is a Chrome extension that let's you enable CORS for any particular URL you want to test. This is great for people using their desktop browser to prototype hybrid mobile applications. The plugin is called "Allow-Control-Allow-Origin: *" (rolls off the tongue, doesn't it?) and can be downloaded <a href="https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en">here</a>. 

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/snap.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/snap.png" alt="snap" width="524" height="206" class="alignnone size-full wp-image-5802" /></a>

Once installed, it adds a pretty little icon to your Chrome browser where you can toggle on/off the feature at will. Note that this feature is also available via a command-line switch, but I find a simple button a heck of a lot easier to use.