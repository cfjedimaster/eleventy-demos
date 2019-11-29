---
layout: post
title: "Nimer's Log Viewer"
date: "2006-09-08T11:09:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2006/09/08/Nimers-Log-Viewer
guid: 1521
---

This is old news but as I used it recently I wanted to remind folks. Mike Nimer has created a cool Eclipse plugin called the <a href="http://www.mikenimer.com/eclipse/logviewer/index.cfm">CF Log Viewer</a>. It lets you display a ColdFusion log directly in Eclipse. It isn't a straight text dump but a nicely formatted display.

What is <i>really</i> nice about it is that it constantly monitors the file. This means you can use cflog commands and watch them show up in Eclipse as you hit your site. I used it to help me debug issues with XML-RPC support for <a href="http://www.blogcfc.com">BlogCFC</a>. 

I'd like to see him allow for removing columns so that you could focus in on the text and not the other messages. (But to be fair - Nimer provides the source so I could do it myself. In my spare time. Um, right. :)

As a side note - you should read Charlie Arehart's new series on <a href="http://carehart.org/blog/client/index.cfm/2006/9/6/fusiondebug_part1">FusionDebug</a> as it can provide an even nicer way to debug.