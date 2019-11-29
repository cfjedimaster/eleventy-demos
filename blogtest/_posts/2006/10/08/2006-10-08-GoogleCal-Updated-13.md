---
layout: post
title: "GoogleCal Updated (1.3)"
date: "2006-10-08T22:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/10/08/GoogleCal-Updated-13
guid: 1574
---

I've updated <a href="http://ray.camdenfamily.com/projects/googlecal/">GoogleCal</a> - my ColdFusion API for Google's Calendar service. It now "officially" supports adding events. I also added code to retrieve all the calendars for a user. 

Let me take this opportunity to once again complain about Google's API. I've already <a href="http://ray.camdenfamily.com/index.cfm/2006/9/28/GoogleCal-beta">complained</a> about their Add Entry API (it requires 3 HTTP calls). 

Today I discovered yet another issue. To get a calendar, let's say calendar A, you have a URL X. This URL does not require authentication, which by itself is a cool idea. It means you can share the URL with others. However - that is the <b>only</b> URL you have. There is no option to use a URL that requires authentication.

So guess what - the URL to add an entry does not have the authentication token in it. You use it along with a username/password value to add your data.

So in case it isn't clear - what this means is that for one calendar you have 2 different URLs. One for reading and one for adding. What is even better is that you can't get the "Add Entry" URL yourself unless you manually modify the "Read" URL. 

Total. Pain. In. The. Rear.

Anyway - enjoy the updated version. I'll be happily switching back to more Yahoo demos this week.