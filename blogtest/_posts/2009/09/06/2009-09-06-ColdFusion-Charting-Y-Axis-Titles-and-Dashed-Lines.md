---
layout: post
title: "ColdFusion Charting - Y Axis Titles and Dashed Lines"
date: "2009-09-06T18:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/06/ColdFusion-Charting-Y-Axis-Titles-and-Dashed-Lines
guid: 3514
---

Joe asks a few questions about ColdFusion Charting:

<blockquote>
Per you instruction on how to add a second Y-axis to a CF chart, I'd like to know what is the attribute to use to specify a title for the second Y-axis.

In addition I would like to have in some cases, dashed lines in my line charts, but cannot find the attribute to control this feature.

Also, where does one find reference material on the available style attributes to use in an xml file that will control style in a ColdFusion chart? I have searched extensively for this information, but it seems that is does not exist.
Thank you for any information you can provide.
</blockquote>

No problem Joe, let's tackle this question by question. First, the blog post about a second y-axis can be found here: <a href="http://www.raymondcamden.com/index.cfm/2008/11/11/Ask-a-Jedi-Two-yAxis-for-ColdFusion-Charts">Ask a Jedi: Two Y Axis for ColdFusion Charts</a>. In that post, the solution was to use XML that told the chart to treat the Nth series (charting is 0 based) as a second Y Axis. To set the title for the second Y Axis requires new XML:
<!--more-->
<code>
&lt;frameChart is3d="false"&gt;
&lt;elements place="Default" shape="Line" drawShadow="true"&gt;
&lt;series index="0" shape="Line" isSecondAxis="true"/&gt;
&lt;/elements&gt;
&lt;yAxis&gt;&lt;titleStyle&gt;Moo&lt;/titleStyle&gt;&lt;/yAxis&gt;
&lt;yAxis2&gt;&lt;titleStyle&gt;Zoo&lt;/titleStyle&gt;&lt;/yAxis2&gt;
&lt;/frameChart&gt;
</code>

In this example I've provide a title for both Y Axises, but ColdFusion provides a native way to set the first Y Axis title. 

Now for the next question - dashed lines. This was a bit trickier. I loaded up the chart editor and selected a line chart. I expanded Elements and then Series. Note the screen shot:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 256.png" />

This is very important. You can see line stroke right there - and you can change it to Dashed or Dotted. However - if you hit Apply, nothing changes. Why? You have to explicitly specify what series you want first. I entered 0 in the left hand text input:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 337.png" />

And <i>then</i> I hit Add. Now when I select Dashed for lineStroke and hit Ok, I can see this in the chart editor:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 415.png" />

The relevant XML then is just:

<code>
&lt;elements place="Default" shape="Line" drawShadow="true"&gt;
&lt;series index="0" lineStroke="Dashed"/&gt;
&lt;/elements&gt;
</code>

So, going back to the original example from the <a href="http://www.coldfusionjedi.com/index.cfm/2008/11/11/Ask-a-Jedi-Two-yAxis-for-ColdFusion-Charts">last blog entry</a>, I can modify that original <series>. Here is the complete version with both a second Y Axis title and the dashed line:

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
&lt;series index="0" shape="Line" isSecondAxis="true" lineStroke="dashed" /&gt;
&lt;/elements&gt;
&lt;yAxis&gt;&lt;titleStyle&gt;Moo&lt;/titleStyle&gt;&lt;/yAxis&gt;
&lt;yAxis2&gt;&lt;titleStyle&gt;Zoo&lt;/titleStyle&gt;&lt;/yAxis2&gt;
&lt;/frameChart&gt;
&lt;/cfsavecontent&gt;

&lt;cfchart chartWidth="400" chartHeight="400" title="Sales" style="#style#"&gt;
    &lt;cfchartseries type="line" query="q" itemColumn="year" valueColumn="sales" serieslabel="Sales" /&gt;
    &lt;cfchartseries type="line" query="q2" itemColumn="year" valueColumn="employees" seriesLabel="Employees" /&gt;
&lt;/cfchart&gt;
</code>

And the result (sans dumps):
 
<img src="https://static.raymondcamden.com/images/cfjedi/Picture 58.png" />

So as to Joe's last question - as already described above - I'm using the Chart Editor. This is a Java application that ships with ColdFusion (including ColdFusion 9). You can find the executable (it is a BAT file for Windows a sh file Linux/OSX) within the charting folder under your ColdFusion install. The basic procedure is to use the editor to tweak the chart to your liking and then copy the XML created.