---
layout: post
title: "Ajax-based CFGRID and IE issue"
date: "2008-08-05T15:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/08/05/Ajaxbased-CFGRID-and-IE-issue
guid: 2958
---

I've been working with a user on this issue and since it involves CSS and IE (two things I try not to be familiar with), I figured I'd blog it to see if one of my readers can help.

Here is the gist of the problem. The user has a cfgrid, ajax-based (well, the new fancy HTML grid, in this demo it won't use HTTP to load it's data), that is editable. In IE something odd happens. 

When you click and edit a cell, the cell goes blank. But if you click on another row, you can see your data. If you click back, and try to type, your data <i>is</i> there, so you don't lose anything. When you submit, the mods are there as well.

Here are some screen shots. First, the table before anything is done:

<img src="https://static.raymondcamden.com/images//Picture 116.png">

Now here it is, blank, right after I finished modifying it:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 27.png">

And here is a shot with me selecting another row. You can see now that the data is there:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 35.png">

My guess is that this has to be a simple CSS/IE conflict. Anyone else run into it? Anyone have a possible solution?