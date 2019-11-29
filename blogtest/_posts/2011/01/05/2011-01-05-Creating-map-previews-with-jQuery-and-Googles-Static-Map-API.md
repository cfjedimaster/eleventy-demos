---
layout: post
title: "Creating map previews with jQuery and Google's Static Map API"
date: "2011-01-05T23:01:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2011/01/05/Creating-map-previews-with-jQuery-and-Googles-Static-Map-API
guid: 4074
---

I've blogged before about Google's <a href="http://code.google.com/apis/maps/documentation/staticmaps">Static Map API</a> (see the related blog entries below). Essentially it is a simple way to quickly embed maps on your site by just using query parameters. While not as powerful as the "real" JavaScript Map API, it's a darn nice feature and about as simple to use as you can get. Today on a phone conversation I mentioned how this API could be used to provide previews for address information. Take for example the <a href="http://groups.adobe.com/index.cfm?event=page.maps">maps</a> page for Adobe Groups. This is driven by address information entered by user group managers. It would be cool if we could provide a way for the UGMs to see exactly where on the map their address will fall. Here is a quick and dirty I whipped up with jQuery.
<!--more-->
<p>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	var baseURL = "http://maps.google.com/maps/api/staticmap?zoom=12&size=400x400&maptype=roadmap&sensor=false&center=";
	
	$("#address").keyup(function() {
		var address = $(this).val();
		if(address.length &lt; 5) $("#mapPreview").attr("src", "spacer.gif");
		else $("#mapPreview").attr("src", baseURL + escape(address));
	});
})
&lt;/script&gt;

&lt;/head&gt;

&lt;body&gt;

&lt;p&gt;
Enter your address:&lt;br/&gt;
&lt;textarea cols="30" rows="2" id="address"&gt;&lt;/textarea&gt;
&lt;/p&gt;

&lt;p&gt;
&lt;img src="spacer.gif" id="mapPreview" width="400" height="400" title="Map Preview"&gt;
&lt;/p&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

So let's start at the bottom. I've got a simple form with a textarea. This is where you enter your address. Below that is an img tag that will store the preview. Now let's go up to the JavaScript.

<p>

I begin by creating a bind to "keyup" event on the textarea. I get the value, and if it is too short (I chose less than five after many hours of research - really) we set the image's source to a blank image. If not, we point to the static map API and pass your value as the address. Try it below. 

<p>

<a href="http://www.raymondcamden.com/demos/jan52011/test.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

For an interesting test, try typing "lafayette, la", then remove the "la" and change it to "in".