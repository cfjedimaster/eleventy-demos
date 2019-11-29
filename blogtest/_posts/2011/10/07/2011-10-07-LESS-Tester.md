---
layout: post
title: "LESS Tester"
date: "2011-10-07T15:10:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2011/10/07/LESS-Tester
guid: 4383
---

This past week I had the pleasure of seeing Nathan Strutz present on <a href="http://lesscss.org/">LESS</a>, a CSS 'language' that allows you to do simple things like variables, functions, and other time saving tricks with your CSS files. It looked pretty cool and I thought I'd like to play with it a bit. I decided to quickly write a desktop application that would let me do quick tests with LESS. Here's the result:

<img src="https://static.raymondcamden.com/images/ScreenClip194.png" />

The application was built with Adobe AIR and written in HTML. It makes use of jQuery, LESS (of course), and Bootstrap. It doesn't handle errors yet (so don't screw up) and I didn't test many features of LESS itself, but I thought it might be helpful to others. Check it out and let me know. If folks are interested in working on it, I'll gladly put it up on Github for public consumption.

<b>Edit:</b> LESS Tester now supports dropping a .css or .less file onto the left hand text area. You can also drag text over to it. Error handling now works (thanks to Nathan Strutz for the code).

<iframe src="http://www.coldfusionjedi.com/demos/2011/oct7/" width="230" height="200" scrolling="no" frameborder="0"></iframe>