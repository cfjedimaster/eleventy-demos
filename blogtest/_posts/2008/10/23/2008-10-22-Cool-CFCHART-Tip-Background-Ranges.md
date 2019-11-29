---
layout: post
title: "Cool CFCHART Tip - Background Ranges"
date: "2008-10-23T09:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/10/23/Cool-CFCHART-Tip-Background-Ranges
guid: 3067
---

The following tip comes from reader Rick Drew. He both asked, and solved this, himself, which makes my job a heck of a lot easier! His question was - how do I create a background 'range' on a chart that can be used to compare against data. In other words, imagine a line chart ranging from 1 to 100. Now imagine that these were golf scores and that the desired score (golfers forgive me, I'm making this up) was 50-70. He wanted to plot a background on the graph for that range so it was really clear to see how the scores compared to the desired value.
<!--more-->
Rick found his answer in the chart editor, and in custom XML, which is something I've blogged about numerous times before. Any time you have a question about charts and you can't find the solution in the ColdFusion docs, just pop open the editor and start digging. 
<p>
Rick found that the limits tag can be used to create a range. Here is a sample:
<p>
<code>
&lt;frameChart isInterpolated="false" is3d="false"&gt;
	&lt;yAxis&gt;
   &lt;limits index="0" min="120" max="140" color="#e6e7e8"/&gt;
	&lt;/yAxis&gt;
&lt;/frameChart&gt;
</code>
<p>
(Note this XML also turns off interpolation and 3d effects which isn't required for what we are doing.) The limits tag is placed with the yAxis tag. I picked my min and max random based on the data I have for my sample and the color is a gray that matches the rest of the chart. This produces a chart like the one below:
<p>
<img src="https://static.raymondcamden.com/images/cfjedi/Picture 39.png">
<p>
Neat trick! I've included a complete script below for folks to play with.
<p>
<code>
&lt;cfset q = queryNew("dept,year,sales","varchar,integer,integer")&gt;
&lt;!--- generate random sales data ---&gt;
&lt;cfloop index="y" from="1990" to="1998"&gt;
	&lt;cfscript&gt;
	queryAddRow(q);
	if(y neq 1996) {
	querySetCell(q, "dept", "Gamma");
	querySetCell(q, "year", y);
	querySetCell(q, "sales", randRange(80,220));
	} else {
	querySetCell(q, "dept", "Gamma");
	querySetCell(q, "year", y);
	}
	&lt;/cfscript&gt;
&lt;/cfloop&gt;
&lt;cfdump var="#q#"&gt;

&lt;!--- style from webcharts ---&gt;
&lt;cfsavecontent variable="style"&gt;
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;frameChart isInterpolated="false" is3d="false"&gt;
	&lt;yAxis&gt;
   &lt;limits index="0" min="120" max="140" color="#e6e7e8"/&gt;
	&lt;/yAxis&gt;
&lt;/frameChart&gt;
&lt;/cfsavecontent&gt;
&lt;p&gt;&lt;p&gt;
&lt;cfchart chartWidth="400" chartHeight="400" title="Sales" style="#style#"&gt;
	&lt;cfchartseries type="line" query="q" itemColumn="year" valueColumn="sales" /&gt;

&lt;/cfchart&gt;

&lt;cfchart chartWidth="400" chartHeight="400" title="Sales"&gt;
	&lt;cfchartseries type="line" query="q" itemColumn="year" valueColumn="sales" /&gt;

&lt;/cfchart&gt;
</code>