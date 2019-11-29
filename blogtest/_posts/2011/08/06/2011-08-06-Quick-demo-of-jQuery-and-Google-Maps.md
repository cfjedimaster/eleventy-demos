---
layout: post
title: "Quick demo of jQuery and Google Maps"
date: "2011-08-06T19:08:00+06:00"
categories: [javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/08/06/Quick-demo-of-jQuery-and-Google-Maps
guid: 4318
---

So this is old news to folks already, but it's the first time I played with it. You can use Google Maps under jQuery Mobile. Not only can you use it, but the maps work <i>real</i> well. It isn't as responsive as the desktop version but it's darn close, and it isn't too hard to use if you follow a few tips.
<!--more-->
<p>

First off - if you use this HTML, as is shown in the Google Maps docs, you will have an issue:

<p>

<code>
&lt;div id="map_canvas" style="width:100{% raw %}%; height:100%{% endraw %}"&gt;&lt;/div&gt;
</code>

<p>

Specifically, the issue is with height:100%. I'm not sure why, but nothing worked for me at all until I switched it to a hard coded value, like so:

<p>

<code>
&lt;div id="map_canvas" style="width:100%;height:400px;"&gt;&lt;/div&gt;
</code>

<p>

Obviously 400px is a bit arbitrary. It seemed nice though. 

<p>

You also - probably - want to make use of the <a href="http://jquery-ui-map.googlecode.com/">Google maps jQuery</a> plugin. Designed both for jQuery Mobile and jQuery UI, it makes map usage even easier. Let's look at a complete example. Here's a demo mobile application with a home page (a list) and three sub pages. The first two pages are simple so they are included on the home page. The map page is separate.

<p>

<code>

&lt;!DOCTYPE html&gt; 
&lt;html&gt;
&lt;head&gt;
&lt;meta charset="utf-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;title&gt;jQuery Mobile Web App&lt;/title&gt;
&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/1.0b2/jquery.mobile-1.0b2.min.css" /&gt;
&lt;script type="text/javascript" src="http://code.jquery.com/jquery-1.6.2.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="http://code.jquery.com/mobile/1.0b2/jquery.mobile-1.0b2.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=true"&gt;&lt;/script&gt;
&lt;script src="jquery.ui.map.min.js"&gt;&lt;/script&gt;
&lt;script&gt;

$('#mapPage').live('pageshow',function(){

	$('#map_canvas').gmap({ 'center': new google.maps.LatLng(42.345573,-71.098326),
						'zoom':14, 'callback':function() {
							$('#map_canvas').gmap('addMarker',{% raw %}{'position':new google.maps.LatLng(42.345573,-71.098326)}{% endraw %})
						} });
		
});
&lt;/script&gt;
&lt;/head&gt; 
&lt;body&gt; 

&lt;div data-role="page" id="page"&gt;
	&lt;div data-role="header"&gt;
		&lt;h1&gt;Page One&lt;/h1&gt;
	&lt;/div&gt;
	&lt;div data-role="content"&gt;	
		&lt;ul data-role="listview"&gt;
			&lt;li&gt;&lt;a href="#page2"&gt;Page Two&lt;/a&gt;&lt;/li&gt;
            &lt;li&gt;&lt;a href="#page3"&gt;Page Three&lt;/a&gt;&lt;/li&gt;
			&lt;li&gt;&lt;a href="map.html"&gt;Our Location&lt;/a&gt;&lt;/li&gt;
		&lt;/ul&gt;		
	&lt;/div&gt;
	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;
&lt;/div&gt;

&lt;div data-role="page" id="page2" data-title="Page 2"&gt;
	&lt;div data-role="header"&gt;
		&lt;h1&gt;Page Two&lt;/h1&gt;
	&lt;/div&gt;
	&lt;div data-role="content"&gt;	
		Content		
	&lt;/div&gt;
	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;
&lt;/div&gt;

&lt;div data-role="page" id="page3" data-title="Page 3"&gt;
	&lt;div data-role="header"&gt;
		&lt;h1&gt;Page Three&lt;/h1&gt;
	&lt;/div&gt;
	&lt;div data-role="content"&gt;	
		Content		
	&lt;/div&gt;
	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Page Footer&lt;/h4&gt;
	&lt;/div&gt;
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

You can see that I've included the normal set of jQuery Mobile resources (one CSS and two JS files), as well as the Google Maps library and the plugin. Now note my pageShow event. This will run whenever my map page is loaded. I fire up the plugin and create the map. I've got a hard coded long/lat here. My thinking here was that - normally - you're going to be showing a user a map of a store or some such. While you can geolocate from an address to a long/lat pair, it doesn't make sense to do that unless your store is slowly moving around the planet. Notice how easy the plugin makes it to handle the map loading and run another function immediately after - in this case - adding a marker. 

<p>

Here's the map file:

<p>

<code>

&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;
&lt;head&gt;
&lt;meta http-equiv="Content-Type" content="text/html; charset=utf-8" /&gt;
&lt;title&gt;Our Location&lt;/title&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div data-role="page" id="mapPage"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Our Location&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;
		&lt;div id="map_canvas" style="width:100%;height:400px;"&gt;&lt;/div&gt;
	&lt;/div&gt;
	
	&lt;div data-role="footer"&gt;
		&lt;h4&gt;Footer content&lt;/h4&gt;
	&lt;/div&gt;
	
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

The only thing of note on the page is the div used for the map. That's it.

<p>

So - nothing more to say really. As I said above, I think it works well on mobile (I've got a HTC Inspire), much better than I thought. You can try it yourself by hitting the Demo button below. 

<p>

<a href="http://www.raymondcamden.com/demos/aug62011/"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

p.s. It may be a small thing, but it seems like Google Maps should allow for a simpler way to automatically add a marker when you create a map at a specific location. It seems like a common use case - "Do a map for point X cuz X is an important thing."