---
layout: post
title: "is your framework up to date?"
date: "2008-03-20T15:03:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2008/03/20/is-your-framework-up-to-date
guid: 2720
---

I was helping a buddy debug an issue this morning with his Model-Glue web site. The error was being thrown from Model-Glue itself, not his own application code, but he naturally assumed the issue was with his site.

He shared with me the line of code throwing the error, and when we compared his line with my line, it became apparent right away that his version of Model-Glue was a bit out of date. 

Once he updated (to version 2.0.304) the issue went away. We are all trained to get our operating systems and other programs up to date, but it probably makes good sense to check your framework versions from time to time as well. 

Obviously if everything is fine you may not want to mess with things, and also you want to be careful if multiple sites on the same box are using the framework, but it is something to keep in mind!