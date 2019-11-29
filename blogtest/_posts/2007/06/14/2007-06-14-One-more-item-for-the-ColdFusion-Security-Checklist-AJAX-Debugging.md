---
layout: post
title: "One more item for the ColdFusion Security Checklist - AJAX Debugging"
date: "2007-06-14T20:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/14/One-more-item-for-the-ColdFusion-Security-Checklist-AJAX-Debugging
guid: 2123
---

I've had a <a href="http://www.raymondcamden.com/coldfusionsecuritychecklist.cfm">ColdFusion Security Checklist</a> for a while now, but there is an item I will have to add once ColdFusion 8 finally ships.
<!--more-->
One of the cool new AJAX features is the debugger. You can turn it on by adding ?cfdebug to your request. While this is nice and cool (and very powerful), it is also something you probably don't want to allow on a public web site. 

The ColdFusion 8 Administrator adds a new option in the Debug Output Settings page: <b>Enable AJAX Debug Log Window</b>

It is important to remember though that AJAX requests, by their very nature, are open to inspection, especially with tools like Firebug. So turning off the AJAX Debug Log Window is probably recommended, but don't have any unwarranted expectations about your AJAX code. It is as "safe" as hidden form fields or cookies. (In other words - you can't trust it.)