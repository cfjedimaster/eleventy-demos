---
layout: post
title: "IndexedDB and Date Example"
date: "2013-06-06T11:06:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2013/06/06/IndexedDB-and-Date-Example
guid: 4954
---

About an hour ago I gave a presentation on IndexedDB. One of the attendees asked about dates and being able to filter based on a date range. I told him that my assumption was that you would need to convert the dates into numbers and use a number-based range. Turns out I was wrong. Here is an example.
<!--more-->
I began by creating an objectstore that used an index on the created field. Since our intent is to search via a date field, I decided "created" would be a good name. I also named my objectstore as "data". Boring, but it works. 

<script src="https://gist.github.com/cfjedimaster/5722073.js"></script>

Next - I built a simple way to seed data. I based on a button click event to add 10 objects. Each object will have one property, created, and the date object will be based on a random date from now till 7 days in the future.

<script src="https://gist.github.com/cfjedimaster/5722082.js"></script>

Note that since IndexedDB calls are asynchronous, my code should handle updating the user to let them know when the operation is done. Since this is just a quick demo though, and since that add operation will complete incredibly fast, I decided to not worry about it.

So at this point we'd have an application that lets us add data containing a created property with a valid JavaScript date. Note I didn't change it to milliseconds. I just passed it in as is.

For the final portion I added two date fields on my page. In Chrome this is rendered nicely:

<img src="https://static.raymondcamden.com/images/Screenshot_6_6_13_9_52_AM.png" />

Based on these, I can then create an IndexedDB range of either bounds, lowerBounds, or upperBounds. I.e., give me crap either after a date, before a date, or inside a date range.

<script src="https://gist.github.com/cfjedimaster/5722112.js"></script>

The only conversion required here was to take the user input and turn it into "real" date objects. Once done, everything works great:

<img src="https://static.raymondcamden.com/images/Screenshot_6_6_13_9_55_AM.png" />

You can run the full demo below.

<a href="https://static.raymondcamden.com/demos/2013/jun/6/test1.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>