---
layout: post
title: "MAXROWS Attribute - Not as good as I thought"
date: "2009-08-12T08:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/12/MAXROWS-Attribute-Not-as-good-as-I-thought
guid: 3485
---

I think it's somewhat easy to fall into assumptions. Everyone knows X is faster than Y. Everyone knows the so and so function should be avoided. Etc. But it doesn't to double check those assumptions from time to time. You may be surprised. Case in point - MAXROWS. The maxrows attribute for cfquery is a simple way to return only the top N rows of a query. While you can do this in SQL, if you don't know the syntax (and every database is a bit different) than this can be a much simpler way of handling it.

In the early days of my ColdFusion development, I tried to avoid using this feature. It was my understanding that if you used this, you were still retrieving a large set of data and that ColdFusion simply performed some work to "chop" the query into your desired size. So if your query returned two million records (it could happen) and you used MAXROWS of 10, your still moving a <i>heck</i> of a lot of data between the database and ColdFusion.

When MX came out and we switched to nice JDBC drivers, I thought that this was much improved. I knew that ColdFusion was passing the MAXROWS to the driver. I had thought that the driver passed this on to the database and the database "did the right thing" - whatever that was for the database in question.

I was speaking with Mark Mandel a bit about this and he expressed some doubt. We followed up on a private listserv and both Jochem van Dieten and Rupesh Kumar schooled me on how incorrect I was. 

Instead of the MAXROWS attribute being passed to the database, it only goes to the JDBC driver. So imagine that I'm the ColdFusion server, Bob is the driver, and Sally is MySQL. When I make a request for: "select * from pants" with "maxrows=10", Bob gets the request along with the maxrows but just passes the SQL along. Sally returns my one million rows, and Bob handles 'the cut' and returns 10. 

In other words - don't be lazy and rely on MAXROWS. Is it the most horrible, inefficient thing you can do in ColdFusion? Probably not. But it is certainly worth the time to research how to do this in your preferred SQL flavor.

Jochem also made another very interesting point. If you use audit triggers in the database to record how many rows were selected, then you would have a mismatch between the records and what your application shows to the end user.