---
layout: post
title: "Quick Tip - Ionic apps and touch events"
date: "2015-11-02T14:48:14+06:00"
categories: [development,javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2015/11/02/quick-tip-ionic-apps-and-touch-events
guid: 7044
---

<strong><i>TL;DR: Ionic handles touch versus click for you. Don't worry and carry on.</i></strong>

<!--more-->

This afternoon I was working on some code that began life as a quick example in a desktop web app and than began to transition to an Ionic application. My desktop app had a button with a click event in it and when converting this to use ng-click, it suddenly occurred to me. How do you switch from a click event to a touch event? We all know (or hopefully know) why that is important for mobile web development, but I have to be honest. As much as I'm aware of that and try to always use it in my code, when it came to Ionic's code, I just always used ng-click. 

All of a sudden I realized that I had completely forgotten about using touch in my Ionic apps. Obviously things worked, but I had been using the wrong event in my demos and presentations. I was pure evil.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/time-bandits-evil-leftovers.jpg" alt="time-bandits-evil-leftovers" width="336" height="293" class="aligncenter size-full wp-image-7045" />

I assumed that Angular would just support touch built-in, perhaps via ng-touch, but surprisingly, this isn't the case. You have to grab angular-touch.js to use <a href="https://docs.angularjs.org/api/ngTouch">ngTouch</a>. Given how important mobile is, I'm kinda surprised that this isn't baked in directly.

I was about to switch over to using it (I even ran <code>bower</code>, ewww....) when @breakingthings on the Ionic slack channel told me something that surprised me. Ionic fixed this already. In fact, if you go to the docs for <a href="http://www.ionicframework.com/docs/api/page/tap/">Tap &amp; Click</a>, you'll find this:

<blockquote>
<p>
On touch devices such as a phone or tablet, some browsers implement a 300ms delay between the time the user stops touching the display and the moment the browser executes the
click. This delay was initially introduced so the browser can know whether the user wants to double-tap to zoom in on the webpage. Basically, the browser waits roughly 300ms to see if the user is double-tapping, or just tapping on the display once.
</p>

<p>
Out of the box, Ionic automatically removes the 300ms delay in order to make Ionic apps feel more "native" like. Resultingly, other solutions such as fastclick and Angular's ngTouch should not be included, to avoid conflicts.
</p>
</blockquote>

So yep, no need to worry about it (and you can disable it too if you want), Ionic has your back. And yes - this is yet another reason why I need to make the time to read the docs from start to end. I've been telling myself I'd do that for a while now but I think I need to make it a priority for this month.