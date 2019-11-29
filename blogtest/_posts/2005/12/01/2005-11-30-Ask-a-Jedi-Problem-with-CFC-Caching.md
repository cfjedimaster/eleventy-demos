---
layout: post
title: "Ask a Jedi: Problem with CFC Caching"
date: "2005-12-01T10:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/01/Ask-a-Jedi-Problem-with-CFC-Caching
guid: 947
---

A reader asks:

<blockquote>
Simple question for you Raymond. I'm new using cfcs and cfforms. How to do I reinitialize a cfc without having to restart the cf server. I've created a few cfc with database queries and everytime I change the query I have to restart the cf server.
</blockquote>

Your question doesn't give enough data, but I will make some guesses. If you are storing your CFCs in a shared scope, then the problem is obvious. You need to build in a way to refresh that data. I <a href="http://ray.camdenfamily.com/index.cfm/2005/11/28/Ask-a-Jedi-Refreshing-Application-Variables">blogged</a> about this a few days ago. The other possibility is - when you say your changing the query - do you mean changing the SQL, or changing the database structure? In the past, I have seen <a href="http://ray.camdenfamily.com/index.cfm?mode=entry&entry=3CE1E9A7-C54A-6BD7-28FDC5E5009DB1E4">strange errors</a> when working with a query that used prepared statements and select *. Lastly - there is a setting in CF Admin, Trust cache, that if turned on, will tell CF to only parse your files once. You do not want to have this activated on a development server as it will prevent your changes from showing up.