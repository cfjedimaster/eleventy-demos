---
layout: post
title: "FYI - iOS, JavaScript, and inactive tabs"
date: "2013-01-20T17:01:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2013/01/20/FYI-iOS-JavaScript-and-inactive-tabs
guid: 4834
---

This is something I had heard before, but didn't really think about it until a reader I was helping ran into it. It involves Safari on iOS (and I believe just iOS 5 and higher). If you have a web page using timed JavaScript (for example, a setInterval), and switch to another tab (or another app), then the operating system will pause the JavaScript environment. Here is an incredibly simple way to see this in action.
<!--more-->
<script src="https://gist.github.com/4582241.js"></script>

The code simply updates a div with a timestamp and an incrementing value. If you open this in your web browser on an iDevice, note the current value, and switch over to another tab, you'll see when you come back that the page had been paused in the background. 

I tried to get around this by adding a focus/blur event handler to my code...

<script src="https://gist.github.com/4582269.js"></script>

Which didn't work either since, hello, you can't run a JavaScript event handler when all of JavaScript is paused! So much for me being clever.

<img src="https://static.raymondcamden.com/images/CleverGirl_Fullpic_1.gif" />

Anyway, there is a much simpler way around this. Check out this solution from StackOverflow: <a href="http://stackoverflow.com/questions/4940657/handling-standby-on-ipad-using-javascript">Handling standby on iPad using Javascript</a>