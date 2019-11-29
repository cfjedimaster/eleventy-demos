---
layout: post
title: "Can't connect Apache and CF due to previous connection?"
date: "2006-01-19T09:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/19/Cant-connect-Apache-and-CF-due-to-previous-connection
guid: 1038
---

My box was running ColdFusion under JRun, but I decided to switch back to a "simple" server setup. During the install, however, the connection to Apache wasn't updated. It continued to point to the JRun server instead of my new server. When I tried to run the connector though, I was told that Apache was already configured for JRun.

So - at first I simply went into my httpd.conf file and removed any mention of JRun. This didn't help. I then ran the bat file to remove all connections. This didn't work either. 

At this point I wasn't sure what to do. It seemed like ColdFusion was convinced that Apache was already configured. I even reinstalled Apache and it didn't change. 

Thankfully I got some help from Stephen Dupre and Bill Sahlas. Turns out there is a wsconfig.properties file under the wsconfig file in the CFMX folder. This had a set of properties that marked CF as connected to Apache. I simply removed them - and the /1 folder, and this time the connection script worked great.