---
layout: post
title: "Problem with Scatter graphs in ColdFusion"
date: "2009-08-19T13:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/19/Problem-with-Scatter-graphs-in-ColdFusion
guid: 3494
---

A reader hit me up recently with an odd issue using scatter graphs in ColdFusion. Let's take a look at his data and then I'll show you how it rendered. 

<code>
&lt;cfset getRanks = QueryNew("id, name, rank1, paid_revenue, rank2","integer, varchar, decimal, decimal, decimal")&gt;
&lt;cfset temp = QueryAddRow(getRanks, 4)&gt;
&lt;cfset temp = QuerySetCell(getRanks, "id", 1, 1)&gt;
&lt;cfset temp = QuerySetCell(getRanks, "name", "ft", 1)&gt;
&lt;cfset temp = QuerySetCell(getRanks, "rank1", 0.2, 1)&gt;
&lt;cfset temp = QuerySetCell(getRanks, "rank2", 25, 1)&gt;

&lt;cfset temp = QuerySetCell(getRanks, "id", 2, 2)&gt;
&lt;cfset temp = QuerySetCell(getRanks, "name", "fg", 2)&gt;
&lt;cfset temp = QuerySetCell(getRanks, "rank1", 0.6, 2)&gt;
&lt;cfset temp = QuerySetCell(getRanks, "rank2", 2, 2)&gt;

&lt;cfset temp = QuerySetCell(getRanks, "id", 3, 3)&gt;
&lt;cfset temp = QuerySetCell(getRanks, "name", "fl", 3)&gt;
&lt;cfset temp = QuerySetCell(getRanks, "rank1", 2.5, 3)&gt;
&lt;cfset temp = QuerySetCell(getRanks, "rank2", 10, 3)&gt;

&lt;cfset temp = QuerySetCell(getRanks, "id", 4, 4)&gt;
&lt;cfset temp = QuerySetCell(getRanks, "name", "fr", 4)&gt;
&lt;cfset temp = QuerySetCell(getRanks, "rank1", 0.3, 4)&gt;
&lt;cfset temp = QuerySetCell(getRanks, "rank2", 5, 4)&gt;
</code>

As just an FYI, you do not need to use a temporary variable for functions that have results. All of those lines could have been changed to:

<code>
&lt;cfset querySetCell(....)&gt;
</code>

Generally I recommend that instead. Anyway - you can see that we have 4 points with 2 numeric values and names in each. Rendering this in CFCHART he used this code:
<!--more-->
<code>
&lt;cfchart format="flash" chartheight="350" chartwidth="650" showxgridlines="yes" showygridlines="yes" showborder="no" fontsize="10" fontbold="yes" fontitalic="no" yaxistitle="Rank" show3d="no" rotated="no" sortxaxis="no" showlegend="yes" showmarkers="yes"&gt;
   &lt;cfchartseries type="scatter" markerstyle="circle" query="getRanks" itemcolumn="rank2" valuecolumn="rank1" serieslabel="#getRanks.name#"/&gt;
&lt;/cfchart&gt;
</code>

The result is less than optimal:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 182.png" />

As you can see, ColdFusion rendered the points in the same order as the query, but that doesn't really make sense for a scatter graph. The x-axis should have been rendered in ascending numeric order.

In fact, if you reorder the query with a query of query, it does list the items correctly, but places each point of the x-axis equally apart:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 254.png" />

Like I always do, I took a look at the Chart Designer and created a new scatter graph. I didn't do squat to the XML, just used it as is. However, I did modify both the scaleMax value to be appropriate for my data:

<code>
&lt;cfsavecontent variable="xml"&gt;
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;frameChart is3D="false"&gt;
          &lt;frame xDepth="2" yDepth="0"/&gt;
          &lt;xAxis type="Scale" scaleMin="0" scaleMax="30" isBucketed="false"/&gt;
          &lt;yAxis scaleMin="0" scaleMax="3"&gt;
               &lt;labelStyle orientation="Vertical"/&gt;
          &lt;/yAxis&gt;
          &lt;legend&gt;
               &lt;decoration style="None"/&gt;
          &lt;/legend&gt;
          &lt;elements shape="Scatter" drawShadow="true"&gt;
               &lt;movie frameCount="60"/&gt;
               &lt;morph morph="Grow"/&gt;
               &lt;series index="0"&gt;
                    &lt;morph morph="Blur"/&gt;
               &lt;/series&gt;
          &lt;![CDATA[
X: $(colLabel)
Y: $(value)
Size: $(nextvalue)
          ]]&gt;
          &lt;/elements&gt;
          &lt;decoration style="FrameOpened" foreColor="##FF99CC"/&gt;
          &lt;paint min="47" max="83"/&gt;
&lt;/frameChart&gt;
&lt;/cfsavecontent&gt;

&lt;cfchart format="flash" style="#xml#" chartheight="350" chartwidth="650" showxgridlines="yes" showygridlines="yes" showborder="no" fontsize="10" fontbold="yes" fontitalic="no" yaxistitle="Rank" show3d="no" rotated="no" sortxaxis="no" showlegend="yes" showmarkers="yes"&gt;
   &lt;cfchartseries type="scatter" markerstyle="circle" query="getRanks" itemcolumn="rank2" valuecolumn="rank1" serieslabel="#getRanks.name#"/&gt;
&lt;/cfchart&gt;
</code>

The result is significantly better (in my opinion): 

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 335.png" />

Nice - but unfortunately, there is no way to label the points, which was another request from the reader. ColdFusion only allows you to pass pure chart data for the points. You can't supply additional data to be used by the labels. Of course, there are alternatives. The XML/SWF Charts library has a nice <a href="http://www.maani.us/xml_charts/index.php?menu=Gallery&submenu=Scatter">scatter</a> example. Ditto for <a href="http://code.google.com/apis/chart/types.html#scatter_plot">Google Charts</a> (although I didn't confirm if you could label each data point).