---
layout: post
title: "Cool Errors: Dating Trouble"
date: "2005-12-01T14:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/01/Cool-Errors-Dating-Trouble
guid: 948
---

So - as regular readers of my blog know - I love errors. I love bug hunting. In fact, back when I was on the Spectra team (May it rest in peace...) I used to love dealing with Spectra errors since there were about one million custom tags run on ever request. So today I ran into a bug caused by an intern that I think is just plain awesome. Awesome in that I bet others have made the same mistake.

First - a bit of back story. The piece of logic was some SQL to get a record where a date column had a value from yesterday or today. This was the original query. Can you tell what was wrong with it? As a hint - the error didn't pop up till today.

<code>
&lt;cfquery name="getPic" datasource="#request.element.objectstore.dsn#"&gt;
	select	fullsize, caption, id
	from	mtnphotos
	where	sentviaemail &gt;= #CreateDate(Year(Now()), Month(Now()), Day(Now())-1)#
&lt;/cfquery&gt;
</code>
<!--more-->
Got it? He was creating a date based on the current year, the current month, and the current day <i>minus one</i>. Today's day was 1, which meant he was trying to create a date with a day value of 0. 

So - I felt pretty smart about myself. I switched to a dateAdd using now() as the value. I also switched to a query param:

<code>
&lt;cfset yesterday = dateAdd("d", -1, now())&gt;

&lt;cfquery name="getPic" datasource="#request.element.objectstore.dsn#"&gt;
	select	fullsize, caption, id
	from	mtnphotos
	where	sentviaemail &gt;= &lt;cfqueryparam cfsqltype="cf_sql_date" value="#yesterday#"&gt;
&lt;/cfquery&gt;
</code>

As I said - I was feeling smart - which of couse meant I had done something stupid. We wanted a value from <i>anytime</i> yesterday on. If go back one day from now, it will be yesterday, at 2:14 PM (the time of this entry). That's not good. So I switched to making a date object for today, which will include no time since I didn't specify it:

<code>
&lt;cfset today = createDate(year(now()), month(now()), day(now()))&gt;
&lt;cfset yesterday = dateAdd("d", -1, today)&gt;
</code>

Anyone have a better way? I know SQL Server is pretty powerful - so I'm sure this could have been written with zero ColdFusion. (Minus the CFQUERY of course.)