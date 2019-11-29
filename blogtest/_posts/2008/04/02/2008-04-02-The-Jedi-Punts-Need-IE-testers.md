---
layout: post
title: "The Jedi Punts - Need IE testers"
date: "2008-04-02T23:04:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2008/04/02/The-Jedi-Punts-Need-IE-testers
guid: 2747
---

I've been working with a <a href="http://lighthousepro.riaforge.org">Lighthouse Pro</a> user today who has discovered a very odd issue. When generating reports (the flash charts version), he got a null pointer error from ColdFusion at the end of the first chart.

I opened up Firefox, gave it a whirl, and couldn't reproduce the error. 

We then found that the error only occurred in IE (I tried 7, not 6). 

So this is what bugs me. It's a CF error - not a client side error. I debugged the FORM scope after posting from the page where you select what to chart and it was the exact same. I debugged the Data variable which all the charts use and it was the exact same in both browsers (as expected), yet somehow only IE is throwing the server side issue. 

It seems impossible - but we are both seeing the same thing. Soooo.... consider this my official call for help. If anyone out there wants to try to duplicate this, and actually can duplicate it, post here. FYI - the database the user was running was SQL Server, not that I think it should matter, but there ya go.

I hope we can figure this out - because it certainly is interesting (and frustrating).