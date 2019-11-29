---
layout: post
title: "Displaying Google Street View images"
date: "2016-02-13"
categories: [javascript]
tags: []
banner_image: /images/banners/map.jpg
permalink: /2016/02/13/displaying-google-street-view-images
---

A few days ago a buddy of mine brought me an interesting problem. He was using JavaScript to dynamically
display a Google Street View image of a property. Instead of making use of the Google Maps APIs, he simply
crafted the URL dynamically based on an address. Here is a snippet of the code that did this.

<!--more-->

<pre><code class="language-javascript">
$.ajax({
	type: &quot;GET&quot;,
	url: 'data/getaddress.cfm',
	data: 'parcelid='+getUrlVars()[&quot;parcelid&quot;]+'&amp;GEOID='+getUrlVars()[&quot;GEOID&quot;],
	success: function (address) {
		$('#map-canvas').html('&lt;img src=&quot;http://maps.googleapis.com/maps/api/streetview?size=500x500'&amp;sensor=false&amp;location='+address+'&quot;&gt;');
		}
});
</code></pre>

As you can see, the image tag passes parameters for height, width, and address, with the address portion being dynamic. This worked well, except that in some cases, a Street View image wasn't available:

![Bad street view](https://static.raymondcamden.com/images/2016/02/streetviewbad.jpeg)

He wanted to know - was it possible to handle that and do something special when an image wasn't available? I did some quick research and ran across a Stack Overflow answer by @user1852570 (probably not a real name - just assuming):

<a href="http://stackoverflow.com/questions/13236312/how-to-detect-if-google-streetview-is-available-in-an-address-coordinates/13568401#13568401">How to detect if Google StreetView is available in an address/coordinates</a>

His answer describes using StreetViewService of the Google Maps API. If you follow the [link](https://google-developers.appspot.com/maps/documentation/javascript/examples/streetview-service) to the Google API example you'll see that you can request a Street View result and check a result value to see if data was available. I took that initial example and integrated it into a dynamic example like he was using originally. Here is the updated code. As a note - this script expects URL parameters for a location that get translated into longitude and latitude by a back end service.

<pre><code class="language-markup">
&lt;html&gt;
&lt;head&gt;
	
&lt;script type=&quot;text/javascript&quot; src=&quot;//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js&quot;&gt;&lt;/script&gt;
&lt;script&gt;
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&amp;]+([^=&amp;]+)=([^&amp;]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}


//credit: http://stackoverflow.com/a/13568401/52160
function initMap() {
	console.log('initMap called');
	var parts = getUrlVars();

	$.get('data/getlatlng.cfm?parcelid='+parts['parcelid']+'&amp;geoid='+parts['GEOID'], function(res) {

		var sv = new google.maps.StreetViewService();
		
		panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));
		
		sv.getPanorama({% raw %}{location: {lat:res.lat, lng:res.lng}{% endraw %}, radius: 50}, processSVData)

	},'json');

	
}

function processSVData(data, status) {
  if (status === google.maps.StreetViewStatus.OK) {
	console.log('ok');
	$('#pano').show();
	panorama.setPano(data.location.pano);
	
	panorama.setPov({
		heading: 270,
		pitch: 0
	});
	
	panorama.setVisible(true);

  } else {
    console.error('Street View data not found for this location.');
	$('#pano').hide();
  }
}
&lt;/script&gt;

&lt;/head&gt;
	
&lt;body&gt;

&lt;div id=&quot;pano&quot; style=&quot;width: 550px; height: 350px;&quot;&gt;&lt;/div&gt;


&lt;script async defer
	src=&quot;https://maps.googleapis.com/maps/api/js?key=somekey&amp;callback=initMap&quot;&gt;
&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;
</code></pre>

Things kick off with the Google Maps script tag at the very bottom of the page. It is set to run `initMap` when done. If you go up to that, we begin by firing off the call to the service to figure out the longitude and latitude of the particular thing we're looking for. That service isn't important - just note that it returns a longitude and latitude. As an FYI, the "image url" shortcut allows for generic addresses, like "So and So Elm Street", but the API we're using requires a longitude and latitude instead. 

Next we create a Street View Panaroma object to display the image. After setting the address we can use the callback and the `google.maps.StreetViewStatus` result to see if we had good data. For my friend, he simply wanted to hide the image if nothing was available. Obviously you could do something else instead.

And that's it. Now to be fair - the end result is a bit different. Instead of just an image we actually have an "embedded" Street View that can be rotated and changed. 

![Good street view](https://static.raymondcamden.com/images/2016/02/streetviewgood.gif)

I believe you could use the API to prevent that if you really wanted to, but I doubt that really matters. You could also skip setting the result at all and just use the initial image url version on a good result.