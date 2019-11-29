---
layout: post
title: "Business logic in a PhoneGap app"
date: "2011-12-27T09:12:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2011/12/27/Business-logic-in-a-PhoneGap-app
guid: 4473
---

This question came in to me via Stefan Richter yesterday on Twitter and I thought I'd use the blog to answer in a bit more detail. He asked:

<blockquote>
liking jqm so far but have yet to figure out how to keep my business logic separate from markup using cf for backend)
</blockquote>

<a href="http://www.phonegap.com">PhoneGap</a> allows you to take simple HTML and create a mobile application. While we may be used to the idea of having HTML to build out our sites, you have to change your thinking a bit when it comes to a PhoneGap application. Your HTML is running within a wrapper on the device itself. That means any logic built in ColdFusion (or <i>any</i> server side language) is not going to be available to you... directly.

Whereas in the past you could have a simple detail page that queried the database based on a URL parameter, your PhoneGap app is - in ways - like running a HTML file downloaded from the Internet. 

This does not mean you can't have dynamic PhoneGap apps. You can. But on the "app side", anything dynamic is going to have to be built in JavaScript. You can certainly build out your business logic using JavaScript. 

So that means we give up on building web sites with dynamic technologies like ColdFusion, right? Not at all. If your application is entirely self contained, then you can build it out completely with HTML, CSS, and JavaScript. But if your application needs to share data with others, if it needs business logic that access a central database, then you still need a central server.

A PhoneGap application, using JavaScript, can make XHR requests to a server. As an example, I'm working on a mobile app now for a web site. The web site already has a lot of business logic built. I exposed this using a CFC that I can easily call from the PhoneGap app. The mobile app uses JavaScript for requesting and presenting the data. The central server handles things like authentication and returning the appropriate information based on your request.

If this does not make sense, please post a comment!