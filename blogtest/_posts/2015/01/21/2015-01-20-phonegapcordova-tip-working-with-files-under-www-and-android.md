---
layout: post
title: "PhoneGap/Cordova Tip: Working with files under www and Android"
date: "2015-01-21T10:05:24+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2015/01/21/phonegapcordova-tip-working-with-files-under-www-and-android
guid: 5573
---

This is a topic that has come up a few times in comments recently but I wanted to post something a bit more explicit. First and foremost, you cannot use the File system APIs to work with files under the www folder. The <a href="http://plugins.cordova.io/#/package/org.apache.cordova.file">docs</a> for the File plugin incorrectly states that you have Read access to the application directory (which would contain www) but that is incorrect. 

You can use XHR to read in files from under www. For text files this is rather trivial. For binary data you want to be careful before reading in large amounts of data. Remember that you can work with binary data via Ajax using XHR2 (<a href="http://www.w3.org/TR/XMLHttpRequest2/">spec</a> and <a href="http://caniuse.com/#feat=xhr2">support levels</a>). 

Finally - one problem you may run into is supporting a dynamic list of files. Since you can't read the directory, if you want to support a random set of assets under www then you would need to ship a file that contains a list of those resources. You would then do an XHR to that file, get the list, and process as you see it.