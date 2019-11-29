---
layout: post
title: "Old School CFCHART Tip"
date: "2013-01-18T15:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/01/18/Old-School-CFCHART-Tip
guid: 4833
---

For those of you still on ColdFusion 9 or running ColdFusion 10 Standard edition, this tip may help you. A reader wanted to know how to have a CFCHART legend with only one value in it. I wasn't quite sure what he meant, so I asked him for a quick demo.

</more>

Take a simple static chart with one series, like the code below.

<script src="https://gist.github.com/4568107.js"></script>

When displayed, note that the legend shows one item for each data point.

<img src="https://static.raymondcamden.com/images/screenshot56.png" />

If you add another series to the chart, then the legend switches to identifying each series, not each point. Turns out, this is actually documented:

<blockquote>
Added the new attribute showLegend to the chart style files, which are the XML files located in the charting\styles directory- This attribute displays an entry for each point and is applicable only to charts that contain a single series. By default, the value of
showLegend is set to true. To turn off this feature, you can either modify the setting in all the chart style files, or use a custom style file.
</blockquote>

How to change this is actually described right there in the note - by using a custom style file. I played around in the chart editor and discovered that the "ShowColumnLegend" setting (under the Legend menu) is the crucial change. Turning this off and using the XML for your style corrects it. Here is an example:

<script src="https://gist.github.com/4568156.js"></script>

Which results in...

<img src="https://static.raymondcamden.com/images/screenshot57.png" />

As an aside, the new HTML-based charts in ColdFusion 10 Enterprise automatically have this behavior.