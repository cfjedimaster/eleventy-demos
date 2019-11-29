---
layout: post
title: "Delaying an Edge Animate asset until visible"
date: "2013-04-03T11:04:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2013/04/03/Delaying-an-Edge-Animate-asset-until-visible
guid: 4900
---

Here's a simple little modification that may be useful for people using <a href="http://html.adobe.com/edge/animate/">Edge Animate</a>. The default behavior for an Edge Animate animation is to play immediately. You can disable this of course and use the JavaScript API to play whenever you want. Here's an interesting use for this. What if your Edge Animate asset is on a page where it may not be visible? For example, a page with lots of text or other assets above it? Here is how I solved it.
<!--more-->
First, ensure you disable autoplay on the Stage element:

<img src="https://static.raymondcamden.com/images/Screen Shot 2013-04-03 at 9.13.16 AM.png" />

Next, click on the "Open Actions" panel and enter some text for the creationComplete event. I don't write much JavaScript directly in Edge Animate, instead, I simply put in something simple, like console.log('yo mama!'), just to get Edge Animate to create the event and make it easier for me to find in my editor. 

I created a simple application, ran the code, and ensured that it was <i>not</i> running (since I had disabled autoplay). Now for the fun part. How do we tell if we the Edge Animate asset is visible? I turned to Stack Overflow and found a great utility for this (well, for DOM items in general): <a href="http://stackoverflow.com/a/488073/52160">Check if element is visible after scrolling</a> As you can see, it checks the Window's current scroll setting as well as the DOM item's size. 

Given this function, I decided on this basic pseudo-code:

if(visible) run the animation
else listen for scroll events and check if visible

Here is the code I came up with:

<script src="https://gist.github.com/cfjedimaster/5301623.js"></script>

You can try a demo of this here: <a href="https://static.raymondcamden.com/demos/2013/apr/3/Untitled-1.html">https://static.raymondcamden.com/demos/2013/apr/3/Untitled-1.html</a> Please try not to be too amazed at my incredible animation and design skills.