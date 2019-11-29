---
layout: post
title: "Ask a Jedi: Click a CFMAP to get Longitude/Latitude"
date: "2010-03-16T19:03:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/03/16/Ask-a-Jedi-Click-a-CFMAP-to-get-LongitudeLatitude
guid: 3751
---

A reader asked:
<p/>
<blockquiote>
cfmap is very new to me.  Could it allow me to get click a map and set variables for the longitude and latitude of the point where I clicked?  If so, how? That would be great for recording bird sightings!
</blockquote>
<p/>
I had not really looked much at Google Maps before ColdFusion 9 introduced it to me, but if there is one thing I've learned - Google Maps can do pretty much about anything. This particular request is actually really darn easy. Here is one way to solve the problem.
<p/>
<!--more-->
First, let's create a simple map and listen for the page to be complete. We will then grab the Map object using ColdFusion's JavaScript API. This will give us a hook to the proper Google Map object.
<p/>
<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;

&lt;script&gt;

function init() {
	map = ColdFusion.Map.getMapObject('mainMap')
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;h2&gt;Bird Spotting Form&lt;/h2&gt;

&lt;cfmap name="mainMap" centeraddress="Lafayette, LA" showcentermarker="false" zoomlevel="13"&gt;
&lt;p&gt;
Click on the map to record where you saw a bird.
&lt;/p&gt;

&lt;form id="mainForm"&gt;
	&lt;input type="submit" value="Send Report" id="submitButton" style="display:none"&gt;
&lt;/form&gt;

&lt;/body&gt;
&lt;/html&gt;
&lt;cfset ajaxOnLoad("init")&gt;
</code>

<p/>

I've got a simple map centered on my home town. I put a form at the bottom which is empty for now. The last line, ajaxOnLoad, simple tells ColdFusion what JavaScript I need to run when the page is done loaded. Right now my init() function simply grabs the Google Map object.

<p/>

I then did a quick Google (is it weird to use Google to search for Google docs?) on map events and came across a pretty nice set of <a href="http://code.google.com/apis/maps/documentation/events.html">documentation</a>. As powerful as Google's APIs are, I'm not always quite as pleased with their docs or ease of use. In this case, it looks like all we need to do is add a simple event listener. This event listener will be called with either an overlay object or a longitude/latitude pair:

<p/>

<code>
GEvent.addListener(map, "click", function(overlay,latlng) {
})
</code>

<p/>

For my demo I decided that each click would simply take the longitude and latitude and add them as text fields to a form. I whipped up the following JavaScript:

<p/>

<code>
&lt;script&gt;
var counter;

function init() {
	counter = 0
	map = ColdFusion.Map.getMapObject('mainMap')
	GEvent.addListener(map, "click", function(overlay,latlng) {
		if(latlng) {
			counter++;
			var s = '&lt;b&gt;Report '+counter+'&lt;/b&gt;: '
			s += '&lt;input type="text" name="siteport_' + counter + '" value="'+latlng+'" size="50"&gt;&lt;br/&gt;'
			$("#submitButton").before(s)
			$("#submitButton").show()
		}
	})
}
&lt;/script&gt;
</code>

<p/>

For the most part this should be pretty trivial. I keep a counter so I can have unique numbers for each sighting. I used a text field with a dynamic name and value... and that's it. Here is a quick screen shot:

<p/>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-03-16 at 5.16.21 PM.png"  title="First I spot the bird - then I shoot it!" />

<p/>

You can play with a demo <a href="http://www.coldfusionjedi.com/demos/marh162010/test.cfm">here</a>. Right now it isn't very exciting. We should probably add markers, and make the form a bit more complex. For example, most users probably don't need to see the actual latitude/longitude, but they probably want to enter data ("The bird was awesome, man. It had wings. And it flew. Cool."). In my next entry I'll add these features to the form.