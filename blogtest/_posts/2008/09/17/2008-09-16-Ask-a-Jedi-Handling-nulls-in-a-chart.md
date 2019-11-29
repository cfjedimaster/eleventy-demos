---
layout: post
title: "Ask a Jedi: Handling nulls in a chart"
date: "2008-09-17T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/09/17/Ask-a-Jedi-Handling-nulls-in-a-chart
guid: 3020
---

Nat asks:

<blockquote>
<p>
Hey Ray, I have a cfchart question. <a href="http://crow.webapper.net/scratch/1221594752589.png
">http://crow.webapper.net/scratch/1221594752589.png
</a>
</p>

<p>
That is a cfchart output. I have multiple cfchartseries (data sets) displaying on that graph. Each data set has a different number of plot points. For instance, Fluid Milk has data up to 19 feet, Cheese all the way up to 26 feet and Cream Cheese only has data for 1 foot and 2 feet. The data in my cfquery recordset has null values for beyond 19 feet in milk and beyond 2 feet in cream chese, but the chart makes it look like the numbers are the same for all subsequent feet, not nulls.
</p>

<p>
I need the lines to disappear - just stop - after the data runs out. I.e., I need it to look like this:
</p>

<p>
<a href="http://crow.webapper.net/scratch/1221594752589_fixed.png">http://crow.webapper.net/scratch/1221594752589_fixed.png</a> (I photoshopped that picture.)
</p>

<p>
I have tried putting zeros in the extra feet where I have no data, but that just drops the lines down to the base of the X
axis, which looks like crap since they connect up to the last, highest foot value.
</p>

<p>
I have also tried manually outputting the cfchartdata tags and doing a cfbreak when the data runs out - that is, making sure I only have as many cfchartdata tags for each series as I am sure I have data. That produces the output you see in the first image. It appears that cfchart is "pulling out" the
data to the longest cfchartseries set of data.
</p>
</blockquote>

So if you follow Nat's links, you will see what he is talking about. I'm sure we've all run into this before as well. Here is a simple script that demonstrates the issue:
<!--more-->
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

&lt;cfchart chartWidth="400" chartHeight="400" title="Sales"&gt;
	&lt;cfchartseries type="line" query="q" itemColumn="year" valueColumn="sales" /&gt;

&lt;/cfchart&gt;
</code>

As you can see, I set it up so that for one year, 1996, the sales value is blank. This produces the following chart (your chart may look different since I'm using random numbers):

<img src="https://static.raymondcamden.com/images//Picture 36.png">

Note that for 1996, the value is half way between 1995 and 1997. So what do we do? Not to sound like a broken record, but as I always say with these cfchart questions, you should go to the chart designer that is shipped with ColdFusion. Along with making it real easy to design a chart, it also lets you muck with the sample data as well. On a whim I decided to just erase one of the values. When I looked back at the design, it was perfect. The line didn't have any data for that part. I took a look around the design options and I found the value we need: isInterpolated. If this value is set to true then we get what we get in ColdFusion. ColdFusion must be setting this to true by default and doesn't - as far as I can see - provide a way around that.

Luckily we can just supply our XML to cfchart. Consider this version (I'm not repasting the fake query data):

<code>
&lt;!--- style from webcharts ---&gt;
&lt;cfsavecontent variable="style"&gt;
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;frameChart isInterpolated="false"&gt;
&lt;/frameChart&gt;
&lt;/cfsavecontent&gt;

&lt;cfchart chartWidth="400" chartHeight="400" title="Sales" style="#style#"&gt;
	&lt;cfchartseries type="line" query="q" itemColumn="year" valueColumn="sales" /&gt;

&lt;/cfchart&gt;
</code>

As you can see, I have an XML style with one value, isInterpolated="false". This produces the following chart:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 51.png">

Which now has the nice null values for your data. Note too that the look is a bit different. You will need to use the designer to specify other values if you want it to look exactly like the first chart above (but with null values).

So again - folks - <i>please</i> remember to use the chart designer. It is an awesome tool. It doesn't run on OSX, but I just RDP into my server to use it there.