---
layout: post
title: "Ask a Jedi: ColdFusion Memory Scoped Variables and Clusters"
date: "2005-08-10T11:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/10/Ask-a-Jedi-ColdFusion-Memory-Scoped-Variables-and-Clusters
guid: 688
---

Tim asks:

<blockquote>
We have a clustered environment for testing and production; each cluster has two JRun4 servers and each of those has many instances of CFMX6.1. A given CF application will therefore live on both the JRun4 boxes. If a user were to change an application-scoped variable (while, obviously, being served by one box), how can we programmatically propagate that change to the other JRun4 server?
</blockquote>

This is a pretty complex issue, and I feel like a good one to talk about since I think others will have good ideas as well. (That's a nice way of sayimg, I'll try to answer, but let's see what other folks say as well. :)

The first thing I would ask is - is your Application data coming from some central source, like a database? If your data is being stored in a backend system that is loaded when your application starts up, then you could build a web service that would force a refresh on the 'other' server. When the change is made on server A, your code would call out to server B and ask it to refresh itself. The problem with this solution is that it is a bit manual. You would want a solution that: contains a list of boxes - knows which machine is currently running (should be doable via CGI) - and then pings all the others.

What if your data is not stored in a DB? Maybe you have something like, currentBackgroundColor, and want to change it and then store it in RAM, not caring about the expiration of the variable. You could use a simular approach to what I described above, except this time, the message isn't to refresh the cache, but to pass a new value along. 

Along with using web services, you could also store messages in the database. For example, when server A changes application.bgcolor, a message could be stored in a database table. The message would contain the information necessary to update the data, and a timestamp. Machine B could check for new messages in the table based on time. In this setup, you have a bit of overhead since you need to check the table every request, while in the first approach, you simply listen in for messages.

Hopefully this gives you some food for thought, and I <i>know</i> I have some smart readers out there who will come up with some better solutions.