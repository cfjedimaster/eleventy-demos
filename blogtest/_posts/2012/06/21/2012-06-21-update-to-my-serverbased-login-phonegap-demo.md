---
layout: post
title: "Update to my Server-Based Login PhoneGap Demo"
date: "2012-06-21T17:06:00+06:00"
categories: [html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2012/06/21/update-to-my-serverbased-login-phonegap-demo
guid: 4653
---

Back in November of last year I <a href="http://www.raymondcamden.com/index.cfm/2011/11/10/Example-of-serverbased-login-with-PhoneGap">blogged</a> an example of adding server-based login to a PhoneGap application. Essentially - how to create an HTML application on your mobile device that calls out to a remote server for authentication purposes. The blog post got quite a bit of traffic (and 100 comments at last count), but today a user pointed out an interesting issue and I thought it would be a great time to post an update to the demo with a fix in place.
<!--more-->
Basically, the user noticed something odd with login failures. The code I wrote supported caching the username and password values in LocalStorage and on application startup would automatically log you in. This worked fine - until your password was changed on the server. Consider the code below:

<script src="https://gist.github.com/2968437.js?file=gistfile1.js"></script>

You can see that when an error is returned by the server, we use PhoneGap's <a href="http://docs.phonegap.com/en/1.8.1/cordova_notification_notification.md.html#notification.alert">Notification Alert</a> API to let the user know about the problem. 

Ok - so that should have worked, right? However - here is where we have a problem. Now - when I do blog entries and demos, I try to balance between 'real world' code and code that focuses narrowly on the issue I'm trying to discuss. I don't like a lot of clutter as I want people to learn without distractions. In this case though I built my demo using <a href="http://www.jquerymobile.com">jQuery Mobile</a> for the UI framework, and here's where the issue came about.

We listen for the pageinit event on the first page to fire off code that checks for cached login credentials:

<script src="https://gist.github.com/2968463.js?file=gistfile1.js"></script>

This is a jQuery Mobile event. But PhoneGap has its own events - with the most critical of them being <a href="http://docs.phonegap.com/en/1.8.1/cordova_events_events.md.html#deviceready">deviceready</a>. You can't do anything device-related until this event fires. 

So take a wild guess what happened. My jQuery Mobile page was up and running <i>before</i> my code was actually ready to speak to the device. (And if you are curious, I tested this using simple console messages. See my <a href="http://www.raymondcamden.com/index.cfm/2012/5/10/Setting-up-console-debugging-for-PhoneGap-and-Android">blog entry</a> for more on that topic.) For my user, I just told them to quickly switch to a browser-native alert() call. But I really wanted a 'proper' fix. 

This led to the question then: If I want my code to not do anything until deviceready is fired, what is the best way to handle it?

While I'm not sure this is the "best" way, here is the solution I came up with. I began by simply adding a new page to my initial HTML page. Remember that jQuery Mobile supports multiple "pages" per HTML file. 

<script src="https://gist.github.com/2968548.js?file=gistfile1.html"></script>

For the most part, this is the same as the previous blog entry. I did update to the latest PhoneGap and jQuery Mobile libraries. The critical part is the addition of "launcherPage." Now let's look at main.js:

<script src="https://gist.github.com/2968554.js?file=gistfile1.js"></script>

The important changes are right at the bottom. I use the deviceready event callback (deviceReady) to register my pageinit function and also change the page manually from the blank screen to the 'real' login page. Now that the deviceready event has fired, when and if an error is returned by the automatic login, we can be assured that the native alert functionality provided by PhoneGap's API will actually work.

For those interested, I've included a zip of the code with this blog entry. You can upload it directly to <a href="http://build.phonegap.com">PhoneGap Build</a> to get a native installer on the platform of your choice.<p><a href='/enclosures/www1.zip'>Download attached file.</a></p>