---
layout: post
title: "Quickie AIR for Mobile Geolocation Example"
date: "2010-11-05T17:11:00+06:00"
categories: [flex,mobile]
tags: []
banner_image: 
permalink: /2010/11/05/Quickie-AIR-for-Mobile-Geolocation-Example
guid: 4004
---

Last night I read over Rich Tretola's excellent <a href="http://blog.everythingflex.com/2010/07/22/air-on-android-geolocation/">Geolocation for AIR/Mobile</a> example. He demonstrates how to a) check and see if Geolocation is available (it may not be) and how to handle the response from the GPS system on the device. I thought it might be interesting to tie that to a change I made to the <a href="http://groups.adobe.com">Adobe Groups</a> remote API last night. I added a method that would return user groups based sorted by distance based on a longitude and latitude. For my testing I had done typed in values (everyone knows their longitude and latitude, right?) but I figured it would be even easier with AIR.
<!--more-->
<p>

Let's take a look at the application I built. All in all it is pretty unrealistic since it has a grand total of one page, but I wanted something I could write in a few minutes.

<p>

<code>

&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" xmlns:mx="library://ns.adobe.com/flex/mx"
		title="UG Locator" viewActivate="init()"&gt;

	&lt;fx:Declarations&gt;
		&lt;mx:HTTPService id="groupsHTTPService" url="http://groups.adobe.com/api/group.cfc" method="get" result="handleResult(event)" fault="handleFault(event)" /&gt;
	&lt;/fx:Declarations&gt;
	
	&lt;fx:Script&gt;
		&lt;![CDATA[
			import com.adobe.serialization.json.*;
			
			import flash.events.GeolocationEvent;
			import flash.sensors.Geolocation;
			
			import mx.collections.ArrayCollection;
			import mx.collections.ArrayList;
			import mx.rpc.events.FaultEvent;
			import mx.rpc.events.ResultEvent;
			
			private var geoLocation:Geolocation;
			
			[Bindable] private var groups:ArrayCollection;
			
			private function init():void {
				groups = new ArrayCollection();
				
				locate();	
				/* used for testing... */
				/*
				var evt:GeolocationEvent = new GeolocationEvent(GeolocationEvent.UPDATE,false,false,30.2009,-92.0572);
				handleLocationRequest(evt);
				*/
			}
			
			public function handleFault(evt:FaultEvent):void {
				//bug.text = evt.toString();
				geoLocation.removeEventListener(GeolocationEvent.UPDATE, handleLocationRequest);
			}
			
			public function handleResult(evt:ResultEvent):void {
				var data:Object = JSON.decode(evt.result as String);
				groups.source = data as Array;
				geoStatus.text = "There were "+data.length + " groups within 200 miles of your location.";
			}
			
			private function locate():void  {
				if(Geolocation.isSupported==true){
					geoLocation = new Geolocation();
					geoLocation.addEventListener(GeolocationEvent.UPDATE, handleLocationRequest);
				} else {
					geoStatus.text = "Geolocation feature not supported"; 
				}
			}
			
			private function handleLocationRequest(event:GeolocationEvent):void { 
				geoLocation.removeEventListener(GeolocationEvent.UPDATE, handleLocationRequest);
				geoStatus.text="Finding groups near your location... ";
				var lat:Number = event.latitude;
				var lon:Number = event.longitude;
				var req:Object = new Object();
				req.method="getgroupswithindistance";
				req.longitude = lon;
				req.latitude = lat;
				req.range = 200;
				groupsHTTPService.request = req;
				groupsHTTPService.send();
			}
			
		]]&gt;
	&lt;/fx:Script&gt;
	
	&lt;s:VGroup width="100{% raw %}%" height="100%{% endraw %}" paddingLeft="5" paddingRight="5" paddingTop="5"&gt;		
		
		&lt;s:Label id="geoStatus" width="100%"/&gt;
		
		&lt;s:List id="groupList" dataProvider="{% raw %}{groups}{% endraw %}" width="100{% raw %}%" height="100%{% endraw %}"&gt;
			&lt;s:itemRenderer&gt;
				&lt;fx:Component&gt;
					&lt;s:MobileIconItemRenderer labelFunction="displayGroup"  messageFunction="displayMessage" iconField="AVATAR"&gt;
						&lt;fx:Declarations&gt;
							&lt;mx:NumberFormatter id="myNumFormat" precision="0" /&gt;					
						&lt;/fx:Declarations&gt;
						&lt;fx:Script&gt;
							&lt;![CDATA[
								private function displayGroup(ob:Object):String {
									return ob.NAME;
								}
								private function displayMessage(ob:Object):String {
									return myNumFormat.format(ob.DISTANCE) + " miles away.";
								}
								
							]]&gt;
						&lt;/fx:Script&gt;
					&lt;/s:MobileIconItemRenderer&gt;
				&lt;/fx:Component&gt;
			&lt;/s:itemRenderer&gt;
			
		&lt;/s:List&gt;
	&lt;/s:VGroup&gt;
	
&lt;/s:View&gt;
</code>

<p>

The application begins by running a call to my locate method. The code here is a complete copy of Rich's code but essentially it just does the hardware check. As soon as you create a Geolocation object you can then begin listening for the result. I do that in handleLocationRequest. Once I've got your location I stop listening. (I assume you are standing still, motionless, like I am most of the day unfortunately.) Once I've got that I then just fire off a HTTP request to the API. Unfortunately my API for Groups is JSON only (for now), but it's easy enough to work with JSON if you use <a href="https://github.com/mikechambers/as3corelib">as3corelib</a>. Once I push my data to my list - it gets rendered. I'm still learning Flex 4 but I love how I was able to have a mini "component" right within the page itself. Very convenient! And the result?

<p>

<img src="https://static.raymondcamden.com/images/screen40.png" />

<p>

I've added APK as a mime type to IIS so hopefully the download link will work. I'd include the full source but outside of the XML that's it. Don't forget that in AIR for Mobile apps you have to be cognizant of the additional permissions your application may require. Within my android manifest block I added:

<p>

<code>
&lt;uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/&gt;
</code>

<p>

Enjoy! Oh - two quick notes.

<p>

While pushing out my code to the phone I noticed, for the first time, that it seemed to 'latch' on to the application. I had to manually delete the application one time. I didn't see that again so maybe it was just a fluke. But keep that in mind if you don't see your application refreshing when running on the hardware.

Lastly - I still need to share the source code for the Death Clock application I blogged about before MAX. Will do so soon.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FGroupsGeo2%{% endraw %}2Eapk'>Download attached file.</a></p>