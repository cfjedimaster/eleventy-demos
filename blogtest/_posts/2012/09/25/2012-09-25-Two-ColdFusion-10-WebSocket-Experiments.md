---
layout: post
title: "Two ColdFusion 10 WebSocket Experiments"
date: "2012-09-25T11:09:00+06:00"
categories: [coldfusion,html5,javascript]
tags: []
banner_image: 
permalink: /2012/09/25/Two-ColdFusion-10-WebSocket-Experiments
guid: 4741
---

What follows are two little experiments I did with ColdFusion 10 WebSockets. I'm not sure how useful these are but I thought I'd share them. As a reminder, I'll be presenting on WebSockets this weekend at <a href="http://ncdevcon.com/">NCDevCon</a> along with many other people far more intelligent than myself. I think there is something like 2 tickets left so it's not too late!

The first thing I tested was passing a random-ish string to wsGetSubscribers. wsGetSubscribers is a server-side function that gets subscriber data about a particular WebSocket channel. It is smart enough to understand subchannels too so if you pass in channel.subchannel as an argument, it will filter correctly. My experiment was to see what would happen if I passed some nonsense value, like news.XXXXXXX. As I kinda figured, this worked fine. Clients can subscribe to <i>any</i> subchannel unless you explicitly block it on the subscriber handler. Therefore, wsGetSubscribers allows for anything as well. 

Not very helpful I guess, but I wanted to share.

The second thing I tried was a bit more complex. I wanted to know if it was possible for the server to send a message to one user. Technically you have support for one to one communication with <a href="http://help.adobe.com/en_US/ColdFusion/10.0/Developing/WSe61e35da8d318518767eb3aa135858633ee-7ff0.html">Point to Point</a> WebSockets, but these calls are in response to the client sending a message. I wanted the server to be able to broadcast to one (or perhaps a few) client.

There are probably multiple ways of doing this. For example, when the client subscribes, they could subscribe to a channel called "private" and use a subchannel which includes their clientid. Or they could use a selector. 

But I was curious to see if I could use <i>one</i> channel and get the same result. Since the server can get all the clients, I built a simple interface to get them and use the IDs in a drop down.

<script src="https://gist.github.com/3782341.js"> </script>

This form isn't very pretty, but it gets the job done. On the flip side, I used the CFC handler and the canSendMessage method to do my filtering. canSendMessage is run before the message is broadcast to each individual client.

<script src="https://gist.github.com/3782360.js"> </script>

This was part of a simple demo where users sent strings messages to each other. So the only time the message was complex was when the server was sending a message. You can see my simple conditional check there. This worked great. I wanted to also modify the message to return it to a simple string, but oddly you can't modify the message here. I could have sworn you could, and my confidence isn't very high about that assertion, but for now I left it commented out and added a bit of JavaScript logic to the front end:

<script src="https://gist.github.com/3782385.js"> </script>

Anyway, I hope this information is useful to people.