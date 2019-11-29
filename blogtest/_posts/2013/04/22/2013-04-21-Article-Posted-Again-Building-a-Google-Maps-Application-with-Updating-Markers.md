---
layout: post
title: "Article Posted (Again) : Building a Google Maps Application with Updating Markers"
date: "2013-04-22T10:04:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2013/04/22/Article-Posted-Again-Building-a-Google-Maps-Application-with-Updating-Markers
guid: 4915
---

<img src="https://static.raymondcamden.com/images/map-trucks.jpg" style="float:left;margin-right: 10px;margin-bottom:10px" /> Just as an FYI, today my first article on <a href="http://flippinawesome.org/">flippin' awesome!</a> was published this morning: <a href="http://flippinawesome.org/2013/04/22/google-maps-markers/">Building a Google Maps Application with Updating Markers</a>

In the article I discuss how to create a Google Map that automatically refreshes marker data every few seconds. The idea being that you may have data for moving items (trucks, dragons, users with jetpacks) and your map can automatically update the display in near real time.
<!--more-->
The article focuses on the client-side aspect of the application with a little bit of time spent on the server-side. I wanted to share one little tip that I didn't think was relevant to the article but that my readers may find interesting. I had originally planned on sharing a live demo of the map with the article. While it is trivial to fire up a Node app, I was curious if I could a) use a subdomain off my main server and b) use port 80 even though Apache was using it for my virtual servers. Turns out this is rather easy.

I'll be honest and say I do not grok this code 100{% raw %}% (hell, not even 1%{% endraw %}), but it worked perfectly fine both on my local OS X Apache as well as my live Windows server.

<script src="https://gist.github.com/cfjedimaster/5435397.js"></script>

My read of this is - listen for the domain nodetest.dev and proxy all requests, back and forth, to the server at 127.0.0.0 on port 3000. As I said, I was able to hit my subdomain just fine and Apache handled the proxy perfectly. 

I ended up not sharing this because my server-side logic didn't constrain truck movement, so after running for a long time, the data points wandered off the main view port.