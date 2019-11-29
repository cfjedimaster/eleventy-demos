---
layout: post
title: "Ask a Jedi: Modify cfchart to remove commas from y-axis"
date: "2010-08-10T14:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/08/10/Ask-a-Jedi-Modify-cfchart-to-remove-commas-from-yaxis
guid: 3904
---

This question came to me from Haris:

<p>

<blockquote>
I just wondering if you could help me with cfchart y-axis. ColdFusion for some reason auto format y-axis with number, for example the value of 2008 on y-axis is displayed as 2,008. Is it possible to disable auto formatting since I try to display year on y-axis so the value 2,008 look strange on the chart it should be just 2008.
</blockquote>
<!--more-->
<p>
To be fair, it isn't ColdFusion that is doing the formatting, but the embedded WebCharts engine. Luckily enough this is easy to tweak. I loaded up the chart editor and went to the YAxis setting. Under the Format tab you will see it defaults to Number:

<p>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-08-10 at 12.31.03 PM.png" />

<p>

At first I thought it was impossible to edit the format. As you can see in the screen shot, it is grayed out. However, if you switch to Pattern you can then tweak it. I did and set the value to just #. You can see in the preview that the commas are removed.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-08-10 at 12.32.29 PM.png" />

<p>

Ok, so before I tried to even use the style here, I created a quick demo to showcase the default behavior.

<p>

<code>
&lt;cfchart chartheight="500" chartwidth="500" title="Test Chart" scalefrom="2000" scaleto="2020" &gt;
	&lt;cfchartseries type="bar" &gt;
		&lt;cfchartdata item="Apples" value="2008"&gt;
		&lt;cfchartdata item="Bananas" value="2009"&gt;
		&lt;cfchartdata item="Cherries" value="2008"&gt;
		&lt;cfchartdata item="Donuts" value="2005"&gt;
	&lt;/cfchartseries&gt;	
&lt;/cfchart&gt;
</code>

<p>

This generates:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-08-10 at 12.34.10 PM.png" />

<p>

I took the style XML from the editor and removed a lot of the extra stuff. I then passed the XML to the cfchart tag:

<p>

<code>

&lt;cfsavecontent variable="style"&gt;
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;frameChart is3D="false"&gt;
          &lt;yAxis scaleMin="2000" scaleMax="2020"&gt;
               &lt;labelFormat style="Pattern" pattern="###"/&gt;
          &lt;/yAxis&gt;
&lt;/frameChart&gt;
&lt;/cfsavecontent&gt;
&lt;cfchart chartheight="500" chartwidth="500" title="Test Chart"  style="#style#"&gt;
	&lt;cfchartseries type="bar" &gt;
		&lt;cfchartdata item="Apples" value="2008"&gt;
		&lt;cfchartdata item="Bananas" value="2009"&gt;
		&lt;cfchartdata item="Cherries" value="2008"&gt;
		&lt;cfchartdata item="Donuts" value="2005"&gt;
	&lt;/cfchartseries&gt;	
&lt;/cfchart&gt;
</code>

<p>

And here is the result:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-08-10 at 12.39.02 PM.png" />

<p>

Notice too that I moved the scales into XML. This seemed to work better than scalefrom/to once I moved to a style based design.