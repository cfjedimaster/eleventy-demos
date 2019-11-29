---
layout: post
title: "ColdFire 1.0 Released"
date: "2007-09-25T13:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/25/ColdFire-10-Released
guid: 2369
---

I'm happy to say that as of about 2 minute ago, the bits for <a href="http://coldfire.riaforge.org">ColdFire 1.0</a> were released to RIAForge. I'm even happier to say that I didn't have to do a lick of work for this last release - Nathan Mische did it all! This release adds full variables support to the debugger. You can now enter "form" as a variable and see the form scope. Or form.id. Anything really. This version makes use of the JavaScript Dump code from <a href="http://www.netgrow.com.au/">Net Grow</a>. Thank you very much guys for letting us use the code. 

Below is a screen show showing both a dump in the actual page and what tracing the form scope looks like in ColdFire:

<img src="https://static.raymondcamden.com/images/cfv.png">

For folks who don't know what ColdFire is - it is an addon to the popular Firebug extension. It allows you to use ColdFusion debugging without all the crazy output added to the bottom of the page.