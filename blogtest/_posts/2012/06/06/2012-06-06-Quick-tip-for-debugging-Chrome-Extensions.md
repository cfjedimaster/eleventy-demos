---
layout: post
title: "Quick tip for debugging Chrome Extensions"
date: "2012-06-06T16:06:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2012/06/06/Quick-tip-for-debugging-Chrome-Extensions
guid: 4642
---

I'm working on a new Chrome extension now (mainly as an excuse to avoid writing this article I'm supposed to turn in), and ran into an interesting problem. I was making use of console.log to debug the extension and noticed it didn't show up in the main console. I figured that made some sense. A user may have a bunch of extensions and you wouldn't want them adding noise to your console. However, I saw examples of extensions that made use of the console so I figured they had to show up somewhere. 

This <a href="http://code.google.com/chrome/extensions/tut_debugging.html">tutorial</a> on the Chrome Extensions site mentioned right clicking on your extension icon and selecting "Inspect popup". But my extension didn't have an UI and that option wasn't available. I then noticed something on the Extensions page:

<img src="https://static.raymondcamden.com/images/ScreenClip95.png" />

See the link by "Inspect views"? Clicking that fires up a Developer Tools window just for your extension. It's like Chrome was smart enough to recognize that there wasn't a real background page and generated one for you. 

Sweet.