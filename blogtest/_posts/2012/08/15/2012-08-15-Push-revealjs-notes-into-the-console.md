---
layout: post
title: "Push reveal.js notes into the console"
date: "2012-08-15T17:08:00+06:00"
categories: [javascript,misc]
tags: []
banner_image: 
permalink: /2012/08/15/Push-revealjs-notes-into-the-console
guid: 4702
---

I just read a great blog post by Christian Heilmann (Principal Developer Evangelist for MDN) about how you can use the detached browser console as a way to broadcast speaker notes in an HTML-based presentation: <a href="http://christianheilmann.com/2012/08/15/browsers-have-a-presenter-mode-console-info/">Browsers have a presenter mode: console.info()</a> It's an incredibly simple and practical idea. His code was tied to the <a href="https://github.com/pepelsbey/shower">Shower</a> presentation framework (a new one for me), but it took all of two minutes to repurpose it for <a href="http://lab.hakim.se/reveal-js">reveal.js</a>.
<!--more-->
reveal.js has an event handler for slide loading called slidechanged. I added an event listener for that which checks the loaded slide for the notes class. If it finds it, I use the same regex as Christian and drop it into the console.

<script src="https://gist.github.com/3363445.js?file=gistfile1.js"></script>

Here is a quick screenshot. Note that I have <i>not</i> detached the console for this shot. (Also - I just now noticed the horrible grammar in the notes. Since these were just for me, I'm not going to fix it. ;)

<img src="https://static.raymondcamden.com/images/screenshot22.png" />