---
layout: post
title: "Updating my CanIUse Mashup with LocalStorage"
date: "2012-09-12T22:09:00+06:00"
categories: [development,html5,javascript]
tags: []
banner_image: 
permalink: /2012/09/12/Updating-my-CanIUse-Mashup-with-LocalStorage
guid: 4730
---

Last week I <a href="http://www.raymondcamden.com/index.cfm/2012/9/4/Mashups-of-CanIUsecom-data">blogged</a> a mashup I built. It took <a href="http://caniuse.com">CanIUse.com</a> data and allowed you to select multiple features at once to see how well - at an aggregate - browsers supported those features. This mashup was possible because CanIUse.com shares their data as a JSON file. This file is a good 200K big. That's a sizable chunk of data to load on every request. I thought it might be cool to update the code to make use of LocalStorage to keep a copy of the data on the user's browser.
<!--more-->
Storing the data in LocalStorage would be trivial. What wouldn't be trivial is figuring out an easy way to know when the local copy should be thrown away and overwritten with newer data on the server. I thought of two basic ways of doing this.

First - I could do a HTTP HEAD request to the file and check the last modified value on the file. This would mean - at most - two HTTP calls to the server. At minimum, there would always be one. I talked about this method in a post earlier this year (<a href="http://www.raymondcamden.com/index.cfm/2012/4/5/Using-jQuery-to-conditionally-load-requests">Using jQuery to Conditionally Load Requests</a>). I knew that would work, but I wanted to try something new, and something simpler.

I decided on a simple 'version' variable. I'd associate the data with this version number. Here's the modification:

<script src="https://gist.github.com/3711150.js?file=gistfile1.js"></script>

The version value is hard coded, which means when I push up a new data file I need to edit the code. That's kinda meh, but it's also pretty quick to edit. Take a look at that conditional. It does many things at once:

<ul>
<li>First, see if the client supports LocalStorage.
<li>See if they have a stored copy of the data
<li>See if they have a stored copy of the version value
<li>Compare the version to the current version. <b>Note!</b> I had to use the double equality comparator instead of the triple equality. Why? The triple equality comparator is strict. LocalStorage values are stored as strings. My currentVersion value is a number. By using the double equality comparator it handle the conversion ok. (I could have just used a string value for currentVersion, but this way, in case I forget, it won't screw up.)
</ul>

Overall - this was about 5 minutes of code - but the update should be worth it. Other resources on the page, like jQuery and Handlebars, also add up to 200k, so I pretty much cut the download time in half. As an example, here's Chrome Dev Tools showing the load and its impact on the request.

<img src="https://static.raymondcamden.com/images/screenshot24.png" />

What's next? I'd like to update the demos to dynamically change the URL so that folks could bookmark various configurations. So for example, selecting feature A, B, and D, should create a URL you could send to someone else.

For your enjoyment - the two demos:
<a href="http://www.raymondcamden.com/demos/2012/sep/4/caniusedemo/test1.html">Demo 1</a>
<a href="http://www.raymondcamden.com/demos/2012/sep/4/caniusedemo/test2.html">Demo 2</a>