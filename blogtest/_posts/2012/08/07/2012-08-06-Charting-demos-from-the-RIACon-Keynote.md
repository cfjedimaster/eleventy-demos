---
layout: post
title: "Charting demos from the RIACon Keynote"
date: "2012-08-07T09:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/08/07/Charting-demos-from-the-RIACon-Keynote
guid: 4697
---

Continuing with my <a href="http://www.raymondcamden.com/index.cfm/2012/8/6/WebSocket-example-with-keyword-highlighting">blog post</a> from yesterday, here are the three chart examples I shared demonstrating the updates in ColdFusion 10. These are <b>not</b> meant to represent everything you can do. I just thought they were kinda cool and demonstrated some of the extensibility of the new charting engine.
<!--more-->
For the first example, I showed how rules can be used to highlight data. Consider the following static chart:

<script src="https://gist.github.com/3284831.js?file=gistfile1.cfm"></script>

Pretending for a moment that the chart isn't static, how could we highlight the highest value? By using a "rule" passed in to the tag's new Plot attribute:

<script src="https://gist.github.com/3284834.js?file=gistfile1.cfm"></script>

You've probably never seen this before in a ColdFusion chart, but the code should be simple enough to understand. Here is the result:

<img src="https://static.raymondcamden.com/images/screenshot18.png" />

Here is another example - this time flagging products with sales below a threshold:

<script src="https://gist.github.com/3284856.js?file=gistfile1.cfm"></script>

And the result:

<img src="https://static.raymondcamden.com/images/screenshot19.png" />

The next example I showed demonstrated the preview and zoom features. The preview feature will display a miniature version of the chart and provide simple controls for 'focusing' in on one portion. Zooming works much the same way but is mouse driven. The code is still relatively simple:

<script src="https://gist.github.com/3284912.js?file=gistfile1.cfm"></script>

This one is best experienced, so hit the demo here: <a href="http://www.raymondcamden.com/demos/2012/aug/7/test5.cfm">http://www.raymondcamden.com/demos/2012/aug/7/test5.cfm</a>

Finally - I wanted to show how you can add simple click support. I've <a href="http://www.raymondcamden.com/index.cfm/2012/3/14/Adding-click-support-in-ColdFusion-10-Charting">blogged</a> this before but I built a new demo that tied that data into an... interesting... third party API: <a href="http://ponyfac.es/">http://ponyfac.es/</a>

Here's the code for the main display:

<script src="https://gist.github.com/3284947.js?file=gistfile1.cfm"></script>

And if you are really curious - the code for the "pony" service:

<script src="https://gist.github.com/3284952.js?file=gistfile1.cfm"></script>

You can demo this awesome chart here: <a href="http://www.raymondcamden.com/demos/2012/aug/7/test9.cfm">http://www.raymondcamden.com/demos/2012/aug/7/test9.cfm</a> 

You can learn more about the charting engine in ColdFusion 10 by reading the ZingChart  <a href="http://www.zingchart.com/learn/">docs</a>. Enjoy!