---
layout: post
title: "AngularJS Doesn't Suck!"
date: "2014-01-14T10:01:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2014/01/14/AngularJS-Doesnt-Suck
guid: 5123
---

<p>
Ok, I apologize, that title is <strong>complete</strong> link bait, but I figured I'm allowed to have some fun every now and then, right? At least I didn't call it, "This Developer tried AngularJS and you won't believe what happened next!" About three years ago I <a href="http://www.raymondcamden.com/index.cfm/2011/6/19/Take-a-look-at-Angular">blogged</a> about AngularJS and how I thought it was kind of cool. This was before the 1.0 release. When 1.0 came out... it had changed. I didn't like it. It was hard to describe <i>why</i> I didn't like it. It had definitely gotten more complex and I just had a hard time wrapping my head around it.
</p>
<!--more-->
<p>
But some friends I admire were doing some good things with it and PhoneGap (see Holly's post: <a href="http://devgirl.org/2013/06/10/quick-start-guide-phonegap-and-angularjs/">Quick Start Guide to PhoneGap+AngularJS</a>) so I thought it might be time to bite the bullet and <i>really</i> take a look at it again. Here are some random notes.
</p>

<ul>
<li>First off, I'm <i>very</i> happy to see that the excellent Git-based <a href="http://docs.angularjs.org/tutorial">tutorial</a> still exists. It is still easy to use (even if you know nothing about Git!) and really encourages you to play around. I also like the emphasis on testing as part of the process. I went through the entire tutorial and the things that confused me the most ($scope and modules) make a bit more sense to me now).</li>
<li>Speaking of testing, the tutorial walks you through using both Jasmine (which I know of and like) and <a href="http://karma-runner.github.io/0.10/index.html">Karma</a>. Karma is really, really freaking cool. If you've tried AngularJS before and hate it, cool, but definitely take a look at Karma.</li>
<li>As I went through the tutorial, I started to build my own little project too (more on that below). I quickly ran into things I didn't know how to do so of course I Googled for solutions. I take it as a good sign that whenever I Googled for "how do I do X with angular" I always found solutions. Even better, the solutions typically made sense to me.</li>
<li>As a whole, I like the approach of AngularJS. The binding feels nice. The controllers make sense to me. I had recently taken to Backbone, but I think I prefer the Angular way. I tend to flip flop a bit (I'm like a cat - shiny!) but right now I'm just digging what I see.</li>
</ul>

<p>
As I said above, I worked on a small project while I was learning AngularJS. I do not believe this is the most appropriate use of AngularJS, and to be clear, I wouldn't even pretend this is a good example. But I want to use this application for something else I've got planned as well so I thought I'd share. When I first learned Flex Mobile, I built an application called INeedIt. (You can still install it <a href="https://play.google.com/store/apps/details?id=air.com.camden.INeedIt">here</a>.) INeedIt was based on a simple idea. You are in a strange city and need... something. An ATM, a barber, or heck, an amusement park. The application would make use of Google's <a href="https://developers.google.com/places/documentation/">Places API</a> to provide you a list of businesses that meet that need.
</p>

<p>
I built this in Flex Mobile as an excuse to play with it, but obviously, this doesn't need Flex. This doesn't even need PhoneGap. All it does is fire off a Geolocation call and then make use of the API. So I rebuilt it in pure HTML. I used <a href="http://maker.github.io/ratchet/">Ratchet</a> for the UI. Here it is in the iPhone. The list of services comes from the API and is pretty extensive. This screen is shown <i>after</i> a loading screen tells you that it is finding your location.
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot13.png" />
</p>

<p>
Once you select a service type, Google will then tell you what businesses it knows about within a range (in my case, 2000 meters).
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot22.png" />
</p>

<p>
Finally, you can see details about a business. Google's API actually returns quite a bit of data. This sometimes includes a rating and open hours. I went with a simple view of the address and a call to the static maps API. In the Flex Mobile one I actually included driving directions. I was being lazy so I didn't go that far.
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot32.png" />
</p>

<p>
The demo is still a bit wonky in places. I didn't include a back button to go back to the results. But it works. You can see this yourself online here: <a href="http://www.raymondcamden.com/demos/2014/jan/14/v4/app">http://www.raymondcamden.com/demos/2014/jan/14/v4/app</a>. I encourage you to view source and see how it was implemented, just keep in mind that this shouldn't be considered "Best Practice" AngularJS code.
</p>