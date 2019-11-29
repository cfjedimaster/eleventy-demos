---
layout: post
title: "Ask a Jedi: CFCHART Question"
date: "2008-02-07T07:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/07/Ask-a-Jedi-CFCHART-Question
guid: 2636
---

Frank asks:

<blockquote>
<p>
I have a question about how to use ColdFusion Chart.

I get data from a database table and wanted to show it on the chart. A typical data would be like this:

<pre>
NAME             MONTH          COST
----------------------------------------
name1            2                 100
name1            3                 80
name2            1                 60
name3            2                 30
----------------------------------------
</pre>

I would like to use name on X-axis and cost as Y-axis on a barchart.  However, since I have two records of name1.
There is only one name1 showing up.  Do you have any experience of fixing this problem?
</p>
</blockquote>

First off - what you really have here isn't one simple set of data, but a series of data. For each month, you have a set of users and sales. CFCHART supports multiple series of data per chart, so right away we can support exactly what you want. However you will run into a little issue when you try to use your data. Let me show you the code first, then I'll show you how I fixed it.
<!--more-->
First off, I create a query of data:

<code>
&lt;cfset data = queryNew("name,month,cost")&gt;

&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data,"name", "Name1")&gt;
&lt;cfset querySetCell(data,"month", "2")&gt;
&lt;cfset querySetCell(data,"cost", "100")&gt;

&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data,"name", "Name1")&gt;
&lt;cfset querySetCell(data,"month", "3")&gt;
&lt;cfset querySetCell(data,"cost", "80")&gt;

&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data,"name", "Name2")&gt;
&lt;cfset querySetCell(data,"month", "1")&gt;
&lt;cfset querySetCell(data,"cost", "60")&gt;

&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data,"name", "Name3")&gt;
&lt;cfset querySetCell(data,"month", "2")&gt;
&lt;cfset querySetCell(data,"cost", "30")&gt;
</code>

I know that my series will be by month, so I then ask for all the distinct months:

<code>
&lt;!--- get months ---&gt;
&lt;cfquery name="getMonths" dbtype="query"&gt;
select	distinct [month]
from	data
order by [month] asc
&lt;/cfquery&gt;
</code>

Notice I escape month since it is a reserved word in query of query. Now I create my chart:

<code>
&lt;cfchart title="Sales" show3d="true" showLegend="true"&gt;
	&lt;cfloop query="getMonths"&gt;
		&lt;cfquery name="databymonth" dbtype="query"&gt;
		select	*
		from	data
		where	[month] = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#month#"&gt;
		&lt;/cfquery&gt;
		&lt;cfchartseries type="bar" itemColumn="name" valueColumn="cost" query="databymonth" seriesLabel="Sales for Month #month#"&gt;
		&lt;/cfchartseries&gt;
	&lt;/cfloop&gt;
&lt;/cfchart&gt;
</code>

Notice that I loop over my getMonths query, and for each month, I get a set of data for that month. I then supply that query to the chartseries tag. So far so good, but what happens when you view the chart?


<img src="https://static.raymondcamden.com/images/Picture%2016.png">

That can't be right. In cases where we don't have data, the bars don't match at all. Unfortunately, I've seen this before. The cfchart support in ColdFusion sometimes seems to get confused by missing values. The only way to fix this is to 'complete' the data and ensure you always have a value for each month and each user. This could be done in SQL, but since my data was fake, I fixed it manually like so:

<code>
&lt;cfloop query="getMonths"&gt;
	&lt;cfset thisMonth = month&gt;
	&lt;cfloop query="getNames"&gt;
		&lt;!--- do we have data for name X on month Y? ---&gt;
		&lt;cfquery name="hasData" dbtype="query"&gt;
		select	cost
		from	data
		where	[month] = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#thisMonth#"&gt;
		and		name = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#name#"&gt;
		&lt;/cfquery&gt;
		&lt;cfif hasData.recordCount is 0&gt;
			&lt;cfset queryAddRow(data)&gt;
			&lt;cfset querySetCell(data,"name", name)&gt;
			&lt;cfset querySetCell(data,"month", thisMonth)&gt;
			&lt;cfset querySetCell(data,"cost", "0")&gt;
		&lt;/cfif&gt;	
	&lt;/cfloop&gt;
&lt;/cfloop&gt;
</code>

When run, we now get the correct chart:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture%2024.png">

And lastly, here is the complete template.

<code>
&lt;cfset data = queryNew("name,month,cost")&gt;

&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data,"name", "Name1")&gt;
&lt;cfset querySetCell(data,"month", "2")&gt;
&lt;cfset querySetCell(data,"cost", "100")&gt;

&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data,"name", "Name1")&gt;
&lt;cfset querySetCell(data,"month", "3")&gt;
&lt;cfset querySetCell(data,"cost", "80")&gt;

&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data,"name", "Name2")&gt;
&lt;cfset querySetCell(data,"month", "1")&gt;
&lt;cfset querySetCell(data,"cost", "60")&gt;

&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data,"name", "Name3")&gt;
&lt;cfset querySetCell(data,"month", "2")&gt;
&lt;cfset querySetCell(data,"cost", "30")&gt;

&lt;!--- get months ---&gt;
&lt;cfquery name="getMonths" dbtype="query"&gt;
select	distinct [month]
from	data
order by [month] asc
&lt;/cfquery&gt;

&lt;!--- Begin Fixing Data ---&gt;
&lt;cfquery name="getNames" dbtype="query"&gt;
select	distinct name
from	data
order by name asc
&lt;/cfquery&gt;

&lt;cfloop query="getMonths"&gt;
	&lt;cfset thisMonth = month&gt;
	&lt;cfloop query="getNames"&gt;
		&lt;!--- do we have data for name X on month Y? ---&gt;
		&lt;cfquery name="hasData" dbtype="query"&gt;
		select	cost
		from	data
		where	[month] = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#thisMonth#"&gt;
		and		name = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#name#"&gt;
		&lt;/cfquery&gt;
		&lt;cfif hasData.recordCount is 0&gt;
			&lt;cfset queryAddRow(data)&gt;
			&lt;cfset querySetCell(data,"name", name)&gt;
			&lt;cfset querySetCell(data,"month", thisMonth)&gt;
			&lt;cfset querySetCell(data,"cost", "0")&gt;
		&lt;/cfif&gt;	
	&lt;/cfloop&gt;
&lt;/cfloop&gt;

&lt;cfchart title="Sales" show3d="true" showLegend="true"&gt;
	&lt;cfloop query="getMonths"&gt;
		&lt;cfquery name="databymonth" dbtype="query"&gt;
		select	*
		from	data
		where	[month] = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#month#"&gt;
		&lt;/cfquery&gt;
		&lt;cfchartseries type="bar" itemColumn="name" valueColumn="cost" query="databymonth" seriesLabel="Sales for Month #month#"&gt;
		&lt;/cfchartseries&gt;
	&lt;/cfloop&gt;
&lt;/cfchart&gt;
</code>