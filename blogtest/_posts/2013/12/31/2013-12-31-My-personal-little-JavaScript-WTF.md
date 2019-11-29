---
layout: post
title: "My personal little JavaScript WTF"
date: "2013-12-31T14:12:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2013/12/31/My-personal-little-JavaScript-WTF
guid: 5114
---

<p>
There are presentations and even a <a href="http://wtfjs.com/">website</a> dedicated to JavaScript oddities. I'm sure this one I ran into has been discussed before, but it certainly surprised me.
</p>
<!--more-->
<p>
I wrote a little function that I thought was pretty trivial. Given a set of objects, iterate over them, check some value, and if good, append matches to an array. Here is an example of what I wrote.
</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/cfjedimaster/Su9eh/1/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
<p>
When I ran my code, I kept getting a 0-length array back. I added a simple variable inside my condition and confirmed that it was matching and appending those matches, so... wtf?
</p>

<p>
Some of you probably see it right away. It took me a good twenty minutes of frustration before I saw it. See the push call? I used brackets instead of parenthesis. I have no idea why this didn't throw an error and I'd love to know why. Ok, JavaScript gurus, can you explain this one?
</p>