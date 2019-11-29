---
layout: post
title: "Embedded CFCHART in Flash Forms - Part 3"
date: "2005-07-23T23:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/07/23/Embedded-CFCHART-in-Flash-Forms-Part-3
guid: 643
---

In my previous posts (<a href="http://ray.camdenfamily.com/index.cfm/2005/7/19/Embedded-CFCHART-in-Flash-Forms">Part 1</a> and <a href="http://ray.camdenfamily.com/index.cfm/2005/7/21/Embedded-CFCHART-in-Flash-Forms-Part-Deux">Part Two</a>), I talked about how a chart can be embedded in Flash Forms. While it isn't exactly straight forward, it isn't too difficult either. 

For my last example, I'm going to show how to pass data to your chart so you can change it on the fly. Let's start with the chart data file, test3.cfm:

<div class="code"><FONT COLOR=MAROON>&lt;cfsetting enablecfoutputonly=<FONT COLOR=BLUE>"true"</FONT> showdebugoutput=<FONT COLOR=BLUE>"false"</FONT>&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfparam name=<FONT COLOR=BLUE>"url.type"</FONT> default=<FONT COLOR=BLUE>"bar"</FONT>&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfif not listFind(<FONT COLOR=BLUE>"bar,line,pie"</FONT>, url.type)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset url.type = <FONT COLOR=BLUE>"bar"</FONT>&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfchart name=<FONT COLOR=BLUE>"chartData"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfchartseries type=<FONT COLOR=BLUE>"#url.type#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfchartdata item=<FONT COLOR=BLUE>"apples"</FONT> value=<FONT COLOR=BLUE>"#randRange(<FONT COLOR=BLUE>1</FONT>,<FONT COLOR=BLUE>100</FONT>)#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfchartdata item=<FONT COLOR=BLUE>"oranges"</FONT> value=<FONT COLOR=BLUE>"#randRange(<FONT COLOR=BLUE>1</FONT>,<FONT COLOR=BLUE>100</FONT>)#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfchartdata item=<FONT COLOR=BLUE>"pears"</FONT> value=<FONT COLOR=BLUE>"#randRange(<FONT COLOR=BLUE>1</FONT>,<FONT COLOR=BLUE>100</FONT>)#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfchartdata item=<FONT COLOR=BLUE>"jedis"</FONT> value=<FONT COLOR=BLUE>"#randRange(<FONT COLOR=BLUE>1</FONT>,<FONT COLOR=BLUE>100</FONT>)#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfchartdata item=<FONT COLOR=BLUE>"pies"</FONT> value=<FONT COLOR=BLUE>"#randRange(<FONT COLOR=BLUE>1</FONT>,<FONT COLOR=BLUE>100</FONT>)#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfchartseries&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfchart&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfcontent type=<FONT COLOR=BLUE>"application/x-shockwave-flash"</FONT> variable=<FONT COLOR=BLUE>"#chartData#"</FONT>&gt;</FONT></div>

The only thing new here, compared to the earlier files, is the use of URL.type. I do some simple validation on the variable, and use it to define the chart type. Now let's look at the front end:

<div class="code"><FONT COLOR=MAROON>&lt;cfform name=<FONT COLOR=BLUE>"test"</FONT> format=<FONT COLOR=BLUE>"flash"</FONT> width=<FONT COLOR=BLUE>"500"</FONT> height=<FONT COLOR=BLUE>"500"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfselect name=<FONT COLOR=BLUE>"type"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;option value=<FONT COLOR=BLUE>"bar"</FONT> selected&gt;</FONT></FONT>Bar<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/option&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;option value=<FONT COLOR=BLUE>"line"</FONT>&gt;</FONT></FONT>Line<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/option&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;option value=<FONT COLOR=BLUE>"pie"</FONT>&gt;</FONT></FONT>Pie<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/option&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfselect&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cftextarea name=<FONT COLOR=BLUE>"chartArea"</FONT> height=<FONT COLOR=BLUE>"300"</FONT>&gt;</FONT><FONT COLOR=MAROON>&lt;/cftextarea&gt;</FONT><br>
<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"button"</FONT> name=<FONT COLOR=BLUE>"submit"</FONT> value=<FONT COLOR=BLUE>"Test Flash"</FONT> <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; onClick = <FONT COLOR=BLUE>"_root.chartArea.html=true;_root.chartArea.htmlText<br>='<FONT COLOR=NAVY><FONT COLOR=PURPLE>&lt;img src="</FONT><FONT COLOR=BLUE>"test3.cfm?type=<br>'+type.getItemAt(type.selectedIndex).data+'&bar=.swf"</FONT><FONT COLOR=BLUE>"/&gt;</FONT></FONT></FONT>'+'<B><I>&amp;nbsp;</I></B>'"</FONT>&gt;<br>
<br>
<FONT COLOR=MAROON>&lt;/cfform&gt;</FONT></div>

In this version, I've added a drop down with the valid chart types. Note how in the onClick for my button, I now pass the value of the selected item to my chart generator. You can see an example of this <a href="http://ray.camdenfamily.com/demos/test3_front.cfm">here</a>. This is a pretty trivial example, but a lot more could be done. You could use radio/checkbox items to select which values should appear on the chart. You could vary the styles of the chart on the fly.

<b>Please forgive the ugly formatting of the code above.</b>