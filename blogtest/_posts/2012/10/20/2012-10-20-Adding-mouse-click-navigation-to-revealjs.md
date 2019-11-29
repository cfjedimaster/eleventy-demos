---
layout: post
title: "Adding mouse click navigation to Reveal.js"
date: "2012-10-20T17:10:00+06:00"
categories: [javascript,misc]
tags: []
banner_image: 
permalink: /2012/10/20/Adding-mouse-click-navigation-to-revealjs
guid: 4762
---

I'm growing more and more fond of the HTML presentation framework <a href="http://lab.hakim.se/reveal-js/#/">Reveal.js</a>. One thing I was curious about was whether I could use mouse clicks to navigate a presentation. Why? I'm considering using a Bluetooth device to navigate a presentation while I'm away from my laptop. I've also recently installed <a href="https://itunes.apple.com/us/app/touch-mouse/id338237450?mt=8">Touch Mouse</a> from Logitech, which allows your iOS device to drive a mouse (both the cursor and mouse buttons). 

I whipped up the following code, which I added to the bottom of the default Reveal.js demo presentation.

<script src="https://gist.github.com/3924728.js?file=gistfile1.js"></script>

The first line sets up the event handler for mouse clicks. The second event handler disables the context menu. This is necessary for right menu clicks. Without it you get the normal right click context menu.

Finally, the actual event handler is somewhat trivial. You check which button was clicked  and then use the Reveal API to go either forward or backward. (The Logitech app supports a center mouse button too. You could bind that to the overview feature, which shows you all the slides.)

That's it. Regular links still work fine, which is kind of cool. I'm not sure if I'll actually use this, but I thought it was a fun experiment. If you want to test this, hit up the demo below.

<a href="http://www.raymondcamden.com/demos/2012/oct/20/"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>