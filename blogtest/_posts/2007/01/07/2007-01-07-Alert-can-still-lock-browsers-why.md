---
layout: post
title: "Alert can still lock browsers - why?"
date: "2007-01-07T13:01:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2007/01/07/Alert-can-still-lock-browsers-why
guid: 1759
---

I remember back in the old days (Netscape was king!) when learning JavaScript that it was pretty easy to lock up the browser with the Alert statement. All you had to do was create an infinite loop of JavaScript alerts and then the browser was essentially locked up.

So while this <i>typically</i> only happens to poor developers who do it to themselves (as I did a few days ago),  why haven't the browser makers done anything about this? Is it really something that only affects us doing development? While I'm not quite sure what the UI would be - it seems like something that could be solved. Perhaps the browser could simply keep an internal counter of the number of alerts fired. Once it hits 30, simply put a prompt on the alert asking if the user would like to suppress all future alerts.