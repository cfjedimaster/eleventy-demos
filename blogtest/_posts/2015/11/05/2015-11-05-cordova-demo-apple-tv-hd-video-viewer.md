---
layout: post
title: "Cordova Demo - Apple TV HD Video Viewer"
date: "2015-11-05T17:27:39+06:00"
categories: [development,javascript,mobile]
tags: [cordova,ionic]
banner_image: 
permalink: /2015/11/05/cordova-demo-apple-tv-hd-video-viewer
guid: 7068
---

So a few days ago, someone on Twitter (sorry, I forget who) mentioned that the new Apple TV has some pretty stellar screen savers. Turns out - the data for those screen savers was all driven by a public JSON file. It didn't take long for someone to notice and then build a cool demo: <a href="http://benjaminmayo.co.uk/watch-all-the-apple-tv-aerial-video-screensavers">Watch All The Apple TV Aerial Video Screensavers</a>. You should check it out. Seriously. Absolutely beautiful stuff. 

<!--more-->

Now it looks like everyone is playing with it. You can even get a <a href="https://github.com/JohnCoates/Aerial">OSX</a> and <a href="https://github.com/cDima/Aerial/">Windows</a> screen saver of the videos. I'm sure Apple is going to kill this off sometime soon - I mean - they have to I imagine - but in the meantime they are some darn pretty visuals to look at.

While exercising today, I thought I'd quickly whip up a demo of this using <a href="http://cordova.apache.org">Apache Cordova</a> and <a href="http://www.ionicframework.com">Ionic</a>. Here it is in action. And yes - for the life of me I couldn't get it to be 100% of the canvas. I'm sure there is some way in CSS to say, "Stretch this so it covers everything and I'm OK if parts of it are off screen", but such CSS Wizardry is beyond me. 

<iframe width="800" height="600" src="https://www.youtube.com/embed/3CUmBl9S2l0" frameborder="0" allowfullscreen></iframe>

So the code isn't anything special. The front end is pretty much just the "pull to refresh" widget and a video tag:

<pre><code class="language-markup">&lt;ion-pane&gt;
	&lt;ion-header-bar class=&quot;bar-dark&quot;&gt;
	&lt;h1 class=&quot;title&quot;&gt;Apple Arial Viewer&lt;/h1&gt;
	&lt;/ion-header-bar&gt;
	&lt;ion-content ng-controller=&quot;MainCtrl&quot;&gt;
			&lt;ion-refresher
				pulling-text=&quot;Pull to select new video...&quot;
				on-refresh=&quot;loadVideo()&quot;&gt;
			&lt;/ion-refresher&gt;
			&lt;video autoplay loop id=&quot;mainVideo&quot; controls2&gt;
				&lt;source src=&quot;&quot; /&gt;
			&lt;/video&gt;
	&lt;/ion-content&gt;
&lt;/ion-pane&gt;</code></pre>

And here is the JavaScript:

<pre><code class="language-javascript">angular.module('starter', ['ionic'])

.controller('MainCtrl', function($scope, AppleVideoService) {

	$scope.loadVideo = function() {
		AppleVideoService.getVideo().then(function(vid) {
			console.log(vid.url);
			document.querySelector(&quot;#mainVideo source&quot;).setAttribute(&quot;src&quot;, vid.url);
			document.querySelector(&quot;#mainVideo&quot;).load();
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
	
	$scope.loadVideo();
		
})
.factory('AppleVideoService', function($http,$q) {

	var jsonURL = &quot;http://a1.phobos.apple.com/us/r1000/000/Features/atv/AutumnResources/videos/entries.json&quot;;
	var videoData = &quot;&quot;;
	
	//http://stackoverflow.com/a/7228322
	var randomIntFromInterval = function (min,max) {
	    return Math.floor(Math.random()*(max-min+1)+min);
	}
	
	/*
	first, I determine if night or data
	then, I pick a random video matching that
	*/
	var randomVideo = function() {
		//what time is it?
		var hour = new Date().getHours();
		if(hour &gt; 6 &amp;&amp; hour &lt; 18) {
			return videoData.day[randomIntFromInterval(0, videoData.day.length)];	
		} else {
			return videoData.night[randomIntFromInterval(0, videoData.night.length)];				
		}
	};
	
	/*
	I convert Apple's JSON into two array of day and night videos. That makes it easier to pick a random one.
	*/
	var process = function(data) {
		var processed = {% raw %}{night:[], day:[]}{% endraw %};
		for(var i=0; i&lt;data.length;i++) {
			for(var video in data[i].assets) {
				if(data[i].assets[video].timeOfDay === &quot;day&quot;) {
					processed.day.push(data[i].assets[video]);	
				}	else {
					processed.night.push(data[i].assets[video]);	
				}
			}	
		}
		return processed;
	};
	
	return {
		
			getVideo:function() {
				var deferred = $q.defer();
				if(videoData === &quot;&quot;) {
					$http.get(jsonURL).success(function(data) {
						videoData = process(data);
						deferred.resolve(randomVideo());
					});	
				}	else deferred.resolve(randomVideo());
				return deferred.promise;
			}
		
	};
	
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova &amp;&amp; window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
		
		
  });
})</code></pre>

So the controller simply sets up a call to my service and updates the DOM with the proper HTML. I'm always unsure about how to do DOM manipulations like this with Angular. I'm guessing I should have used ng-model or something here, right? 

The service isn't too complex either. We load Apple's JSON once and parse it into a list of day and night videos. We then figure out what time it is, and arbitrarily decide that 7AM to 6PM is "day". Obviously your world may differ. Then we can just select a random video and return it. 

And really that's it. I could add a label to the display so folks knew what it is. I could also add support for knowing when you are offline. But I won't. I will, however, share all the code: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/arialscreensaver">https://github.com/cfjedimaster/Cordova-Examples/tree/master/arialscreensaver</a>.