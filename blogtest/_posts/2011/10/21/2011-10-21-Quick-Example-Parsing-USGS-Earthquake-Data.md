---
layout: post
title: "Quick Example - Parsing USGS Earthquake Data"
date: "2011-10-21T12:10:00+06:00"
categories: [coldfusion,html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/10/21/Quick-Example-Parsing-USGS-Earthquake-Data
guid: 4402
---

Apparently there were a few earthquakes yesterday. All I know is that I'm happy I live in a state where our natural disasters are huge and slow moving. (Not that I left last time a hurricane hit anyway.) One of the cool services the US Geological Service provides is a set of <a href="http://earthquake.usgs.gov/earthquakes/catalogs/">feeds</a> for earthquake data. These are organized by how far back they go in time as well as how low of a magnitude they include. Since there's quite a few small earthquakes every day this helps you focus on more of the "OMG THE WORLD IS ENDING" variety quake as opposed to the "Did the garbage truck just go by" mini-quake. The USGS provides both RSS feeds and CSV, and I thought it would be cool to whip up a quick ColdFusion demo that makes use of this data stream.
<!--more-->
<p>

I began by looking at the RSS feeds. I know ColdFusion makes RSS parsing easy and in general CSV just feels messy. But I noticed something odd. None of the RSS feeds provided the magnitude of the earthquake in a "data safe" format. What do I mean? Well consider this snippet:

<p>

<code>
&lt;entry&gt;
&lt;id&gt;urn:earthquake-usgs-gov:us:b0006b3y&lt;/id&gt;
&lt;title&gt;M 4.9, Tonga&lt;/title&gt;
&lt;updated&gt;2011-10-21T14:56:05Z&lt;/updated&gt;
&lt;link rel="alternate" type="text/html" href="http://earthquake.usgs.gov/earthquakes/recenteqsww/Quakes/usb0006b3y.php"/&gt;
&lt;link rel="related" type="application/cap+xml" href="http://earthquake.usgs.gov/earthquakes/catalogs/cap/usb0006b3y" /&gt;
&lt;summary type="html"&gt;
&lt;![CDATA[
&lt;img src="http://earthquake.usgs.gov/images/globes/-20_-175.jpg" alt="21.107&#176;S 175.602&#176;W" align="left" hspace="20" /&gt;
&lt;p&gt;Friday, October 21, 2011 14:56:05 UTC&lt;br&gt;
Saturday, October 22, 2011 03:56:05 AM at epicenter&lt;/p&gt;
&lt;p&gt;&lt;strong&gt;Depth&lt;/strong&gt;: 191.60 km (119.05 mi)&lt;/p&gt;
]]&gt;
&lt;/summary&gt;
&lt;georss:point&gt;-21.1065 -175.6015&lt;/georss:point&gt;
&lt;georss:elev&gt;-191600&lt;/georss:elev&gt;
&lt;category label="Age" term="Past day"/&gt;
&lt;/entry&gt;
</code>

<p>

While you can see the mangitude in the title, and it is pretty consistent, I didn't like the idea of regexing it out just to get the value. So I took a look at the CSV data instead. Here's a sample from their feed:

<p>

<code>
Src,Eqid,Version,Datetime,Lat,Lon,Magnitude,Depth,NST,Region
us,b0006b3y,3,"Friday, October 21, 2011 14:56:05 UTC",-21.1065,-175.6015,4.9,191.60,17,"Tonga"
</code>

<p>

Perfect! Not only is this exactly what I want - it's actually a lot slimmer than the XML. But how will I parse it? I'm going to use an old feature - one I haven't used in years. Did you know that CFHTTP automatically supports parsing CSV type files? Check it out:

<p>

<code>
&lt;!--- This URL represents M2.5+ quakes over the past day ---&gt;
&lt;cfset m25oneday = "http://earthquake.usgs.gov/earthquakes/catalogs/eqs1day-M2.5.txt"&gt;

&lt;!--- get the URL and turn it into a query ---&gt;
&lt;cfhttp url="#m25oneday#" method="get" firstrowasheaders="true" name="items"&gt;
</code>

<p>

Do I need to parse the CSV? Not at all. Here's how the dump looks:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip205.png" />

<p>

Wow, I'm done. So I whipped up a small little application that let's me use jQuery to click for a map detail of the earthquake epicenter. This makes use of the super-simple static Google Map API. Here's the complete source:

<p>

<code>
&lt;!--- Source: http://earthquake.usgs.gov/earthquakes/catalogs/ ---&gt;

&lt;!--- This URL represents M2.5+ quakes over the past day ---&gt;
&lt;cfset m25oneday = "http://earthquake.usgs.gov/earthquakes/catalogs/eqs1day-M2.5.txt"&gt;

&lt;!--- get the URL and turn it into a query ---&gt;
&lt;cfhttp url="#m25oneday#" method="get" firstrowasheaders="true" name="items"&gt;

&lt;html&gt;
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	var mapImg = $("#quakeMap");
	
	$("div.quakeItem").click(function(e) {
		var lat = $(this).data("lat");
		var lon = $(this).data("lon");
		mapImg.attr("src","http://maps.googleapis.com/maps/api/staticmap?center="+lat+","+lon+"&zoom=7&sensor=false&size=400x400");
		console.log(mapImg.attr("src"));
	});
})
&lt;/script&gt;
&lt;style&gt;
#quakeMap {
	float:right;
}
div.quakeItem {
	cursor:hand;
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;h2&gt;M2.5+ Earthquakes&lt;/h2&gt;

&lt;img id="quakeMap" &gt;

&lt;cfoutput query="items"&gt;
	&lt;div class="quakeItem" data-lat="#lat#" data-lon="#lon#"&gt;
	&lt;h3&gt;#region#&lt;/h3&gt;
	&lt;p&gt;
	A #magnitude# earthquake at #datetime#
	&lt;/p&gt;
	&lt;/div&gt;
&lt;/cfoutput&gt;

&lt;/body&gt;
&lt;/html&gt;	
</code>

<p>

So how does it work? I simply loop over my query and output the data. Notice I make use of data attributes to store my latitude and longitude. This is one of my favorite HTML5 features. If you look up at the JavaScript code you can see how easy it is to fetch that data out. Once I have it I simply update my image to point to Google's API. And I'm done! Try the demo below. (And yes, I removed the console.log message.)

<p>


<a href="http://www.coldfusionjedi.com/demos/2011/oct/21/usgstest.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>