---
layout: post
title: "Simple Reverse Geocoding Example"
date: "2013-03-05T10:03:00+06:00"
categories: [html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2013/03/05/Simple-Reverse-Geocoding-Example
guid: 4872
---

Have you ever seen a web site that seemed to know where you were located? I'm not talking about a map, but the actual <i>name</i> of the location? This is done with a process called "Reverse Geocoding." Whereas geocoding refers to translating a human-readable address into a longitude/latitude pair, reverse geocoding is, well, the opposite of that. Given a longitude/latitude pair, what would be the description of that location. In this blog post I'll show a simple example of this process. My example application will attempt to report the city and state you live in.
<!--more-->
Once again I'll be making use of Google for my example. One of the services of the Google Maps API is geocoding as well as <a href="https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding">reverse geocoding</a>. Their reverse geocode API needs a longitude and latitude, we can get that easily enough using Geolocation. Here is a snippet of code that begins the process:

<script src="https://gist.github.com/cfjedimaster/5091026.js"></script>

Please note that in this demo, if the user doesn't support geolocation I'm not going to do anything else. They won't get an error though and won't know what they are missing. 

Once we have the longitude and latitude, we then fire off a request to the geocode service.

<script src="https://gist.github.com/cfjedimaster/5091031.js"></script>

As with our initial geolocation support, all I care about here is a success. If anything goes wrong, I don't care and I just ignore it. 

So, here comes the difficult part. The result was from the geocode call is fairly complex. You get an array of results ordered by the quality of the match. If you check the <a href="https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding">docs</a>, you can see an example of this. Each individual result is also fairly complex. You get an array of address parts that represent, obviously, parts of an address. If you read the "Address Component Types" section of the docs, you can see an explanation of the types of address parts. Each part has one or more of these types applied as a tag. 

Based on my reading of the spec, I determined I could get the city when the tag was "locality" and the state when the tag was "administrative_area_level_1." This is US-centric and I've not done any testing yet with other countries.

Given that I knew which tags to look for, I decided to work with the first result and see if I could match those tags:

<script src="https://gist.github.com/cfjedimaster/5091064.js"></script>

Again, if there isn't a match I don't throw an error. Since this is simply window dressing for the site it doesn't really matter if we don't get a match. Want to see this in action? Check out the demo below. 

<a href="https://static.raymondcamden.com/demos/2013/mar/4/test.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>