---
layout: post
title: "CFMAP and Centering"
date: "2009-12-27T19:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/27/CFMAP-and-Centering
guid: 3665
---

For a while now I've had two line items in my "To write about" notebook. They concerned figuring out how to use CFMAP (and Google Maps in general) to center the map on an address. Out of the box you have an immediate address that acts as the center, but I wanted to see how the center could be changed post map load. 
<p/>

My first attempt was to figure out a way to center the map on an marker. I began with an extremely simple script:
<!--more-->
<p/>
<code>
&lt;cfmap centeraddress="St. Louis, MO" width="400" height="400" name="mainMap"&gt;

	&lt;cfmapitem address="New Orleans, LA"&gt;

&lt;/cfmap&gt;
</code>
<p/>

This generated: 
<p/>

<img src="https://static.raymondcamden.com/images/Screen shot 2009-12-27 at 6.36.28 PM.png" />
<p/>

Looking over both the ColdFusion docs and the Google Maps API, I began by adding ajaxOnLoad to the bottom of my script:
<p/>

<code>
&lt;cfset ajaxOnLoad("init")&gt;
</code>
<p/>

And used this for my init:
<p/>

<code>
function init(){
	ColdFusion.Map.addEvent("mainMap", "click", clickHandler)
}
</code>
<p/>

This code adds a click handler for the map I created earlier. The click handler does:
<p/>

<code>
function clickHandler(item){
	if (item) {
		var map = ColdFusion.Map.getMapObject("mainMap")
		map.setCenter(item.getLatLng())
	}
}
</code>
<p/>

Because I've got a click handler for the entire map, it runs whenever you click on it. However, it only passes event data when you click on one of the markers. Either the center marker (St. Louis) or New Orleans. This feels a bit.... fuzzy to me. I should probably check to see if item is an instance of a marker object. But the important part is the setCenter call. I run this on the map object returned by getMapObject. You can get fancy if you want to - change setCenter to panTo and you get a nice animation. <a href="http://www.coldfusionjedi.com/demos/map122709/test.cfm">View the Demo</a>
<p/>

Here is the complete code for that example:
<p/>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script&gt;
function clickHandler(item){
	if (item) {
		var map = ColdFusion.Map.getMapObject("mainMap")
//		map.setCenter(item.getLatLng())
		map.panTo(item.getLatLng())
	}
}

function init(){
	ColdFusion.Map.addEvent("mainMap", "click", clickHandler)
}
&lt;/script&gt;
&lt;/head&gt;


&lt;body&gt;


&lt;cfmap centeraddress="St. Louis, MO" width="400" height="400" name="mainMap"&gt;

	&lt;cfmapitem address="New Orleans, LA"&gt;

&lt;/cfmap&gt;


&lt;/body&gt;
&lt;/html&gt;
&lt;cfset ajaxOnLoad("init")&gt;
</code>
<p/>

Ok, that works, but is a bit simplistic. I wanted to step it up a notch and add more interactivity. For my second demo, I created a list of cities. These cities were used as map markers, but I also wanted a simple HTML list as well. Clicking on the text version of the city would center the map. (I skipped making the marker work as well since I had just done that.) To begin, I created my list of cities.
<p/>

<code>
&lt;cfset addresses = ["New Orleans, LA", "San Francisco, CA", "Washington, D.C.", "Houston, TX", "Miami, FL"]&gt;
</code>
<p/>

Next I wrote the code to generate the map and HTML list:
<p/>

<code>
&lt;cfmap centeraddress="St. Louis, MO" width="400" height="400" name="mainMap" showcentermarker="false"&gt;
	&lt;cfloop index="address" array="#addresses#"&gt;
		&lt;cfmapitem address="#address#"&gt;
	&lt;/cfloop&gt;
&lt;/cfmap&gt;

&lt;p/&gt;

&lt;cfloop index="address" array="#addresses#"&gt;
	&lt;cfoutput&gt;
	&lt;a class="addressDisplay" href="javascript:center('#jsStringFormat(address)#')"&gt;#address#&lt;/a&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

<p/>

Notice that for each address I'm calling a JavaScript function center. Let's take a look at that:

<p/>

<code>
function center(s){
	ColdFusion.Map.setCenter('mainMap',{
		address: s
	})
}
</code>
<p/>

Yeah - pretty simple, right? Unfortunately, something goes wonky when you run this. The first time I ran my code, I ended up with new, green markers on the locations. This was <b>before</b> I added showcentermarker="false" to my map. I clicked a bunch of cities and each time it simply added green markers. It never actually centered. 
<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2009-12-27 at 6.58.41 PM.png" />
<p/>

When I added showcentermarker="false", it did absolutely nothing. You can see this yourself <a href="http://www.coldfusionjedi.com/demos/map122709/test2.cfm">here</a>. I'm guessing it is just a bug. 
<p/>

I decided to switch to the code I used in the first code sample. But to do that - I needed longitude and latitude. Normally I'd recommend always using those values (see my previous article on this linked to below), but I only had string addresses for now. I was lucky though to find a quick solution on the Google Maps API reference. They had this very simple example of using the Geolocation API:
<p/>

<code>
function center(address){
	var geocoder = new GClientGeocoder();

	geocoder.getLatLng(
	    address,
	    function(point) {
	      if (!point) {
	        alert(address + " not found");
	      } else {
			map = ColdFusion.Map.getMapObject("mainMap")
			map.setCenter(point);
	      }
	    }
  )

}
</code>
<p/>

Now the code creates a new instance of GClientGeocoder and runs getLatLng on the address. Notice the use of the inline function to handle the result and set the center. You can see this demo here: <a href="http://www.coldfusionjedi.com/demos/map122709/test2a.cfm">View the Demo</a>
<p/>

And here is the complete script:
<p/>

<code>
&lt;cfset addresses = ["New Orleans, LA", "San Francisco, CA", "Washington, D.C.", "Houston, TX", "Miami, FL"]&gt;

&lt;html&gt;

&lt;head&gt;
&lt;script&gt;
function center(address){
	var geocoder = new GClientGeocoder();

	geocoder.getLatLng(
	    address,
	    function(point) {
	      if (!point) {
	        alert(address + " not found");
	      } else {
			map = ColdFusion.Map.getMapObject("mainMap")
			map.setCenter(point);
	      }
	    }
  )

}
&lt;/script&gt;
&lt;style&gt;
.addressDisplay {
 display: block;
 background-color: #e0e0e0;
 padding: 10px;
 margin: 10px;
 width:140px;
}
&lt;/style&gt;
&lt;/head&gt;


&lt;body&gt;


&lt;cfmap centeraddress="St. Louis, MO" width="400" height="400" name="mainMap" showcentermarker="false"&gt;
	&lt;cfloop index="address" array="#addresses#"&gt;
		&lt;cfmapitem address="#address#"&gt;
	&lt;/cfloop&gt;
&lt;/cfmap&gt;

&lt;p/&gt;

&lt;cfloop index="address" array="#addresses#"&gt;
	&lt;cfoutput&gt;
	&lt;a class="addressDisplay" href="javascript:center('#jsStringFormat(address)#')"&gt;#address#&lt;/a&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>
<p/>

And finally, I decided to get crazy. I knew that Google's Streetview stuff was part of the main API. What I didn't know was how freaking easy it was to use. 
<p/>

<code>
panoramaOptions = {% raw %}{ latlng:point }{% endraw %};
var myPano = new GStreetviewPanorama(document.getElementById("streetView"), panoramaOptions);
</code>
<p/>

In this snippet, point is a valid longitude/latitude pair. The call to GStreetViewPanorama simply creates the streetview within a DOM item. Now, my addresses are pretty vague so this demo ain't great, but you can imagine how cool this would be for your business if you supplied some fuller data points. <a href="http://www.coldfusionjedi.com/demos/map122709/test5.cfm">View the Uber Elite Awesome Demo</a>
<p/>

Pretty cool, right?
<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2009-12-27 at 7.08.19 PM.png" />