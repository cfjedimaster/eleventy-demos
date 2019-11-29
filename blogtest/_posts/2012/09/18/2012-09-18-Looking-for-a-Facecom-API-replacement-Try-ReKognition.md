---
layout: post
title: "Looking for a Face.com API replacement? Try ReKognition."
date: "2012-09-18T13:09:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2012/09/18/Looking-for-a-Facecom-API-replacement-Try-ReKognition
guid: 4733
---

Many moons ago I <a href="http://www.raymondcamden.com/index.cfm/2011/11/7/Facecom-API-released">blogged</a> about a cool API that provided facial recognition. Unfortunately, Facebook bought them and their API is shutting down. A few services have sprung up in its place, one of them being the <a href="http://rekognition.com/">ReKognition API</a>.
<!--more-->
They offer a metered REST-based API that supports face recognition and training. You can sign up for free and use their service in a metered fashion. Even better, you can use their API via JavaScript in CORS-enabled browsers. What I find most interesting though is their scene recognition API. It is still a bit rough, but it attempts to scan an image for features you would find in scenes - like an ocean, mountains, or even a sunset. They've got a <a href="http://rekognition.com/demo/">demo</a> you can try yourself. Here's how their sample image reports:

<img src="https://static.raymondcamden.com/images/ScreenClip124.png" />

For the heck of it I decided to build my own demo. I created a page with simple drag/drop support. Here's a snapshot of the relevant code:

<script src="https://gist.github.com/3744017.js?file=gistfile1.js"></script>

This code makes use of a few bleeding edge features around drag and drop and file APIs. I tested it in the latest Chrome and Firefox and it worked fine. Drag an image into the box, let go, and you should see it doing a XHR2-based Post to ReKognition. (And yes, this is using my own keys so it may run out of available calls. I don't have any good error handling there yet.)

Just in case you don't have a capable browser, or my API calls get cut, here are a few examples of the output:

<img src="https://static.raymondcamden.com/images/09.18.2012-12.05.png" />

And another one...

<img src="https://static.raymondcamden.com/images/ScreenClip125.png" />

As I said - the results are still a bit rough - but I think this API could be pretty darn cool when it has more data to work with. I can also say that I had <i>very</i> good luck working with the engineers behind this API. I ran into a few issues and they were very supportive. (They even took a few suggestions I had!)