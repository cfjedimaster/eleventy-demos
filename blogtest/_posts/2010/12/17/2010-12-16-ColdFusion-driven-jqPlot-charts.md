---
layout: post
title: "ColdFusion driven jqPlot charts"
date: "2010-12-17T09:12:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/12/17/ColdFusion-driven-jqPlot-charts
guid: 4057
---

Yesterday night I took at <a href="http://www.jqplot.com">jqPlot</a>, a jQuery plugin for charting. I'm a big fan of charting, especially ColdFusion's built-in charting, but I wanted to take a look at jqPlot more deeply ever since I played with it a bit within the <a href="http://cfam.riaforge.org">CFAM</a> project. For the most part, jqPlot works well (although I had a few issues I'll describe below), and if a JavaScript rendered chart solution is ok for you then you definitely want to take a look. Just remember that this is completely client side solution. You won't emailing these charts or embedding them in a presentation anytime soon.
<!--more-->
<p/>

I'd begin by taking a look at the jqPlot <a href="http://www.jqplot.com/tests/">examples</a>. These give a good idea of what the plugin is capable of. Then you want to download the bits, extract, and start playing. If you look at the <a href="http://www.jqplot.com/docs/files/usage-txt.html">usage</a> example, you can see that the plugin is rather simple to use. You include your jQuery, the plugin, and a CSS sheet. If you ever used jQuery UI then this should be very familiar to you. You then select a div (and note it is important that the div have a defined width and height) and then you create an instance of jqPlot within that div. The code makes it look deceptively simple:
<p/>

<code>
$.jqplot('chartdiv',  [[[1, 2],[3,5.12],[5,13.1],[7,33.6],[9,85.9],[11,219.9]]]);
</code>

<p/>
However this never worked for me. The third argument to the constructor is an options object. Apparently this is optional but for me, nothing worked until I actually passed in an object, even a blank one. Here is a complete working example of the chart.

<p/>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="jqplot/jquery.jqplot.js"&gt;&lt;/script&gt;
&lt;link rel="stylesheet" type="text/css" href="jqplot/jquery.jqplot.css" /&gt;
&lt;script&gt;
$(document).ready(function() {

	$.jqplot('chartdiv',  [[[1, 2],[3,5.12],[5,13.1],[7,33.6],[9,85.9],[11,219.9]]], {});
})
&lt;/script&gt;

&lt;/head&gt;
&lt;body&gt;

&lt;h2&gt;Test jqPlot&lt;/h2&gt;

&lt;div id="chartdiv" style="width:400px;height:400px"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p/>

You can see an example of this here: <a href="http://www.raymondcamden.com/demos/dec172010/jqplot/test1.cfm">http://www.coldfusionjedi.com/demos/dec172010/jqplot/test1.cfm</a> The default rendering works but there are approximately one million or so ways to configure the chart. 

<p/>

One critical thing you don't want to miss is the format of the data. This confused me at first because visually, [[[1, 2],[3,5.12],[5,13.1],[7,33.6],[9,85.9],[11,219.9]]], doesn't exactly scream out "Readability." What that is, in English, is an array of series of points. So the top level array contains series inside it. A simple chart has one series. A series is made up of data points. So for the line graph 1,2 means x position 1, y position 2.

<p/>

So how about a ColdFusion example? I began by performing a simple query against the cfartgallery datasource.

<p/>

<code>
&lt;cfquery name="getsales" datasource="cfartgallery"&gt;
select sum(total) as sales, month(orderdate) as month from orders
group by month(orderdate)
&lt;/cfquery&gt;
</code>

<p>

I then needed to translate this query into the format jqPlot desires:

<p>

<code>
&lt;!--- core data ---&gt;
&lt;cfset data = []&gt;
&lt;!--- one series ---&gt;
&lt;cfset data[1] = []&gt;
&lt;cfloop query="getsales"&gt;
	&lt;cfset arrayAppend(data[1], [month,sales])&gt;
&lt;/cfloop&gt;
&lt;cfset serializedData = serializeJSON(data)&gt;
&lt;cfset serializedData = replace(serializedData, """", "", "all")&gt;
</code>

<p>

For the most part this should make sense. But why am I doing the replacement at the end? ColdFusion 901 wraps all the data in quotes. It's easy to remove them at once, but I bet jqPlot could just do parseInt on em and be fine. Anyway, I then output it like so:

<p>

<code>
$(document).ready(function() {
	&lt;cfoutput&gt;
	$.jqplot('chartdiv',  #serializedData#, 
		{ 
			title:'Sales by Month',
			axes:{
				xaxis:{min:1, max:12,numberTicks:12,
					tickOptions:{% raw %}{formatString:'%{% endraw %}s'}
				},
				yaxis:{% raw %}{min:0}{% endraw %}
			}
		}
	);
	&lt;/cfoutput&gt;
})
</code>

<p>

Note I've used a few options here. I added a title and specified the xaxis should go from 1 to 12. I also formatted the ticks. You can see an example of this here: <a href="http://www.coldfusionjedi.com/demos/dec172010/jqplot/test2a.cfm">http://www.coldfusionjedi.com/demos/dec172010/jqplot/test2a.cfm</a> It works, but how about using a bar chart? That's better for this type of data. Switching to a bar chart involves a bit more work. Here is the complete template. You can see two main changes. First - we include plugins to support the bar chart. Secondly we use a new renderer for the xaxis.

<p>

<code>
&lt;cfquery name="getsales" datasource="cfartgallery"&gt;
select sum(total) as sales, month(orderdate) as month from orders
group by month(orderdate)
&lt;/cfquery&gt;
&lt;!--- core data ---&gt;
&lt;cfset data = []&gt;
&lt;!--- one series ---&gt;
&lt;cfset data[1] = []&gt;
&lt;cfloop query="getsales"&gt;
	&lt;cfset arrayAppend(data[1], sales)&gt;
&lt;/cfloop&gt;
&lt;cfset serializedData = serializeJSON(data)&gt;
&lt;cfset serializedData = replace(serializedData, """", "", "all")&gt;

&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="jqplot/jquery.jqplot.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="jqplot/plugins/jqplot.categoryAxisRenderer.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="jqplot/plugins/jqplot.barRenderer.js"&gt;&lt;/script&gt;

&lt;link rel="stylesheet" type="text/css" href="jqplot/jquery.jqplot.css" /&gt;
&lt;script&gt;
$(document).ready(function() {
	&lt;cfoutput&gt;
	$.jqplot('chartdiv',  #serializedData#, 
		{ 
			title:'Sales by Month',
			series:[ {% raw %}{renderer:$.jqplot.BarRenderer, rendererOptions:{barPadding: 0, barMargin: 3}{% endraw %}} ],
			axes:{
        		xaxis:{% raw %}{renderer:$.jqplot.CategoryAxisRenderer}{% endraw %}, 
		        yaxis:{% raw %}{min:0}{% endraw %}
		    }
		}
	);
	&lt;/cfoutput&gt;
})
&lt;/script&gt;

&lt;/head&gt;
&lt;body&gt;

&lt;h2&gt;Test jqPlot&lt;/h2&gt;

&lt;div id="chartdiv" style="width:400px;height:400px"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

You can see this here: <a href="http://www.coldfusionjedi.com/demos/dec172010/jqplot/test2.cfm">http://www.coldfusionjedi.com/demos/dec172010/jqplot/test2.cfm</a>. Looking nicer, right? Not quite as simple, but I think once you get the chart to your liking, then your home free. So how about one more example? Imagine for a moment that our chart is a bit overwhelming for the sales staff. They can't quite handle seeing 12 bars at once. It overwhelms them and confuses them. How about we give them a nice way to control how much data is shown at once? In my final example, I've added the jQuery Slider control. I'm using the option with 2 controls so that you can specify an exact portion of the year. Here is the code. Notice how I look for changes to the slider and then fire off XHR requests to get my data. 

<p>

<code>
 

&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="jqueryui/jquery-ui-1.8.7.custom.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="jqplot/jquery.jqplot.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="jqplot/plugins/jqplot.categoryAxisRenderer.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="jqplot/plugins/jqplot.barRenderer.js"&gt;&lt;/script&gt;

&lt;link rel="stylesheet" type="text/css" href="jqplot/jquery.jqplot.css" /&gt;
&lt;link rel="stylesheet" type="text/css" href="jqueryui/css/ui-lightness/jquery-ui-1.8.7.custom.css" /&gt;
&lt;script&gt;
function getData() {
	var min = $("#monthbegin").text();
	var max = $("#monthend").text();

	$.post("data.cfc?method=getdata&returnformat=json", {% raw %}{"minmonth":min,"maxmonth":max}{% endraw %}, function(res,code) {
		//remove the quotes
		res = res.replace(/"/g,"");
		//create the proper data
		var data = [];
		data[0] = eval(res);

		var options = { 
			title:'Sales by Month',
			series:[ {% raw %}{renderer:$.jqplot.BarRenderer, rendererOptions:{barPadding: 0, barMargin: 3}{% endraw %}} ],
			axes:{
        		xaxis:{% raw %}{renderer:$.jqplot.CategoryAxisRenderer}{% endraw %}, 
		        yaxis:{% raw %}{min:0}{% endraw %}
		    }
		};
		$("#chartdiv").html("");
		$.jqplot('chartdiv',  data, options);

	});
}

$(document).ready(function() {

	getData();
	
	$( "#slider-range" ).slider({
			range: true,
			min: 1,
			max: 12,
			values: [ 1, 12 ],
			slide: function( event, ui ) {
				$("#monthbegin").text(ui.values[0]);
				$("#monthend").text(ui.values[1]);
				getData();
			}
	});
		
})
&lt;/script&gt;

&lt;/head&gt;
&lt;body&gt;

&lt;h2&gt;Test jqPlot&lt;/h2&gt;

&lt;b&gt;Show data from month &lt;span id="monthbegin"&gt;1&lt;/span&gt; to &lt;span id="monthend"&gt;12&lt;/span&gt;&lt;/b&gt;

&lt;div id="slider-range" style="width:400px"&gt;&lt;/div&gt;

&lt;div id="chartdiv" style="width:400px;height:400px"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

The CFC behind the scenes really isn't relevant, but here it is if you want to see it:

<p>

<code>
component {

	remote array function getdata(numeric minmonth=1, numeric maxmonth=12) {
		
		var q = new com.adobe.coldfusion.query();
        q.setDatasource("cfartgallery");
        q.setSQL("select sum(total) as sales, month(orderdate) as month from orders where month(orderdate) &gt;= :min and month(orderdate) &lt;= :max group by month(orderdate)");
        q.addParam(name="min",value="#arguments.minmonth#",cfsqltype="cf_sql_integer");
        q.addParam(name="max",value="#arguments.maxmonth#",cfsqltype="cf_sql_integer");
        var results = q.execute().getResult();
        var result = [];
        for(var i=1; i&lt;= results.recordCount; i++) {
        	arrayAppend(result, [results.month[i], results.sales[i]]);	
        }
        return result;
	}

}
</code>

<p>

And finally, you can play with this demo by clicking the big ass demo button below:

<p>

<a href="http://www.coldfusionjedi.com/demos/dec172010/jqplot/test3a.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

p.s. Quick final note folks. When I posted my demos, I forgot to include the IE fix. jqPlots DOES support IE. Just be sure to add this one line:

<p>

<code>
&lt;!--[if IE]&gt;&lt;script language="javascript" type="text/javascript" src="jqplot/excanvas.js"&gt;&lt;/script&gt;&lt;![endif]--&gt;
</code>