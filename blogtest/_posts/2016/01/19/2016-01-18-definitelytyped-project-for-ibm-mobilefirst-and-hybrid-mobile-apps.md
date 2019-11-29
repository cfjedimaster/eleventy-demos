---
layout: post
title: "DefinitelyTyped project for IBM MobileFirst and Hybrid Mobile Apps"
date: "2016-01-19T10:48:55+06:00"
categories: [development,javascript,mobile]
tags: [mobilefirst]
banner_image: 
permalink: /2016/01/19/definitelytyped-project-for-ibm-mobilefirst-and-hybrid-mobile-apps
guid: 7403
---

I've blogged before about the client-side API for hybrid mobile apps built on <a href="
https://ibm.biz/IBM-MobileFirst">IBM MobileFirst</a>. One of the things I've discovered recently is the library of <a href="http://definitelytyped.org/">DefinitlyTyped</a> definition files for TypeScript developers. These files provide intellisense for a huge set of various frameworks and client-side code written in TypeScript. Turns out though that you can also use them in regular old JavaScript files too. My editor of choice (Visual Studio Code) has <a href="https://code.visualstudio.com/docs/languages/javascript">great support</a> for this. You can simply get the file, drop it into your project, and go to town.

<!--more-->

So with that in mind - I started working on a DefinitelyTyped file for MobileFirst. I had to guess a bit at exactly how to do it, and I probably did a few things wrong, but you can get the work in progress here: <a href="https://github.com/cfjedimaster/MobileFirst-Typings">https://github.com/cfjedimaster/MobileFirst-Typings</a>. As you will see in the ReadMe, I've covered a few of the main classes in the WL namespace (this is the core namespace for the API). I'm looking for feedback on how I built it as well as volunteers to help complete the library with a pull request. 

In case your curious as to how well this works, check out the video below:

<iframe width="640" height="360" src="https://www.youtube.com/embed/wre69RYbDnA" frameborder="0" allowfullscreen></iframe>

As a side note - you can get definition files for Apache Cordova and Ionic as well!