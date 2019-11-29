---
layout: post
title: "Update to my Pie chart with lots of data post"
date: "2011-01-26T07:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/01/26/Update-to-my-Pie-chart-with-lots-of-data-post
guid: 4094
---

Two days ago I wrote about a <a href="http://www.raymondcamden.com/index.cfm/2011/1/24/Ask-a-Jedi-ColdFusion-Pie-chart-with-lots-of-data">pie chart</a> that had too much data. As you can see in the blog post, the amount of data and size of the pie chart causes the labels to run in together. It's also just a bit too much for a pie. As one commenter said, a bar char would be better, or as another said, it may make sense to combine some of the smaller slices into an "Other" slice. In this post I do exactly that. Given a random query I'm going to see if I have too many data points and if so - I'll combine them into a new slice called Other. I'm going to begin with the assumption that q, our query, already exists. At the very end of the blog post I'll put up the entire code template in case you want to try this yourself.
<!--more-->
<p/>

First - I chose 6 as the max number of slices I wanted. You can go higher or lower of course.

<p/>

<code>
&lt;cfif q.recordCount gt 6&gt;
	&lt;!--- number of items we want to strip/join ---&gt;
	&lt;cfset otherCount = q.recordCount - 5&gt;
</code>

<p/>

This code block shows my initial check to see if I have too much data. If I do, I create a variable called otherCount. This is how many rows of data that will be cominbed into the other slice. Notice it is 5, not 6. Remember that I'm adding a new slice, Other. So I want to leave 6-1 slices of data. Now let's get the data that will fall into the Other block.

<p/>

<code>
	&lt;cfquery name="getOthers" dbtype="query" maxrows="#otherCount#"&gt;
	select 		fruit, total
	from 		q
	order by 	total asc	
	&lt;/cfquery&gt;
</code>

<p/>

Nothing crazy here - just a query of query. I sort by total asc as I want to combine the smallest items. Now let's get their total:

<p/>

<code>
	&lt;!--- total of Other ---&gt;
	&lt;cfset otherTotal = arraySum(listToArray(valueList(getOthers.total)))&gt;
</code>

<p/> 

And then let's get the query <i>minus</i> the rows we took out.

<p/>

<code>
	&lt;!--- query without others ---&gt;	
	&lt;cfquery name="newData" dbtype="query"&gt;
	select	*
	from	q
	where	fruit not in (&lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#valueList(getOthers.fruit)#" list="true"&gt;)
	&lt;/cfquery&gt;
</code>

<p/>

Now we need to add in our new slice:

<p/>

<code>
	&lt;!--- add Other ---&gt;
	&lt;cfset queryAddRow(newData)&gt;
	&lt;cfset querySetCell(newData, "fruit", "Other")&gt;
	&lt;cfset querySetCell(newData, "total", otherTotal)&gt;
</code>

<p/>

And finally - copy over newData:

<p/>

<code>
	&lt;cfset q = newData&gt;
&lt;/cfif&gt;
</code>

<p/>

And here is the final result - compare it to the screen shots in the <a href="http://www.coldfusionjedi.com/index.cfm/2011/1/24/Ask-a-Jedi-ColdFusion-Pie-chart-with-lots-of-data">previous post</a>:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip18.png" />

<p/>

Neat! So here is the complete template. Enjoy.

<p/>

<code>

&lt;cfset q = queryNew("fruit,total","cf_sql_varchar,cf_sql_integer")&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "fruit","apples")&gt;
&lt;cfset querySetCell(q, "total",112)&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "fruit","oranges")&gt;
&lt;cfset querySetCell(q, "total",304)&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "fruit","bananas")&gt;
&lt;cfset querySetCell(q, "total",0)&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "fruit","pears")&gt;
&lt;cfset querySetCell(q, "total",0)&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "fruit","grapes")&gt;
&lt;cfset querySetCell(q, "total",16)&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "fruit","strawberries")&gt;
&lt;cfset querySetCell(q, "total",80)&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "fruit","plums")&gt;
&lt;cfset querySetCell(q, "total",48)&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "fruit","pineapples")&gt;
&lt;cfset querySetCell(q, "total",32)&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "fruit","blueberries")&gt;
&lt;cfset querySetCell(q, "total",16)&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "fruit","raspberries")&gt;
&lt;cfset querySetCell(q, "total",32)&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "fruit","apricots")&gt;
&lt;cfset querySetCell(q, "total",256)&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "fruit","tangerines")&gt;
&lt;cfset querySetCell(q, "total",705)&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "fruit","cherries")&gt;
&lt;cfset querySetCell(q, "total",1)&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "fruit","peaches")&gt;
&lt;cfset querySetCell(q, "total",0)&gt;

&lt;cfif q.recordCount gt 6&gt;
	&lt;!--- number of items we want to strip/join ---&gt;
	&lt;cfset otherCount = q.recordCount - 5&gt;
	&lt;cfquery name="getOthers" dbtype="query" maxrows="#otherCount#"&gt;
	select 		fruit, total
	from 		q
	order by 	total asc	
	&lt;/cfquery&gt;
	&lt;!--- total of Other ---&gt;
	&lt;cfset otherTotal = arraySum(listToArray(valueList(getOthers.total)))&gt;

	&lt;!--- query without others ---&gt;	
	&lt;cfquery name="newData" dbtype="query"&gt;
	select	*
	from	q
	where	fruit not in (&lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#valueList(getOthers.fruit)#" list="true"&gt;)
	&lt;/cfquery&gt;

	&lt;!--- add Other ---&gt;
	&lt;cfset queryAddRow(newData)&gt;
	&lt;cfset querySetCell(newData, "fruit", "Other")&gt;
	&lt;cfset querySetCell(newData, "total", otherTotal)&gt;

	&lt;cfset q = newData&gt;
&lt;/cfif&gt;

&lt;cfchart chartheight="500" chartwidth="500"&gt;
	&lt;cfchartseries type="pie" query="q" itemcolumn="fruit" valuecolumn="total" datalabelstyle="pattern" &gt;
&lt;/cfchart&gt;
</code>