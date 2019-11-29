---
layout: post
title: "Warning to Adium/iTunes users"
date: "2007-10-08T10:10:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/10/08/Warning-to-AdiumiTunes-users
guid: 2396
---

I just had a weird issue where Adium refused to start up. I'd get the contact window, but it would never connect and I had to force quit it. I searched their bug tracker and came across this <a href="http://trac.adiumx.com/ticket/7315">ticket</a>, which basically says that if iTunes is stuck and you are using the iTunes plugin for Adium, your Adium will hang too. iTunes wasn't crashed on my machine, but had been streaming audio and was stuck on 'Rebuffering Stream'. I dismissed that alert, restarted Adium, and it worked again.