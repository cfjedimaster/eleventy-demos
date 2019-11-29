---
layout: post
title: "Simple Google Maps demo with Custom Markers"
date: "2012-12-01T11:12:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2012/12/01/Simple-Google-Maps-demo-with-Custom-Markers
guid: 4795
---

This isn't anything special, but a reader today asked if I could modify some code I did for an earlier blog post: <a href="https://www.raymondcamden.com/2011/04/13/Simple-introduction-to-Google-Maps-Part-2-Markers/">Simple introduction to Google Maps - Part 2 - Markers</a>. This was a blog post I had done as part of a series introducing folks to using the Google Maps SDK. While partially focused on ColdFusion (and replacing &lt;cfmap&gt;), it was applicable to anyone who wanted to try out the SDK on their web site.
<!--more-->
The final demo in that blog post (available <a href="http://www.raymondcamden.com/demos/april132011/test4.cfm">here</a>) showed how to add dynamic markers to a map and provided a simple UI to select and focus on each marker. 

<img src="https://static.raymondcamden.com/images/screenshot41.png" />

My reader had two main questions. First, he wanted to know how to customize the marker. Second, he wanted to build in a basic filtering system based on a type of content. He was building a map of medical related locations and he wanted to be able to filter by pharmacies or hospitals. I whipped up a demo of both of these concepts and I thought folks might like to see the code.

Let's begin by talking about custom markers. This is really an incredibly trivial thing to do. While you have a few different options for customizing the marker, the simplest way to do so is to point to a URL. So given this code to create a marker:

<script src="https://gist.github.com/4183177.js?file=gistfile1.js"></script>

You can tell Google to use a custom image like so:

<script src="https://gist.github.com/4183178.js?file=gistfile1.js"></script>

In this case, I'm pointing to a file called drugstore.png that exists on my server. If you google for "google map icons", you'll find a great selection of icons out there, many free to use. I found a great set here: <a href="http://mapicons.nicolasmollet.com/">http://mapicons.nicolasmollet.com/</a> In fact, he even had a medical category. I grabbed that zip, downloaded it, and expanded it. 

To make use of these icons, I took some static code he rewrote and created a more generic version of it. In my code, I had an array of locations. Each location included a title and an address. I then added a "type" property that mapped to the types of things he was looking to filter. This then allowed me to build a utility that could map the medical type to an image file. I also could have allowed for completely custom icons. For example, maybe making use of a hospital's logo. But for now, I went with a simple type to icon solution. Here's how I set up the sample data and the icon "mapping" code. Obviously I made some guesses here and went with a silly choice for the default.

<script src="https://gist.github.com/4183198.js?file=gistfile1.js"></script>

Here's how it looks now:

<img src="https://static.raymondcamden.com/images/screenshot42.png" />

Filtering was easy too. I used jQuery to bind to changes to the checkboxes on top. I then did a show/hide on both the left hand list of locations and the markers as well. (Google had a simple API to show/hide markers.)

<script src="https://gist.github.com/4183221.js?file=gistfile1.js"></script>

And that's it. A good modification to this would be to use the Google API that 'centers' around markers. I'm not sure if that is smart enough to handle hidden markers, but it could be useful as you filter to adjust the map. (Then again that may be disorienting to users.) 

You can view the full demo below. 

<a href="https://static.raymondcamden.com/demos/2012/dec/1/new4.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>