---
layout: post
title: "How to give dynamic driving directions to your customers"
date: "2011-11-14T11:11:00+06:00"
categories: [html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/11/14/How-to-give-dynamic-driving-directions-to-your-customers
guid: 4432
---

<b>Quick Note: I added a quick edit just now to show a message while the browser tries to get your location. This was simple to do and I'm embarrassed to say I didn't remember it. Thanks go to Gregory Macke for reminding me.</b>

<p/>

I've blogged a couple times now about Google's <a href="http://code.google.com/apis/maps/documentation/javascript/reference.html#DirectionsService">Driving Directions</a> API, but I thought it might be nice to provide a simple demo by itself. Something that folks could take an add to their web site in - literally - minutes. While I spent part of my weekend fighting another Google service, the Driving Directions API is <i>incredibly</i> powerful and simple. Something you don't see terribly often with Google's APIs. Here's a very simple example based on the idea that you just want to tell a person how to get to your store.
<!--more-->
<p>

Let's begin with the HTML markup.

<p>

<pre><code class="language-javascript">
&lt;!-- Office location --&gt;
&lt;p&gt;
You can find our office at:&lt;br/&gt;
1907 West Pinhook Rd 
Lafayette, LA 70508-3225
&lt;/p&gt;

&lt;p style="display:none" id="directionsBlock"&gt;
&lt;button id="getMeThereButton"&gt;Get Directions Here&lt;/button&gt;
&lt;div id="directionsPanel"&gt;&lt;/div&gt;
&lt;/p&gt;
</code></pre>

<p>

I've got the address first, since, obviously, you want people to know where you are whether or not we can get the driving directions to work. In case folks are curious, that's the address of my local Starbucks. (Later today I may do a quick blog post where I examine their store finder and show how they could add this.) Notice that below the address we have a block of stuff hidden from the user. This is where the magic will happen. Ok, now let's switch to the JavaScript.

<p>

<pre><code class="language-javascript">
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=true"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	//exit early if no geolocation
	if(!navigator.geolocation) return;
			
	var destinationAddress = "1907 West Pinhook Rd Lafayette, LA 70508-3225";
	
	//our generic error handler will just give a basic message
	function handleError(e){
		$("#directionsBlock").append("&lt;p&gt;Sorry, I wasn't able to provide driving directions to our location!&lt;/p&gt;");
	}
	
	function gotDirections(geo){
		var directionsService = new google.maps.DirectionsService();
		var directionsDisplay = new google.maps.DirectionsRenderer();
		directionsDisplay.setPanel($("#directionsPanel")[0]);
		var youLocation = new google.maps.LatLng(geo.coords.latitude, geo.coords.longitude);
		
		var request = {
			origin:youLocation,
			destination:destinationAddress,
			travelMode: google.maps.TravelMode.DRIVING
		};
		directionsService.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				$("#directionsPanel").html("");
				directionsDisplay.setDirections(result);
			}
		});
		
	}
	
	$("#getMeThereButton").on("click", function() {
		$("#directionsPanel").html("&lt;p&gt;Getting your location and driving directions now. Please stand by.&lt;/p&gt;");		
		navigator.geolocation.getCurrentPosition(gotDirections,handleError);
	});
	
	//show the button
	$("#directionsBlock").show();
	
});
&lt;/script&gt;
</code></pre>

<p>

So right away, the first thing I do is check for geolocation. If it isn't supported I just split town. I'm not doing anything else on the page so there isn't any point hanging around. After that I create a variable with my store address. Scroll down a bit to the click handler for my button. When fired, I do a geolocation request. Notice I have two call backs. One is for success and one is for any error. I could be specific in my error handler but i just do a vanilla message on any error. The last thing done in this block is to show the directions area I had previously hidden. 

<p>

So - what happens when I click and the geolocation works? Basically I start setting up my direction services. I make one instance of the service, and one of the renderer. I'll explain why in a second. I take the geolocation result and create a longitude/latitude pair that Google can work with. Next I create my request. Notice that Google is fine with either a specific longitude/latitude or a generic address. <b>Awesome.</b> The final bit is to simply make the route request. 

<p>

Here comes the cool part - and it's something I discovered when I was working on my <a href="http://www.raymondcamden.com/2011/11/4/Latest-Mobile-app--WTFRU">last mobile application</a>. While Google provides a very detailed driving direction response, if you just want to not worry about the data and just display it, Google can do it for you. The result is great:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/device-2011-11-14-102805.png" />

<p>

And that's it. You can demo this yourself by clicking the demo button below. In theory, you could take my code and just change the address and be done. You can either view source on the demo or cut and paste below.

<p>

<a href="https://static.raymondcamden.com/demos/2011/nov/14/test.html"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

<pre><code class="language-javascript">
&lt;html&gt;
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=true"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	//exit early if no geolocation
	if(!navigator.geolocation) return;
			
	var destinationAddress = "1907 West Pinhook Rd Lafayette, LA 70508-3225";
	
	//our generic error handler will just give a basic message
	function handleError(e){
		$("#directionsBlock").append("&lt;p&gt;Sorry, I wasn't able to provide driving directions to our location!&lt;/p&gt;");
	}
	
	function gotDirections(geo){
		var directionsService = new google.maps.DirectionsService();
		var directionsDisplay = new google.maps.DirectionsRenderer();
		directionsDisplay.setPanel($("#directionsPanel")[0]);
		var youLocation = new google.maps.LatLng(geo.coords.latitude, geo.coords.longitude);
		
		var request = {
			origin:youLocation,
			destination:destinationAddress,
			travelMode: google.maps.TravelMode.DRIVING
		};
		directionsService.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(result);
			}
		});
		
	}
	
	$("#getMeThereButton").on("click", function() {
		navigator.geolocation.getCurrentPosition(gotDirections,handleError);
	});
	
	//show the button
	$("#directionsBlock").show();
	
});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;!-- Office location --&gt;
&lt;p&gt;
You can find our office at:&lt;br/&gt;
1907 West Pinhook Rd 
Lafayette, LA 70508-3225
&lt;/p&gt;

&lt;p style="display:none" id="directionsBlock"&gt;
&lt;button id="getMeThereButton"&gt;Get Directions Here&lt;/button&gt;
&lt;div id="directionsPanel"&gt;&lt;/div&gt;
&lt;/p&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>