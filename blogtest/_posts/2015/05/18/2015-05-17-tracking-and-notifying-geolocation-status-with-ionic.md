---
layout: post
title: "Tracking and notifying geolocation status with Ionic"
date: "2015-05-18T08:42:04+06:00"
categories: [development,javascript,mobile]
tags: [cordova,ionic]
banner_image: 
permalink: /2015/05/18/tracking-and-notifying-geolocation-status-with-ionic
guid: 6156
---

On Twitter, Snehal reached out to me with an interesting question. Given a location X, he wanted to track a user's location and know when they were within a certain distance to X. By itself, that's not really a difficult task. You need to:

<!--more-->

<ul>
<li>Track the user's location - which is easy with geolocation and an interval.</li>
<li>Get the distance from the user's location to your target, which is also easy. (Ok, I lie. It's bat-shit crazy math but you can copy and paste a solution so let's call it easy.)</li>
<li>Tell the user when they are close - again easy.</li>
</ul>

What <i>wasn't</i> particularly easy for me to wrap my head around how to build this within Ionic, or specifically, within Angular. As I've said on multiple occasions now, I can write Angular, but I'm still struggling with how best to organize and coordinate various different aspects of my application. In this case, I was particularly confused by how I'd handle the interval process. I also needed something that would run <i>all</i> the time, not just for a particular view/controller. 

I was stuck - but then I figured - if I know I'm probably going to do this wrong, let me just take a stab at it and let my smarter readers tell me what I did wrong. ;)

I began by creating a new Ionic application. I let it use the default template, Tabs, so I'd have a "real" app with multiple views in it. I then created a new service in services.js called GeoAlert. GeoAlert would have a simple API:

<ul>
<li>begin: This would initiate tracking and would be passed a target location and a callback to fire when the user is "close enough". I ended up hard coding what "close enough" was, but that could have been an argument as well. Ditto for how often it checked the location.</li>
<li>end: This simply stops the tracking.</li>
<li>setTarget: A method I built and abandoned, but I thought it made sense so I kept it in. This lets you change the target.</li>
</ul>

Here is my service:

<pre><code class="language-javascript">.factory('GeoAlert', function() {
   console.log('GeoAlert service instantiated');
   var interval;
   var duration = 6000;
   var long, lat;
   var processing = false;
   var callback;
   var minDistance = 10;
    
   // Credit: http://stackoverflow.com/a/27943/52160   
   function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
   }
  
   function deg2rad(deg) {
    return deg * (Math.PI/180)
   }
   
   function hb() {
      console.log('hb running');
      if(processing) return;
      processing = true;
      navigator.geolocation.getCurrentPosition(function(position) {
        processing = false;
        console.log(lat, long);
        console.log(position.coords.latitude, position.coords.longitude);
        var dist = getDistanceFromLatLonInKm(lat, long, position.coords.latitude, position.coords.longitude);
        console.log(&quot;dist in km is &quot;+dist);
        if(dist &lt;= minDistance) callback();
      });
   }
   
   return {
     begin:function(lt,lg,cb) {
       long = lg;
       lat = lt;
       callback = cb;
       interval = window.setInterval(hb, duration);
       hb();
     }, 
     end: function() {
       window.clearInterval(interval);
     },
     setTarget: function(lg,lt) {
       long = lg;
       lat = lt;
     }
   };
   
})</code></pre>

So a few notes about this. Since Geolocation is async, I used a variable, processing, to detect when it was active so that my heartbeat function (hb) wouldn't request it again. I could have switched from setInterval to setTimeout as well. I'd simply call the setTimeout in the success function of the geolocation request. I'm not necessarily sure that makes a big deal, but it is something I'd possibly change in the future. As mentioned, the "how far away" logic is something I just cut and paste from a good <a href="http://stackoverflow.com/a/27943/52160">StackOverflow answer</a>. As I said above, both the interval and minimum distance for a match (10 kilometers) are hard coded, but could easily be arguments instead.

At this point, I've got a service that will basically run every N seconds and determine when I'm within X kilometers of a target. How do I use it?

I decided to inject the service in the <code>run</code> method of my main Angular module. I don't know why it felt weird to work there, but it did. Normally I use services in my controllers, but obviously you can use them here too. Heck, Ionic does this with the $ionicPlatform service. As for how to let the user know something happened, I had a few choices. I could have used an <a href="http://ionicframework.com/docs/api/service/$ionicModal/">Ionic Modal</a> or <a href="http://ionicframework.com/docs/api/service/$ionicPopup/">Popup</a>, but they felt wrong to me. I don't have a good reason for why they felt wrong, but I decided to use the Dialogs plugin. Obviously that's a personal choice. My thinking was that the dialog would let the user know they are close to some target and give them the choice to view information about that target. For my demo though I just record what button was clicked and leave the implementation of that to the reader. Here's the code.

<pre><code class="language-javascript">.run(function($ionicPlatform, GeoAlert) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova &amp;&amp; window.cordova.plugins &amp;&amp; window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
    
    //Begin the service
    //hard coded 'target'
    var lat = 30.224090;
    var long = -92.019843;
    function onConfirm(idx) {
      console.log('button '+idx+' pressed');
    }
    
    GeoAlert.begin(lat,long, function() {
      console.log('TARGET');
      GeoAlert.end();
      navigator.notification.confirm(
        'You are near a target!',
        onConfirm,
        'Target!',
        ['Cancel','View']
      );
      
    });
    
  });
})</code></pre>

Pretty simple I think. As a quick note, the button index passed to onConfirm is 1-based, which is good, but don't forget. For testing, I fired up my iOS Simulator. What you may not know is that it lets you change your location. This can be found under the Debug menu.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/Screen-Shot-2015-05-18-at-8.35.31-AM.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/Screen-Shot-2015-05-18-at-8.35.31-AM.png" alt="Screen Shot 2015-05-18 at 8.35.31 AM" width="458" height="344" class="aligncenter size-full wp-image-6157" /></a>

Notice it has a "Custom Location" item. You can select this, enter a location, and it will remember it. I entered my values (which are the same as the static values in the code) and in the next iteration of the heart beat, it matched:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/iOS-Simulator-Screen-Shot-May-18-2015-8.37.44-AM.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/iOS-Simulator-Screen-Shot-May-18-2015-8.37.44-AM.png" alt="iOS Simulator Screen Shot May 18, 2015, 8.37.44 AM" width="450" height="800" class="aligncenter size-full wp-image-6158" /></a>

If you want to play with this, check out the full source code here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/geoalert">https://github.com/cfjedimaster/Cordova-Examples/tree/master/geoalert</a>.