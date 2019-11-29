---
layout: post
title: "Ask a Jedi: Controlling the size of bars in cfchart"
date: "2008-08-17T18:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/08/17/Ask-a-Jedi-Controlling-the-size-of-bars-in-cfchart
guid: 2974
---

Su asks:

<blockquote>
<p>
I am trying to use CFCHART to create bar graphs.  I need to specifically format them to match to a predefined sized width of bars.  Is there a way to control the width of bars produced by the CFchart?  Thanks for any help.
</p>
</blockquote>
<!--more-->
I could have sworn that there was a specific attribute for this from with the core ColdFusion language itself, but I did not see it. So, as always, I went to the WebCharts graphical editor. I found the setting right away: elements:shapeSize. 

I generated the XML from the chart, stripped out all the extra stuff, and got to this:

<code>
&lt;!--- style from webcharts ---&gt;
&lt;cfsavecontent variable="style"&gt;
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;frameChart&gt;
&lt;elements shapeSize="50" /&gt;
&lt;/frameChart&gt;
&lt;/cfsavecontent&gt;
</code>

Just change 50 to whatever you would like and whatever makes sense for your data. For a complete demo, you can run this code below. It creates a fake query and then uses that to source a bar chart with 5 sets of sales figures. Note how I pass in the XML to the cfchart tag.

<code>

&lt;cfset q = queryNew("dept,year,sales","varchar,integer,integer")&gt;
&lt;!--- generate random sales data ---&gt;
&lt;cfloop index="y" from="1995" to="2000"&gt;
	&lt;cfscript&gt;
	queryAddRow(q);
	querySetCell(q, "dept", "Alpha");
	querySetCell(q, "year", y);
	querySetCell(q, "sales", randRange(80,120));
	queryAddRow(q);
	querySetCell(q, "dept", "Beta");
	querySetCell(q, "year", y);
	querySetCell(q, "sales", randRange(60,100));
	queryAddRow(q);
	querySetCell(q, "dept", "Gamma");
	querySetCell(q, "year", y);
	querySetCell(q, "sales", randRange(80,220));
	&lt;/cfscript&gt;
&lt;/cfloop&gt;

&lt;!--- style from webcharts ---&gt;
&lt;cfsavecontent variable="style"&gt;
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;frameChart&gt;
&lt;elements shapeSize="50" /&gt;
&lt;/frameChart&gt;
&lt;/cfsavecontent&gt;

&lt;cfchart chartWidth="500" chartHeight="500" title="Sales by Department" style="#style#"&gt;
	&lt;cfloop index="y" from="1995" to="2000"&gt;
		&lt;cfquery name="salesdata" dbtype="query"&gt;
		select	*
		from	q
		where	[year] = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#y#"&gt;
		&lt;/cfquery&gt;
	&lt;cfchartseries type="bar" query="salesdata" itemColumn="dept" valueColumn="sales" seriesLabel="#y#" /&gt;
	&lt;/cfloop&gt;

&lt;/cfchart&gt;
</code>