---
layout: post
title: "How to add a panel to Chrome Dev Tools"
date: "2012-07-15T13:07:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2012/07/15/How-to-add-a-panel-to-Chrome-Dev-Tools
guid: 4678
---

I'm a big fan of the Chrome <a href="http://code.google.com/chrome/extensions/index.html">Extension</a> API. It is a simple (and cool) way to extend my favorite browser using HTML and JavaScript. One of the features I've been excited about for a while now is the <a href="http://code.google.com/chrome/extensions/devtools.html">DevTools API</a>. This has been in "experimental" status for a while but is now (mostly) available in the main release. 

The DevTools API allows you to integrate extensions directly into your DevTools. There are multiple <a href="http://code.google.com/chrome/extensions/samples.html#devtools">samples</a> of this API. But there aren't any samples that detail how to create panels. There is documentation for <a href="http://code.google.com/chrome/extensions/devtools.panels.html">creating panels</a>, but it wasn't clear how to use that API in a real extension. I dug at it for a while and finally figured it out. What follows is what I had to do to make panel creation work. It may not be the right way, but it worked.
<!--more-->
First, you must set a devtools_page value in your manifest.json. Here is my sample manifest.

<script src="https://gist.github.com/3117746.js?file=gistfile1.js"></script>

The critical part here is devtools_page. You specify a HTML file that will be executed every time the devtools UI is opened. Here is my HTML file:

<script src="https://gist.github.com/3117766.js?file=gistfile1.html"></script>

Not much, right? As far as I can tell, the actual HTML for this file is never going to be rendered - anywhere. Instead, the entire point of this file is to load a JavaScript script. If so, it would be nice if Google would let us simply point devtools_page to a JavaScript script instead. Now let's look at the script.

<script src="https://gist.github.com/3117770.js?file=gistfile1.js"></script>

The main part of this script - for now - is just one line. It runs the panels.create API to define a new panel. The first argument is the title. The second is the icon. The third is the HTML file for the panel. Finally, the last argument is a callback to execute when the panel is created. There is no documentation on what size the icon should be. It seems to be 32x32.

Now let's look at panel.html. I've only just begun development so for right now it is pretty simple.

<script src="https://gist.github.com/3117779.js?file=gistfile1.html"></script>

And last but not least, the JavaScript file loaded by the panel:

<script src="https://gist.github.com/3117782.js?file=gistfile1.js"></script>

And that's it. Here is my panel running in the Developer Tools UI:

<img src="https://static.raymondcamden.com/images/screenshot14.png" />

So - what about all those console messages? As I tried to get things working, I used console messages all over the place so I could - hopefully - see what was going on. I had very little luck with this. I've <a href="http://www.raymondcamden.com/index.cfm/2012/6/6/Quick-tip-for-debugging-Chrome-Extensions">blogged</a> before about how to use console with Chrome Extensions, but that tip only works when you have a background script. My test extension did not. What finally worked was this:

<ol>
<li>Click the button that detaches Chrome Dev Tools</li>
<li>With the Chrome Dev Tools in its own window and currently focused, use the keyboard combo to open Chrome Dev Tools</li>
</ol>

This opens a second Chrome Dev Tools and I could see all my log messages there.

I hope this helps. As I said, I <i>just</i> got this working so I probably have a lot more to learn.