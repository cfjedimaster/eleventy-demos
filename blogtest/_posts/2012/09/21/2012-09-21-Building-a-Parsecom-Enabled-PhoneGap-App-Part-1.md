---
layout: post
title: "Building a Parse.com Enabled PhoneGap App - Part 1"
date: "2012-09-21T12:09:00+06:00"
categories: [development,html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2012/09/21/Building-a-Parsecom-Enabled-PhoneGap-App-Part-1
guid: 4736
---

It's been a quiet week here on the blog. I apologize for that. Been head deep into presentation preparation and writing along with lots of other fun personal stuff. Things y'all don't care about and that's perfectly fine. ;) Even when I'm not writing blog entries though I'm typically planning some for the future. Last week I wrote a quick <a href="http://www.raymondcamden.com/index.cfm/2012/9/14/Example-of-a-Parsecom-JavaScript-application-with-offline-support">proof of concept</a> demonstrating how to use Parse.com to store data and support offline mode. This came up in a user group meeting I was presenting at and when I described <a href="http://www.parse.com">Parse.com</a> to the attendees there was a <i>huge</i> amount of interest. I first <a href="http://www.raymondcamden.com/index.cfm/2012/1/3/Parsecom--dynamic-data-storage-for-mobile">blogged</a> on Parse.com back in January of this year, but the service has come a long way since then and has some <i>incredible</i> features. I've decided to start a simple blog series that walks through the steps of creating a PhoneGap application making use of Parse.com. It won't necessarily be the most serious of all applications, but it will demonstrate some of the more interesting aspects of the platform and be completely open source.
<!--more-->
For the first entry, I've decided to do something completely radical. I'm not going to show any code. No code at all. Zip. I'm tweaking out a bit about that, but I think if I try hard enough I can actually accomplish posting a blog entry without a line of code in it.

Instead, I'm going to describe the application and share a prototype I built using <a href="http://www.adobe.com/products/proto.html">Adobe Proto</a>. Proto is a tablet application that lets you quickly design web sites and mobile apps. You use familiar typing tools (along with some cool gesture support) to layout pages. You can add dummy text, basic forms, and even create links between various pages. As an example:

<img src="https://static.raymondcamden.com/images/proto-1-600x375.png" />

<img src="https://static.raymondcamden.com/images/proto-3-600x375.png" />

The most powerful aspect, I think, is that you can add interactivity to your prototypes. Forms can be manipulated and buttons can link to other pages. 

So the app? Simple - the Cow Tip Line:

<img src="https://static.raymondcamden.com/images/ctl.png" />

The Cow Tip Line will be the cow tippers best friend. You can use it to report places to tip cows and find cows to tip. And - err - well that's it. I began by defining a simple home page in Proto:

<img src="https://static.raymondcamden.com/images/Photo Sep 21, 10 35 22 AM (Custom).png" />

The top bar is my navigation bar. I only wanted one button but Proto wouldn't allow for that. (Actually, I could have just used a regular button, but I liked how the menu looked.) Beneath the top bar is space for my logo and some basic text, and then two buttons that lead right into the next pages. Here's the form for reporting a prime cow tipping location:

<img src="https://static.raymondcamden.com/images/Photo Sep 21, 10 35 33 AM.png" />

Followed by the report interface. 

<img src="https://static.raymondcamden.com/images/Photo Sep 21, 10 35 47 AM.png" />

As I mentioned, you are able to add basic interactivity to these pages and export them as HTML. I've got a version online now you can click away at. 

<a href="http://www.raymondcamden.com/demos/2012/sep/21/Index.html">http://www.raymondcamden.com/demos/2012/sep/21/Index.html</a>

As a quick tip - on the form - try clicking the drop down. I was able to define those values within Proto itself. I didn't really need to go through all that but it adds the extra level of realism that makes for an even better prototype.

Will I use any of this HTML? Maybe. But even if I don't - just having the screens in place gives me direction for where to go next.

Speaking of that - in the next part I'll walk you through the Parse.com set up process and what we need for a JavaScript application.