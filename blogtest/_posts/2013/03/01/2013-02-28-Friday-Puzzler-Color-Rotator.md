---
layout: post
title: "Friday Puzzler: Color Rotator"
date: "2013-03-01T07:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/03/01/Friday-Puzzler-Color-Rotator
guid: 4870
---

It has been a while since my last ColdFusion Friday puzzler, so I hope you enjoy this one. It occurred to me while driving my eldest to school Wednesday morning and in my "not quite awake yet" semi-conscious daze, it seemed like a sneaky little puzzle. I figured out a possible simple solution before I got home, but I'm curious to see what others make of it. Ready?
<!--more-->
Your client wants their web site to make use of a rotating color background. Each day, the background color of the web site will change. The list of colors used for the background are: red,blue,green,yellow,orange. (I know, I know, this is why I don't do web design.) 

Your goal is to write a UDF that accepts a date and selects a color. If you pass the day after that initial date, you should pick the next day in the list. On the day you pick orange, the next day would pick red. 

You may think - why not simply use the the day of the week modded by 5? 

<script src="https://gist.github.com/cfjedimaster/5064328.js"></script>

But this doesn't work on the edges. You could switch to the day of the year but would have the same issue (although a heck of a lot less). So how would you solve this issue? Note that you cannot persist anything in the database (or file system, etc).