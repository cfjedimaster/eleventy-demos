---
layout: post
title: "CFLOG and Permissions"
date: "2008-05-08T18:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/05/08/CFLOG-and-Permissions
guid: 2815
---

Here is an issue I've run into a few times in the recent months and I've never figured it out till now. Thanks go to cfconcepts@twitter for pointing me in the right direction.

From time to time I've noticed that cflog would suddenly stop working. It wouldn't throw an error it just wouldn't... log. I was never able to nail down exactly what the issue was, but today I really wanted to dig into it. I threw out a message on twitter and cfconcepts mentioned that I should check permissions.

Now - at first - I was sure he (or she) was wrong. Obviously if cflog tried to write to a file that it didn't have permissions for - it would cfthrow, right? Nope. Apparently cflog silently fails. 

How did I get a permissions issue in the first place? I run cf/apache on startup on my Mac. But from time to time I have to stop and restart them. I sometimes use the command line and sometimes use the graphical tools for this. I had stopped and restarted CF as a normal user. When I restarted it using sudo it was suddenly able to write to the file again.

Anyone else encounter this? Obviously those of you on Windows probably never see this.