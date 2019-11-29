---
layout: post
title: "Chrome Dev Tools and WebSQL"
date: "2012-04-04T10:04:00+06:00"
categories: [development,html5,javascript]
tags: []
banner_image: 
permalink: /2012/04/04/Chrome-Dev-Tools-and-WebSQL
guid: 4580
---

In my <a href="http://www.raymondcamden.com/index.cfm/2012/4/3/Adding-database-synchronization-to-your-PhoneGap-project">blog post</a> yesterday I talked about database synchronization and PhoneGap. One thing I didn't mention was that almost all of my code runs just fine in the desktop. The only thing that didn't work was the network check. While I worked on this demo, I found Chrome Dev Tools to be incredibly helpful. Did you know that it includes a way to see what databases are in use at a website?
<!--more-->
Open up your Dev Tools and click the Resources panel. If the site uses any databases, you will see them listed here.

<img src="https://static.raymondcamden.com/images/ScreenClip65.png" />

You can expand the database and look at the tables. Clicking on a table will list all the data available.

<img src="https://static.raymondcamden.com/images/ScreenClip66.png" />

<strike>Currently there isn't a way to introspect the table structure or write arbitrary SQL. It should be possible to do SQL via the console.</strike> Oops, I was wrong. Down in the comments below Marcin pointed out that if you click the table, you get a console that allows for arbitrary SQL. That's fraking cool!