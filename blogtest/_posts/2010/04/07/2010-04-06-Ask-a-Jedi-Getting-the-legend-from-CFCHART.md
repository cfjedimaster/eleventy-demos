---
layout: post
title: "Ask a Jedi: Getting the legend from CFCHART"
date: "2010-04-07T10:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/04/07/Ask-a-Jedi-Getting-the-legend-from-CFCHART
guid: 3773
---

Brijesh asks:

<p>

<blockquote>
Dear Jedi. In my reporting application, I am using tab based reports, one tab shows the graph and the other needs to show the legend, this is beacuse I am limited with the space of the POD in which the graphs need to be shown (280 x 280 px), is it possible to show the graph in one tab and legend in another? how do I just get the legend to show it separately?
</blockquote>

<p>

I began by looking at the chart editor. While I could add things to my chart (like a table of data), as far as I could see there was no way to not display the chart unless I completely switched the chart type. Even though I could change the chart to just a table, there was no way to switch it to just the label. That wasn't terribly surprising since this is probably not something commonly requested. I can definitely see why Brijesh needed this functionality though so I decided to hack it up a bit.
<!--more-->
<p>

To begin, I create a simple query of data and a chart to render it:

<p>

<code>
&lt;cfset data = queryNew("name,value")&gt;
&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data, "name", "Apples")&gt;
&lt;cfset querySetCell(data, "value", 50)&gt;
&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data, "name", "Bananas")&gt;
&lt;cfset querySetCell(data, "value", 40)&gt;
&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data, "name", "Cherries")&gt;
&lt;cfset querySetCell(data, "value", 72)&gt;
&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data, "name", "Donuts")&gt;
&lt;cfset querySetCell(data, "value", 59)&gt;

&lt;cfchart chartheight="300" chartwidth="300" title="Test Chart" showlegend="true"&gt;
	&lt;cfchartseries type="pie" query="data" itemcolumn="name" valuecolumn="value" /&gt;
&lt;/cfchart&gt;
</code>

<p>

Which renders this fairly typical chart:

<p>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-04-07 at 8.12.19 AM.png" title="Chart One" />

<p>

So the first step is to get rid of the legend. That takes all of two seconds - just change the showlegend value to false. Now for the next step. My reader mentioned using pods but for now I'm going to use ColdFusion's built in tab support. I normally use jQuery UI for this but for a quick demo, this works great:

<p>

<code>
&lt;cflayout type="tab" width="320" height="320"&gt;
    &lt;cflayoutarea title="Chart"&gt;
	&lt;cfchart chartheight="300" chartwidth="300" showLegend="false"&gt;
	    &lt;cfchartseries type="pie" query="data" itemcolumn="name" valuecolumn="value"/&gt;
	&lt;/cfchart&gt;
    &lt;/cflayoutarea&gt;
	&lt;cflayoutarea title="Legend"&gt;
		My Legend
	&lt;/cflayoutarea&gt;
&lt;/cflayout&gt;
</code>

<p>

Obviously the legend is a work in progress, but as you can see I've got my chart in one tab and my legend in the other. However, this runs into another problem. If you switch back and forth a few times, you eventually get this:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-04-07 at 8.17.27 AM.png" title="Oh crap, it broke!" />

<p>

Luckily there is a workaround for this. Brijesh ran into this as well and used the same solution (for the most part) that I'm going to demo here. CFCHART allows us to extract the bits generated and save it to the file system. Obviously this means you need to think about how long you save the bits, but for now, I'm just generating the chart once:

<p>

<code>

&lt;cfif not fileExists(expandPath("./cfchart.swf"))&gt;
&lt;cfchart chartheight="400" chartwidth="400" showLegend="false" name="data"&gt;
	&lt;cfchartseries type="pie" query="data" itemcolumn="name" valuecolumn="value"/&gt;
&lt;/cfchart&gt;

    &lt;cffile action="write" file="#expandPath('./cfchart.swf')#" output="#data#"&gt;
&lt;/cfif&gt;


&lt;cflayout type="tab" width="320" height="320"&gt;
    &lt;cflayoutarea title="Chart"&gt;
		&lt;object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" width="300" height="300" id="mymoviename"&gt; 
		&lt;param name="movie" value="cfchart.swf" /&gt;  
		&lt;param name="quality" value="high" /&gt; 
		&lt;param name="bgcolor" value="#ffffff" /&gt; 
		&lt;embed src="cfchart.swf" quality="high" bgcolor="#ffffff" width="300" height="300" name="mymoviename" align="" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"&gt; 
		&lt;/embed&gt; 
		&lt;/object&gt;
    &lt;/cflayoutarea&gt;
(Continued...)
</code>

<p>

This code snippet begins by seeing if I have file, cfchart.swf, in my current directory. If not, I create the chart and write it to the file system. I modified the tab then to use old school html tags to embed the swf. (Btw - who else <i>really</i> hates all the code you have to use to embed Flash? Thank goodness for swfObject.) 

<p>

So at this point I've got my chart rendering in a tab. Now I need to worry about the legend. As I said, there is no way (that I know of), to ask cfchart to just generate the legend. Therefore we need to do it ourselves. The main problem that we have is figuring out what colors refer to what data. Luckily cfchart lets us specify a color list to apply to our data. So my solution simply creates a hard coded list of colors and remembers what data label uses what color.

<p>

<code>
&lt;cfset coreColorList = "red,blue,green,yellow,orange,silver,lime,navy,olive"&gt;
&lt;cfset colorList = ""&gt;
&lt;cfset legend = []&gt;
&lt;cfloop query="data"&gt;
	&lt;cfif currentRow lte listLen(coreColorList)&gt;
		&lt;cfset thisColor = listGetAt(coreColorList, currentRow)&gt;
	&lt;cfelse&gt;
		&lt;cfset thisColor = listGetAt(coreColorList, currentRow mod listLen(coreColorList))&gt;
	&lt;/cfif&gt;
	&lt;cfset legend[currentRow] = {% raw %}{ color=thisColor, label=name }{% endraw %}&gt;
	&lt;cfset colorList = listAppend(colorList, thisColor)&gt;
&lt;/cfloop&gt;
</code>

<p>

At the end of this block we have two variables. A list, colorList, that represents the colors I'll use for my chart. (Please don't use my colors. I can barely dress myself. You should see have seen what I wore out yesterday.) The second variable, legend, is an array of structs where I store the label and the color used. Now for the final bit - generating the legend. I chose to use a simple table where the left side was a cell for the color and the right side was the actual legend.

<p>

<code>
&lt;cflayoutarea title="Legend"&gt;
	&lt;table style="height:90%"&gt;
		&lt;cfloop index="l" array="#legend#"&gt;
			&lt;cfoutput&gt;
				&lt;tr&gt;
					&lt;td style="background-color:#l.color#;width:30px"&gt;&nbsp;&nbsp;&lt;/td&gt;
					&lt;td&gt;#l.label#&lt;/td&gt;
				&lt;/tr&gt;
			&lt;/cfoutput&gt;
		&lt;/cfloop&gt;
	&lt;/table&gt;
&lt;/cflayoutarea&gt;
</code>

<p>

And here is the final result, starting with the chart:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-04-07 at 8.25.17 AM.png" title="The Chart" />

<p>

And now the legend:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-04-07 at 8.25.23 AM.png" title="The Legend" />

<p>

So not the prettiest solution, but workable. Here is the complete template.

<p>

<code>
&lt;cfset data = queryNew("name,value")&gt;
&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data, "name", "Apples")&gt;
&lt;cfset querySetCell(data, "value", 50)&gt;
&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data, "name", "Bananas")&gt;
&lt;cfset querySetCell(data, "value", 40)&gt;
&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data, "name", "Cherries")&gt;
&lt;cfset querySetCell(data, "value", 72)&gt;
&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data, "name", "Donuts")&gt;
&lt;cfset querySetCell(data, "value", 59)&gt;

&lt;cfset coreColorList = "red,blue,green,yellow,orange,silver,lime,navy,olive"&gt;
&lt;cfset colorList = ""&gt;
&lt;cfset legend = []&gt;
&lt;cfloop query="data"&gt;
	&lt;cfif currentRow lte listLen(coreColorList)&gt;
		&lt;cfset thisColor = listGetAt(coreColorList, currentRow)&gt;
	&lt;cfelse&gt;
		&lt;cfset thisColor = listGetAt(coreColorList, currentRow mod listLen(coreColorList))&gt;
	&lt;/cfif&gt;
	&lt;cfset legend[currentRow] = {% raw %}{ color=thisColor, label=name }{% endraw %}&gt;
	&lt;cfset colorList = listAppend(colorList, thisColor)&gt;
&lt;/cfloop&gt;

&lt;cfif not fileExists(expandPath("./cfchart.swf"))&gt;
	&lt;cfchart chartheight="400" chartwidth="400" showLegend="false" name="data"&gt;
	    &lt;cfchartseries type="pie" query="data" itemcolumn="name" valuecolumn="value" colorList="#colorList#"/&gt;
	&lt;/cfchart&gt;
    &lt;cffile action="write" file="#expandPath('./cfchart.swf')#" output="#data#"&gt;
&lt;/cfif&gt;

&lt;cflayout type="tab" width="320" height="320"&gt;
    &lt;cflayoutarea title="Chart"&gt;
		&lt;object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" width="300" height="300" id="mymoviename"&gt; 
		&lt;param name="movie" value="cfchart.swf" /&gt;  
		&lt;param name="quality" value="high" /&gt; 
		&lt;param name="bgcolor" value="#ffffff" /&gt; 
		&lt;embed src="cfchart.swf" quality="high" bgcolor="#ffffff" width="300" height="300" name="mymoviename" align="" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"&gt; 
		&lt;/embed&gt; 
		&lt;/object&gt;
    &lt;/cflayoutarea&gt;
	&lt;cflayoutarea title="Legend"&gt;
		&lt;table style="height:90%"&gt;
			&lt;cfloop index="l" array="#legend#"&gt;
				&lt;cfoutput&gt;
					&lt;tr&gt;
						&lt;td style="background-color:#l.color#;width:30px"&gt;&nbsp;&nbsp;&lt;/td&gt;
						&lt;td&gt;#l.label#&lt;/td&gt;
					&lt;/tr&gt;
				&lt;/cfoutput&gt;
			&lt;/cfloop&gt;
		&lt;/table&gt;
	&lt;/cflayoutarea&gt;
&lt;/cflayout&gt;
</code>