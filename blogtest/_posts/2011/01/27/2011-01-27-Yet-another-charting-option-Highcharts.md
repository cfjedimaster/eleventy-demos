---
layout: post
title: "Yet another charting option - Highcharts"
date: "2011-01-27T13:01:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2011/01/27/Yet-another-charting-option-Highcharts
guid: 4096
---

A reader emailed me earlier this week and suggested I take a look at <a href="http://www.highcharts.com/">Highcharts</a>, a JavaScript charting solution created by  Torstein Hønsi out of Norway. It's an interesting package and I'm glad the reader suggested I take a look.
<!--more-->
<p/>

First off - let's talk costs. Highcharts is free for non-commercial use. That's great. The commercial license is a bit odd though. For 80 dollars you get a single site license but the site "does not have customer specific data or charges for its use." I'm not quite sure what to make of that. Customer specific data could be anything from a simple login account to a cookie for your favorite background color. Above that you've got a single developer license. This also seems weird. They say a developer is :"Each person who directly or indirectly creates an application or user interface containing Highcharts is considered a developer." So according to this, if my coworker adds a chart I'm not allowed to edit it if I find a typo. For a JavaScript package I just don't think this makes sense. That being said - the prices (80 for the single site and 360 for the single developer) don't seem too terribly high for what you get. I encourage you to read the <a href="http://www.highcharts.com/license">license page</a>. Maybe it will make more sense to you then it did to me. 

<p/>

Feature wise you get the normal gamut of support chart types. Nothing stands out here as exception or missing so that's good. However, the <a href="http://www.highcharts.com/demo/">examples</a> look <i>very</i> professional. I did a quick comparison to <a href="http://www.jqplot.com/">jqPlot</a> and I think Highcharts looks significantly better. It also ships with a couple of built in themes which all look very well done.

<p/>

Usage follows pretty much every other framework out there. Include jQuery (you can also make it work with Mootools), include the Highcharts library, and then instantiate a chart object. Here is a complete example taken from their <a href="http://www.highcharts.com/documentation/how-to-use">documentation</a>:

<p/>

<code>

&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script src="Highcharts-2.1.2/js/highcharts.js"&gt;&lt;/script&gt;
&lt;script&gt;

var chart1; // globally available
$(document).ready(function() {
      chart1 = new Highcharts.Chart({
         chart: {
            renderTo: 'chart-container-1',
            defaultSeriesType: 'bar'
         },
         title: {
            text: 'Fruit Consumption'
         },
         xAxis: {
            categories: ['Apples', 'Bananas', 'Oranges']
         },
         yAxis: {
            title: {
               text: 'Fruit eaten'
            }
         },
         series: [{
            name: 'Jane',
            data: [1, 0, 4]
         }, {
            name: 'John',
            data: [5, 7, 3]
         }]
      });
});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div id="chart-container-1" style="width: 400px; height: 400px"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p/>

You can view that code <a href="http://www.raymondcamden.com/demos/jan272011/test1.html">here</a>. Modifying the theme is pretty cool - instead of using an object you can just include another JavaScript file, ie:

<p/>

<code>

&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script src="Highcharts-2.1.2/js/highcharts.js"&gt;&lt;/script&gt;
&lt;script src="Highcharts-2.1.2/js/themes/dark-green.js"&gt;&lt;/script&gt;
&lt;script&gt;

var chart1; // globally available
$(document).ready(function() {
      chart1 = new Highcharts.Chart({
         chart: {
            renderTo: 'chart-container-1',
            defaultSeriesType: 'bar'
         },
         title: {
            text: 'Fruit Consumption'
         },
         xAxis: {
            categories: ['Apples', 'Bananas', 'Oranges']
         },
         yAxis: {
            title: {
               text: 'Fruit eaten'
            }
         },
         series: [{
            name: 'Jane',
            data: [1, 0, 4]
         }, {
            name: 'John',
            data: [5, 7, 3]
         }]
      });
});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div id="chart-container-1" style="width: 400px; height: 400px"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

You can view that demo <a href="http://www.coldfusionjedi.com/demos/jan272011/test2.html">here</a>. What I find cool is how nicely the new theme changed the default colors to work well with the new background.

<p>

Another interesting feature of this framework is that it supports exporting. You can export to PDF, PNG, and JPG. This is done in a slick way. You can either point to his own web server or you can point to a PHP file on your own system. Now to be clear - this is <i>not</i> the same as being able to get a real binary copy of the chart. For example, ColdFusion's built in charting allows you to generate straight to an image that can be stored, emailed, or printed even. All JavaScript based charting engines will still require you to have a real browser to render and execute the code to get the display. 

<p>

I worked on a simple ColdFusion example and here is where I ran into my only real problem. I don't feel like the documentation for data formats is very clear. The main documentation page is really just an introduction. The examples all give you a quick way to see the code but are just - examples. There is a <a href="http://www.highcharts.com/ref/">reference</a> guide as well. But in terms of using data it seems like you have to guess a bit. I know it was a bit rough for me. Then again - I worked on this for thirty minutes so with more practice I think it would get easier. Here is the ColdFusion sample I came up. It's not Ajax based (which Highcharts supports of course) but it is dynamic.

<p>

<code>
&lt;cfquery name="getArtStats" datasource="cfartgallery"&gt;
select count(a.artid) as total, m.mediatype as media
from art a 
join media m 
on a.mediaid = m.mediaid
group by a.mediaid, m.mediatype
&lt;/cfquery&gt;

&lt;cfset cats = []&gt;
&lt;cfset data = []&gt;
&lt;cfloop query="getArtStats"&gt;
	&lt;cfset arrayAppend(cats, media)&gt;
	&lt;cfset arrayAppend(data, total)&gt;
&lt;/cfloop&gt;

&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script src="Highcharts-2.1.2/js/highcharts.js"&gt;&lt;/script&gt;
&lt;script&gt;

var chart1; // globally available
$(document).ready(function() {
      chart1 = new Highcharts.Chart({
         chart: {
            renderTo: 'chart-container-1',
            defaultSeriesType: 'bar'
         },
         title: {
            text: 'Art by Media'
         },
         xAxis: {
            categories: &lt;cfoutput&gt;#serializejson(cats)#&lt;/cfoutput&gt;
         },
         yAxis: {
            title: {
               text: 'Total'
            }
         },
         series: [{% raw %}{name:"Totals",data:&lt;cfoutput&gt;#replace(serializejson(data),"""","","all")#&lt;/cfoutput&gt;}{% endraw %}]

      });
});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div id="chart-container-1" style="width: 400px; height: 400px"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

You can view this <a href="http://www.coldfusionjedi.com/demos/jan272011/test3.cfm">here</a>. So - thoughts? I know I've seen a few people recently tweet about Highcharts so I'd love to see some comments from folks using it. (And please - if you have used it and can share a URL, please do. I'd love to see real life examples.)