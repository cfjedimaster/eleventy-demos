---
layout: post
title: "Check out GeoNames"
date: "2011-11-30T12:11:00+06:00"
categories: [html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/11/30/Check-out-GeoNames
guid: 4451
---

While looking at <a href="http://www.kendoui.com/">Kendo UI</a> earlier this morning, I noticed one of their demos made use of <a href="http://www.geonames.org/">GeoNames</a>. I think I had heard of this site before but I had no idea the amount of cool stuff they had there. GeoNames provides a wealth of free geographical information. For example, countries, cities, states, time zones, etc. Again, all free. But on top of the pure data dumps they have some <i>really</i> cool <a href="http://www.geonames.org/export/ws-overview.html">web services</a>. These services are free, but metered. You have to register and get a username, but once you do, it's pretty simple to use. What I found truly cool though was some of their more unique services. The neatest was <a href="http://www.geonames.org/export/wikipedia-webservice.html#findNearbyWikipedia">findNearByWikipedia</a>. Basically, if you provide a longitude and latitude, the API will find wikipedia articles of items that are near by that location. You can use this to return information about (possibly) interesting things near by the user. Here's a simple example.

<p/>

<code>

&lt;html&gt;
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	//exit early if no geolocation
	if(!navigator.geolocation) return;
			
	//our generic error handler will just give a basic message
	function handleError(e){
		$("#status").append("&lt;p&gt;Sorry, I wasn't able to get your location!&lt;/p&gt;");
	}
	
	function gotPosition(geo){
		var latitude = geo.coords.latitude;
		var longitude = geo.coords.longitude;
		var apiUrl = "http://api.geonames.org/findNearbyWikipediaJSON?lat="+latitude+"&lng="+longitude+"&username=cfjedimaster&maxRows=10&callback=?";
		$.getJSON(apiUrl, {}, function(res) {

			if (res.hasOwnProperty("status")) {
				$("#status").html("Sorry, I failed to work because: " + res.status.message);
				return;
			}

			var s = "";
			for (var i = 0; i &lt; res.geonames.length; i++) {
				s+= "&lt;h2&gt;"+res.geonames[i].title+"&lt;/h2&gt;&lt;p&gt;";
				if(res.geonames[i].hasOwnProperty("thumbnailImg")) s += "&lt;img src='"+res.geonames[i].thumbnailImg+"' align='left'&gt;";
				s += res.geonames[i].summary;
				s += "&lt;br clear='left'&gt;&lt;a href='http://"+res.geonames[i].wikipediaUrl+"'&gt;[Read More]&lt;/a&gt;&lt;/p&gt;";
			}
			$("#status").html(s);
		});
	}
	
	$("#status").html("&lt;p&gt;Getting your location. Please stand by.&lt;/p&gt;");		
	navigator.geolocation.getCurrentPosition(gotPosition,handleError);
	

});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div id="status"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

This page fires off a HTML5 geolocation request. Once it has it, it then uses jQuery's getJSON and JSON/P support to hit the API. Then it's a simple matter of rendering the results out to the user. You can demo this yourself below, but be warned, my free account will probably stop working if enough people hit the page.

<p>

<a href="http://coldfusionjedi.com/demos/2011/nov/30/test.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>