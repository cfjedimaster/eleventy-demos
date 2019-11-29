---
layout: post
title: "Another charting option: XML/SWF Charts"
date: "2008-01-04T08:01:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2008/01/04/Another-charting-option-XMLSWF-Charts
guid: 2574
---

A few weeks ago I <a href="http://www.raymondcamden.com/index.cfm/2007/12/10/Googles-Charting-API">blogged</a> about an alternative to ColdFusion's built in charts, <a href="http://code.google.com/apis/chart/">Google's Chart API</a>. This week I discovered another alternative, <a href="http://www.maani.us/xml_charts/index.php">XML/SWF Charts</a>. This isn't a free option, but they have a free license with limitations and the price for a "full" copy is only 45 bucks for a single domain. It works pretty easy too.
<!--more-->
You basically drop in a set of SWF files and then call the SWF and point to a XML file:

<code>
&lt;OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" 
	WIDTH="400" 
	HEIGHT="250" 
	id="charts" 
	ALIGN=""&gt;
&lt;PARAM NAME=movie VALUE="charts.swf?library_path=charts_library&xml_source=sample.xml"&gt;
&lt;PARAM NAME=quality VALUE=high&gt;
&lt;PARAM NAME=bgcolor VALUE=#666666&gt;

&lt;EMBED src="charts.swf?library_path=charts_library&xml_source=sample.xml"
       quality=high 
       bgcolor=#666666  
       WIDTH="400" 
       HEIGHT="250" 
       NAME="charts" 
       ALIGN="" 
       swLiveConnect="true" 
       TYPE="application/x-shockwave-flash" 
       PLUGINSPAGE="http://www.macromedia.com/go/getflashplayer"&gt;
&lt;/EMBED&gt;
&lt;/OBJECT&gt;
</code>

Your XML file has all the data and options to drive the chart. You can point to a ColdFusion file as well to have dynamic data. The set of chart types is pretty impressive, as is all the options you can use, including funky animations and layout. See the <a href="http://www.maani.us/xml_charts/index.php?menu=Gallery">gallery</a> for examples.

Probably the coolest option they have though is their <a href="http://www.maani.us/xml_charts/index.php?menu=Reference&submenu=live_update">live update</a> option. This lets you point to XML data and automatically refresh every N seconds. Here is an example that points to a CFM on my server. Region C will change every 2 seconds.

<OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" 
	WIDTH="400" 
	HEIGHT="250" 
	id="charts" 
	ALIGN="">
<PARAM NAME=movie VALUE="/demos/swfchart/charts.swf?library_path=/demos/swfchart/charts_library&xml_source=/demos/swfchart/sample.cfm">
<PARAM NAME=quality VALUE=high>
<PARAM NAME=bgcolor VALUE=#666666>

<EMBED src="/demos/swfchart/charts.swf?library_path=/demos/swfchart/charts_library&xml_source=/demos/swfchart/sample.cfm"
       quality=high 
       bgcolor=#666666  
       WIDTH="400" 
       HEIGHT="250" 
       NAME="charts" 
       ALIGN="" 
       swLiveConnect="true" 
       TYPE="application/x-shockwave-flash" 
       PLUGINSPAGE="http://www.macromedia.com/go/getflashplayer">
</EMBED>
</OBJECT>