---
layout: post
title: "Using Drawing Tools and Maps to Find Data"
date: "2013-08-19T11:08:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2013/08/19/Using-Drawing-Tools-and-Maps-to-Find-Data
guid: 5011
---

A few years back a good buddy of mine (<a href="http://bayousoft.com/">Ryan LeTulle</a>) demoed a cool real estate map application he built. I asked him to blog it (because, everyone has a blog, and time to blog, right?) but he never got around to it. Last week I asked him if he minded me rebuilding what I saw him do, and he said go for it. Thanks Ryan for the inspiration!

Have you ever tried to use a real estate site to find homes but had trouble narrowing down your search criteria? For example, you know what city you want to live in, but also what area. If you're lucky, the site lets you search by subdivision, but how in the heck do you figure that out? My subdivision is Ivanhoe, but I lived here about 10 years before I realized that. 

What you would really like - I imagine - is being able to draw your search criteria. Given a map of the city and a vague notion of where you want to live - what if we could draw a region and find results within it?
<!--more-->
This idea relies on two main aspects. First is the ability to draw on a map. I'm going to be using Google Maps for this project. Google Maps is a pretty darn deep API. It allows you to draw markers, lines, boxes, and polygons in general on a map. It also allows for deep interaction with those UI items as well.

While I researched this idea, I discovered they had a feature called <a href="https://developers.google.com/maps/documentation/javascript/examples/user-editable-shapes">"User-editable Shapes"</a>. As you can imagine, this lets a user move and adjust a shape on a map:

<img src="https://static.raymondcamden.com/images/forb.png" />

This is nice - but a box isn't exactly precise enough. I decided to begin with simple lines (what Google calls Polylines). I created a map and then used click events to add markers with lines connecting them. Luckily Google had an example of this already (<a href="https://developers.google.com/maps/documentation/javascript/examples/polyline-complex">Polyline complex</a>) so I began with that. I made one modification though. I set it up so that as soon as you had clicked three times, I'd "close" the box automatically for you. 

As an example:

<img src="https://static.raymondcamden.com/images/forb2.png" />

The code is rather simple - just notice how many lines we've drawn and on the 3rd click, automatically close the box:
 
<script src="https://gist.github.com/cfjedimaster/6269870.js"></script>

This worked... ok (and you can demo it <a href="https://static.raymondcamden.com/demos/2013/aug/16_2/test1.html">here</a>), but I felt bad I was forcing you to search within a four sided polygon. What I really wanted was the ability to let you click as much as you want, and when you're done, close the 'box' automatically. As an example, I've created a multi-segmented polygon here and clicked search to complete the region:

<img src="https://static.raymondcamden.com/images/forb3.png" />

Overall, I felt like this was a good solution. Now - right away you may be asking - what happens if you draw something crazy, like, oh say this:

<img src="https://static.raymondcamden.com/images/forb4.png" />

Don't do that. Seriously. 

<img src="https://static.raymondcamden.com/images/streams.jpg" />

Ok... so at this point, we've covered the first main aspect of this project - giving you the ability to 'draw' a region. Now comes the second. Given that we know the region, how do we find crap inside it? 

I was a bit torn about this aspect. Turns out there is a client-side solution provided by Google (no surprise) but also server side code you can use as as well. CFLib has a UDF (<a href="http://www.cflib.org/udf/PointInPolygon">PointInPolygon</a>) nearly 10 years old that would do this. So in theory - we could hit a server database, do some logic, and return the points. Or - we could do it client side. Keeping the data on the server allows for quicker initial load. Keeping it in the client lets us search a bit quicker, but makes the first load 'fatter'.

I decided to go with a client-side solution. Mainly because I wanted to test this particular Google API, but also because I was curious how 'bad' the hit would be if I did store a large set of data on the client. In my example, I'm only storing longitude/latitude data. I'd imagine that once you click on a result we could do an AJAX ping to get further data. Or heck, we could do so as soon as you complete your polygon. I wrote a script (you can view source <a href="https://static.raymondcamden.com/demos/2013/aug/16_2/gen.html">here</a>) to generate 400 different long/lat pairs that were roughly in the Lafayette area. This script outputs a JavaScript variable I could then take and save into a file called data.json.

Now that I had my data, I could update my code to load it into memory. As to how I could filter the data, I made use of Google's <a href="https://developers.google.com/maps/documentation/javascript/geometry">Geometry</a> library. It lets you pass a long/lat point and a polygon and it returns true if the point is within it. Here is the updated edition. You want to pay attention to the doSearch function:

<script src="https://gist.github.com/cfjedimaster/6270009.js"></script>

As you can see, I loop over the data and pass it to the Geometry API. If a match is found, I add a marker. When done, I report on the total matches. You can demo this by hitting the giant demo button below. Note that hitting Search twice will destroy the universe. Don't hit search twice.

<a href="https://static.raymondcamden.com/demos/2013/aug/16_2/test3.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>

p.s. I actually tested "crossing the streams" and it worked perfectly. I knew it would. Honest.