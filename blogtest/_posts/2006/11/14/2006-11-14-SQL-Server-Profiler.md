---
layout: post
title: "SQL Server Profiler"
date: "2006-11-14T14:11:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2006/11/14/SQL-Server-Profiler
guid: 1654
---

Ok - I'm probably the last one on the planet to know this - but just in case I'm not - I thought I'd share.

I've been trying to debug an issue with a .Net application. I don't have access to the source code, and the application was throwing an error with a SQL statement.

I needed some way to see what SQL was being executed so I could see if there was a way to fix it on the data side. Turns out you can use SQL Server Profiler to monitor SQL calls being run against the database. I ran this - watched as the SQL came in, and was able to find the problem in a few minutes.

Again - I'm probably the last one to discover this. I wonder if MySQL has anything like this?