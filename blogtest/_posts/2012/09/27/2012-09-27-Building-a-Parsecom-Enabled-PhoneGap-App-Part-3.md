---
layout: post
title: "Building a Parse.com Enabled PhoneGap App - Part 3"
date: "2012-09-27T16:09:00+06:00"
categories: [development,html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2012/09/27/Building-a-Parsecom-Enabled-PhoneGap-App-Part-3
guid: 4743
---

Welcome to the third part of my blog series on building a <a href="http://www.parse.com">Parse.com</a> enabled <a href="http://www.phonegap.com">PhoneGap</a> application. If you haven't yet read the earlier entries in this series, please see the links at the bottom for background and the story so far. In today's entry, I finally get to some code! Not a whole lot of code, but actual data gets created and displayed which is quite a bit farther than we've gotten so far.
<!--more-->
My goal for today's post is to build the initial layout of the application. That includes the home page, the Add Tip page, and the Get Tips page. I wanted the Add Tip page to actually support creating content while the Get Tips page would list out existing data in a simple list format. The fancy map stuff will come later.

Before I got started, I had a decision to make. I wanted my application to look nice on mobile devices. I could have used <a href="http://www.jquerymobile.com">jQuery Mobile</a>. But I didn't want jQuery Mobile set up to be a concern for folks reading this series. Whenever I blog about a particular topic, I try my best to focus in as narrowly as possible on that topic and avoid things that could cause distractions. I didn't want folks going through these blog entries to have issues with jQuery Mobile. Don't get me wrong - jQuery Mobile is very easy to use and I don't think it would cause any problems, but it nagged at me enough for me to consider other options.

In the end, I decided on <a href="http://twitter.github.com/bootstrap/">Twitter Bootstrap</a>. I knew that it had support for responsive mobile-friendly design, and I thought this would be an excellent opportunity to try it out. It also had minimal code requirements and would - for the most part - stay out of my way.

Deciding on the UI framework for an application is an incredibly important decision. I don't want to trivialize that. At the same time, I want to get my nice UI done quickly and focus in on the task at hand - making use of Parse.com and PhoneGap.

I began then with a simple home page based on my mockups from the <a href="http://www.raymondcamden.com/index.cfm/2012/9/21/Building-a-Parsecom-Enabled-PhoneGap-App--Part-1">first blog entry</a>. I plopped in the header graphic, some bullcrap marketing text, and my buttons. Here's how it looked:

<img src="https://static.raymondcamden.com/images/first.png" />

Notice that menu on top? It's part of the Bootstrap responsive navigation system. Clicking on it brings out a flyout menu. If viewed on a tablet in landscape mode, the items show up on the bar. 

As a quick aside - how did I generate those screen shots? With <a href="http://html.adobe.com/edge/inspect/">Adobe Edge Inspect</a> (formerly Shadow) of course. Edge Inspect was a great help as I built out the application.

Let's look at the code behind the homepage. There isn't anything terribly interesting here, but it will give you a look at a page with Bootstrap in it.

<script src="https://gist.github.com/3796140.js?file=gistfile1.html"></script>

Next up was the Add Tip page. Again, this was fairly easy since our tips consist of only three requirements. I built out a simple form:

<script src="https://gist.github.com/3796195.js?file=gistfile1.html"></script>

Which gave me this...

<img src="https://static.raymondcamden.com/images/third.png" />

Ok, so now let's talk about the code that's going to integrate with this form. I'll share the relevant code (which may be found in main.js), and then explain what's going on.

<script src="https://gist.github.com/3796208.js?file=gistfile1.js"></script>

First off - I've got my initialization for Parse that makes use of my Application ID and JavaScript API key. I called these out in my <a href="http://www.raymondcamden.com/index.cfm/2012/9/25/Building-a-Parsecom-Enabled-PhoneGap-App--Part-2">last blog entry</a>. 

Next I create an instance of my TipObject. This is the Parse way to create a generic object type that will - eventually - be persisted. TipObject will act like a class I can reuse when working with data.

Now let's look at that event handler. The first portion is boilerplate jQuery form access. As you can see, I decided to skip on validation for now. (Validation is for wimps!) Once I've got my data, I can make a new tip. The variable, tip, is an instance of TipObject, which is created by the Parse library.

Saving that data then becomes trivial. The object has an instance of a save method. The first argument is the actual data I'm saving. Now - this is a crucial point here so pay close attention.

Parse data types are free form. That means I can define my object types any way I want. I've decided that "Tips" will consist of the number of cows, a ranking on how dangerous the area is, and free form comments. Parse doesn't care how I define my Tip object. Even more interesting, later on, I can completely change my mind on what the structure will look like.

This is both good and bad. During development, it's great. I can try things out and figure out which form "feels" best for the application. Parse will happily store new objects with a new schema no problem. In fact, I plan on doing just that in the next blog entry. (I'll be adding geolocation support.)

After launch though this falls into the realm of Very Bad Idea.

<img src="https://static.raymondcamden.com/images/Very-bad-idea.jpg" />

If you change your data structure after folks have been using the application, your code then has to handle this somehow. So imagine you had a data type called person with a "Name" property. You figure out later on it makes much more sense to have a firstName and lastName property instead. You now have to update all of that old data or write code that handles both 'styles' of objects. It is certainly <i>possible</i> to do that (don't forget that you can access Parse.com data via a REST API - which means you could use some server-side code to do a one-time data update) but for the most part, you want to try to get your structure as concrete as possible before launch.

Ok, enough with the sermon, you get the idea. But the coolest thing is - I didn't have to go to the Parse data browser. I didn't have to make a database table. I made the object. I saved it. I'm done. Seriously - I've just offloaded the entire database requirement to Parse.com in about 30 seconds of code. If that doesn't make you excited, then I don't know what will! 

On saving the object, I let the user know and then send them back. The "doAlert" call there is simply a wrapper function I wrote to handle alerts and callbacks. When I get PhoneGap working with the code properly, that function will handle desktop versus device detection and use the <a href="http://docs.phonegap.com/en/2.1.0/cordova_notification_notification.md.html#Notification">PhoneGap Notification API</a> when possible.

So - the final part to today's blog entry is the list function. I plan on using some mapping there and intelligent reporting (i.e., tell me the reports within 10 miles), but for now, I'm doing a simple list:

<img src="https://static.raymondcamden.com/images/fourth.png" />

I'll skip the HTML for this one since it is just a div, but here's a look at how I retrieved that data:

<script src="https://gist.github.com/3796281.js?file=gistfile1.js"></script>

Parse supports <i>very</i> detailed queries and pagination even. But for now, I simply ask the service for everything and dump it to screen. I'd typically use a JavaScript templating engine for this instead, but as it is temporary, it gets the job done.

Note how every object has an ID and createdAt automatically. I don't have to worry about that. Parse does it. It also tracks the last updated value as well.

Want to play with it? I've updated the <a href="https://github.com/cfjedimaster/CowTipLine">GitHub repo</a> with the latest code. Oh - and even though I'm not actually using any PhoneGap APIs yet I went ahead and created the application at PhoneGap Build:

<a href="https://build.phonegap.com/apps/215210/share">https://build.phonegap.com/apps/215210/share</a>

Note that while there is an iOS download link there, it will only work on my own devices. If this application gets fancy enough, and if readers want me to try, I'll actually submit this to the App Store and see what happens. Do note that this is a Hydration enabled build. That means as I update the application I can tell PhoneGap Build to automatically create new builds from the GitHub repo. It couldn't be easier.