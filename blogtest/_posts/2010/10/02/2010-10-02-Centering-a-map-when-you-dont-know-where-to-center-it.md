---
layout: post
title: "Centering a map when you don't know where to center it"
date: "2010-10-03T00:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/10/02/Centering-a-map-when-you-dont-know-where-to-center-it
guid: 3959
---

Wow, that's a pretty bad title, but hopefully things will be a bit clearer in a minute. A reader, Matt, wrote in with a few interesting cfmap problems. First - how would you center a map "best" when you aren't sure where your map items will be placed? The second problem is how best to zoom the map. By best we mean getting in as close as possible and still seeing all the map items. What follows is my solution, but the road to this solution was a bit rough. As always, if you have suggestions please share them.
<!--more-->
<p>

First - let's look at how I tried to solve this with a basic cfmap. I created 4 long/lat points (in the west) and centered the map in St. Louis. Here is the code:

<p>

<code>
&lt;cfset data = [
{% raw %}{latitude="38.685510",longitude="-122.167969"}{% endraw %},
{% raw %}{latitude="41.705729",longitude="-119.794922"}{% endraw %},
{% raw %}{latitude="39.027719",longitude="-116.894531"}{% endraw %},
{% raw %}{latitude="35.173808",longitude="-117.685547"}{% endraw %}]&gt;


&lt;cfmap width="500" height="500" centerAddress="St. Louis, MO" name="mainMap" showcentermarker="false"&gt;
	&lt;cfloop index="mi" array="#data#"&gt;
		&lt;cfmapitem longitude="#mi.longitude#" latitude="#mi.latitude#" &gt;
	&lt;/cfloop&gt;
&lt;/cfmap&gt;
</code>

<p>

And it renders like so:

<p>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-10-02 at 10.25.53 PM.png" />

<p>

Ok, so let's focus on the centering first - because this is where we will run into our first big problem. The Google Maps API provides a cool little object called a bounds. You can think of a bounds object as a box that contains all your data. So given the fact that we know our points, we can make a bounds object using a little bit of JavaScript. I began by adding this:

<p>

<code>
&lt;cfset ajaxOnLoad("init")&gt;
</code>

<p>

And then added this JavaScript function:

<p>

<code>
&lt;script&gt;
function init() {
	console.log('ready');
	var gbounds = new GLatLngBounds();
	&lt;cfloop index="mi" array="#data#"&gt;
	&lt;cfoutput&gt;
	var p = new GLatLng(#mi.latitude#,#mi.longitude#);
	gbounds.extend(p);
	&lt;/cfoutput&gt;
	&lt;/cfloop&gt;
	
	center = gbounds.getCenter();

	var centerOb = {% raw %}{longitude:center.lng(), latitude:center.lat()}{% endraw %};
	ColdFusion.Map.setCenter("mainMap", centerOb);
}
&lt;/script&gt;
</code>

<p>

Ok - so you can see where I create by bounds object (documented <a href="http://code.google.com/apis/maps/documentation/javascript/v2/reference.html#GLatLngBounds">here</a>) and loop over my data. For each piece of data I create a GLatLng object and extend my bounds. Cool, right? I can then get the center, create a new structure from that, and use it in the API ColdFusion provides. Woot. Except - it doesn't do anything. I'd post a screen shot but it is the exact same as the one above. I'm not quite sure why it fails - but it seems as if the map created by ColdFusion "locks" onto the center address and doesn't let you move away from it. 

<p>

So I gave up. I admit it. But I thought - why not take a look and see how hard it would be to make the map the "native" way. I knew that Google was up to v3, one version ahead of the API used in ColdFusion, and with that I headed over to the <a href="http://code.google.com/apis/maps/documentation/javascript/">documentation</a>. I began with my data again.

<p>

<code>
&lt;cfset data = [
{% raw %}{latitude="38.685510",longitude="-122.167969"}{% endraw %},
{% raw %}{latitude="41.705729",longitude="-119.794922"}{% endraw %},
{% raw %}{latitude="39.027719",longitude="-116.894531"}{% endraw %},
{% raw %}{latitude="35.173808",longitude="-117.685547"}{% endraw %}]&gt;
</code>

<p>

And then loaded my libraries. Obviously only the Google Map library was required - I brought in jQuery just because.

<p>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
</code>

<p>

Ok, so let's get our bounds object again and populate it.

<p>

<code>
	var gbounds = new google.maps.LatLngBounds();
</code>

<p>

And then loop over our data and extend it again.

<p>

<code>


	&lt;cfloop index="mi" array="#data#"&gt;
	&lt;cfoutput&gt;
	//make the point
	var point = new google.maps.LatLng(#mi.latitude#,#mi.longitude#);
	gbounds.extend(point);

	&lt;/cfoutput&gt;
	&lt;/cfloop&gt;
</code>

<p>

Creating a map manually means pointing to a div (a blank div) and passing in options. These options match up to what you would have used with cfmap - so things like zoom, map type, and the center. 

<p>

<code>
	var options = {
		zoom:3,
		mapTypeId:google.maps.MapTypeId.ROADMAP,
		center:gbounds.getCenter()
	};
	
	var map = new google.maps.Map(document.getElementById('mainMap'), options);
</code>

<p>

The result? Looks right:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-10-02 at 10.43.05 PM.png" />

<p>

Ok, but what about those markers? That's pretty simple too. Marker objects can be as simple as a longitude and latitude. Google supports much more complex markers of course but for now, we can take the base default. I'm going to start by modifying my initial loop to also create the markers:

<p>

<code>

$(document).ready(function() {
	var gbounds = new google.maps.LatLngBounds();
	var markers = [];
	
	&lt;cfloop index="mi" array="#data#"&gt;
	&lt;cfoutput&gt;
	//make the point
	var point = new google.maps.LatLng(#mi.latitude#,#mi.longitude#);
	gbounds.extend(point);

	//make the marker
	var marker = new google.maps.Marker({% raw %}{position: point}{% endraw %});
	markers[markers.length] = marker;
	&lt;/cfoutput&gt;
	&lt;/cfloop&gt;
</code>

<p>

And then I added the markers. Now remember I don't have a map yet in the loop there so I need to wait till after that map is done:

<p>

<code>
for(var i=0; i&lt;markers.length; i++) markers[i].setMap(map);
</code>

<p>

And the result...

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-10-02 at 10.45.26 PM.png" />

<p>

Woot! I'd call that just about right. It seems centered right. We've got our markers. The only thing not done yet is the "best" zoom. I can bet this is going to involve quite a bit of math and other work. <b>Wrong</b>. Apparently you can just tell the map to fit to the bounds. Geeze, that's it?

<p>

<code>
map.fitBounds(gbounds);
</code>

<p>

And the result:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-10-02 at 10.47.21 PM.png" />

<p>

All in all - not so much work. I spent more time trying to get the cfmap version working then the v3 "native" one. Here is the entire template. Feel free to rip it apart and make it better.

<p>

<code>

&lt;cfset data = [
{% raw %}{latitude="38.685510",longitude="-122.167969"}{% endraw %},
{% raw %}{latitude="41.705729",longitude="-119.794922"}{% endraw %},
{% raw %}{latitude="39.027719",longitude="-116.894531"}{% endraw %},
{% raw %}{latitude="35.173808",longitude="-117.685547"}{% endraw %}]&gt;


&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	var gbounds = new google.maps.LatLngBounds();
	var markers = [];
	
	&lt;cfloop index="mi" array="#data#"&gt;
	&lt;cfoutput&gt;
	//make the point
	var point = new google.maps.LatLng(#mi.latitude#,#mi.longitude#);
	gbounds.extend(point);

	//make the marker
	var marker = new google.maps.Marker({% raw %}{position: point}{% endraw %});
	markers[markers.length] = marker;
	&lt;/cfoutput&gt;
	&lt;/cfloop&gt;

	var options = {
		zoom:3,
		mapTypeId:google.maps.MapTypeId.ROADMAP,
		center:gbounds.getCenter()
	};
	
	var map = new google.maps.Map(document.getElementById('mainMap'), options);

	map.fitBounds(gbounds);
	
	for(var i=0; i&lt;markers.length; i++) markers[i].setMap(map);
});
&lt;/script&gt;
&lt;style&gt;
#mainMap {
	width: 400px;
	height: 400px;
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div id="mainMap"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>