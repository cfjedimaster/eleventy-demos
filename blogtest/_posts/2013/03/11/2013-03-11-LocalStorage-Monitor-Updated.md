---
layout: post
title: "LocalStorage Monitor Updated"
date: "2013-03-11T15:03:00+06:00"
categories: [development,html5]
tags: []
banner_image: 
permalink: /2013/03/11/LocalStorage-Monitor-Updated
guid: 4877
---

Just an FYI - if you follow this blog pretty regularly, then you know I'm a big fan of the LocalStorage API. It is one of those simple, <i>practical</i> APIs that I think are far more useful than the much praised/talked about canvas tag. A while ago I built a Chrome Extension called the <a href="https://chrome.google.com/webstore/detail/localstorage-monitor/bpidlidmmmnapeldonddkjmmjkpeiabi">LocalStorage Monitor</a>. The idea being that I wanted to know when sites were making use of LocalStorage and have a quick way to view that usage.
<!--more-->
To be clear, you can always view LocalStorage usage in Chrome Dev Tools, but I don't always keep that open and this extension was a bit more "up front" about letting me know when a site was using the feature. 

Today <a href="http://fusiongrokker.com/">Adam Tuttle</a> pushed up a mod to the code (<a href="https://github.com/cfjedimaster/Local-Storage-Monitor">https://github.com/cfjedimaster/Local-Storage-Monitor</a>) to add memory usage reports to the display. As an example, here is how Amazon's Cloud Player is using local storage.

<img src="https://static.raymondcamden.com/images/screenshot77.png" />

Anyway, it is a cool little modification and thanks go to Adam for adding it. You can add this to your Chrome install <a href="https://chrome.google.com/webstore/detail/localstorage-monitor/bpidlidmmmnapeldonddkjmmjkpeiabi">here</a>.