---
layout: post
title: "An update to my RSS Reader built with Ionic"
date: "2015-06-22T08:12:11+06:00"
categories: [development,javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2015/06/22/an-update-to-my-rss-reader-built-with-ionic
guid: 6299
---

A few days ago a reader posted a comment to a <a href="http://www.raymondcamden.com/2014/09/05/RSS-Reader-Cordova-demo-updated-with-Ionic">blog post</a> I wrote that demonstrated a simple RSS reader built with the Ionic framework. Looking over the code I had written for that demo I realized there was a lot of room for improvement. I'm still no Angular expert, but I've learned a few things over the past few months and decided to update the code base. I thought it might be interesting to point out what I changed (especially if people better at Angular want to correct me) so folks could compare the differences.

<!--more-->

I made three major changes to the code base. The first was to tweak how I handle Cordova's deviceready event within the Ionic code. Previously I had the default Ionic "run" code inside my controller. That was messy and not necessary, so I moved it back to the <code>run</code> method in app.js:

<pre><code class="language-javascript">
.run(function($ionicPlatform, $rootScope, $location) {

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

	$rootScope.goHome = function() {
		$location.path('/entries');
	};

});
</code></pre>

That cleaned up my controller a bit. Next, I added a service. When I first started working with Angular, I did almost everything in controllers because that was simpler, but it also made my code messy (imo). I moved all the logic of RSS parsing into its own service.

<pre><code class="language-javascript">(function() {
/* global angular,window,cordova,console */

	angular.module('rssappServices', [])
	.factory('rssService', function($http,$q) {
		
		var entries;

		return {

			getEntries: function(url) {
				var deferred = $q.defer();
				console.log('getEntries for '+url);
				if(entries) {
					console.log('from cache');
					deferred.resolve(entries);
				} else {
					google.load(&quot;feeds&quot;, &quot;1&quot;,{callback:function() {
						console.log('googles init called');
						var feed = new google.feeds.Feed(url);

						feed.setNumEntries(10);
						feed.load(function(result) {
							entries = result.feed.entries;
							deferred.resolve(entries);
						});


					}});

				}
				return deferred.promise;
			}

		};
	});

}());
</code></pre>

Note the use of deferreds here to handle the async nature of Google's RSS parsing. The end result of these two changes is a much simpler controller. 

<pre><code class="language-javascript">.controller('HomeCtrl', ['$ionicPlatform', '$scope', '$rootScope', '$cordovaNetwork', '$ionicLoading', '$location', 'rssService', 'settings', function($ionicPlatform, $scope, $rootScope, $cordovaNetwork, $ionicLoading, $location, rssService, settings) {

	$ionicLoading.show({
     		template: 'Loading...'
	});

	$ionicPlatform.ready(function() {

		console.log(&quot;Started up!!&quot;);

		if($cordovaNetwork.isOnline()) {
			rssService.getEntries(settings.rss).then(function(entries) {
				$ionicLoading.hide();
				$rootScope.entries = entries;
				$location.path('/entries');
			});

		} else {
			console.log(&quot;offline, push to error&quot;);
			$ionicLoading.hide();
			$location.path('/offline');
		}

	});

}])</code></pre>

The final change was how I set the title and RSS URL of the app. I had used rootScope variables before, but now I'm using Angular Constants, which is something I just discovered about a month or so ago:

<pre><code class="language-javascript">.constant("settings", {
	title:"Raymond Camden's Blog",
	rss:"http://feeds.feedburner.com/raymondcamdensblog"
})</code></pre>

All in all, not a huge amount of changes, but it "feels" a heck of lot better architected now. As I said in the beginning, I welcome comments/criticisms about the techniques here - just post a comment. You can find the full source code here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/rssreader_ionic">https://github.com/cfjedimaster/Cordova-Examples/tree/master/rssreader_ionic</a>