---
layout: post
title: "ColdFusion Quickie - Adding an average to a line chart"
date: "2010-12-20T17:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/12/20/ColdFusion-Quickie-Adding-an-average-to-a-line-chart
guid: 4060
---

This came up in an IM conversation earlier today. Given a simple line chart, is it easy to add an average? Here is a quick way to do it. First, I'll start off with an array of data points. A query would work fine as well of course.
<!--more-->
<p>
<code>
&lt;cfset data = [ ["Apples", 50], ["Bananas", 40], ["Cherries", 72], ["Donuts", 59], ["Beers", 91] ]&gt;
</code>

<p>

Now let's render the data as a series:

<p>

<code>
&lt;cfchart chartheight="500" chartwidth="500" title="Test Chart"&gt;
	&lt;cfchartseries type="line" seriesLabel="Sales"&gt;
		&lt;cfloop index="datum" array="#data#"&gt;
			&lt;cfchartdata item="#datum[1]#" value="#datum[2]#"&gt;
		&lt;/cfloop&gt;
	&lt;/cfchartseries&gt;
&lt;/cfchart&gt;
</code>

<p>

Which gives us:

<p>


<img src="https://static.raymondcamden.com/images/ScreenClip3.png" />

<p>

Ok - easy enough. Now let's an add an average. I'm simply going to use a second series for the average. I need to do two things. One - I need to get an average. Since I'm looping over my data points I'll just do some basic math in the first loop. Secondly - I need to output a value for each unit from the first series. The value will be the same - the average - but the item will match up with the items in the first series. Here is the complete code sample.

<p>

<code>

&lt;cfset data = [ ["Apples", 50], ["Bananas", 40], ["Cherries", 72], ["Donuts", 59], ["Beers", 91] ]&gt;

&lt;cfchart chartheight="500" chartwidth="500" title="Test Chart"&gt;
	&lt;cfchartseries type="line" seriesLabel="Sales"&gt;
		&lt;cfset total = 0&gt;
		&lt;cfloop index="datum" array="#data#"&gt;
			&lt;cfchartdata item="#datum[1]#" value="#datum[2]#"&gt;
			&lt;cfset total+= datum[2]&gt;
		&lt;/cfloop&gt;
	&lt;/cfchartseries&gt;
	&lt;cfchartseries type="line" seriesLabel="Average Sales"&gt;
		&lt;cfset avg = total/arrayLen(data)&gt;
		&lt;cfloop index="datum" array="#data#"&gt;
			&lt;cfchartdata item="#datum[1]#" value="#avg#"&gt;
		&lt;/cfloop&gt;
	&lt;/cfchartseries&gt;
&lt;/cfchart&gt;
</code>

<p>

Obviously this could be done a bit cleaner, but you get the idea. Here is the result:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip4.png" />