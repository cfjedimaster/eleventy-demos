---
layout: post
title: "Quick Tip: Running WebSQL commands in Chrome Dev Tools"
date: "2013-01-16T10:01:00+06:00"
categories: [development,html5,javascript]
tags: []
banner_image: 
permalink: /2013/01/16/Quick-Tip-Running-WebSQL-commands-in-Chrome-Dev-Tools
guid: 4831
---

I'm a big fan of WebSQL, which is, unfortunately, going the way of the Dodo since it was apparently just too easy to use. One of the nice things about the feature is that Chrome Dev Tools make it real easy to use. As an example, here is what you can see on a page making use of WebSQL.
<!--more-->
<img src="https://static.raymondcamden.com/images/ScreenClip164.png" />

As you can see, both the database and its tables are enumerated. If you click on the table, you get a list of data.

<img src="https://static.raymondcamden.com/images/ScreenClip165.png" />

There's no UI hint to this, but you can click the columns to sort. 

The coolest feature though is the one that is <i>very</i> non-obvious (in my opinion). If you click the database name, you may notice the right side of the panel empties out...

<img src="https://static.raymondcamden.com/images/ScreenClip166.png" />

That's actually an editor. If you start typing you can execute arbitrary SQL. Hell, Chrome will even autocomplete table names and SQL commands for you. Here's an example:

<img src="https://static.raymondcamden.com/images/ScreenClip167.png" />

One thing to watch out for. If you execute a SQL command that returns no results, Chrome doesn't display anything. You don't get a nice "0 Results". In fact, Chrome will remove the SQL from the pane.