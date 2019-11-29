---
layout: post
title: "Reminder on CFLOGON and Web Based Security"
date: "2006-08-19T11:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/08/19/Reminder-on-CFLOGON-and-Web-Based-Security
guid: 1482
---

I <a href="http://ray.camdenfamily.com/index.cfm?mode=entry&entry=93DF9C26-E949-7552-0FD3D62E488E25AB">blogged </a> about this way back in 04, but I had a client who ran into this yesterday and lost a good few days trying to debug. 

Folks who read my blog know that CFLOGON is probably the only thing about ColdFusion that I do not like. I was a huge fan of it, and in fact, all of my applications still use it, but after being burned by it one too many times, I'm hoping to remove the use of it completely over time.

The client that contacted me couldn't understand why their application worked perfectly in testing, but when deployed to a live site, <i>with web server security turned on</i>, the application threw an error. Why did it do this?

ColdFusion's roles based security does not have a way to tell you if you are logged on. (Why?) The typical way of doing it is to check the result of getAuthUser(). If it is blank, you aren't logged in.

However, one of the features of ColdFusion's system is to automatically integrate with web server security. What would happen is that the user would hit the site, logon at the web server level, and getAuthUser() would return that username. Therefore, the site thought he was logged in when he really never did. 

I've fixed this myself by simply using a session flag. But then you need to make sure you use the session based version  of roles based security (which is not the default). Consider this a warning if you use roles based security.