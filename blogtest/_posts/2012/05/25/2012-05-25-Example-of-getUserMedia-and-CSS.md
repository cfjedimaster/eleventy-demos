---
layout: post
title: "Example of getUserMedia and CSS Filters"
date: "2012-05-25T11:05:00+06:00"
categories: [development,html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2012/05/25/Example-of-getUserMedia-and-CSS
guid: 4629
---

One of the more interesting features on the bleeding edge of HTML5 is <a href="http://dev.w3.org/2011/webrtc/editor/getusermedia.html">getUserMedia</a>. This API covers basic access to the user's audio and video devices. I first blogged about this a few weeks ago with my <a href="http://www.raymondcamden.com/index.cfm/2012/4/6/Face-detection-with-getUserMedia">face detection</a> example. Since that time I've been curious what other uses would be possible with this support. As I said in the previous blog entry, chat and quick picture taking is kind of obvious. I'm more interested in the <i>not so obvious</i> (and possibly not very practical ;) examples.
<!--more-->
In the excellent <a href="http://www.html5rocks.com/en/tutorials/getusermedia/intro/">HTML5 Rocks tutorial</a> on getUserMedia, they discuss how live video passed to a canvas object can be modified using CSS filters in real time. This allows for interesting effects. For example, Hulk Ray:

<img src="https://static.raymondcamden.com/images/ScreenClip79.png" />

When I saw this demo, I was curious if something fun could be done with it. Along with basic color changes you can also blur the video. I thought it might be cool to create a user registration form that creates a crystal-clear image of you as you fill it out. I know many of you can't use this feature yet in your browser, so here are a few screen shots to demonstrate what I mean. Upon hitting the form, here is how things look.

<img src="https://static.raymondcamden.com/images/ScreenClip80.png" />

And then I fill in a field...

<img src="https://static.raymondcamden.com/images/ScreenClip81.png" />

And another...

<img src="https://static.raymondcamden.com/images/ScreenClip82.png" />

And so on...

<img src="https://static.raymondcamden.com/images/ScreenClip83.png" />

And finally...

<img src="https://static.raymondcamden.com/images/ScreenClip85.png" />

How does it work? I'm going to assume you read my earlier post (or the excellent HTML5 Rocks article I already linked to). The basic gist is - once you've gotten access to the web cam and have directed the output to the canvas, you simply apply different CSS filters based on how correct the form is.

<script src="https://gist.github.com/2788945.js?file=gistfile1.js"></script>

Want to test this yourself or see all of the code? Head over to the demo below.

<a href="http://www.raymondcamden.com/demos/2012/may/25/test2.html
"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>