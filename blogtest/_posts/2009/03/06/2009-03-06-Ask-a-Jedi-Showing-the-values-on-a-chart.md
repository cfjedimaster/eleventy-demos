---
layout: post
title: "Ask a Jedi: Showing the values on a chart"
date: "2009-03-06T14:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/03/06/Ask-a-Jedi-Showing-the-values-on-a-chart
guid: 3267
---

Misha asks:
<p/>
<blockquote>
<p>
Hi Raymond, I would really appreciate you if you could help me with CFCHART (CF8). In CF5 in CFGRAPH it was possible to display the value by using showValueLabel attribute. I don't see anything in CF8. Is it possible to display the value from the ValueColumn attribute on the actual bar itself?
</p>
</blockquote>
<p/>
At first I wasn't sure what she meant. I could easily see the values when I moused over the bars in a barchart. But after speaking with her I figured out that what she really wanted was to see the values <i>without</i> a mouseover. This would be especially useful on a printout.
<!--more-->
Turns out this is rather easy. You can use the dataLabelStyle attribute to specify a label for your data points. Valid values are none (default), value, rowLabel (kinda silly), columnLabel (ditto), pattern (a data pattern you can't modify, more on that in a bit). So as a concrete example, consider this chart:
<p/>
<code>
&lt;cfchart format="flash" xaxistitle="respondents" yaxistitle="numbers"&gt;

	&lt;cfchartseries type="bar" serieslabel="result" seriescolor="##6633CC" datalabelstyle="value"&gt;
		&lt;cfchartdata item="result1" value="75"&gt;
		&lt;cfchartdata item="result2" value="80"&gt;
	&lt;/cfchartseries&gt;

&lt;/cfchart&gt;
</code>
<p/>

Which creates:
<p/>

<img src="https://static.raymondcamden.com/images//Picture 319.png">
<p/>

Almost right - the chart isn't quite tall enough. We can fix that by using scaleTo:
<p/>

<code>
&lt;cfchart format="flash" xaxistitle="respondents" yaxistitle="numbers" scaleTo="100"&gt;
</code>
<p/>

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 47.png">
<p/>

That's better, but obviously we would have to make scaleTo a bit dynamic if we weren't sure of our value range. I mentioned 'pattern' above. What does that do? 
<p/>

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 52.png">
<p/>

That's cool, but you don't have control over what is there. It is kind of silly that the label is repeated, but that second line is really nice. 
<p/>

That got me digging into the chart editor. First I was curious about the data label placement. What if you didn't want to use scaleTo? In my digging I found that you can use an 'Extra Lines' attribute. If set to something above 0, like 1 for example (duh), the chart will always ensure there is an extra line. This handles ensuring the values fit ok. You can also switch to an inner display as well. Here is an example with extra lines turned on:
<p/>

<code>
&lt;cfsavecontent variable="style"&gt;
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;frameChart is3D="false"&gt;
          &lt;yAxis scaleMin="0"&gt;
               &lt;labelFormat pattern="#,##0.###"/&gt;
               &lt;parseFormat pattern="#,##0.###"/&gt;
          &lt;/yAxis&gt;
&lt;legend allowSpan="true" equalCols="false" isVisible="false" showColumnLegend="false" halign="Right"
               isMultiline="true"&gt;
               &lt;decoration style="None"/&gt;
          &lt;/legend&gt;
          &lt;dataLabels style="Value" extraLines="1" autoControl="true"/&gt;
&lt;/frameChart&gt;
&lt;/cfsavecontent&gt;

&lt;cfchart format="flash" xaxistitle="respondents" yaxistitle="numbers" style="#style#"&gt;

	&lt;cfchartseries type="bar" serieslabel="result"&gt;
		&lt;cfchartdata item="result1" value="75"&gt;
		&lt;cfchartdata item="result2" value="80"&gt;
	&lt;/cfchartseries&gt;

&lt;/cfchart&gt;

&lt;p/&gt;
</code>
<p/>

Notice I also turned off the legend in the chart. This resulted in:
<p/>

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 6.png">
<p/>

So - remember how I said that pattern was hard coded? Well with the chart editor you can muck with that. Consider this XML:
<p/>

<code>
&lt;dataLabels style="Pattern" placement="Inside" extraLines="1" autoControl="true"&gt;
&lt;![CDATA[
$(value) [$(colPercent) of $(colTotal)]
]]&gt;
&lt;/dataLabels&gt;
</code>
<p/>

I specified both the value, and the percent of total, and got rid of the newline there by default. Also note I moved the labels inside. I could get rid of extraLines now if I wanted to. This resulted in the following chart:
<p/>

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 71.png">
<p/>

Pretty cool! But I'd probably want to change that font color. Anyway, I hope this is useful!