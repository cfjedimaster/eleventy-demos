---
layout: post
title: "Ask a Jedi: Encrypting ColdFusion Templates"
date: "2005-12-16T16:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/16/Ask-a-Jedi-Encrypting-ColdFusion-Templates
guid: 974
---

Here is a great question:

<blockquote>
Does anyone encrypt their templates anymore? Someone once told me this was a good practice to do on production servers.
</blockquote>

First off - I don't think this is a good idea for production servers per se. The idea behind encrypting templates was to protect your intellectual property. So for example - one could write a custom tag, encrypt it, and share it with the world. Of course, the Open Source Zealots would be down your throat (grin), but it was an option. Unfortunately, the encryption used to encrypt templates wasn't very strong. It was broken years ago. It would stop honest people, but then again, honest people respect copyrights anyway. CFMX7 allows for <a href="http://www.macromedia.com/software/coldfusion/productinfo/features/static_tour/deployment/#pf3">sourceless deployment</a> - so that is an option. 

To be honest - I don't worry about it. All of my code is free, period, I just guilt folks into buying crap from my <a href="http://www.amazon.com/o/registry/2TCL1D08EZEYE">wish list</a>. In theory someone could steal my code and put their name on it - but I'd be willing to bet it would be noticed. At the company level, <a href="http://www.mindseye.com">Mindseye</a> uses a contract to control our intellectual property. Also, many of our ColdFusion-based clients actually like to be able to modify the code. So my gut answer is to tell you to either use the law - or don't worry about it.

I'd be very curious to see if any of my readers still worry about encrypting templates.