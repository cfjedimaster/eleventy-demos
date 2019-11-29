---
layout: post
title: "Using the Page Visibility API with Edge Animate"
date: "2013-05-29T10:05:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2013/05/29/Using-the-Page-Visibility-API-with-Edge-Animate
guid: 4947
---

Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2013/5/28/Using-the-Page-Visibility-API">blogged</a> about the Page Visibility API. In that entry I talked about how the API works and how it can be used. Today I thought I'd demonstrate another example of this API. Imagine you have an <a href="http://html.adobe.com/edge/animate/">Edge Animate</a> animation that runs in a loop. It would be cool if you could use the Page Visibility API to pause the animation when the browser tab isn't being displayed. Here is how I solved this.
<!--more-->
First off, I have to admit that I did not know how to create a looping EA animation. This blog entry explained it well: <a href="http://www.cyprich.com/2012/09/05/how-to-create-a-loop-in-adobe-edge-animate/">How to Create a Loop in Adobe Edge Animate</a>. Essentially you create a trigger at the end of your animation that causes the whole thing to start over. Simple and effective.

I then put all of my design skills to use to create the following:

<iframe width="600" height="400" src="http://www.raymondcamden.com/demos/2013/may/29/Untitled-1.html"></iframe>

Epic, right? The next part was rather simple. (Again, the assumption here is that you read the <a href="http://www.raymondcamden.com/index.cfm/2013/5/28/Using-the-Page-Visibility-API">last post</a>.) In Edge Animate I created a <strong>creationComplete</strong> event and then used the following code.

<script src="https://gist.github.com/cfjedimaster/5670449.js"></script>

This is basically the same code as shown in the previous entry, but now it makes use of the EA APIs to stop and play the animation.

<a href="http://www.raymondcamden.com/demos/2013/may/29/Untitled-1.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>