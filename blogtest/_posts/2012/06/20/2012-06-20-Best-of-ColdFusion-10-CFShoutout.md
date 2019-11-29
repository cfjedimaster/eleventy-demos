---
layout: post
title: "Best of ColdFusion 10: CFShoutout"
date: "2012-06-20T12:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/06/20/Best-of-ColdFusion-10-CFShoutout
guid: 4652
---

Our third entry in the <a href="http://www.raymondcamden.com/index.cfm/2012/2/29/Best-of-Adobe-ColdFusion-10-Beta-Contest">Best of ColdFusion 10</a> contest comes from Ben Dalton. It mixes quite a few ColdFusion features including REST, Web Sockets, and ORM/Solr. On top of that, it is also one of the first uses I've seen of ESRI's mapping service. Most people use Google Maps but it certainly isn't the only option. Ben also mixed in HTML5 geolocation for good measure.
<!--more-->
Because this application could be used for evil spammy/troll purposes, I will not be hosting a live version. Instead, I'll simply show some screenshots and at the end tell you how to grab the code yourself. 

The application allows folks to send messages (shout outs) to other users. Because geolocation is used we know where you are when you make the shout out. When you first hit the application, any previous shout outs are loaded and displayed on the map.

<img src="https://static.raymondcamden.com/images/screenshot7.png" />

Clicking the shout icon lets you create a new message:

<img src="https://static.raymondcamden.com/images/screenshot9.png" />

Any connected users automatically see the new shoutout due to the use of websockets. 

Let's look at some of the code. First - check out the ORM CFC used for shoutouts. I absolutely love how easy it is to enable Solr-based indexing:

<script src="https://gist.github.com/2960600.js?file=gistfile1.cfm"></script>

Basically one attribute in the component tag turns it on (and adds autoindexing, which you could do in Application.cfc at a global level) and another argument to the content property tells Solr which data to actually index. I don't think he is actually using a search yet in the application (in my copy he just gets them all), but his REST service supports a find operation so it is ready to be used.

Another interesting issue is the need to set up REST support for an application. I like how he used a simple URL hook to automate this - as well as handling ORM indexing. You can trigger both in one request. But the important one is the REST call. It <b>must</b> be done before you use any REST based application in ColdFusion 10. This isn't a big deal I guess - you just don't want to forget it. Here is Ben's Application.cfc:

<script src="https://gist.github.com/2961188.js?file=Application.cfc"></script>

Want to see more? Ben set up a screencast <a href="http://www.screencast.com/t/3caXuCZbch">here</a> and you can download the bits at - of course - Github: <a href="https://github.com/bendalton/cfshoutout">https://github.com/bendalton/cfshoutout</a>