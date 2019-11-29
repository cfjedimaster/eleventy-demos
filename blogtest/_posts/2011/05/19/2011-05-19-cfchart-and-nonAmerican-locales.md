---
layout: post
title: "cfchart and non-American locales"
date: "2011-05-19T14:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/05/19/cfchart-and-nonAmerican-locales
guid: 4239
---

A poster on cf-talk today noticed an interesting issue. Even though she was trying to use the English (UK) locale (or as I call it, Dr. Who's locale), her cfchart was not using Pound symbols for the values. I whipped up a quick example to verify this issue. Luckily, it's easy to get around with - you guessed it - the chart style editor.
<!--more-->
<p>

First, an example that demonstrates the bug.

<p>

<code>
&lt;cfset setLocale("English (UK)")&gt; 

&lt;cfchart chartheight="500" chartwidth="500" title="Average Price Per" labelFormat="currency"&gt;

	&lt;cfchartseries type="bar"&gt;
		&lt;cfchartdata item="Apples" value="50.99"&gt;
		&lt;cfchartdata item="Bananas" value="40.12"&gt;
		&lt;cfchartdata item="Cherries" value="72.00"&gt;
		&lt;cfchartdata item="Donuts" value="61.21"&gt;
	&lt;/cfchartseries&gt;
	
&lt;/cfchart&gt;
</code>

<p>

This produces:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip95.png" />

<p>

You can see both on the left hand side, and in the tool tip, the values are in American dollars. To fix this, I simply opened up the chart editor, clicked the Y-Axis section, and picked Format. I changed Style to currency and then turned off the click for system locale. 

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip96.png" />

<p>

I took - and stripped down - the XML to get the following code:

<p>

<code>

&lt;cfsavecontent variable="style"&gt;
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;frameChart is3D="false"&gt;
          &lt;yAxis scaleMin="0"&gt;
               &lt;labelFormat style="Currency" pattern="#,##0.00"&gt;
                    &lt;locale lang="en" country="GB" variant=""/&gt;
               &lt;/labelFormat&gt;
               &lt;parseFormat pattern="#,##0.###"/&gt;
               &lt;groupStyle&gt;
                    &lt;format pattern="#,##0.###"/&gt;
               &lt;/groupStyle&gt;
          &lt;/yAxis&gt;
&lt;/frameChart&gt;
&lt;/cfsavecontent&gt;

&lt;cfchart chartheight="500" chartwidth="500" title="Average Price Per" labelFormat="currency" style="#style#"&gt;

	&lt;cfchartseries type="bar"&gt;
		&lt;cfchartdata item="Apples" value="50.99"&gt;
		&lt;cfchartdata item="Bananas" value="40.12"&gt;
		&lt;cfchartdata item="Cherries" value="72.00"&gt;
		&lt;cfchartdata item="Donuts" value="61.21"&gt;
	&lt;/cfchartseries&gt;
	
&lt;/cfchart&gt;
</code>

<p>

And here is the result:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip97.png" />

<p>

Fixed! In case you're wondering about the <i>other</i> changes, when you use cfchart and don't specify an XML file, ColdFusion passes a set of values based on defaults and the arguments you used. When you specify an XML style yourself, those defaults go away. Sometimes this means a bit more work, but overall you get much more control over the final result.