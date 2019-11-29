---
layout: post
title: "Simple introduction to Google Maps Part 2 - Markers"
date: "2011-04-13T19:04:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/04/13/Simple-introduction-to-Google-Maps-Part-2-Markers
guid: 4195
---

Back in February I wrote a <a href="http://www.raymondcamden.com/2011/02/15/Simple-introduction-to-Google-Maps">simple introduction</a> to using Google Maps. ColdFusion makes this relatively easy, but there are times when you may want to use the Google Map service natively. It's also important to note that CFMAP makes use of the previous version of Google Maps. If you want to make use of the new hotness, you have to do it "by hand." As my blog post (hopefully) showed, this isn't terribly difficult at all. I thought I'd post a sequel that dealt with another part of the puzzle - markers. ColdFusion makes this really easy as well with the cfmapitem tag. Here's what I found when digging into the docs.
<!--more-->
<p>

Google groups markers into an area they called <a href="http://code.google.com/apis/maps/documentation/javascript/overlays.html">overlays</a>. Overlays include:

<p>

<ul>
<li>Markers (duh)
<li>Lines
<li>Polygons (you see - Math is important)
<li>Circles
<li>and finally - "Info Windows"
</ul>

<p>

The last item, "Info Windows", is actually something you have already seen if you've played with cfmap. When you create a marker with cfmapitem and supply a value for markerwindowcontent, you are actually creating both a marker <i>and</i> an Info Window. The info window is the little "cartoon voice" window that pops up when you click on the marker. Let's look at a simple example that creates a map and then puts a marker on top of it:

<p>

<pre><code class="language-markup">
&lt;!DOCTYPE html&gt;
&lt;html&gt;

&lt;head&gt;
&lt;style type="text/css"&gt;
  #map_canvas {% raw %}{ width: 450px; height: 450px; }{% endraw %}
&lt;/style&gt;
&lt;script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"&gt;&lt;/script&gt;
&lt;script type="text/javascript"&gt;

function initialize() {
	var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
	var myOptions = {
		zoom: 4,
		center: myLatlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
	}
	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	
	var marker = new google.maps.Marker({
	  position: myLatlng,
	  title:"Hello World!"
	});
	
	// To add the marker to the map, call setMap();
	marker.setMap(map);  
}
&lt;/script&gt;
&lt;/head&gt;
 
&lt;body onload="initialize()"&gt;

  &lt;div id="map_canvas"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt; 
</code></pre>

<p>

So I assume you read the <a href="http://www.raymondcamden.com/2011/02/15/Simple-introduction-to-Google-Maps">previous entry</a> and I don't need to explain the code that initializes the map. Immediately after this code is the marker code, let's focus on that:

<p>

<pre><code class="language-javascript">
var marker = new google.maps.Marker({
  position: myLatlng,
  title:"Hello World!"
});
	
// To add the marker to the map, call setMap();
marker.setMap(map);  
</code></pre>

<p>

I create the marker object with with a position (a longitude and latitude - we've all memorized our long/lat values, right?) and a title. There's more options to the marker object, but this will give you a basic marker with a title. The setMap function simply allows me to set the map for the marker. You can also provide it when you create the marker:

<p>

<pre><code class="language-javascript">
var marker = new google.maps.Marker({
  position: myLatlng,
  title:"Hello World!",
  map:map
});
</code></pre>

<p>

<strike>You can run this yourself here: http://www.coldfusionjedi.com/demos/april132011/test1.html</strike>

<p>

That works - but let's get some ColdFusion involved - check out this next example:

<p>

<pre><code class="language-markup">
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
var map;
function initialize() {
	var latlng = new google.maps.LatLng(38, -90);
	var myOptions = {
		zoom: 3,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
	
	geocoder = new google.maps.Geocoder();
	&lt;cfoutput query="getorders"&gt;
	geocoder.geocode( {% raw %}{ 'address': '#address#'}{% endraw %}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var marker = new google.maps.Marker({
				map: map, 
				position: results[0].geometry.location,
				title: "Order #orderid# for #dollarFormat(total)#"
			});
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
	&lt;/cfoutput&gt;
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body onload="initialize()"&gt;

&lt;div id="map_canvas"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p>

First - I added a query on top to get order information from the database. This includes address information for each order. Now look into our JavaScript. Because my order data isn't geocoded, I have to ask Google to geocode the data for me. I loop over each order and request such data and when I get it back, I use it to create a marker. Note the title includes a bit of information about the order itself. Not terribly complex but closer to a real application. You can see this one here: <strike>http://www.coldfusionjedi.com/demos/april132011/test2.cfm</strike> In case it isn't obvious, the title for the marker shows on mouse over.

<p>

Ok - so what about the cute little info windows? Let's look at our next example:

<p>

<pre><code class="language-markup">
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
var map;
function initialize() {
	var latlng = new google.maps.LatLng(38, -90);
	var myOptions = {
		zoom: 3,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
	
	geocoder = new google.maps.Geocoder();
	&lt;cfoutput query="getorders"&gt;
	geocoder.geocode( {% raw %}{ 'address': '#address# #city# #state# #postalcode#'}{% endraw %}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var marker = new google.maps.Marker({
				map: map, 
				position: results[0].geometry.location,
				title: "Order #orderid# for #dollarFormat(total)#"
			});
			var infowindow = new google.maps.InfoWindow({
    			content: "&lt;h3&gt;Order #orderid#&lt;/h3&gt;Address: #address#, #city#, #state# #postalcode#&lt;br/&gt;Ordered: #dateFormat(orderdate)#"
			});
			google.maps.event.addListener(marker, 'click', function() {
			  infowindow.open(map,marker);
			});
			
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
	&lt;/cfoutput&gt;
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body onload="initialize()"&gt;

&lt;div id="map_canvas"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p>

I'm going to focus on what's new here and that's the code right after the marker creation. You can see I make a new infowindow object. The content here is totally arbitrary, but I figured order details would be nice. Finally we add a click event to make it open when the marker is clicked. Still relatively simple, right? You can run this one here: <strike>http://www.coldfusionjedi.com/demos/april132011/test3.cfm</strike>

<p>

Time for our final demo. What spurred this blog post was a request from someone for the ability to center a map based on a click elsewhere in the page. Here's how I solved that - and note - there is probably a much nicer way to do this.

<p>

<pre><code class="language-markup">
&lt;cfquery name="getorders" datasource="cfartgallery" maxrows="10"&gt;
select	orderid, total, orderdate, address, city, state, postalcode
from	orders
where orderid != 4
&lt;/cfquery&gt;

&lt;!DOCTYPE html&gt;
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript"&gt;
var map;
var markers = [];
var lastinfowindow;

function initialize() {
	var latlng = new google.maps.LatLng(38, -90);
	var myOptions = {
		zoom: 3,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
	
	geocoder = new google.maps.Geocoder();
	&lt;cfoutput query="getorders"&gt;
	geocoder.geocode( {% raw %}{ 'address': '#address# #city# #state# #postalcode#'}{% endraw %}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var marker = new google.maps.Marker({
				map: map, 
				position: results[0].geometry.location,
				title: "Order #orderid# for #dollarFormat(total)#"
			});
			var infowindow = new google.maps.InfoWindow({
    			content: "&lt;h3&gt;Order #orderid#&lt;/h3&gt;Address: #address#, #city#, #state# #postalcode#&lt;br/&gt;Ordered: #dateFormat(orderdate)#"
			});
			google.maps.event.addListener(marker, 'click', function() {
			  infowindow.open(map,marker);
			});
			marker.orderid = #orderid#;
			marker.infowindow = infowindow;
			markers[markers.length] = marker;
		} else {
			//alert("Geocode was not successful for the following reason: " + status);
		}
	});
	&lt;/cfoutput&gt;
	
	$(".order").click(function() {
		var thisorder = $(this).data("orderid");
		for(var i=0; i&lt;markers.length; i++) {
			if(markers[i].orderid == thisorder) {
				console.log("found my match");
				//get the latlong
				if(lastinfowindow instanceof google.maps.InfoWindow) lastinfowindow.close();
				console.dir(markers[i]);
				map.panTo(markers[i].getPosition());
				markers[i].infowindow.open(map, markers[i]);
				lastinfowindow = markers[i].infowindow;
			}
		}
	});
}


&lt;/script&gt;
&lt;style&gt;
#map_canvas { 
 width: 450px; height: 450px; 
 float:left;
}
#orders {
	margin-top: 0px;
	padding-top: 0px;
	margin-left: 10px;
	float:left;
	height: 450px;
	overflow-y: scroll;
}
.order {
    	border-style:solid;    
    	border-width:thin; 
		width: 300px;
		padding: 5px;  
		cursor:pointer; 
		margin-top:0px;
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body onload="initialize()"&gt;

&lt;div id="map_canvas"&gt;&lt;/div&gt;

&lt;div id="orders"&gt;
&lt;cfloop query="getorders"&gt;
	&lt;cfoutput&gt;
	&lt;p class="order" data-orderid="#orderid#"&gt;
	&lt;b&gt;Order #orderid#&lt;/b&gt;&lt;br/&gt;
	#address#, #city#, #state# #postalcode#
	&lt;/p&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p>

So first a quick note - I modified my query to not get orderid 4. That order was consistently not geolocating so I thought i'd just remove it. Right away you may notice something new - I've created an array called markers and a variable called lastinfowindow. The reason why for this will become evident real quick like. 

<p>

Scroll down a bit to where I create the marker. I wanted a way to associate the order ID with the marker (and again, why will be made clear), so I kinda cheated a bit. Objects in JavaScript can be manipulated much like CFCs in ColdFusion. I can add an arbitrary value - as I've done here - to store the order id. That <i>kind</i> of bugs me. I could have create a new object instead and stuffed the marker as one key and the value as another - but this works. I also store a copy of the infowindow object. Finally this is appended to my array. The end result is that I've now got a global object that contains a reference to all my markers. Apparently (and I could be wrong), Google Maps do not provide an easy way to get all the markers in a map. From what I see they recommend exactly this approach - storing them within an array. 

<p>

So - next up is a click handler defined using jQuery syntax. If you look down a bit you can see I'm outputting the orders in a set of P blocks. I've asked jQuery to set up a click handler on those paragraphs. When you click, I grab the order id (I <b>love</b> data-* properties!) and then look for it within my markers array. If I find it - I first see if I need to close an existing infowindow. I then pan the map to the location and open the infowindow. All in all - rather simple? <strike>If you want to demo this, please be aware of the console.log messages I used to debug. Use in a Chrome browser or Firebug-enabled Firefox. </strike>

A big thank you to <a href="http://www.cfsilence.com">Todd Sharp</a> for help with the CSS.