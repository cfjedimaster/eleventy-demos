---
layout: post
title: "Tales from the Trenches - Swapping Libraries"
date: "2012-09-22T13:09:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2012/09/22/Tales-from-the-Trenches-Swapping-Libraries
guid: 4738
---

Ok, not a very deep post, but my buddy Tai over at <a href="http://www.luxanimals.com/">Luxurious Animals</a> just told me a story on IM I couldn't resist sharing. 

He built a nice animation of birds in flight, and after implementing a fix, someone reported that the birds no longer moved.

That user went home and this morning, reported that the birds were in their final position.

Why?

Turns out that someone swapped out a JavaScript library and the duration value went from milliseconds to seconds. The animation now takes almost 28 hours to complete. (But hey, it still works, right?)

Woot. This is why I love client-side development. ;)