---
layout: post
title: "Quick tip for Cordova and the Browser platform - Setting a custom port"
date: "2015-10-22T09:10:44+06:00"
categories: [development,mobile]
tags: [cordova]
banner_image: 
permalink: /2015/10/22/quick-tip-for-cordova-and-the-browser-platform
guid: 6981
---

I'm not regularly using Cordova and the Browser platform because most of the time I'll use <code>ionic serve</code> instead. However, last night I was working on a Cordova project that - shockingly - didn't use Ionic. I needed to run it in a web page to do some quick testing. I quickly discovered that one thing the browser platform does not handle is enabling CORS for all requests. I had set up CORS for the server part of this application a while ago but it required me to use localhost:3333. By default, Cordova will use port 8000 for the port. There wasn't an obvious way to change that so I did some digging.

<!--more-->

The first thing I did was go into the browser folder under platforms. Under <code>platforms/browser/cordova</code> I opened up the <code>run</code> file and saw that the script did include the ability to pass in a port argument. I couldn't figure out how to pass it though so I tried doing <code>run -h</code>:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot18.png" alt="shot1" width="611" height="159" class="aligncenter size-full wp-image-6982" />

Ok, that's simple. I confirmed it worked by doing <code>cordova/run --port=3333</code>. Sweet. But how do it via the "main" Cordova CLI? If you run <code>cordova help run</code>, you'll see this nugget in the docs:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot28.png" alt="shot2" width="611" height="34" class="aligncenter size-full wp-image-6983" />

So basically, this is all you need to do: <code>cordova run browser -- --port=3333</code>. Simple, right? Probably everyone but me knew this, but as I had to dig to figure it out, I thought it made sense to blog it.