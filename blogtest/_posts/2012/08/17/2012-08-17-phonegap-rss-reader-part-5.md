---
layout: post
title: "PhoneGap RSS Reader - Part 5"
date: "2012-08-17T16:08:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2012/08/17/phonegap-rss-reader-part-5
guid: 4705
---

For a while now I've been talking about, and upgrading, a basic PhoneGap-based RSS reader application. (See the related entries at the bottom for the earlier iterations.) I was thinking about the application this morning. One of the things I noticed about the application is that when you clicked to read a full article, the application launched the native web browser. In IOS, there wasn't a nice way to get back to the application. On Android, you could use back, but overall, the transition was a bit jarring. I thought this would be a perfect opportunity to try the ChildBrowser plugin.
<!--more-->
The ChildBrowser plugin creates a "pop up window" that acts like an embedded browser for your application. You can load it with a URL and add event handlers for things like location changing or the browser being closed. The end result is that the user isn't really "leaving" the application when they view a web page. 

The ChildBrowser plugin is available for <a href="https://github.com/phonegap/phonegap-plugins/tree/master/iOS/ChildBrowser">iOS</a> and <a href="https://github.com/phonegap/phonegap-plugins/tree/master/Android/ChildBrowser">Android</a>. (You can also use it with Blackberry and Windows Phone.) 

The API is really simple to use. Since I'm not concerned with any of the events thrown by the ChildBrowser and just need it to go some place, I added a class to my "Read Entry on Site" link and then added this touch handler:

<script src="https://gist.github.com/3381736.js?file=gistfile1.js"></script>

I've talked about PhoneGap plugins before so I won't repeat the story behind how you use them, but the basic idea is that you get the native code bits installed with your editor and then copy over one JavaScript file that provides the connection to the native code. For the most part, it's really pretty simple. 

That being said - I was in luck. Turns out that PhoneGap Build supports a few plugins - and one of them is the ChildBrowser. I opened up my config.xml file and added one line:

<script src="https://gist.github.com/3381752.js?file=gistfile1.xml"></script>

The last thing I needed to do was add a call to the childbrowser.js file in my index.html. Do not forget that even though you include a script tag that points to the file, <b>you don't actually include the file when creating your zip</b>. Another thing to note. My application - previously - had not actually done anything device related. Yeah, that makes the application kind of dumb I guess, but because I wasn't accessing the camera or doing anything special, I never actually included cordova.js. <b>PhoneGap Build will not include a plugin JavaScript file unless you also have a call to cordova.js.</b> I'm assuming some basic regex is being done on that back end and the first script tag is required before any plugins are checked for. Here's what I added to the head block of my index.html file:

<script src="https://gist.github.com/3381771.js?file=gistfile1.html"></script>

And that's it! I uploaded my code and within about two minutes I had my iOS and Android versions up and running. I've included a full zip of the code as an attachment to this blog. You can download individual binaries via the embed below. Note that the iOS version will not work for you - sorry - I'm not adding to this to the AppStore.

<b>Edit on Jan 30, 2015 - I removed the PhoneGap Build iframe embed as it was dead.</b>