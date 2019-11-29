---
layout: post
title: "Getting a quota error with Google and you've barely touched your limit?"
date: "2013-02-13T11:02:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2013/02/13/Getting-a-quote-error-with-Google-and-youve-barely-touched-your-limit
guid: 4854
---

I spent the last 30 minutes or so trying to figure out why in the heck my simple Google Maps demo was giving me this error in the console:

<blockquote>
This site has exceeded its usage quota for Google Maps JavaScript API v3. See here for details on usage limits: https://developers.google.com/maps/documentation/javascript/usage
</blockquote>
<!--more-->
The "site" in question was localhost and I knew I was nowhere near my 25,000 daily limit. In fact, the Google API Console reported 44 hits over the past 30 days. To make things even more maddening, when I intentionally included a bad API key I got the exact same error.

Turns out I had forgotten to <b>enable</b> Google Maps V3. This is done in the "Services" menu:

<img src="https://static.raymondcamden.com/images/ScreenClip183.png" />

You must turn on API access on the relevant line:

<img src="https://static.raymondcamden.com/images/ScreenClip184.png" />

Obvious, right? I just wish the console message had been actually helpful.