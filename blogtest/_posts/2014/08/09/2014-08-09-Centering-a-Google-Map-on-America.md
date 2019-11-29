---
layout: post
title: "Centering a Google Map on America"
date: "2014-08-09T13:08:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2014/08/09/Centering-a-Google-Map-on-America
guid: 5284
---

<p>
Earlier this morning I was building a Google Map demo for a client (using EventBrite data - I'll share that if I can) and I needed to center a Google Map on America. There are a couple ways of doing this and I thought I'd share them along with some screen shots so you can see the results.
</p>
<!--more-->
<p>
The first Google result I found led to this Stack Overflow result: <a href="http://stackoverflow.com/a/12220246/52160">How to center Google Map on a country by name</a>. The answer uses Geocoding to translate a simple country name,  like America, into the right results. You'll need to scroll down a bit to see a version of the code for the current version of Google's API, or just check out the full sample below.
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;

&lt;head&gt;
&lt;title&gt;Demo One&lt;&#x2F;title&gt;
&lt;style type=&quot;text&#x2F;css&quot;&gt;
#map_canvas {% raw %}{ width: 500px; height: 500px; }{% endraw %}
&lt;&#x2F;style&gt;
&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;maps.google.com&#x2F;maps&#x2F;api&#x2F;js?sensor=false&quot;&gt;&lt;&#x2F;script&gt;
&lt;script type=&quot;text&#x2F;javascript&quot;&gt;
function initialize() {

	var country = &quot;United States&quot;

    var myOptions = {
        zoom: 3,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
	
    var map = new google.maps.Map(document.getElementById(&quot;map_canvas&quot;),myOptions);

	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( {% raw %}{ &#x27;address&#x27;: country }{% endraw %}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
		} else {
			alert(&quot;Could not find location: &quot; + location);
		}
	});

}
&lt;&#x2F;script&gt;
&lt;&#x2F;head&gt;

&lt;body onload=&quot;initialize()&quot;&gt;

&lt;div id=&quot;map_canvas&quot;&gt;&lt;&#x2F;div&gt;

&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

<p>
This gives you:
</p>

<p>
<img src="https://static.raymondcamden.com/images/s13.jpg" />
</p>

<p>
Looks good to me - but the geocoding bugs me. For every single visitor to your site, a request will be made to Google to ask it where America is. Most likely, America is not going to move. Probably. And while this request is pretty darn fast, there's no real reason for you to geocode this constantly. I did another quick Google and discovered this Wikipedia page: <a href="http://en.wikipedia.org/wiki/Geographic_center_of_the_contiguous_United_States">Geographic center of the contiguous United States</a>. It defined the longitude and latitude for America as 39°50?N 98°35?W. I rewrote my code to simply use these hard coded values.
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;

&lt;head&gt;
&lt;title&gt;Demo Two&lt;&#x2F;title&gt;
&lt;style type=&quot;text&#x2F;css&quot;&gt;
#map_canvas {% raw %}{ width: 500px; height: 500px; }{% endraw %}
&lt;&#x2F;style&gt;
&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;maps.google.com&#x2F;maps&#x2F;api&#x2F;js?sensor=false&quot;&gt;&lt;&#x2F;script&gt;
&lt;script type=&quot;text&#x2F;javascript&quot;&gt;
function initialize() {

    var latlng = new google.maps.LatLng(39.5, -98.35);
    var myOptions = {
        zoom: 3,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

	var map = new google.maps.Map(document.getElementById(&quot;map_canvas&quot;),myOptions);

}
&lt;&#x2F;script&gt;
&lt;&#x2F;head&gt;

&lt;body onload=&quot;initialize()&quot;&gt;

&lt;div id=&quot;map_canvas&quot;&gt;&lt;&#x2F;div&gt;

&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

<p>
And the result:
</p>

<p>
<img src="https://static.raymondcamden.com/images/s23.jpg" />
</p>

<p>
Looks a <i>tiny</i> bit different to me. So I went back to the first demo and added this line: <code>console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng());</code>. I checked the console for the values and simply updated the numbers. 
</p>

<p>
I zipped up the demos (including a third demo with the values returned via the console) and included it as a zip.
</p><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2013%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fgooglemapamerica%{% endraw %}2Ezip'>Download attached file.</a></p>