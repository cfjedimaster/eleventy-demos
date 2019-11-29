---
layout: post
title: "Server monitoring with ColdFusion"
date: "2006-10-24T18:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/10/24/Server-monitoring-with-ColdFusion
guid: 1609
---

Unlocking the CF Server Black Box

How to answer questions about your server. How is it doing? What templates/queries are slow?

New tool: CF Server Monitor. 

Monitors requests via all paths (template, CFC, web service, gateway, Flash Remoting)

Has minimal performance overhead (normally). 

Switch on and off on a running server.

Summary Screen: (I didn't get everything here. There is more.) JVM memory status. Requests per second. Heh - Aswhin is testing with BlogCFC. 

Active Request Report: Template path, client IP, how long request has run. Double clicking gets you a full CFML stack trace. You can see a CFC name+function call. Requests graphs - average times for example. Requests per second. 

Cummalitive server report - which templates are taking up the most of the time on the server. This may not be slow pages - it is the page that is most often being used. This is awesome as it is something that would never show up in a slow report - but is critical for you to know about. 

You can size different thread pools for different types of request. This came up from a question about - how do I check stuff if the server itself is hammered. 

Template cache status. How many templates graph - and size of template cache graph. (Estimated size only.) Template cache hit ratio.

Slowest queries report. Two tabs - one for simple list - and one for slowest queries by average. You can see the SQL and a bunch of information about it. You can see how many times the query was executed. Last execution time, average execution time. You can also see the memory used by a query. Report tells you exactly where the query was (file+line). Frequently run query report. 

Query cache report. Cache hit ration. You can list queries in the cache. 

Summary of memory usage over all scopes. Application/Server/Session. You can see exactly what is in the scopes. 

Off topic - Scorpio will support Java 1.5.

Tracking errors and timeouts. You can see how many times an error occurred and when it occurred last. You can see where it occurred and the stack trace. Request timed out report. 

You can look at your slow request report and find out what parts of the page itself is being slow. Nice!! You can see which variables in a request is taking the most memory. 

Snapshot feature. Can be trigged manually - or via a Hung Server Alert. Creates a text report. 

Hung Server Alert - you define what it means. (When N threads have been busy for more than T seconds.) Slow Server Alert - ditto - lets you define what it means to be slow. Slow Server Report doesn't auto-dump an alert. You can do email alerts. If Hung Server Alert, it will attach report to email. You can also specify a custom CFC to run on an alert. 

You can filter requests. Useful to tell CF to ignore certain paths. 

Other reports/settings: Active Sessions, Active Queries, DB connection pool status, request throttle data, highest hit counts, refresh interval, graphs have time filters.

Switches: Toggles monitoring, profiling, tracking. Profiling lets you turn on monitoring for invidual tag/queries. Memory tracker switches lets you toggle memory consumed tracking in scopes. 

Performance impact for monitoring and profiling is minimal. Performance impact with memory tracking turned on can be significant.

There is a CFC (like Admin API) that gives you access to everything. You can roll your own server monitor.