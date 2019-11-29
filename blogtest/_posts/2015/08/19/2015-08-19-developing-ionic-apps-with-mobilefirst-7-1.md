---
layout: post
title: "Developing Ionic Apps with MobileFirst 7.1"
date: "2015-08-19T15:27:30+06:00"
categories: [development,javascript,mobile]
tags: [cordova,ionic,mobilefirst]
banner_image: 
permalink: /2015/08/19/developing-ionic-apps-with-mobilefirst-7-1
guid: 6668
---

Time for the last in my series of blog posts on hybrid development with <a href="https://ibm.biz/BluemixMobileFirst">MobileFirst 7.1</a>. Obviously I've got more to say about MobileFirst, but this last post will complete the picture so to speak about the development is like in 7.1. I want to give a special shout out to my coworkers <a href="https://twitter.com/csantanapr">Carlos Santana</a> and Karl Bishop. They helped quite a bit with the first two blog posts and this one in particular is thanks to Carlos. Both are smart folks who make my job of telling yall stuff quite a bit easier. With that in mind, before going further, be sure to read my introductory post (<a href="http://www.raymondcamden.com/2015/08/17/getting-started-with-mobile-development-and-ibm-mobilefirst-7-1">Getting Started with Mobile Development and IBM MobileFirst 7.1</a>) and my follow up (<a href="http://www.raymondcamden.com/2015/08/18/developing-hybrid-mobile-apps-with-ibm-mobilefirst-7-1">Developing Hybrid Mobile Apps with IBM MobileFirst 7.1</a>).

<!--more-->

For this post, I'm going to speak specifically about <a href="http://ionicframework.com/">Ionic</a> development and MobileFirst. In general, you can follow much the same path as what I described in the <a href="http://www.raymondcamden.com/2015/08/18/developing-hybrid-mobile-apps-with-ibm-mobilefirst-7-1">last blog entry</a>. Basically make a new MobileFirst project, make a new Ionic project, and then copy over the www assets. But you will also want to make sure you include Ionic's keyboard plugin: <code>com.ionic.keyboard</code>. Finally, you want to include the code I mentioned that makes use of wlCommonInit. Remember, this is the "MobileFirst is ready to go" event.

In general, that would work fine, but there's a way to make it even easier. As I mentioned, my buddy Carlos has been working on this issue and has already made something that will help quite a bit - a set of Ionic templates: <a href="https://github.com/csantanapr/mfp-ionic-templates">https://github.com/csantanapr/mfp-ionic-templates</a>. These templates make it easier to work with MobileFirst and Ionic. Assuming you've checked out the repo, you can simply provide the path to the repo when creating a new MobileFirst hybrid project:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot19.png" alt="shot1" width="750" height="229" class="aligncenter size-full wp-image-6669" />

Once you've created the project, you then need to initialize Ionic library values and other settings. Luckily Carlos made this easy - just run: <code>npm install</code>. This will read in the dependencies defined in package.json <i>and</i> run bower as well. (This means that Carlos didn't need to include a specific Ionic JavaScript library - you'll always get the latest.)

If you crack open the code, you'll see that app.js has been updated to include MobileFirst specific chores including wlCommonInit. He also includes a bit of code to ensure the app will work in our Mobile Browser Simulator (<a href="http://www.raymondcamden.com/2015/02/20/using-the-mobilefirst-mobile-browser-simulator">Using the MobileFirst Mobile Browser Simulator</a>) and Ionic serve as well. To be honest, I kinda felt like it was a mistake to include code that just works in those situations, but I'm glad he included it. He clearly marked them in app.js and if you're worried about the 'waste' of 15 lines of unnecessary JavaScript code in production, it will be easy to remove it. (And since this is a repo, you can always just check it out and modify it yourself.)

Here's an incredibly cool animated Gif of the blank starter in action.
 
<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/Untitled4.gif" alt="Untitled4" width="408" height="714" class="aligncenter size-full wp-image-6670" />

And there you have it. Let me know what you think in the comments below!