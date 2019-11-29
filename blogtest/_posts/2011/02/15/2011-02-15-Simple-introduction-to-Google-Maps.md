---
layout: post
title: "Simple introduction to Google Maps"
date: "2011-02-15T23:02:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2011/02/15/Simple-introduction-to-Google-Maps
guid: 4124
---

I've done quite a few blog entries on cfmap, ColdFusion's wrapper to the Google Map API. While cfmap makes using the API as easy as possible, there may be cases where you want to use the map API natively. For example, ColdFusion's use of the API is tied to version 2 of Google's API. The current version is 3. I decided to take a quick look at what's involved with working with Google's Map API by itself. Here are some examples and notes. Please note that there are multiple wrappers out there to make this process easier - including support for doing maps via a jQuery plugin. I'm intentionally avoiding these as I want a 100% pure solution.

<p>

<more>

To begin, you may want to take a look at what Google calls the <a href="http://code.google.com/apis/maps/index.html">Map API Family</a>. This is a high level directory of all the Map APIs. This blog entry is concerned with the latest version of the <a href="http://code.google.com/apis/maps/documentation/javascript/">JavaScript API</a>. One thing I'll point out right away is that the latest version of the API does not require a developer key. That doesn't mean we get to use the service without limit (you'll see a good example of this later), but it does mean we skip signing up for a developer key. Google makes this easy - but also ties the key to a particular domain. In my cfmap examples I can't tell you how many times I got hit by a dev versus production move.  

<p>

I began my research by reading the <a href="http://code.google.com/apis/maps/documentation/javascript/tutorial.html">tutorial</a>. It's a good entry, but a bit overly complex. I took their code and stripped it down a bit to make it even simpler. Here is my version of their first code block.

<p>

<code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;

&lt;head&gt;
&lt;style type="text/css"&gt;
  #map_canvas {% raw %}{ width: 450px; height: 450px; }{% endraw %}
&lt;/style&gt;
&lt;script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"&gt;&lt;/script&gt;
&lt;script type="text/javascript"&gt;
function initialize() {
	var latlng = new google.maps.LatLng(31, -92);
	var myOptions = {
		zoom: 8,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body onload="initialize()"&gt;

  &lt;div id="map_canvas"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

The critical parts of this template are:

<p>

<ul>
<li>Loading the Google Maps JavaScript API. What's with the sensor=false? That tells Google to <i>not</i> try to load your location. This is only useful on mobile devices or geolocation enabled browsers. And let's be honest. If your intent is to show your users the location of objects, you probably don't care where they are. (At least not yet.) 
<li>Notice the div called map_canvas. Google Maps works by writing the map into a div. It is critical that the div have a precise size. In this case the size is set in a style block.
<li>The body tag runs a function, initialize, on startup. Creating a map comes down to choosing your settings and then passing it to a Map initializer. This example just uses 3 settings - a zoom level, a center, and a map type. According to the docs these three settings are your minimum. 
</ul>

<p>

All in all - not a lot of code, right? You can test this <a href="http://www.raymondcamden.com/demos/feb152011/test1.html">here</a>. For a slightly more advanced example, this template simply adds a bunch more options. (You can find the full list of options <a href="http://code.google.com/apis/maps/documentation/javascript/reference.html#MapOptions">here</a>.)

<p>

<code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;

&lt;head&gt;
&lt;style type="text/css"&gt;
  #map_canvas {% raw %}{ width: 450px; height: 450px; }{% endraw %}
&lt;/style&gt;
&lt;script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"&gt;&lt;/script&gt;
&lt;script type="text/javascript"&gt;
function initialize() {
	var latlng = new google.maps.LatLng(31, -92);
	var myOptions = {
		zoom: 8,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.HYBRID,
		panControl:false,
		zoomControl:false,
		streetViewControl:false,
		mapTypeControl:false
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body onload="initialize()"&gt;

  &lt;div id="map_canvas"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

You can run this demo <a href="http://www.coldfusionjedi.com/demos/feb152011/test1a.html">here</a>. Ok - so far, I've all done is create a map at a certain longitude and latitude. (Keep watch - I'm going to typo the heck out of those words probably.) It's possible your data may contain such information already. It probably doesn't. Google does have a web service you can run to get geolocation information. (You can find a ColdFusion wrapper <a href="http://googlegeocoder3.riaforge.org/">here</a>.) I use this service at <a href="http://groups.adobe.com">Adobe Groups</a> to geolocate group data on a scheduled basis. But what if you want to geolocate on the fly? Luckily this is possible via JavaScript as well, but you are limited to 2500 requests per day. (See details <a href="http://code.google.com/apis/maps/documentation/geocoding/index.html#Limits">here</a>.) I'd probably suggest geocoding server side and doing it one time only as opposed to on the fly with every request. But if you do want to do it in JavaScript, here is an example.

<p>

<code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;

&lt;head&gt;
&lt;style type="text/css"&gt;
  #map_canvas {% raw %}{ width: 450px; height: 450px; }{% endraw %}
&lt;/style&gt;
&lt;script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"&gt;&lt;/script&gt;
&lt;script type="text/javascript"&gt;
function initialize() {
	var address = "Lafayette, LA";
	geocoder = new google.maps.Geocoder();

	geocoder.geocode( {% raw %}{ 'address': address}{% endraw %}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {

			var myOptions = {
				zoom: 8,
				center: results[0].geometry.location,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);

			var marker = new google.maps.Marker({
				map: map, 
				position: results[0].geometry.location
			});
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
	
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body onload="initialize()"&gt;

  &lt;div id="map_canvas"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

In this template, I begin with  free form address string for Lafayette, LA. I create a new geocoder object and fire off the geocode request. This is asynchronous so a callback function is used to handle the result. If the result was good, we have a location object that contains our longitude and latitude. This can then be passed to the Map initializer. That by itself is it - but I went ahead and took more code from Google's doc to create a simple marker object. You can see this demo <a href="http://www.coldfusionjedi.com/demos/feb152011/test2.html">here</a>. 

<p>

Ok - can we use some ColdFusion now? I wanted to create a simple demo based on database data. I began by writing the query and a simple table output.

<p>

<code>
&lt;cfquery name="getorders" datasource="cfartgallery" maxrows="10"&gt;
select	orderid, total, orderdate, address, city, state, postalcode
from	orders
&lt;/cfquery&gt;

&lt;table border="1" width="100%"&gt;
	&lt;tr&gt;
		&lt;th&gt;Order ID&lt;/th&gt;
		&lt;th&gt;Total&lt;/th&gt;
		&lt;th&gt;Date&lt;/th&gt;
		&lt;th&gt;Shipped To&lt;/th&gt;
	&lt;/tr&gt;
	&lt;cfoutput query="getorders"&gt;
	&lt;tr&gt;
		&lt;td&gt;#orderid#&lt;/td&gt;
		&lt;td&gt;#dollarformat(total)#&lt;/td&gt;
		&lt;td&gt;#dateFormat(orderdate)#&lt;/td&gt;
		&lt;td&gt;
		#address#&lt;br/&gt;
		#city#, #state# #postalcode#
		&lt;/td&gt;
	&lt;/tr&gt;
	&lt;/cfoutput&gt;
&lt;/table&gt;
</code>

<p>

I assume nothing here needs explanation but if so, leave a comment. Now let's look at a modified version - one that integrates with Google maps.

<p>

<code>
&lt;cfquery name="getorders" datasource="cfartgallery" maxrows="10"&gt;
select	orderid, total, orderdate, address, city, state, postalcode
from	orders
&lt;/cfquery&gt;

&lt;!DOCTYPE html&gt;
&lt;html&gt;

&lt;head&gt;
&lt;style type="text/css"&gt;
  #map_canvas {% raw %}{ width: 450px; height: 450px; }{% endraw %}
&lt;/style&gt;
&lt;script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"&gt;&lt;/script&gt;
&lt;script type="text/javascript"&gt;
function showMap(address) {
	geocoder = new google.maps.Geocoder();

	geocoder.geocode( {% raw %}{ 'address': address}{% endraw %}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {

			var myOptions = {
				zoom: 8,
				center: results[0].geometry.location,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);

			var marker = new google.maps.Marker({
				map: map, 
				position: results[0].geometry.location
			});
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;table border="1" width="500"&gt;
	&lt;tr&gt;
		&lt;th width="60"&gt;Order #&lt;/th&gt;
		&lt;th width="100"&gt;Total&lt;/th&gt;
		&lt;th width="100"&gt;Date&lt;/th&gt;
		&lt;th&gt;Shipped To&lt;/th&gt;
	&lt;/tr&gt;
	&lt;cfoutput query="getorders"&gt;
	&lt;tr&gt;
		&lt;td&gt;#orderid#&lt;/td&gt;
		&lt;td&gt;#dollarformat(total)#&lt;/td&gt;
		&lt;td&gt;#dateFormat(orderdate)#&lt;/td&gt;
		&lt;td&gt;
		#address#&lt;br/&gt;
		#city#, #state# #postalcode#&lt;br/&gt;
		&lt;cfset fulladdress = address & " " & city & ", " & state & " " & postalcode&gt;
		&lt;a href="##" onclick="showMap('#jsStringFormat(fulladdress)#');return false"&gt;Show Map&lt;/a&gt;
		&lt;/td&gt;
	&lt;/tr&gt;
	&lt;/cfoutput&gt;
&lt;/table&gt;

&lt;div id="map_canvas"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

So what did I do? I began by adding a link to a JavaScript function called showMap. I passed in the address of the order data I am displaying. showMap is basically the same code as before except now my address value is passed in as an argument. You can see this demo <a href="http://www.coldfusionjedi.com/demos/feb152011/orders2.cfm">here</a>.

<p>

So - this is just scratching the surface of what's available, but as you can see it isn't too hard to use. I hope this helps - and if anyone has follow up questions, just leave a comment.