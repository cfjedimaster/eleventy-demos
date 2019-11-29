---
layout: post
title: "Take a look at jQuery Flot"
date: "2009-10-02T14:10:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/10/02/Take-a-look-at-jQuery-Flot
guid: 3551
---

I'm a huge charting fan. I don't know why - maybe it's my simple mind having an issue time with shiny pictures than raw numbers. For some time now I've been meaning to take a look at <a href="http://code.google.com/p/flot/">flot</a>, a jQuery based chart engine. If you take a look at the <a href="http://people.iola.dk/olau/flot/examples/">examples</a> you can see they look pretty darn professional and even better they are pretty simple to use.
<!--more-->
For the simplest chart, you only need two things:

1) A div. This is where the chart will be displayed. You must provide a specific height and width for the div or the world will come to an end. 

So for example:

<code>
&lt;style&gt;
#chart {
      width:300px;
      height:300px;
}
&lt;/style&gt;

&lt;div id="chart"&gt;&lt;/div&gt;
</code>

2) The data. This is where things got a bit confusing for me. The data for flot is an array of series records. Each series representing one line of data. A series can either be a structure (well, that's not a JavaScript term) or an array itself. Finally - each point of data is itself an array as well.

Here is a very simple example:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;style&gt;
#chart {
      width:300px;
      height:300px;
}
&lt;/style&gt;

&lt;script src="/jquery/jquery.js"&gt;&lt;/script&gt;
&lt;script src="/jquery/jquery.flot.js"&gt;&lt;/script&gt;
&lt;script&gt;

$(document).ready(function() {

    $.plot($("#chart"), [ [[1,3], [5,99],  [20,14.01]] ])
	
})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;h1&gt;Flot Test1&lt;/h1&gt;

&lt;div id="chart"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

You can see that I include jQuery and the flot library. When the page loads, I run the plot function and pass it the DOM item I want to "chartify" and the data itself. You can view a demo of this <a href="http://www.raymondcamden.com/demos/flot/test.html">here</a>. What's impressive is how nice it looks. The library picks nice default colors and just renders everything well. 

A more complex example uses structs for each series and specifies a label:

<code>
    $.plot($("#chart"), [ 
	
	//series 1
	{
    label:"Beer Consumption",
	data:[[1,3], [5,99],  [20,14.01]]
	},

    //series 2
    {
    label:"Session Ratings",
    data:[[1,80], [3,21],  [17,53]]
    }
	
	 ])
</code>

You can view this <a href="http://www.coldfusionjedi.com/demos/flot/test2.html">here</a>. View source for the complete code but the code block above is really all that's changed. 

The plot function also takes a third argument which allows for strong customization of the chart itself. So for example, I can tweak the legend to allow for clicking:

<code>
legend: {
     show:true,
     labelFormatter:function(label) {
         return '&lt;a href="' + label + '"&gt;' + label + '&lt;/a&gt;';
     }
}
</code>

You can view this one <a href="http://www.coldfusionjedi.com/demos/flot/test3.html">here</a>, but don't bother actually clicking the links. 

So what about putting in real data? Remember that jQuery makes it pretty trivial to run AJAX calls, and ColdFusion makes it pretty trivial to search up JSON. So given this method:

<code>
&lt;cffunction name="getSalesData" returnType="array" access="remote"&gt;
    &lt;cfset var q = ""&gt;
	
	&lt;cfquery name="q" datasource="cfartgallery"&gt;
	select count(orderid) as orders, year(orderdate) as yearval
	from orders
	group by year(orderdate)
	&lt;/cfquery&gt;
	
	&lt;cfset var result = []&gt;
	&lt;cfloop query="q"&gt;
		&lt;cfset var point = [yearval,orders]&gt;
		&lt;cfset arrayAppend(result, point)&gt;
	&lt;/cfloop&gt;
	
	&lt;cfreturn result&gt;
&lt;/cffunction&gt;
</code>

The method runs a query against the cfargallery database. It converts the query into an array of arrays. Now for the jQuery code:

<code>
$.getJSON("salesdata.cfc?method=getsalesdata&returnformat=json", {}, function(data) {
	    $.plot($("#chart"), [ data ], 
		{
			lines:{% raw %}{show:true}{% endraw %},
			points:{% raw %}{show:true}{% endraw %}
		})
})
</code>

Pretty simple, right? Hit the CFC and pass the data into flot. On reflection I probably should convert the data client side and leave the CFC as is. You can view the demo <a href="http://www.coldfusionjedi.com/demos/flot/test4.html">here</a>. You can view another version of this <a href="http://www.coldfusionjedi.com/demos/flot/test6.html">here</a>, this one using 2 sets of data from the CFC. 

Anyway - check it out yourself. The <a href="http://people.iola.dk/olau/flot/API.txt">docs</a> cover a lot more than what I did. Two things you should note. The released version does <b>not</b> support IE8. (Cry me a river.) Secondly, this works fine in AIR. So if you are building an HTML-based AIR application this would be a great charting solution I think.