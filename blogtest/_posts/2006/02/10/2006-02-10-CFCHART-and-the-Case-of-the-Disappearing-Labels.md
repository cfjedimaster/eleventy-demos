---
layout: post
title: "CFCHART and the Case of the Disappearing Labels"
date: "2006-02-10T17:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/02/10/CFCHART-and-the-Case-of-the-Disappearing-Labels
guid: 1092
---

A user reported an odd problem today. She was using <a href="http://ray.camdenfamily.com/projects/soundings">Soundings</a>, my ColdFusion survey application, and noticed something odd. She would do a report and the chart would be missing data! Here is an example:
<!--more-->
<img src="http://ray.camdenfamily.com/images/badchart1.jpg">

This chart should have 9 items, even though some are blank, but we only see 5 labels. I did a quick google check and found out this was a known bug:

<a href="http://cfchart.blogspot.com/2005/06/charting-technote-addendum.html">http://cfchart.blogspot.com/2005/06/charting-technote-addendum.html</a>

Turns out that in earlier versions of CF, the labels were rotated, but a designer (darn designers!) decided that horizontal labels made more sense. I agree - but it would be nice if CF would automatically rotate them instead of just dropped them.

So I decided to make a quick XML file. From the URL above I saw that I needed to use this XML:

<code>
&lt;xAxis&gt; 
 &lt;labelStyle isHideOverlapped="true" orientation="Horizontal"/&gt; 
 &lt;titleStyle font="Arial-12-bold" isMultiline="false"/&gt; 
&lt;/xAxis&gt; 
</code>

I didn't want to modify the core style files since that wouldn't be a solution for Soundings. According to the docs, you can use either an XML file or <b>a string</b> to specify style information. However, now matter what I did I couldn't get it to work. So I switched to an XML file using just the code above. This still didn't work. However, now I figured it was because I wasn't specifying a "full" style. 

Now I was worried. I really did <b>not</b> want to specify 100 styles just to tweak one small little thing. I loaded up the WebCharts style editor. (Everyone knows about that, right? More info can be found 
<a href="http://www.buntel.com/blog/index.cfm?mode=entry&entry=838065DF-4E22-1671-5BEDBD3D6FD2D0D8">here</a>.) First - while this is a cool tool, I had trouble finding a "simple" bar chart. I made my best guess and took a look the XML. Turns out - the file was very simple. Even better, I was able to figure out why my XML above was missing. I changed it to this:

<code>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;frameChart&gt;
&lt;xAxis&gt; 
 &lt;labelStyle isHideOverlapped="false" orientation="Vertical"/&gt; 
 &lt;titleStyle font="Arial-12-bold" isMultiline="false"/&gt; 
&lt;/xAxis&gt;
&lt;/frameChart&gt;
</code>

And that alone was enough to fix the problem. Here is the chart as it appears now:

<img src="http://ray.camdenfamily.com/images/goodchart1.jpg">

As you can see, I lost the black borders and text, but to be honest it doesn't really bug me much.