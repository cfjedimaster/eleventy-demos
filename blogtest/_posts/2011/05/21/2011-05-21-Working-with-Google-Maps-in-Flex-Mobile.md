---
layout: post
title: "Working with Google Maps in Flex Mobile"
date: "2011-05-21T16:05:00+06:00"
categories: [flex,mobile]
tags: []
banner_image: 
permalink: /2011/05/21/Working-with-Google-Maps-in-Flex-Mobile
guid: 4242
---

So - I wasn't sure if I should post this blog entry. Why? What I'm describing is a bit of a failure. But the more I thought about it the more I figured that the experience I went through could be useful for others. Plus - there's always the chance that I made a simple mistake and someone will point it out. I then get to pretend that it was a test and quickly fix my code! That being said - what I'm about to describe should not be something you should try yourself. At least not in the same way I did. Ok - so enough preamble!
<!--more-->
<p/>

I decided to add one more simple feature to the <a href="http://www.raymondcamden.com/index.cfm/2011/5/14/INeedIt--Simple-Flex-Mobile-example">INeedIt</a> mobile application: driving directions. This is a topic I've <a href="http://www.coldfusionjedi.com/index.cfm/2011/3/9/Adding-driving-directions-to-a-jQuery-Mobile-web-site">covered before</a> with JavaScript and jQuery Mobile, so I was curious as to how it would work in the Flex world. I knew that Google had an <a href="http://code.google.com/apis/maps/documentation/flash/">API for Flash</a> and I'd heard good things about it. I figured I'd replace the static map image I had now while also adding in the driving directions. 

<p>

I spent maybe 15 minutes looking over the docs. For the most part, it's incredibly easy. You download a SWC and add it to your project. (Total time - 60 seconds.) 

<p>

You then drop a map tag into your Flex code. (Total time - 60 seconds.)

<p>

<code>
&lt;maps:Map xmlns:maps="com.google.maps.*" id="map" mapevent_mapready="onMapReady(event)" width="100{% raw %}%" height="100%{% endraw %}" key="ABQIAAAANa2eDzLCrHnNGWxQ6nsUqBT0kcRajLdLCyGsAW6MRHnr7QX6dBTzuJkY4CKmc-3TB-8A2-9DEW3IXQ" sensor="false" url="http://coldfusionjedi.com" /&gt;
</code>

<p>

You then write an event handler to listen for the map ready event. Now - for me - this was the most tricky part. I use the map on a view that fires off a call to get detailed information about a Google Place data item. I basically have 2 network calls then. One for my Place data and one for the map to prepare itself. This is probably not the best way to do it - but I used variable flags to handle checking to see if the "other guy" was done. Here are the two functions:

<p>

<code>
private function placeResult(event:ResultEvent):void {
	var resultData:Object = JSON.decode(event.result.toString());
	addressLabel.text = resultData.result.formatted_address;
	phoneLabel.text = resultData.result.formatted_phone_number;
	
	//Store long/lat for use for driving directions
	long = resultData.result.geometry.location.lng;
	lat = resultData.result.geometry.location.lat;
	//technically this could finish before mapReady - need to think
	if(mapReady) drawMap();
	trace("done ");	
}
					
protected function onMapReady(event:MapEvent):void {
	if(lat) drawMap();
	mapReady = true;
}
</code>

<p>

Basically, when placeResult is done it checks to see if the map is done. If so, it calls drapMap. onMapReady checks for the existence of lat, the latitude of the place result. If that exists, then it runs drawMap. This was the only real complex part to my code. (Total time: 5 minutes.)

<p>

Actually drawing the map then was pretty trivial. I used one simple function to center it on my Place result and added a marker as well. (Total time: 5 minutes.)

<p>

<code>
protected function drawMap():void {
	map.setCenter(new LatLng(lat,long), 16, MapType.NORMAL_MAP_TYPE);
	var markerA:Marker = new Marker(new LatLng(lat, long),
		new MarkerOptions({
			strokeStyle: new StrokeStyle({% raw %}{color: 0x987654}{% endraw %}),
			fillStyle: new FillStyle({% raw %}{color: 0x223344, alpha: 0.8}{% endraw %}),
			radius: 12,
			hasShadow: true
		}));
	map.addOverlay(markerA);
}
</code>

<p>

Woot! Pretty simple, right? Check out the result:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/device1.png" />

<p>

Unfortunately, this is where we hit a brick wall. On the simulator I noticed an odd pause when the place view was loaded. I figured it was a gremlin and didn't pay attention. When I tried it on my mobile device however - whoa buddy. Hitting the link to load a Place result now took about 15-30 seconds to load! Turns out Google Maps delays the loading of it's libraries. No wonder. If it takes that long to load I can see why. Unfortunately this pretty much kills the usability of the application. It seems like maybe there should be a way for everything else to happen <i>except</i> for the map loading until the view is there, but even if I didn't run drawMap, the mere existence of the Map tag caused the incredible slow down.

<p>

Failure.

<p>

That sucks... but I decided to move on. Mainly because I wanted to see the driving directions anyway. Much like my jQuery Mobile example, I went for a text page approach. But unlike my old example that showed one step at a time, I figured I'd simply list out the results. I made some modifications to my code so that I could pass to my new view both the user's location and the place result location. Here's what I came up with:

<p>

<code>

&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" title="Driving Directions" viewActivate="init(event)"&gt;
	&lt;fx:Script&gt;
		&lt;![CDATA[
			import com.google.maps.LatLng;
			import com.google.maps.services.Directions;
			import com.google.maps.services.DirectionsEvent;
			import com.google.maps.services.Route;
			import com.google.maps.services.Step;
			
			import spark.events.ViewNavigatorEvent;

			private function goBack(event:MouseEvent):void {
				navigator.popView();
				//hollyschinsky@gmail.com
			}

			protected function init(event:ViewNavigatorEvent):void {

				trace(data.long+","+data.lat);
				var dir:Directions = new Directions();
				dir.addEventListener(DirectionsEvent.DIRECTIONS_SUCCESS, onDirLoad);
				dir.addEventListener(DirectionsEvent.DIRECTIONS_FAILURE, onDirFail);
				
				var waypoints:Array = [new LatLng(data.mylat,data.mylong),
											   new LatLng(data.lat,data.long)
												];
				dir.loadFromWaypoints(waypoints);
				statusLabel.text = "Loading directions...";
			}
			
			protected function onDirLoad(event:DirectionsEvent):void
			{
				currentState="ready";
				trace('got stuff back');
				var directions:String = "";
				var directionData:Directions = Directions(event.directions);
			
				//As before, use route 1
				if(directionData.numRoutes &gt;= 1) {
					var route:Route = directionData.getRoute(0);
					for(var i:int=0; i&lt;route.numSteps; i++) {
						var step:Step = route.getStep(i);
						var html:String = step.descriptionHtml;
						html = html.replace(/&lt;div class="google_note"&gt;/g,"\n\n");
						directions += html.replace(/&lt;.*?&gt;/g,"") + "\n\n";
					}
					trace(directions);
					dirBox.text = directions;
					
				} else {
					//A lie, but close enough
					currentState="error";
					statusLabel.text = "Sorry, unable to get directions.";
					
				}
				
			}
			
			protected function onDirFail(event:Event):void
			{
				currentState="error";
				statusLabel.text = "Sorry, unable to get directions.";
				trace('dir error');
				
			}
			
		]]&gt;
	&lt;/fx:Script&gt;
	&lt;fx:Declarations&gt;
		&lt;!-- Place non-visual elements (e.g., services, value objects) here --&gt;
	&lt;/fx:Declarations&gt;

	&lt;s:actionContent&gt;
		&lt;s:Button label="Back" click="goBack(event)" /&gt;		
	&lt;/s:actionContent&gt;

	&lt;s:layout&gt;
		&lt;s:VerticalLayout gap="5" paddingTop="5" paddingLeft="5" paddingRight="5"/&gt;
	&lt;/s:layout&gt;

	&lt;s:states&gt;
		&lt;s:State name="loading" /&gt;
		&lt;s:State name="error" /&gt;
		&lt;s:State name="ready" /&gt;
	&lt;/s:states&gt;

	&lt;s:Label id="statusLabel" includeIn="error,loading" /&gt;
	&lt;s:Label id="dirBox" width="100{% raw %}%" height="100%{% endraw %}" includeIn="ready" /&gt;
&lt;/s:View&gt;
</code>

<p>

I <i>love</i> how easy Google's directions API are. In case it isn't obvious in the code above, this is all you really need:

<p>

<code>
var dir:Directions = new Directions();
dir.addEventListener(DirectionsEvent.DIRECTIONS_SUCCESS, onDirLoad);
dir.addEventListener(DirectionsEvent.DIRECTIONS_FAILURE, onDirFail);

var waypoints:Array = [new LatLng(data.mylat,data.mylong),
				   new LatLng(data.lat,data.long)
				];
dir.loadFromWaypoints(waypoints);
</code>

<p>

That's pretty darn simple, right? Once the directions are returned, I can simply loop over them and make a big ole string I then dump out to screen. Like so:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/device2.png" />

<p>

So... what to do? There are other mapping packages out there. I could switch. But I don't know if any of them provide directions support. I think I may switch back to the Google Static Map API and simply get rid of the driving directions. Kinda sucks, but, it's still a cool application. Any opinions out there? Remember that you can get all of the code via the <a href="https://github.com/cfjedimaster/ineedit">Github repo</a>. If you want to try the APK yourself, I've attached it to this blog post.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FINeedIt1%{% endraw %}2Eapk'>Download attached file.</a></p>