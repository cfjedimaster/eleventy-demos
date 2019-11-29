---
layout: post
title: "Example of Intents with PhoneGap"
date: "2012-05-01T15:05:00+06:00"
categories: [development,html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2012/05/01/example-of-intents-with-phonegap
guid: 4604
---

This weekend I was reading an email on my phone when I noticed something odd. The link, to a Wikipedia article, prompted me to ask if I wanted to load it in my browser, or in the Wikipedia app. Knowing that the Wikipedia app was built with <a href="http://www.phonegap.com">PhoneGap</a>, I decided to dig into this and see how it was done.
<!--more-->
I did some research and discovered that (as far as I could tell), the Wikipedia app was making use of an Android feature called <a href="http://developer.android.com/guide/topics/intents/intents-filters.html">Intents</a>. From my understanding, Intents are a way for applications to...

<ul>
<li>Broadcast out a general request - ie, "I have an address and I'd love for someone to do something fancy with it!"
<li>Listen for general requests - ie, "Dude, I can so do awesome things with maps. If you have an address, let me know, cuz I'll so do something awesome with it. Awesome."
</ul>

Turns out there is already a plugin for this: <a href="http://smus.com/android-phonegap-plugins/">WebIntent</a>. To make use of this plugin, you have to modify the Java code a bit (I forgot to bookmark it, but someone else provided the help here) to support the latest version of PhoneGap. I've included a copy with my blog entry so feel free to just copy it from there. But once you have the plugin installed, you can do either (or both) of the actions above. 

Creating an intent is as simple as using a bit of JavaScript:

<script src="https://gist.github.com/2570579.js?file=gistfile1.js"></script>

But making your application listen for an intent involves a bit more work, specifically, modifying your AndroidManifest.xml file. You need to add a bit of XML in this to register the intent while also using JavaScript in your application to notice when your app was launched. 

Via Stackoverflow, I found <a href="http://stackoverflow.com/questions/525063/android-respond-to-url-in-intent">this entry</a> on listening out for Youtube links, and then added it to my AndroidManifest.xml:

<script src="https://gist.github.com/2570595.js?file=gistfile1.xml"></script>

And then I used a bit of JavaScript to notice the intent.

<script src="https://gist.github.com/2570618.js?file=gistfile1.html"></script>

Simple, right? After installing the application, I whipped up a quick HTML page with two links. One pointing to my blog, another to a random <a href="http://www.youtube.com/watch?v=dQw4w9WgXcQ">Youtube video</a>.

<img src="https://static.raymondcamden.com/images/wishot1.png" />

When I click the Youtube link, I now get this:

<img src="https://static.raymondcamden.com/images/wishot2.png" />

and if I select my own application, the JavaScript I wrote notices and responds to the invocation:

<img src="https://static.raymondcamden.com/images/wishot3.png" />

Pretty simple! I really barely touched on the power and reach of Intents, and I have no idea if something similar exists for iOS (surely it must), but all in all this is <i>incredibly</i> easy to use with PhoneGap.<p><a href='/enclosures/intenttest%2Ezip'>Download attached file.</a></p>