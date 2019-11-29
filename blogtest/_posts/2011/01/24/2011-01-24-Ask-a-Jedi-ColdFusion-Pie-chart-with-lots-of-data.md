---
layout: post
title: "Ask a Jedi: ColdFusion Pie chart with lots of data"
date: "2011-01-24T18:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/01/24/Ask-a-Jedi-ColdFusion-Pie-chart-with-lots-of-data
guid: 4092
---

A. Stanley asks:

<p>

<blockquote>
I am using cf9 report builder to generate a PDF of a pie chart with many slices (i.e. 14) . When I select 'data label: pattern', for my pie chart, the labels overlap. I have tried changing the size and style (e.g. sliced instead of solid) to no avail. The labels on the pie chart still overlap. I have increased the width and height as much as possible, but the chart is displayed with a page header and footer, so I am unable to use the entire width/height of the page. Is there at least a way to modify the legend so that I might add the [data label: pattern] (e.g. itemName n x% of y) information there and remove the labels from the pie chart altogether?
</blockquote>

<p>

Unfortunately the last time I used ColdFusion's Report Builder I was a <i>lot</i> less gray and I think HomeSite+ was the best ColdFusion editor. Luckily though I was able to reproduce her issue with a vanilla cfchart and move from there. She sent me fruit data (why not beer???) that I turned into a query like so.
<!--more-->
<p>

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
</code>

<p>

Obviously this would normally be a database query and be a heck of a lot smaller. I then passed this into a pie chart.

<p>

<code>
&lt;cfchart chartheight="500" chartwidth="500"&gt;
	&lt;cfchartseries type="pie" query="q" itemcolumn="fruit" valuecolumn="total" datalabelstyle="pattern" &gt;
&lt;/cfchart&gt;
</code>

<p>

And we can see right away the - um - "suboptimal" rendering:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip15.png" title="The chart is messier than my daughter's bed room." />

<p>

Gross. So I did what I normally do in cases like this and opened up the chart editor. I entered additional data and recreate the issue in their tool. I then played around and discovered that the Data Labels editor has an option called <b>AutoControl</b>. If you mouse over this you see: "Toggles auto control of overlapping labels"

<p>

Yeah - no way it's that easy. I turned it on and <b>bam</b> - it worked. So I snagged the XML (and tweaked a few more small things) and got this:

<p>

<code>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;pieChart depth="Double" style="Solid" is3d="false"&gt;
          &lt;dataLabels style="Pattern" autoControl="true"/&gt;
          &lt;paint palette="PastelTransluent" paint="Plain" min="44" max="95"/&gt;
&lt;/pieChart&gt;
</code>

<p>

The critical part is autoControl="true". Here is the complete code then to use this XML:

<p>

<code>
&lt;cfsavecontent variable="cxml"&gt;
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;pieChart depth="Double" style="Solid" is3d="false"&gt;
          &lt;dataLabels style="Pattern" autoControl="true"/&gt;
          &lt;paint palette="PastelTransluent" paint="Plain" min="44" max="95"/&gt;
&lt;/pieChart&gt;
&lt;/cfsavecontent&gt;

&lt;cfchart chartheight="500" chartwidth="500" style="#cxml#"&gt;
	&lt;cfchartseries type="pie" query="q" itemcolumn="fruit" valuecolumn="total" datalabelstyle="pattern" &gt;
&lt;/cfchart&gt;
</code>

<p>

And the result is: 

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip16.png" />

<p>

Still "busy" but a heck of a lot more readable. (I'd probably reduce the smallest 5 items into one bucket, but thats for another blog post.) Hope this helps!