---
layout: post
title: "Google Analytics and PhoneGap"
date: "2013-03-28T17:03:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2013/03/28/Google-Analytics-and-PhoneGap
guid: 4893
---

<p>
<b>Edit on November 18, 2014:</b> Please read carefully. Since the time this entry was written, some things have changed. Thanks to readers (see comments below), we know now that we should use App, not Site, as I describe towards the bottom of the post.
</p>

<p>
Today I decided to try out the Google Analytics plugin with PhoneGap, and more specifically, PhoneGap Build. It is one of the plugins <a href="https://build.phonegap.com/docs/plugins">supported</a> by PhoneGap Build and being somewhat of a data nerd, I was curious to see how well it worked. Unfortunately, my "quick little experiment" turned out pretty horrid so I thought I'd write up my experiences to help others avoid the same mistakes I made.
</p>
<!--more-->
<p>
Based on the docs for PhoneGap Build and this plugin, I was directed to the plugin's <a href="https://github.com/bobeast/GAPlugin/blob/master/README.md">README</a> file. The API to initialize, and track, events was rather darn simple. It's all asynchronous, but in most cases, you can probably just ignore the results. You want to log crap and forget about it. You've got support to register events and pages, and set up custom data as well. (Note that free accounts are limited to 4 custom variables.) 
</p>

<p>
I whipped up a sample application that would let me test custom events and pages. I didn't want to bother setting up jQuery Mobile or a custom Single Page Architecture, I decided to just fake everything. So here is the index.html file:
</p>

<script src="https://gist.github.com/cfjedimaster/5266572.js"></script>

<p>
Note the two buttons. I'm going to use one to trigger an event and one to trigger a page load. Now let's look at the JavaScript.
</p>

<script src="https://gist.github.com/cfjedimaster/5266589.js"></script>

<p>
Again, fairly simple. You can see the initialization, you can see the button event handlers, etc. In theory, that should be it, right?
</p>

<p>
The Google Analytics number came from, well, Google Analytics of course. I created a new site and used the "App" setting (since I was building a mobile app):
</p>

<p>
<img src="https://static.raymondcamden.com/images/screenshot82.png" />
</p>

<p>
Easy peasy. I pushed up my bits to PhoneGap Build, pointed my iDevice at the QR code (they <i>do</i> have a purpose), ran the app, and everything worked great. And by that I mean I didn't see the error handler firing. I went over to Google Analytics, switched to the Real-Time view, and waited.
</p>

<p>
And waited some more.
</p>

<p>
<img src="https://static.raymondcamden.com/images/stillwaiting.png" />
</p>

<p>
I knew Google Analytics, in general, took some time to process crap, but Real-Time is supposed to be, well, <b>real time!</b> I put it aside, did some other stuff, and every now and then I'd run the app, click some buttons with my fat fingers, check the Google Analytics site, and curse.
</p>

<p>
Eventually I began to Google around for some solutions. By some random luck I found this page on the PhoneGap Build support site: <a href="http://community.phonegap.com/nitobi/topics/build_2_3_and_analytics_plugin">Build 2.3 and Analytics Plugin </a>. Specifically, one of the support folks posted a link to a GitHub demo of the feature in action (<a href="https://github.com/amirudin/pgb-analytic">amirudin / pgb-analytic</a>), and right there in the README was...
</p>

<blockquote>
1- When creating new Analytics account, choose 'Website' under 'What do you like to track'
</blockquote>

<p>
*sigh*
</p>

<p>
So.... yeah... that's frustrating. I created a new GA site, put in a fake URL as they suggested, switched the GA variable in my code, and voila - I began to see data immediately.
</p>

<p>
<img src="https://static.raymondcamden.com/images/screenshot83.png" />
</p>

<p>
Surprisingly - or maybe I shouldn't be surprised - the geo data was right as well.
</p>

<p>
<img src="https://static.raymondcamden.com/images/screenshot84.png" />
<p>

<p>
That orange blob isn't <i>terribly</i> accurate, but I do live inside of it. Actually, and I just found this, it did get more accurate over time:
</p>

<p>
<img src="https://static.raymondcamden.com/images/screenshot85.png" />
</p>

<p>
If I had to guess, I'd say it took about one hour before data showed up in the non-Real-Time portion, but once it did, it seemed to update rather quickly. I tested on my Android device (more on that in the notes below) and it showed up pretty quickly.
</p>

<p>
<img src="https://static.raymondcamden.com/images/screenshot86.png" />
</p>

<p>
Also, both my events and page data were recorded. As I don't have a lot of either, I won't bother to show a screen shot, but they are showing up. 
</p>

<p>
So - it works.... but I've got some issues (as well as general questions out there for anyone who wants to help).
</p>

<p>
1) <strike>Number one thing is to ensure you make a GA account for a site, not an app. I've already got an email out to the PhoneGap team to see if we can document that better. I can see a lot of people making that mistake.</strike> See my note on top.
</p>

<p>
2) This is probably covered in the Google Analytics docs, but I'm pretty sure I screwed up by sending "new Date()" as my event value. First, GA already knows when an event occurs. So that's kinda dumb on my part. Secondly, it looks like the dates were converted into milliseconds since epoch. I've got some wonky big values for them in the GA dashboard. I'm thinking that if my intent was just to log the "event" of hitting a UI item, I'd be ok with a value of 1 there. If the event was something like, submitting a form for the # of beers you drank, then the value could be dynamic.
</p>

<p>
3) I tried to use the plugin locally - the one linked to from the PhoneGap Build docs. It never worked, and apparently is dead. But this isn't documented, and the PhoneGap Build docs link to it, so it... yeah... confusing. I was told that this is the new site for the repo: <a href="https://github.com/phonegap-build/GAPlugin">https://github.com/phonegap-build/GAPlugin</a>. I haven't tried these bits.
</p>

<p>
4) Unfortunately, the Android version of this is throwing errors. Immediately on loading up the error handler is thrown, but all I get is a "JSON Error". Yeah, that's it. At the same time, <i>some</i> functionality worked (you can see in the screenshot above the device was recorded). My plan is to hook up DDMS (or whatever they call it now) and see if I can figure out the issue there.
</p>

<p>
5) I think you could do some interesting stuff with the variables aspect, especially if you have a paid account. You could make use of the <a href="http://docs.phonegap.com/en/2.5.0/cordova_device_device.md.html#Device">device</a> API and the <a href="http://docs.phonegap.com/en/2.5.0/cordova_connection_connection.md.html#Connection">connection</a> API to log some additional information about your users.
</p>