---
layout: post
title: "Coloring CFCHART Dynamically"
date: "2010-03-12T18:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/03/12/Coloring-CFCHART-Dynamically
guid: 3746
---

Here is a question that came up earlier this morning on a mailing list. How can we specify colors for CFCHART based on some particular business rule? So for example, imagine we have a set of average temperatures. You want to chart them and specifically call out values that are below, or above, certain notes. This is rather simple if you make use of the <a href="http://cfmldocs.com/cfchartseries.html">colorList</a> attribute of cfchartseries. Normally this is used to provide a static list of colors, but you can certainly make it dynamic as well. Here is a simple example.

<p/>
<!--more-->
Let's start off with some simple, static data, and no, this isn't real temperatures for Louisiana.

<p/>

<code>
&lt;cfset data = arrayNew(2)&gt;
&lt;cfset data[1][1] = "Jan"&gt;
&lt;cfset data[1][2] = 30&gt;
&lt;cfset data[2][1] = "Feb"&gt;
&lt;cfset data[2][2] = 60&gt;
&lt;cfset data[3][1] = "Mar"&gt;
&lt;cfset data[3][2] = 70&gt;
&lt;cfset data[4][1] = "Ap"&gt;
&lt;cfset data[4][2] = 80&gt;
&lt;cfset data[5][1] = "May"&gt;
&lt;cfset data[5][2] = 85&gt;
&lt;cfset data[6][1] = "Jun"&gt;
&lt;cfset data[6][2] = 95&gt;
&lt;cfset data[7][1] = "Jul"&gt;
&lt;cfset data[7][2] = 105&gt;
&lt;cfset data[8][1] = "Aug"&gt;
&lt;cfset data[8][2] = 104&gt;
&lt;cfset data[9][1] = "Sep"&gt;
&lt;cfset data[9][2] = 95&gt;
&lt;cfset data[10][1] = "Oct"&gt;
&lt;cfset data[10][2] = 80&gt;
&lt;cfset data[11][1] = "Nov"&gt;
&lt;cfset data[11][2] = 75&gt;
&lt;cfset data[12][1] = "Dec"&gt;
&lt;cfset data[12][2] = 60&gt;
</code>

<p/>

Next, let's supply this to a cfchart just to see how it looks without any modification:

<p/>

<code>
&lt;cfchart chartheight="500" chartwidth="600" title="Average Temperature" show3d="false" &gt;
       &lt;cfchartseries type="bar" paintstyle="shade"&gt;
               &lt;cfloop index="datum" array="#data#"&gt;
                       &lt;cfchartdata item="#datum[1]#" value="#datum[2]#"&gt;
               &lt;/cfloop&gt;
       &lt;/cfchartseries&gt;
&lt;/cfchart&gt;
</code>

<p/>

This results in the rather lovely chart you see here:

<p/>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-03-12 at 5.49.12 PM.png" title="CFCHART Example One" />

<p/>

Ok, so it works. I'm not exactly sure where the Halloween Orange theme came from, but it works. So now let's make it dynamic. I'm going to use the following rules for my colors:

<ul>
<li>If the temperature was less than 40, use blue (get it?).
<li>If the temperature was greater than 90, use red (clever, I know).
<li>Otherwise just use green.
</ul>

I whipped up the following to generate a color list:

<p/>

<code>
&lt;cfset cList = ""&gt;
&lt;cfloop index="datum" array="#data#"&gt;
       &lt;cfif datum[2] lt 40&gt;
               &lt;cfset cList = listAppend(cList, "##0000FF")&gt;
       &lt;cfelseif datum[2] gt 90&gt;
               &lt;cfset cList = listAppend(cList, "##FF0000")&gt;
       &lt;cfelse&gt;
               &lt;cfset cList = listAppend(cList, "##00FF00")&gt;
       &lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

<p/>

Next I passed in cList:

<p/>

<code>
&lt;cfchartseries type="bar" colorlist="#cList#" paintstyle="shade"&gt;
</code>

<p/>

And voila:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-03-12 at 5.52.52 PM.png" title="CFCHART Example Two... is it beer time yet?" />

<p/>

Not exactly a work of art, but better. You can quickly see which items are at the extreme of my data set. I've pasted the complete template below.

<p/>

<code>

&lt;cfset data = arrayNew(2)&gt;
&lt;cfset data[1][1] = "Jan"&gt;
&lt;cfset data[1][2] = 30&gt;
&lt;cfset data[2][1] = "Feb"&gt;
&lt;cfset data[2][2] = 60&gt;
&lt;cfset data[3][1] = "Mar"&gt;
&lt;cfset data[3][2] = 70&gt;
&lt;cfset data[4][1] = "Ap"&gt;
&lt;cfset data[4][2] = 80&gt;
&lt;cfset data[5][1] = "May"&gt;
&lt;cfset data[5][2] = 85&gt;
&lt;cfset data[6][1] = "Jun"&gt;
&lt;cfset data[6][2] = 95&gt;
&lt;cfset data[7][1] = "Jul"&gt;
&lt;cfset data[7][2] = 105&gt;
&lt;cfset data[8][1] = "Aug"&gt;
&lt;cfset data[8][2] = 104&gt;
&lt;cfset data[9][1] = "Sep"&gt;
&lt;cfset data[9][2] = 95&gt;
&lt;cfset data[10][1] = "Oct"&gt;
&lt;cfset data[10][2] = 80&gt;
&lt;cfset data[11][1] = "Nov"&gt;
&lt;cfset data[11][2] = 75&gt;
&lt;cfset data[12][1] = "Dec"&gt;
&lt;cfset data[12][2] = 60&gt;

&lt;cfset cList = ""&gt;
&lt;cfloop index="datum" array="#data#"&gt;
       &lt;cfif datum[2] lt 40&gt;
               &lt;cfset cList = listAppend(cList, "##0000FF")&gt;
       &lt;cfelseif datum[2] gt 90&gt;
               &lt;cfset cList = listAppend(cList, "##FF0000")&gt;
       &lt;cfelse&gt;
               &lt;cfset cList = listAppend(cList, "##00FF00")&gt;
       &lt;/cfif&gt;
&lt;/cfloop&gt;

&lt;cfchart chartheight="500" chartwidth="600" title="Average Temperature" show3d="false" &gt;
       &lt;cfchartseries type="bar" colorlist="#cList#" paintstyle="shade"&gt;
               &lt;cfloop index="datum" array="#data#"&gt;
                       &lt;cfchartdata item="#datum[1]#" value="#datum[2]#"&gt;
               &lt;/cfloop&gt;
       &lt;/cfchartseries&gt;
&lt;/cfchart&gt;
</code>