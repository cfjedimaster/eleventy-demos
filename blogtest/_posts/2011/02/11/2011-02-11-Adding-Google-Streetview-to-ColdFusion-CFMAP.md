---
layout: post
title: "Adding Google Streetview to ColdFusion CFMAP"
date: "2011-02-11T17:02:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2011/02/11/Adding-Google-Streetview-to-ColdFusion-CFMAP
guid: 4119
---

A reader asked if it was possible to integrate Google's StreetView API with CFMAP. Turns out this was rather simple once you read the <a href="http://code.google.com/apis/maps/documentation/javascript/v2/services.html#Streetview">docs</a>. Here is a pretty simple example to get you started.

<p/>
<!--more-->
<p>

First, I'm going to create a page with a simple map on it and a cfajaxonload to run my init function when everything is done loading.

<p>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script&gt;

function init() {
}
&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;

&lt;cfmap centeraddress="Lafayette, LA" zoomlevel="15" name="mainMap"&gt;

&lt;/body&gt;
&lt;/html&gt;
&lt;cfset ajaxOnLoad("init")&gt;
</code>

<p>

Nothing here should need much explanation. I've got the map - I've got my ajaxOnLoad, and I've got an empty init function begging to be filled. Now normally I'd slowly add the bits in, but since the code is so simple I'm going to go ahead and now show the final template.

<p>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script&gt;

function init() {
	ColdFusion.Map.addEvent("mainMap","click",function(overlay,overlaylnglt) {
		address = arguments[arguments.length-1];
		var loc = new GLatLng(address.lat(),address.lng());
		panoramaOptions = {% raw %}{ latlng:loc }{% endraw %};
		var myPano = new GStreetviewPanorama(document.getElementById("streetDiv"), panoramaOptions);
	});
}
&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;

&lt;cfmap centeraddress="Lafayette, LA" zoomlevel="15" name="mainMap"&gt;

&lt;div id="streetDiv" style="width:500px;height:500px"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
&lt;cfset ajaxOnLoad("init")&gt;
</code>

<p>

So what changed? I begin by adding an event handler for my map. I can do it via the native Google Map functions or use the ColdFusion.Map.addEvent API as a wrapper. This is where things got slightly weird. Turns out you normally get sent two arguments - the overlay you clicked on (if any), and the location. However in my testing I would get three arguments when I clicked on a marker. The argument we care about is the location and that's always last so thats why I use the length of arguments to get it into a variable. This location object has longitude and latitude values I can grab to to create a proper Google Long/Lat object. Once done, I set this into an object and create a new GStreetviewPanorama. Notice I tell it to use a new DIV I created. This DIV will show the street view. <b>You must include a height and width for this div.</b> Obviously Google's street view supports other options, but for quick and dirty you can't beat how darn simple that is. You can view a demo of this by clicking the button below. In case it isn't obvious, you need to click on the map to load the street view.

<p>

<a href="http://www.raymondcamden.com/demos/feb112011/test.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>