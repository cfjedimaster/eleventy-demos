---
layout: post
title: "RIAForge Schedular Mystery Solved (Mostly)"
date: "2007-11-30T09:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/30/RIAForge-Schedular-Mystery-Solved-Mostly
guid: 2506
---

I've blogged a few times already about the <a href="http://www.riaforge.org">RIAForge</a> Schedular issue. People who registered at RIAForge were supposed to get one email a day for the categories they monitored. All of a sudden, about 2 weeks ago, three emails about an hour separated, started to go out. I was a bit slow to addressing this (hey, it was a holidays!), but I found it the problem.

I added this to my code:

<code>
&lt;cflog file="tasktest" text="size of emailusers is #emailusers.recordcount#, ref=#cgi.http_referer#, browser=#cgi.http_user_agent#, remote_addr=#cgi.remote_addr#, remote_hote=#cgi.remote_host#"&gt;
</code>

Basically I logged the remote IP of the request. The 12AM task had the right IP for my machine. The latter two events had another IP. My first thought was - since I shared the RIAForge code, people know the URL that is used to fire off the task. Maybe someone accidentally set up the task and didn't realize it would actually work. Turns out though the IP is from the previous location running RIAForge. That machine was supposed to be shut down, but it looks like it never was.

I could just add a quick check for the IP, but I'll be lazy and simply check for the a URL variable:

<code>
&lt;cfif not structKeyExists(url,"youthinkIlltellyouguys")&gt;
  &lt;cfreturn&gt;
&lt;/cfif&gt;
</code>

Anyway - sorry it took so long for me to wrap this up. If folks still get 3 copies tomorrow morning, please let me know.