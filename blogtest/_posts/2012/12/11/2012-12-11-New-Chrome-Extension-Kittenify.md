---
layout: post
title: "New Chrome Extension - Kittenify"
date: "2012-12-11T18:12:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2012/12/11/New-Chrome-Extension-Kittenify
guid: 4807
---

I had an hour to kill this morning before a day of meetings, so I built a new Chrome extension - <a href="https://chrome.google.com/webstore/detail/kittenify/nbjopbciknbclbhneogialmaibjkcnen">Kittenify</a>. While not exactly rocket science, it simply takes all the images in a page and replaces them with calls to <a href="http://placekitten.com">placekitten.com</a>. As an example:
<!--more-->
<img src="https://static.raymondcamden.com/images/screenshot46.png" />

Stupid, I know. ;) But it did answer one question I had about Chrome extensions. In the docs I saw, there is always an HTML page tied to the click event of icons in the browser UI. I wasn't sure how to simply run random JavaScript code on the click event. Turns out it is rather simple.

First - specify a background JavaScript file and do not specify a default_popup for browser_action. Here's my manifest.json:

<script src="https://gist.github.com/4263369.js"></script>

Then simply add an onClicked event for the browserAction object. I didn't even know this was possible. (See, this <b>wasn't</b> a waste of time!)

<script src="https://gist.github.com/4263378.js"></script>