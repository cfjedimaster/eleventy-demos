---
layout: post
title: "Table not found error when you know it exists? Check your triggers"
date: "2011-03-16T15:03:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2011/03/16/Table-not-found-error-when-you-know-it-exists-Check-your-triggers
guid: 4160
---

Credit for this goes to my buddy Lance Staples, who is somewhat of a Luddite when it comes to blogs/social media/etc. I was testing a simple ColdFusion form process that kept throwing a database error saying that a table did not exist. I checked my database and it was there so I wasn't quite sure what the issue was. Then I noticed the error said the table was 1stcomp.dbo.table. In this form, "1stcomp" is the database. In my local copy of the database I had used FirstComp for the name. Easy enough to fix - right? Check the SQL. But I noticed in the error that even the SQL wasn't using a fully qualified name. It just used "table". So what the frack, right?

I noticed that the table being complained about, let's call it douchepickle, wasn't the same table in the query, let's call it catfryingpan. I mentioned this to Lance who remembered that a trigger was in play here. Inserts into catfryingpan ran a trigger and in <i>that</i> SQL the calls to douchepickle were qualified with 1stcomp.dbo.

I'll be honest - I've never written a trigger in my life. I know what they are for of course, but I certainly never though to check in there. Hopefully if this happens to you this blog entry will be helpful!