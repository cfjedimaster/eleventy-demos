---
layout: post
title: "Quick example of Chrome JavaScript Hot Swapping"
date: "2013-02-11T09:02:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2013/02/11/Quick-example-of-Chrome-JavaScript-Hotswapping
guid: 4852
---

This morning I read a nice blog entry about Chrome JavaScript hot swapping: <a href="http://smotko.si/using-chrome-as-a-javascript-editor/">The Chrome Javascript editor can do hot swapping</a>. I liked the article but wanted to try it myself to see it in action.

First off - this feature does <b>not</b> work for JavaScript in HTML files. This is possibly obvious, and most likely you keep your JavaScript and HTML separate anyway, but I tend to create small demos that have the JavaScript on the same page as the HTML. If you do this and open up the HTML in the Chrome Sources tab, you won't be able to edit it. 

I edited my code to include a JavaScript file instead of directly embedding it. Here's the simple example I started with.

<script src="https://gist.github.com/cfjedimaster/4754644.js"></script>

Note the simple interval. I increment a variable and log it to the console. I opened up the HTML in Chrome and confirmed it was logging as expected. I then switched over to my Resources tab and edited the file directly in Chrome.

<img src="https://static.raymondcamden.com/images/screenshot62.png" />

Hit CTRL+S to save it and then switched back to my console.


<img src="https://static.raymondcamden.com/images/screenshot63.png" />

Easy - and cool. But note that this change did <b>not</b> persist to the file system. Unless you've read the docs or read it on a blog entry, you'll have no idea until you reload. You can save it to the file system if you do Save As instead. 

If you like this, be sure to check out what is coming soon to Brackets: <a href="http://blog.brackets.io/2013/02/08/live-development-with-brackets-experimental/">Live Development with Brackets (experimental)</a>. As cool as it is to be able to edit in Chrome, I'd much rather do my editing with a real editor.