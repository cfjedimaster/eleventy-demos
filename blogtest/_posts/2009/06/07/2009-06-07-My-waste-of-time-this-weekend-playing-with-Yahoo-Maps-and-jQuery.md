---
layout: post
title: "My waste of time this weekend - playing with Yahoo Maps and jQuery"
date: "2009-06-07T13:06:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2009/06/07/My-waste-of-time-this-weekend-playing-with-Yahoo-Maps-and-jQuery
guid: 3386
---

Last week I <a href="http://www.raymondcamden.com/index.cfm/2009/6/5/jQuery-Tabs-and-Google-Maps">blogged</a> on jQuery UI tabs and Google Maps. That led me to take another look at Yahoo's <a href="http://developer.yahoo.com/maps/">Maps</a> API. I had worked with this sometime ago when I created my <a href="http://cfyahoo.riaforge.org">CFYahoo</a> project. The code I wrote for the wrapper though only interfaced with their <a href="http://developer.yahoo.com/maps/rest/V1/">REST</a> API. This let you get maps as images and save them to your server. This weekend I took a look at the <a href="http://developer.yahoo.com/maps/ajax/">AJAX</a> API.
<!--more-->
As you guess, this is a pure JavaScript solution. Include a script tag pointing to their service, create a map object, and you're good to go. In general, it worked well. I was a bit disappointed by their documentation though. Their reference guide spells out all the various methods, but is <i>very</i> slim on actual implementation details. So for example, you can create a YGeoPoint object from a latitude and longitude object, but they don't tell you what the valid values are in that range. I guess I learned that in Geography class 20 years ago, but my memory isn't what it used to be. Another example - they mention the various event handlers you can make use of, but from what I see, they don't specify what gets passed to the event. Nor do they fully explain what each event does. You can guess, of course, but I was surprised one more than one occasion when some code fired an event I didn't expect. 

Yet another example (and I don't mean to harp so much on this, but it really bugs me when documentation is lacking, and yes, I know I've not done a great job at this myself) - there are 3 valid map types defined. They are: YAHOO_MAP_SAT, YAHOO_MAP_REG, YAHOO_MAP_HYB. Now I know that you can take a guess at these. Sat is for satellite, hybrid is satellite and regular, but would it have killed Yahoo to simply put a one line description of these fields somewhere in the docs? 

Ok, I'll stop now. Once I figured things out and began to play, I decided to have some fun. Check out this template:

<code>
&lt;html&gt;
	
&lt;head&gt;
&lt;script type="text/javascript" src="http://api.maps.yahoo.com/ajaxymap?v=3.8&appid=cfjedimaster"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;	
&lt;style type="text/css"&gt;
#map{
height: 100%;
width: 100%;
}
&lt;/style&gt;

&lt;script&gt;
$(document).ready(function() {
	// Create a map object
	var map = new YMap(document.getElementById('map'));

	var mapTypes = map.getMapTypes()

	var validZooms = map.getZoomValidLevels()
	//remove a few zooms since a lot of places won't let us zoom in
	for(var i=0;i&lt;5;i++) validZooms.shift()
	//pop one or two off the top
	for(var i=0;i&lt;2;i++) validZooms.pop()
	

	//no need for dragging	
	map.disableDragMap()

	// Set map type to either of: YAHOO_MAP_SAT, YAHOO_MAP_HYB, YAHOO_MAP_REG
	map.setMapType(YAHOO_MAP_REG);

	// Display the map centered on a geocoded location
	map.drawZoomAndCenter("San Francisco", 10);

	window.setInterval(moveMe,6000)
	
	function moveMe() {
		var newLat = Math.floor(Math.random()*181)-90
		var newLong = Math.floor(Math.random()*361)-180
		var gp = new YGeoPoint(newLat,newLong)
		map.panToLatLon(gp)
		map.setMapType(getRandomType())
		map.setZoomLevel(getRandomZoom())
	}

	function getRandomType() {
		var type = mapTypes[Math.floor(Math.random()*mapTypes.length)]
		return type
	}
	
	function getRandomZoom() {
		var zoom = validZooms[Math.floor(Math.random()*validZooms.length)]
		return zoom
	}
		
})	
&lt;/script&gt;
&lt;/head&gt;	

&lt;body&gt;
	
&lt;div id="map"&gt;&lt;/div&gt;
	
&lt;/body&gt;
&lt;/html&gt;
</code>

This script creates a map object centered on San Francisco. (Sorry, I thought my home town was the center of the universe?) I then fire off an interval to run "moveMe" every 6 seconds. This function picks a random location on the planet, a random map type, and a random zoom level (although note I trim the zoom values at the edges). Basically what you get is a full screen view of the Earth at random locations. 

You can see an example of this here (<b>Note - most likely I will go over my usage limit for Yahoo, sorry!</b>): <a href="http://www.coldfusionjedi.com/demos/yahoomapsajx/test2.html">http://www.coldfusionjedi.com/demos/yahoomapsajx/test2.html</a>

Kind of fun, but tends to show ocean more often than not. No surprise there - we live on a planet that is 3/4ths water.

I then began work on a new version. I wanted a version where a map would fade in, instead of loading in blocks. I updated my code to use 2 DIVs. One for an initial map, another for the map that would load the new location. In theory, I could flip back and forth. I used the event handlers to fade out the old map, fade in the new map, and call out again in a few seconds to load a new map. In general it worked ok, but I removed the random zoom since zooming changed the map and forced another 'map loaded' event. I also removed the random map type. (Although you will see some of the code left over.)

<code>
&lt;html&gt;
	
&lt;head&gt;
&lt;script type="text/javascript" src="http://api.maps.yahoo.com/ajaxymap?v=3.8&appid=cfjedimaster"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;	
&lt;style type="text/css"&gt;
.map {
	height: 500px;
	width: 500px;
	float:left;
	display:none;
}

#status {
	float:left;
	padding-left: 20px;
	font-family: Verdana, Geneva, Arial, Helvetica, sans-serif;
}
&lt;/style&gt;

&lt;script&gt;
$(document).ready(function() {

	//used for debugging
	var TEMP = 0
	
	//flag for m2
	var m2flag = true
	
	//size it, since map gets confused by hidden
	size = new YSize(500,500)
	
	// Create a map object for each div
	var map1 = new YMap($("#map1").get(0),YAHOO_MAP_REG,size)
	var map2 = new YMap($("#map2").get(0),YAHOO_MAP_REG,size)


	//Listen for loading
	YEvent.Capture(map1,EventsList.endMapDraw,mapLoaded)
	YEvent.Capture(map2,EventsList.endMapDraw,mapLoaded)

	//get data from map1, used for map types and zooms
	var mapTypes = map1.getMapTypes()
	var validZooms = map1.getZoomValidLevels()

	//remove a few zooms since a lot of places won't let us zoom in
	for(var i=0;i&lt;5;i++) validZooms.shift()
	//pop one or two off the top
	for(var i=0;i&lt;2;i++) validZooms.pop()

	//no need for dragging	
	map1.disableDragMap()
	map2.disableDragMap()

	//begin with map1
	var currentMap = "map1"

	// Display the map centered on a geocoded location
	map1.drawZoomAndCenter("San Francisco", 10);
	
	function moveMe(thismap) {
		console.log('moveMe '+thismap)
		var newLat = Math.floor(Math.random()*181)-90
		var newLong = Math.floor(Math.random()*361)-180
		var gp = new YGeoPoint(newLat,newLong)
		var mp = eval(thismap)
		if(m2flag) {
			mp.drawZoomAndCenter(gp, 10);			
			m2flag = false			
		} else {
			mp.panToLatLon(gp)
			//mp.setMapType(getRandomType())
		}
		$("#status").html("&lt;p&gt;Moved to "+newLat+" Lat, "+newLong+" Long&lt;/p&gt;")
	}

	function getRandomType() {
		var type = mapTypes[Math.floor(Math.random()*mapTypes.length)]
		return type
	}
	
	function getRandomZoom() {
		var zoom = validZooms[Math.floor(Math.random()*validZooms.length)]
		return zoom
	}
		
	function mapLoaded(e) {
		//console.log('loaded '+currentMap)

		//fade out, fade in 
		if(currentMap == "map1") $("#map2").fadeOut('slow', function() {% raw %}{ $("#map1").fadeIn('slow') }{% endraw %})
		else $("#map1").fadeOut('slow', function() {% raw %}{ $("#map2").fadeIn('slow') }{% endraw %})
		
		//$("#" + currentMap).fadeIn('slow')
		
		//call out to move next map
		if(currentMap == "map1") {
			nextMap = "map2"
			currentMap = "map2"
		} else {
			currentMap = "map1"
		}
		/*
		TEMP++
		if(TEMP &lt; 10) window.setTimeout(moveMe,5000,currentMap)
		else console.log('ABORT')
		*/
		window.setTimeout(moveMe,5000,currentMap)	
	}
})	
&lt;/script&gt;
&lt;/head&gt;	

&lt;body&gt;
	
&lt;div id="map1" class="map"&gt;&lt;/div&gt;
&lt;div id="map2" class="map"&gt;&lt;/div&gt;
&lt;div id="status"&gt;&lt;p&gt;Starting in San Francisco&lt;/p&gt;&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

You can see this here: <a href="http://www.coldfusionjedi.com/demos/yahoomapsajx/test3.html">http://www.coldfusionjedi.com/demos/yahoomapsajx/test3.html</a> 

Like the first example, this one also spends a lot of time out at sea. I then decided to figure out the ranges for American long/lat. This took me a few minutes to get right. I ended up using the <a href="http://developer.yahoo.com/maps/ajax/V3.8/example/draw-polylines.html">Polylines</a> demo, which reported long/lat values for your mouse clicks, and used that to figure out ranges for the continental United States. (If anyone in Hawaii wants me to update this to support your state, please send plane tickets so that I may properly ensure my code is working correctly.) I modified moveMe function like so:

<code>
function moveMe(thismap) {
	//console.log('moveMe '+thismap)
	//Miami 25, Seattle 47
	var newLat = Math.floor(Math.random()*22)+25
	//Seattle 122, Maine 68
	var newLong = Math.floor(Math.random()*57)+(-124)
	var gp = new YGeoPoint(newLat,newLong)
	var mp = eval(thismap)
	if(m2flag) {
		mp.drawZoomAndCenter(gp, 10);			
		m2flag = false			
	} else {
		mp.panToLatLon(gp)
	}
	$("#status").html("&lt;p&gt;Moved to "+newLat+" Lat, "+newLong+" Long&lt;/p&gt;")
}
</code>

The m2flag code simply handles initializing the second map correctly. I couldn't initialize it and not listen to it so I simply wrote a hack to handle the first time I want to set that map up. You can see this version here: <a href="http://www.coldfusionjedi.com/demos/yahoomapsajx/test4.html">http://www.coldfusionjedi.com/demos/yahoomapsajx/test4.html</a>



As I said, useless, but kind of fun anyway. 
<img src="https://static.raymondcamden.com/images/cfjedi//Picture 1.jpg">