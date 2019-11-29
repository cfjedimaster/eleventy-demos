---
layout: post
title: "Really useful Chrome Dev Tools tip"
date: "2014-12-10T09:18:58+06:00"
categories: [development,javascript,jquery]
tags: []
banner_image: 
permalink: /2014/12/10/really-useful-chrome-dev-tools-tip
guid: 5428
---

This is not necessarily a new feature, but one that really helped me yesterday so I thought I'd share it. I do not believe this exists in Firefox now (I'm using Firefox as my primary browser now), and I did not check IE, so it may be a Chrome-only feature at the moment. Yesterday I was trying to help a friend debug an incredibly weird problem with an incredibly simple bit of jQuery.

<!--more-->

His page had a form with a submit handler. On submit he serialized the code, sent it to a service, and put the response in a div. That is about as simple as you can get. But oddly it was doing different things in different browsers. When it worked right, it was fine, but sometimes it would display the <i>current</i> page inside the div that was meant to display the service result. 

To make this even more crazy, when I commented out that part of the code, it <strong>still</strong> did that. I was going crazy trying to figure it out. I then decided to try something. I went to the div in question, right clicked, and used a Chrome Dev Tools feature. Within the Elements panel, you can right click on any DOM element and tell the browser to pause when something messes with it.

Here is an example:

<a href="http://www.raymondcamden.com/wp-content/uploads/2014/12/Screen-Shot-2014-12-10-at-9.07.23-AM.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2014/12/Screen-Shot-2014-12-10-at-9.07.23-AM.png" alt="Screen Shot 2014-12-10 at 9.07.23 AM" width="593" height="466" class="alignnone size-full wp-image-5429" /></a>

I reloaded his page, submitted the form, and as expected, the browser paused. Here is a sample of what that looks like:

<a href="http://www.raymondcamden.com/wp-content/uploads/2014/12/Screen_Shot_2014-12-10_at_9_08_04_AMmod.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2014/12/Screen_Shot_2014-12-10_at_9_08_04_AMmod.png" alt="Screen_Shot_2014-12-10_at_9_08_04_AMmod" width="840" height="334" class="alignnone size-full wp-image-5430" /></a>

I've added a few callouts to the screen shot to make it a bit more obvious. The lowest callout is just a nice message from the Dev Tools saying why it fired. It may be obvious, but I dug that. The second call out is the crucial one. It is telling me exactly what script/code modified my DOM. In his code (the screen shots above are just from a local sample), it was actually <i>another</i> piece of code loaded by the template. It was a generic forms handler plugin that had <i>also</i> listened in for the form submit and was modifying the DOM. I had no idea this was even being used on the site until I tried this particular type of debugging.