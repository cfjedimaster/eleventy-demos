---
layout: post
title: "Ionic/Cordova Demo: Where did I take that picture?"
date: "2015-12-03T10:38:31+06:00"
categories: [development,javascript,mobile]
tags: [cordova,ionic]
banner_image: 
permalink: /2015/12/03/ioniccordova-demo-where-did-i-take-that-picture
guid: 7196
---

Every now and then I think of an idea for a cool (aka useless and pointless but fun) app that I think will take me one hour and let me grow my small little empire of demos. Sometimes those "quick little demos" end up turning into multi-hour sessions as I pull my hair out trying to find out why this or that isn't working. That's frustrating as heck <i>while</i> I'm working on it, but in the end it makes me as happy.

<!--more-->

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/smile-kitten-large.jpg" alt="smile-kitten-large" width="400" height="276" class="aligncenter size-full wp-image-7197" />

Why? Because if I run into problems with my little "toy" demo, most likely you, the poor reader who has to put up with my silly demos, will run into it in a production app. And if my pain helps you avoid issues, then this blog will earn its keep. Ok, so what was the idea?

A few weeks ago I was shopping with my wife. It was the type of store where pretty much nothing in it interests me so I was just kind of mindlessly following along. But when my wife pointed out something she liked, I discretely snapped a picture of the item so I'd remember it as a possible present for her birthday or Christmas. Unfortunately, I couldn't remember the name of the store. I knew roundabout where it was, of course, but not the actual store.

Turns out that many pictures automatically include data that relates to the location where the picture was taken. You can - with a few clicks - get the latitude and longitude of the picture. That's nice - but frankly, I can't translate those values into a 'real' location off the top of my head. I'm sure web apps exist to help with that, but I thought, wouldn't it be nice if I could just select a picture and have it tell me where it was taken - in English? For example:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot1.png" alt="shot1" width="422" height="750" class="aligncenter size-full wp-image-7198" />

For my demo, I decided to build the following:

<ul>
<li>Let the user select a picture.</li>
<li>Attempt to read the EXIF data and get a location.</li>
<li>Try to Foursquare the location. I figured that would work great for businesses.</li>
<li>If that fails, try to reverse geocode it to an address at least.</li>
<li>If that fails too, show it on a map at least.</li>
</ul>

Right away I ran into some interesting issues. First, I needed to read the EXIF data. I found a Cordova plugin for it, but it had not been updated in two years, and I saw multiple issues reported that were not being addressed. So then I simply Googled for "exif javascript" and came across this project: <a href="https://github.com/exif-js/exif-js">exif-js</a>. This project was also old with outstanding PRs, but I thought it might be safer to try.

For the most part, it just works. Here is a snippet showing it in action:

<pre><code class="language-javascript">	
$scope.selectPicture = function() {
	navigator.camera.getPicture(gotPic, errHandler, {
		sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
		destinationType:Camera.DestinationType.NATIVE_URI
	});
};
	
var errHandler = function(e) {
	alert('Error with Camera: '+e);	
};
	
//utility funct based on https://en.wikipedia.org/wiki/Geographic_coordinate_conversion
var convertDegToDec = function(arr) {
	return (arr[0].numerator + arr[1].numerator/60 + (arr[2].numerator/arr[2].denominator)/3600).toFixed(4);
};
	
var gotPic = function(u) {
	console.log('Got image '+u);
	$scope.img.url = u;
	//scope.apply can KMA
	$scope.$apply();
	
};

var img = document.querySelector("#selImage");	

img.addEventListener("load", function() {
	console.log("load event for image "+(new Date()));
	$scope.status.text = "Loading EXIF data for image.";
	EXIF.getData(document.querySelector("#selImage"), function() {
		console.log("in exif");
			
		//console.dir(EXIF.getAllTags(img));
		var long = EXIF.getTag(img,"GPSLongitude");
		var lat = EXIF.getTag(img,"GPSLatitude");
		if(!long || !lat) {
			$scope.status.text = "Unfortunately, I can't find GPS info for the picture";
			return;	
		}
		long = convertDegToDec(long);
		lat = convertDegToDec(lat);
		//handle W/S
		if(EXIF.getTag(this,"GPSLongitudeRef") === "W") long = -1 * long;
		if(EXIF.getTag(this,"GPSLatitudeRef") === "S") lat = -1 * lat;
		console.log(long,lat);
		locateAddress(long,lat);
	});			
}, false);</code></pre>

First thing I discovered was that when you select an image in Cordova, the EXIF data is stripped down to about 4 or so different tags. Turns out this is a known bug (<a href="https://issues.apache.org/jira/browse/CB-1285">CF-1285</a>) due to the fact that the plugin copies the original image and in that process removes the data. The bug is marked resolved, but obviously it isn't. However, if you switch the camera source to NATIVE_URI then the problem goes away.

So far so good. To work with the code, you need to point it to an image in the DOM, and wait for the image to finish loading. That by itself isn't hard, although I feel dirty when I use the DOM in Angular controllers. (I got over it.) I then discovered an issue with the library. When it loads the EXIF data, it copies the values to the DOM item for caching. I'm using the same image every time you select a new photo, so this meant the tag data was cached. I filed a bug report and in the meantime I simply edited the library to remove the cache check. That's bad - but I got over that too.

The next thing I had to work with was the location stuff. As I said, the idea was to first check Foursquare, fall back to reverse geocoding, and fall back again to a static map. Let's look at the controller code first.

<pre><code class="language-javascript">
var locateAddress = function(long,lat) {

	$scope.status.text = "Trying to locate the photo.";

	Location.getInfo(long, lat).then(function(result) {
		console.log('Result was '+JSON.stringify(result));
		if(result.type === 'foursquare') {
			$scope.status.text = 'Your photo was taken at ' + result.name + ' located at ' + result.address;
		} else if (result.type === 'geocode') {
			$scope.status.text = 'Your photo appears to have been taken at ' + result.address;
		} else {
			var map = 'https://maps.googleapis.com/maps/api/staticmap?center='+lat+','+long+'zoom=13&size=300x300&maptype=roadmap&markers=color:blue{% raw %}%7Clabel:X%{% endraw %}7C'+lat+','+long;
			$scope.status.text = 'Sorry, I\'ve got nothing. But here is a map!<br><img class="map" src="' + map + '">';	
		}
	});
};
</code></pre>

Not too complex, right? I just run my service and deal with the result. The service is a bit complex, but really just makes use of the various APIs I'm hitting.

<pre><code class="language-javascript">angular.module('starter.services', [])

.factory('Foursquare', function($http) {

	var CLIENT_ID = 'mahsecretismahsecret';
	var CLIENT_SECRET = 'soylentgreenispeople';
	
	function whatsAt(long,lat) {
		return $http.get('https://api.foursquare.com/v2/venues/search?ll='+lat+','+long+'&amp;intent=browse&amp;radius=30&amp;client_id='+CLIENT_ID+'&amp;client_secret='+CLIENT_SECRET+'&amp;v=20151201');		
	}

	return {
		whatsAt:whatsAt
	};
})
.factory('Geocode', function($http) {
	var KEY = 'google should let me geocode for free';
	
	function lookup(long,lat) {
		return $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long+'&amp;key='+KEY);
	}
	
	return {
		lookup:lookup	
	};

})
.factory('Location', function($q,Foursquare,Geocode) {
	
	function getInfo(long,lat) {
		console.log('ok, in getInfo with '+long+','+lat);
		var deferred = $q.defer();
		Foursquare.whatsAt(long,lat).then(function(result) {
			//console.log('back from fq with '+JSON.stringify(result));
			if(result.status === 200 &amp;&amp; result.data.response.venues.length &gt;= 1) {
				var bestMatch = result.data.response.venues[0];
				//convert the result to something the caller can use consistently
				var result = {
					type:&quot;foursquare&quot;,
					name:bestMatch.name,
					address:bestMatch.location.formattedAddress.join(&quot;, &quot;)
				}
				console.dir(bestMatch);
				deferred.resolve(result);
			} else {
				//ok, time to try google
				Geocode.lookup(long,lat).then(function(result) {
					console.log('back from google with ');
					if(result.data &amp;&amp; result.data.results &amp;&amp; result.data.results.length &gt;= 1) {
						console.log('did i come in here?');
						var bestMatch = result.data.results[0];
						console.log(JSON.stringify(bestMatch));	
						var result = {
							type:&quot;geocode&quot;,
							address:bestMatch.formatted_address	
						}
						deferred.resolve(result);
					}
				});	
			}
		});
		
		return deferred.promise;	
	}
	return {
		getInfo:getInfo	
	};
	
});</code></pre>

In both cases, I'm assuming the first result from the API is the best result. That may not always be true, but it works for now. You've seen an example of Foursquare working, here is an example of the reverse geocode.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/geocode.png" alt="geocode" width="750" height="779" class="aligncenter size-full wp-image-7199 imgborder" />

And here it is with the last fallback. Yes, this is the same picture, I just temporarily disabled the Geocode service for a quick test.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/map.png" alt="map" width="422" height="750" class="aligncenter size-full wp-image-7200 imgborder" />

All in all, this was a fun little app to build, and as I said, I'm glad I ran into the EXIF issues. I know I'll need that in the future. You can find the complete source code for this demo here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/photolocate">https://github.com/cfjedimaster/Cordova-Examples/tree/master/photolocate</a>