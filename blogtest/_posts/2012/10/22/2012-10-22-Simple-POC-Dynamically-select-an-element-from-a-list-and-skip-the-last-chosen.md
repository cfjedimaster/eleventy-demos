---
layout: post
title: "Simple POC - Dynamically select an element from a list and skip the last chosen"
date: "2012-10-22T18:10:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2012/10/22/Simple-POC-Dynamically-select-an-element-from-a-list-and-skip-the-last-chosen
guid: 4764
---

Pardon the super-long title up there. This is based on a simple StackOverflow question from today (<a href="http://stackoverflow.com/questions/13015128/select-random-list-item-and-add-class">Select random list item and add class</a>) based on a simple premise: Given a set of tags, how would you remove a class from one of them and dynamically re-apply it to another one chosen by random?
<!--more-->
I chimed in, as did others, but I thought it might be interesting to share my solution here. I updated my code to make use of SessionStorage to remember the last item selected. As you know, I'm a <strong>big</strong> fan of LocalStorage and other "practical" HTML5 features, and I thought this was a nice, if simple, example of where you could use the API. Here's the code:

<script src="https://gist.github.com/3934580.js?file=gistfile1.js"></script>

And you can run it on JSBin here: <a href="http://jsbin.com/axudey/1/">http://jsbin.com/axudey/1/</a>

There really isn't much to say about this. If anyone needs something explained, just ask. Again - I'm mainly sharing it as a practical example of LocalStorage. 

P.S. As explained on StackOverflow, I intentionally made the code more verbose then it needed to be to help explain it to the user. Since we are still talking just 20 lines of code here, I don't think that's a big deal. ;)