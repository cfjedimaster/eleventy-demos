---
layout: post
title: "How to update the Panel DOM in a Chrome Extension Panel"
date: "2012-08-03T17:08:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2012/08/03/How-to-update-the-DOM-in-a-Chrome-Extension-Panel
guid: 4694
---

A few weeks ago I <a href="http://www.raymondcamden.com/index.cfm/2012/7/15/How-to-add-a-panel-to-Chrome-Dev-Tools">posted</a> a blog entry on how you can create new panels in Chrome Dev Tools. I've finally made some time to look more into this feature and I ran into an interesting problem.  (Before continuing on, I strongly recommend reading the earlier entry or none of this will make sense.)
<!--more-->
When you define your extension, you set it up so that JavaScript is used to call the extension API and create a panel. You have one HTML file that serves as the "devtools_page", which can then load JavaScript to create the panel which opens the "real" HTML page for your panel, let's say panel.html.

So to be clear, you've got:

devtools.html (doesn't need to be named this) loading devtools.js (ditto) which creates a panel called panel.html (ditto ditto).

To make things more complex, I had panel.html load panel.js. I attempted to do something like this: document.querySelector("#status").innerHTML="hi". Doing so threw an error. I did some testing, and even though panel.js was loaded in by panel.html, it didn't have access to the DOM of panel.html. (Or at least not directly.)

I backed up a bit, spent some more time looking at the DOM, and discovered the proper way of handling this.

When you create a panel, the callback function is passed a panel object. That panel object supports you assigning a few event handlers to it, one being "onShown". If you specify an onShown handler, it gets passed a window object which represents the DOM of your panel.

This probably makes <i>no</i> sense. Sorry. Here is my devtools.js showing this in action.

<script src="https://gist.github.com/3251541.js?file=gistfile1.js"></script>

Hopefully when I get this extension done I can post a followup that brings these tips into something more coherent.