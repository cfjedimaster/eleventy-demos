---
layout: post
title: "Using Errorception with PhoneGap"
date: "2013-06-13T08:06:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2013/06/13/Using-Errorception-with-PhoneGap
guid: 4959
---

I thought I had blogged about <a href="http://www.errorception.com">Errorception</a> before, but unless my search engine skills are failing me I must not have ever gotten around to it. Errorception is a service that aggregates and reports on client-side errors on your web site. By placing a simple embed in your HTML code, all errors will be sent off to their service for your perusal. When I first tested this service, I remember thinking, glibly, that I hope I'd get enough data points to make it worthwhile to demonstrate. I mean, my blog runs well, I never see any errors myself, so I just kinda assumed everything was good. Heh.
<!--more-->
I logged in to the Errorception portal after a week and discovered that there were a <i>huge</i> amount of errors reported. Obviously my blog "worked", and most of these bugs were not preventing people from using my site, but I really had no idea what was going on and Errorception provided a wealth of data. Here are some screen shots from those reports. (Note that the screenshots are from last year.)

First - the general list of issues:

<img src="https://static.raymondcamden.com/images/ec1.png" />

Then a drill down:

<img src="https://static.raymondcamden.com/images/ec2.png" />

And yet another drill down:

<img src="https://static.raymondcamden.com/images/ec3.png" />

Errorception is not a free service, but the pricing model seems rather fair to me and as I said - I can bet you've got more issues than you think you do.

So what about PhoneGap? When I tried to use the Errorception code snippet with PhoneGap, I noted that the error reporting didn't work. I got in contact with the Errorception team and Rakesh Pai was able to figure out the issue. 

Here is the original snippet:

<script src="https://gist.github.com/cfjedimaster/5773177.js"></script>

Rakesh noticed this:

<blockquote>
It turns out, the problem you faced is indeed trivial, fortunately.
The tracking snippet Errorception gives you is protocol-relative, so
as to make it work on HTTP and HTTPS. However, on phonegap, the
protocol for the 'index.html' page is file://, and so the tracking
snippet fails to load (404).

The fix is simple: it's to modify the snippet to load the beacon from
a hard-coded http/https protocol
</blockquote>

Here is his modified snippet:

<script src="https://gist.github.com/cfjedimaster/6078890.js"></script>

That worked! I fired up both my iOS simulator and my Android simulator and as soon as I forced my error they showed up immediately in the console.

<img src="https://static.raymondcamden.com/images/ec4.png" />

Notice that the error is reported differently in iOS versus Android.