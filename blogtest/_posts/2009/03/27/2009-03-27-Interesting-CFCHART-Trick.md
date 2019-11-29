---
layout: post
title: "Interesting CFCHART Trick"
date: "2009-03-27T15:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/03/27/Interesting-CFCHART-Trick
guid: 3294
---

A reader, Asaf, and I exchanged a few emails earlier this week about an interesting little cfchart trick. It relates to a blog entry I did earlier in the month: <a href="http://www.raymondcamden.com/index.cfm/2009/3/6/Ask-a-Jedi-Showing-the-values-on-a-chart">Ask a Jedi: Showing the Values on a Chart</a>. Specifically - controlling the labels on your chart. I definitely recommend reading that article first as some of the following won't make sense without it.
<!--more-->
Asaf discovered that when you specify a dataLabel style in your chart XML, one of the special values is $(desc). In my last article I showed a few other tokens (value, colPercent, colTotal). The desc token is interesting. It takes a string from your data and uses it for the label. So consider this hacked up data:

<code>
&lt;cfset q2 = queryNew("year,employees","integer,varchar")&gt;
&lt;!--- generate random sales data ---&gt;
&lt;cfloop index="y" from="1994" to="1998"&gt;
	&lt;cfscript&gt;
	queryAddRow(q2);
	querySetCell(q2, "year", y);
	querySetCell(q2, "employees", randRange(2,8) & " foo #y#");
	&lt;/cfscript&gt;
&lt;/cfloop&gt;
</code>

Previously, this query was simply a set of years and employees. Notice I still use a random number for that. But now I've added a string, foo #y#, after the value. So one row of the query may look like so:

year=1994
employes=5 foo 1994

In the style XML for the chart, I used:

<code>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;frameChart is3D="false"&gt;
	&lt;legend useMarkers="true"/&gt;
 &lt;elements action="" place="Default" outline="black"&gt;	
&lt;series index="0" place="Clustered" shape="Line"&gt;
&lt;dataLabel style="Pattern"&gt;
&lt;![CDATA[
$(desc)
]]&gt;
&lt;/dataLabel&gt;
&lt;/series&gt;
&lt;/elements&gt;
&lt;/frameChart&gt;
</code>

Notice the dataLabel and the use of $(desc). So what happens next is kind of cool. I can run the chart as normal:

<code>
&lt;cfchart chartWidth="400" chartHeight="400" title="Sales" font="arial" style="#chartxml#"&gt;
	&lt;cfchartseries type="line" query="q2" itemColumn="year" valueColumn="employees" seriesLabel="Employees" /&gt;
&lt;/cfchart&gt;
</code>

And ColdFusion will ignore the string portion of the data. The charting engine will use this as the label:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 146.png">

This could have some interesting uses. For example, you could add descriptions for data points that have special meanings. For example, you could correlate your query to product releases, and for every year that had a product release, mention it: "Released Phaser Gun". This would help give some context to the ups and downs of the chart.