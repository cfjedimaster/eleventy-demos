---
layout: post
title: "Skipping labels in a ColdFusion Chart"
date: "2009-04-02T10:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/04/02/Skipping-labels-in-a-ColdFusion-Chart
guid: 3301
---

Earlier this week I <a href="http://www.raymondcamden.com/index.cfm/2009/3/30/Ask-a-Jedi-CFCHART-and-Scaling-to-Decimal-Points">blogged</a> about an issue with ColdFusion charting and scaling to decimal points. While working on the solution, I did a small tweak to the x-axis to the turn the labels vertical. Why? Look what happens when there isn't enough room for the x-axis labels:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture%20147.png">

Things get scrunchy and random labels are dropped. Changing them to a vertical orientation helps, but what if you don't want vertical labels?

I discovered another option - oddly placed (odd to me anyway) in the "Group" section of the x-axis area in the cart editor:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 148.png">

Skip labels does pretty much what is says - skips labels. Setting it to 1 means it will skip every other label. So using the same data we did from the <a href="http://www.coldfusionjedi.com/index.cfm/2009/3/30/Ask-a-Jedi-CFCHART-and-Scaling-to-Decimal-Points">previous</a> blog entry, I modified the style xml like so:

<code>
&lt;xAxis&gt;
  &lt;labelFormat pattern="#,##0.###"/&gt;
  &lt;parseFormat pattern="#,##0.###"/&gt;
  &lt;groupStyle skipLabels="1"/&gt;
&lt;/xAxis&gt;
</code>

This results in:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 228.png">

Which I think is a nice alternative. Here is the vertical version for comparison:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture%20227.png">

Anyway, I hope this helps someone.