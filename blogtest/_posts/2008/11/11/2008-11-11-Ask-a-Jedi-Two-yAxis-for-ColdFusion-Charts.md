---
layout: post
title: "Ask a Jedi: Two Y Axis for ColdFusion Charts"
date: "2008-11-11T22:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/11/Ask-a-Jedi-Two-yAxis-for-ColdFusion-Charts
guid: 3096
---

Danny asks:

<blockquote>
<p>
I basically want to know if it's possible to have two different y-axis units/values and title? Let's say series #1 is random from 1-10 and then series #2 is random from 1000-10000. If you put those two series onto the same graph having only one y-axis, then the first series will not be readable. So, left y-axis would feature the first series and the right y-axis would feature the second series.
</p>
</blockquote>

I have to admit - I wasn't sure what he meant at first. Then he provided a nice sample graph:

<img src="https://static.raymondcamden.com/images/cfjedi/graph.gif">
<!--more-->
This made sense to me. Basically he has two sets of data with different ranges of Y values. Danny said he tried the chart editor, which as my readers know is the first place I always suggest folks to look. I tried as well and like Danny, I wasn't able to get it working. I did some quick Googling and came across this <a href="http://www.gpoint.com/website/WebCharts50/examples-server/auto.jsp?src=no">example</a>. I played around with the source code, did some tests back in the chart editor, and finally figured it out.

In the style XML you can define a series as using a different y axis. For example:

<code>
&lt;elements place="Default" shape="Line" drawShadow="true"&gt;
&lt;series index="0" shape="Line" isSecondAxis="true"/&gt;
&lt;/elements&gt;
</code>

This says that the first series (remember, it is 0 based, since lord forbid people start counting with 1 like sane folks) represents the second axis. The shape should match the type of graph you want of course. You can use index="1" to specify the second series as well.

Ok, so let's do a demo. First, I'll create two queries of data:

<code>
&lt;cfset q = queryNew("year,sales","integer,integer")&gt;
&lt;!--- generate random sales data ---&gt;
&lt;cfloop index="y" from="1994" to="1998"&gt;
	&lt;cfscript&gt;
	queryAddRow(q);
	querySetCell(q, "year", y);
	querySetCell(q, "sales", randRange(80,220));
	&lt;/cfscript&gt;
&lt;/cfloop&gt;
&lt;cfset q2 = queryNew("year,employees","integer,integer")&gt;
&lt;!--- generate random sales data ---&gt;
&lt;cfloop index="y" from="1994" to="1998"&gt;
	&lt;cfscript&gt;
	queryAddRow(q2);
	querySetCell(q2, "year", y);
	querySetCell(q2, "employees", randRange(2,8));
	&lt;/cfscript&gt;
&lt;/cfloop&gt;
</code>

The first query represents sales figures over a 5 year period. The second query represents how many employees they had during those years. 

Next up is the XML I'll use for the style:

<code>
&lt;!--- style from webcharts ---&gt;
&lt;cfsavecontent variable="style"&gt;
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;frameChart is3d="false"&gt;
&lt;elements place="Default" shape="Line" drawShadow="true"&gt;
&lt;series index="0" shape="Line" isSecondAxis="true"/&gt;
&lt;/elements&gt;
&lt;/frameChart&gt;
&lt;/cfsavecontent&gt;
</code>

Notice there my elements and series tags. Now lets render the charts:

<code>
&lt;cfchart chartWidth="400" chartHeight="400" title="Sales" style="#style#"&gt;
	&lt;cfchartseries type="line" query="q" itemColumn="year" valueColumn="sales" serieslabel="Sales" /&gt;
	&lt;cfchartseries type="line" query="q2" itemColumn="year" valueColumn="employees" seriesLabel="Employees" /&gt;
&lt;/cfchart&gt;
</code>

The important thing to note is that the first chart series, sales, is what will be on the right side of the chart. Here is the result:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 311.png">

There ya go. Hope this helps others, and here is the complete template if folks want to quickly test it.

<code>
&lt;cfset q = queryNew("year,sales","integer,integer")&gt;
&lt;!--- generate random sales data ---&gt;
&lt;cfloop index="y" from="1994" to="1998"&gt;
	&lt;cfscript&gt;
	queryAddRow(q);
	querySetCell(q, "year", y);
	querySetCell(q, "sales", randRange(80,220));
	&lt;/cfscript&gt;
&lt;/cfloop&gt;
&lt;cfdump var="#q#"&gt;
&lt;cfset q2 = queryNew("year,employees","integer,integer")&gt;
&lt;!--- generate random sales data ---&gt;
&lt;cfloop index="y" from="1994" to="1998"&gt;
	&lt;cfscript&gt;
	queryAddRow(q2);
	querySetCell(q2, "year", y);
	querySetCell(q2, "employees", randRange(2,8));
	&lt;/cfscript&gt;
&lt;/cfloop&gt;
&lt;cfdump var="#q2#"&gt;

&lt;!--- style from webcharts ---&gt;
&lt;cfsavecontent variable="style"&gt;
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;frameChart is3d="false"&gt;
&lt;elements place="Default" shape="Line" drawShadow="true"&gt;
&lt;series index="0" shape="Line" isSecondAxis="true"/&gt;
&lt;/elements&gt;
&lt;/frameChart&gt;
&lt;/cfsavecontent&gt;

&lt;cfchart chartWidth="400" chartHeight="400" title="Sales" style="#style#"&gt;
	&lt;cfchartseries type="line" query="q" itemColumn="year" valueColumn="sales" serieslabel="Sales" /&gt;
	&lt;cfchartseries type="line" query="q2" itemColumn="year" valueColumn="employees" seriesLabel="Employees" /&gt;
&lt;/cfchart&gt;
</code>