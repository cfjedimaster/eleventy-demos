---
layout: post
title: "Two Eclipse search tips"
date: "2011-06-09T14:06:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2011/06/09/Two-Eclipse-search-tips
guid: 4262
---

Both of these tips come from the "Obvious Department", but as I recently discovered myself <i>not</i> using them, I'm going to assume I'm not the only one a bit slow on the uptake.
<!--more-->
First - it kept bugging me that Find within a file would only search forwards. I'd forget - cuss when it didn't find something I knew was there - and then either click the search backwards checkbox or quickly jump to line one and repeat the search. But - there is a better option - Wrap Search:

<img src="https://static.raymondcamden.com/images/ScreenClip110.png" />

What's nice is that this seems to persist. Check it and you shouldn't have to check it again.

Now for the second tip. I work with a <i>very</i> repository of code. While searching, if I have to search from the root, it would take about 5 minutes or so depending on how loose my filter was. Turns out I had enabled regex for my search even when I wasn't using regex:

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip111.png" />

See the checkbox to the right? I had it checked and thought - ok - I don't need it - is it faster turned off? Turns out - it was <i>way</i> faster. 

Hope this helps!