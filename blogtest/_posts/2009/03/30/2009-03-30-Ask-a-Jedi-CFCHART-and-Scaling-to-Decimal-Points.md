---
layout: post
title: "Ask a Jedi: CFCHART and Scaling to Decimal Points"
date: "2009-03-30T14:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/03/30/Ask-a-Jedi-CFCHART-and-Scaling-to-Decimal-Points
guid: 3296
---

A reader wrote in with an interesting problem. He needed to use CFCHART to plot data points that ranged in value from 0.9 to 1.0. He wanted to use the scaleFrom and scaleTo attributes to limit the chart to this range, but no matter what he did, the chart would range from 0 to 1.
<!--more-->
Looking at the docs for cfchart, it does say that both scaleTo and scaleFrom are integers, so I guess it isn't too surprising that it would fail to recognize 0.9 and 1 as a scale. You can try to use 0.9 but it is simply ignored. Here is a chart showing how this data plots out.

<img src="https://static.raymondcamden.com/images//Picture 147.png">

Not very nice, is it? As always, I turned to the chart designer. I quickly found the scaling options and tried 0.9 and 1.0 there. I was surprised to see that it worked right away. While there, I tweaked the xAxis labels to be vertical and turned off the legend. Here is the XML I ended up with:

<code>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;frameChart is3D="false"&gt;
      &lt;yAxis scaleMin="0.9" scaleMax="1.0"&gt;
           &lt;labelFormat pattern="#,##0.###"/&gt;
           &lt;parseFormat pattern="#,##0.###"/&gt;
           &lt;groupStyle&gt;
                &lt;format pattern="#,##0.###"/&gt;
           &lt;/groupStyle&gt;
      &lt;/yAxis&gt;
      &lt;xAxis&gt;
           &lt;labelFormat pattern="#,##0.###"/&gt;
           &lt;parseFormat pattern="#,##0.###"/&gt;
           &lt;labelStyle orientation="Vertical"/&gt;
      &lt;/xAxis&gt;
      &lt;legend allowSpan="true" equalCols="false" isVisible="false" halign="Right" isMultiline="true"&gt;
           &lt;decoration style="None"/&gt;
      &lt;/legend&gt;
&lt;/frameChart&gt;
</code>

The result?

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 227.png">

Much better, right? Not quite sure why cfchart doesn't like the numeric scale values. The charting engine works wonderfully with it. Anyway, I've attached a test file you can download and run to see it yourself.<p><a href='enclosures/E{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fcfchart%{% endraw %}2Dtest{% raw %}%2Ecfm%{% endraw %}2Ezip'>Download attached file.</a></p>