---
layout: post
title: "Google Map/Directions Mashup"
date: "2013-02-18T08:02:00+06:00"
categories: [html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2013/02/18/Google-MapDirections-Mashup
guid: 4857
---

A while back I ran into an interesting problem with Google Maps. I was booking travel for a conference and needing to find the closest Marriott to the conference location. I didn't know the area very well so seeing a few addresses meant nothing to me. I figured Google Maps would be able to help me, but I could only plot one location at a time. (To be clear, I bet there is a way to plot multiple addresses, I just couldn't find it.) I then tried the Directions service. That too was only able to work with two addresses. I ended up entering 4 or 5 Marriott addresses and just trying to remember which one seemed shorter. To get around this, I built a simple application that lets you enter up to five starting addresses and a destination. It then plots driving directions and reports on the total distances for each. It also reports on which starting address is the best.
<!--more-->
The code for this application is relatively simple. I began by creating a simple Bootstrapped UI:

<img src="https://static.raymondcamden.com/images/screenshot64.png" />

I built in a bit of basic validation logic (which isn't too exciting) and then began work on the real meat of the application. Here's the entire JavaScript library behind the demo.

<script src="https://gist.github.com/cfjedimaster/4977674.js"></script>

The interesting part begins around line 47. I geocode the destination address first to ensure it is valid. (I should probably do the same for the starting addresses as well.) Once I have a valid destination address, I map it, and begin a loop for each of the starting addresses. I make use of the <a href="https://developers.google.com/maps/documentation/directions/">Google Directions API</a> to get and plot the directions from each starting address to the destination. This API is very cool (I've blogged on it a bunch already), but modifying the display of the plot is a bit broken. Unless you want to handle all of the drawing yourself, you can't really (nicely) do small modifications, like changing the initial pushpin. (Which is documented to work, but does not.) 

Here's a quick example:

<img src="https://static.raymondcamden.com/images/screenshot65.png" />

You can try this yourself by hitting the demo button below.

<a href="http://www.raymondcamden.com/demos/2013/feb/13/test.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>