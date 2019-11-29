---
layout: post
title: "ColdFusion Quickie - Turning a set of XML nodes into a string."
date: "2013-01-03T10:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/01/03/ColdFusion-Quickie-Turning-a-set-of-XML-nodes-into-a-string
guid: 4821
---

Yesterday a reader sent me a question concerning XML handling and ColdFusion, and while it was rather simple, I thought others might like to see a quick demo of it as well. Imagine for a minute this simple XML data.
<!--more-->
<script src="https://gist.github.com/4444109.js"></script>

The XML above describes a simple article. You've got a title, an author object, and paragraphs of text each as their own XML node. The reader simply wanted to know how to get those paragraphs into one string variable. You may be tempted to do this:

<script src="https://gist.github.com/4444113.js"></script>

But doing so returns you one XML node. 

<img src="https://static.raymondcamden.com/images/ScreenClip163.png" />

One of the oddities of ColdFusion's XML handling is that it treats some things as a singular value and some things like an array. So if I take the same "address" and run arrayLen() on it, like so...

<script src="https://gist.github.com/4444127.js"></script>

I'll get 4. This is the clue then that tells us to simply loop over them like an array and append each value to a string.

<script src="https://gist.github.com/4444131.js"></script>

Note that I've also wrapped the values in P tags to help me display it later.