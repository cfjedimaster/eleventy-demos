---
layout: post
title: "Google Maps and Markers Update"
date: "2013-08-09T08:08:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2013/08/09/Google-Maps-and-Markers-Update
guid: 5002
---

<strong>Edit:</strong> Nice - it looks like I had already posted a follow up. Maybe the readers of the blog entries missed it (I did!). But anyway, you can see yet another post on this subject <a href="http://www.raymondcamden.com/index.cfm/2012/12/3/Simple-Google-Maps-demo-with-Custom-Markers--Followup">here</a>. Note to self - don't blog before coffee.

Last December I <a href="http://www.raymondcamden.com/index.cfm/2012/12/1/Simple-Google-Maps-demo-with-Custom-Markers">blogged</a> a simple example of using custom markers in Google Maps. One of the issues folks ran into with my code was that it made use of Google's Geocoding service to translate addresses into lat/long points. This works great - to a point. If you have more than 10 (or 11, never sure about this) then Google will block your geocoding results. The fix is pretty simple - but as folks had issues with this I thought I'd describe it in more detail.
<!--more-->
In the demo I used before, I had an array of data. The data included the addresses I wanted to geocode. What I did was to add a simple console message to my code so I could see the result from Google's geocoding service:

console.log(results[0].geometry.location.lat()+','+results[0].geometry.location.lng(),mapData.title);

Once I had that, I then modified my data to include the information:

<script src="https://gist.github.com/cfjedimaster/6192930.js"></script>

Now - you may be wondering how this would work on a page that already has the bug I was talking about. It should still give you data - up to 10 or 11 items. You could then <strong>temporarily</strong> remove data so that when you run the page again, the rest are processed. If that doesn't make sense, you can also consider using a simple web app. This <a href="http://www.mygeoposition.com/">web app</a> lets you drag a map around and then click for the data. This will be slow, but once you've done it, you never need to do it again. Finally, you could also build a server-side application to do this for you - in chunks over time - and let it run until complete.

The point is - you have multiple different ways to geocode those addresses. Once you've done so, your code then gets simpler than what I had in the previous example. Here is the new loop now:

<script src="https://gist.github.com/cfjedimaster/6192944.js"></script>

To be honest, I think this is better overall as there really is no need to keep geocoding the same darn address for every user who comes to your site. You can find a full demo below.

<a href="http://www.raymondcamden.com/demos/2013/aug/9/test2a.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>