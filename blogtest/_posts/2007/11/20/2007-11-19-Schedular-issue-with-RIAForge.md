---
layout: post
title: "Scheduler issue with RIAForge"
date: "2007-11-20T07:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/20/Schedular-issue-with-RIAForge
guid: 2485
---

Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2007/11/19/Multiple-Emails-from-RIAForge-Yes-I-know">blogged</a> about an issue <a href="http://www.riaforge.org">RIAForge</a> was having. What was supposed to be a once a day email about project updates magically turned into a three a day email. Here is the update.

I turned on the scheduler logger to see if I noticed anything odd. Unfortunately - nothing odd showed up there:

<code>
"Information" ,"scheduler-2", "11/20/07" ,"00:05:00", ,"C:\ColdFusion8\logs\scheduler.log initialized"
"Information" ,"scheduler-2" ,"11/20/07" ,"00:05:00" ,,"[RIAForge] Executing at Tue Nov 20 00:05:00 EST 2007"
"Information" ,"scheduler-2" ,"11/20/07" ,"00:05:03",,"[RIAForge] Rescheduling for :Wed Nov 21 00:05:00 EST 2007 Now: Tue Nov 20 
</code>

Since I never messed with the scheduled task, this is what I expected. So why is the template running three times? And in what seems to be hourly increments?

For my next test I'm going to add some debugging to the code that does the email. I'm going to have it log the time and a few CGI variables. 

I shared the code for RIAForge a few months back so it's possible someone is bored and is firing the event manually. I'll probably also add the 'url hack' I use for other scheduled tasks. Basically, if url.something doesn't exist, don't run. This is also handy for me as it tends to protect me from accidentally running the code myself.

p.s. I assume folks find this investigation interesting, so I'll keep posting updates.