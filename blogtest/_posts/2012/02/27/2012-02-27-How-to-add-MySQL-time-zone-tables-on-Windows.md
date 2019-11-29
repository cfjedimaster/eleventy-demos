---
layout: post
title: "How to add MySQL time zone tables on Windows"
date: "2012-02-27T21:02:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2012/02/27/How-to-add-MySQL-time-zone-tables-on-Windows
guid: 4541
---

I'm working with a database that needs to be populated with time zone data. Turns out that on Unix-based systems, this is rather simple and can be done entirely from the command line. On Windows though (and apparently HP-UX too), you can't use that method. Instead, the MySQL site has downloads here:

<a href="http://dev.mysql.com/downloads/timezones.html">Time zone description tables</a>

I needed this tonight so I grabbed the zip, extracted, and went... wtf...

<img src="https://static.raymondcamden.com/images/ScreenClip27.png" />

So maybe I'm dumb, but I expected SQL files I could import via my client or even the command line. I had absolutely no idea what in the heck this was.

Turns out - these are the actual physical file formats used by MySQL to store data. To restore these files, you literally just find your database directory (you can find the root by looking at your MySQL my.ini file) and just copy them in. That's it. 

I restarted MySQL just... well just because I figured I'd need to, and it the tables (and data) showed up.