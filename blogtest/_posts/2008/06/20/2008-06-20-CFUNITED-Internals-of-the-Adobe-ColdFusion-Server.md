---
layout: post
title: "CFUNITED - Internals of the Adobe ColdFusion Server"
date: "2008-06-20T18:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/20/CFUNITED-Internals-of-the-Adobe-ColdFusion-Server
guid: 2892
---

I just sat through "Internals of the Adobe ColdFusion Server" by Eliot Sprehn. This was probably the most fascinating class I've taken at cfunited. Eliot talked about - well - everything behind the scenes of your ColdFusion code. This included some rather interesting information about why certain operations are slow. I'll also say that he has convinced me that 'cheating' (ie, using hidden methods of these internal CF objects) is not as bad as I had thought. He made the point that as long as all your code uses one utility method that had the 'cheat', if CF upgrades to a new version where the cheat isn't needed, you can just replace the cheat with the proper code.

Anyway - you get the point. I'd highly recommend checking out his presentation. I just checked - you can watch the presentation <a href="http://cfunited.com/presentations/2008/ADV259">here</a>. This was definitely one of the best surprises for me at this conference.

(And sorry for the slow blogging today - got a killer of a head cold, which should make my presentation tomorrow fun.)