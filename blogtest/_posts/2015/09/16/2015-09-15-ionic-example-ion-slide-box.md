---
layout: post
title: "Ionic Example: ion-slide-box"
date: "2015-09-16T10:58:20+06:00"
categories: [development,javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2015/09/16/ionic-example-ion-slide-box
guid: 6767
---

One of my favorite parts of the Ionic framework is the <a href="http://ionicframework.com/docs/api/directive/ionSlideBox/">ion-slide-box</a>. It is a simple directive that allows you to create a pretty handy little widget for your mobile application. (Widget isn't really the best word.) The ion-slide-box directive lets you embed a set of images (or random HTML) and then display one item at a time. Their docs have a great little animated gif that I'm going to steal to demonstrate exactly what this looks like:

<!--more-->

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/slideBox.gif" alt="slideBox" width="367" height="508" class="aligncenter size-full wp-image-6768" />

What makes this feature so cool is how darn easy it is to use. For example, here is the sample code to create a slide box:

<pre><code class="language-markup">&lt;ion-slide-box on-slide-changed=&quot;slideHasChanged($index)&quot;&gt;
  &lt;ion-slide&gt;
    &lt;div class=&quot;box blue&quot;&gt;&lt;h1&gt;BLUE&lt;/h1&gt;&lt;/div&gt;
  &lt;/ion-slide&gt;
  &lt;ion-slide&gt;
    &lt;div class=&quot;box yellow&quot;&gt;&lt;h1&gt;YELLOW&lt;/h1&gt;&lt;/div&gt;
  &lt;/ion-slide&gt;
  &lt;ion-slide&gt;
    &lt;div class=&quot;box pink&quot;&gt;&lt;h1&gt;PINK&lt;/h1&gt;&lt;/div&gt;
  &lt;/ion-slide&gt;
&lt;/ion-slide-box&gt;</code></pre>

This is <i>incredibly</i> simple. I thought I'd build a simple demo of this feature that tied the slides to a dynamic result. I thought I'd use the Bing Image Search API since it worked well for me in the past (<a href="http://www.raymondcamden.com/2011/12/02/Adding-voicebased-search-to-a-PhoneGap-app">Adding voice-based search to a PhoneGap app</a>). I set up a simple view that included a form field and button top.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/iOS-Simulator-Screen-Shot-Sep-16-2015-10.42.15-AM.png" alt="iOS Simulator Screen Shot Sep 16, 2015, 10.42.15 AM" width="500" height="303" class="aligncenter size-full wp-image-6769 imgborder" />

When you enter a term, it will then display the results in a slidebox:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/iOS-Simulator-Screen-Shot-Sep-16-2015-10.44.18-AM.png" alt="iOS Simulator Screen Shot Sep 16, 2015, 10.44.18 AM" width="500" height="772" class="aligncenter size-full wp-image-6770 imgborder" />

Notice the little gray balls at the bottom - they provide a way for you to know where you are in the slide list (and you can turn that feature off if you want). Now let's take a look at the code. First, I'll show the HTML.

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width&quot;&gt;
    &lt;title&gt;&lt;/title&gt;

    &lt;link href=&quot;lib/ionic/css/ionic.css&quot; rel=&quot;stylesheet&quot;&gt;
    &lt;link href=&quot;css/style.css&quot; rel=&quot;stylesheet&quot;&gt;

    &lt;!-- IF using Sass (run gulp sass first), then uncomment below and remove the CSS includes above
    &lt;link href=&quot;css/ionic.app.css&quot; rel=&quot;stylesheet&quot;&gt;
    --&gt;

    &lt;!-- ionic/angularjs js --&gt;
    &lt;script src=&quot;lib/ionic/js/ionic.bundle.js&quot;&gt;&lt;/script&gt;

    &lt;!-- cordova script (this will be a 404 during development) --&gt;
    &lt;script src=&quot;cordova.js&quot;&gt;&lt;/script&gt;

    &lt;!-- your app's js --&gt;
    &lt;script src=&quot;js/app.js&quot;&gt;&lt;/script&gt;
  &lt;/head&gt;
  &lt;body ng-app=&quot;starter&quot;&gt;

    &lt;ion-pane&gt;
      &lt;ion-header-bar class=&quot;bar-stable&quot;&gt;
        &lt;h1 class=&quot;title&quot;&gt;Image Search&lt;/h1&gt;
      &lt;/ion-header-bar&gt;
      &lt;ion-content class=&quot;padding&quot; ng-controller=&quot;MainCtrl&quot;&gt;
						
				&lt;div class=&quot;list&quot;&gt;
				&lt;label class=&quot;item item-input&quot;&gt;
					&lt;input type=&quot;search&quot; placeholder=&quot;Search&quot; ng-model=&quot;search&quot;&gt;
				&lt;/label&gt;
				&lt;button class=&quot;button button-full button-assertive&quot; ng-click=&quot;doSearch()&quot;&gt;Search&lt;/button&gt;
				&lt;/div&gt;

				&lt;ion-slide-box&gt;
					&lt;ion-slide ng-repeat=&quot;image in images&quot;&gt;
						&lt;img ng-src=&quot;{% raw %}{{image.MediaUrl}}{% endraw %}&quot; style=&quot;width:300px;height:300px;margin:auto;display:block&quot; &gt;
					&lt;/ion-slide&gt;
				&lt;/ion-slide-box&gt;
				
      &lt;/ion-content&gt;
    &lt;/ion-pane&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>

Most of this is boilerplate Ionic code, but you can seem my ion-slide-box is using a dynamic ion-slide list. That's really all there is to it. I could include more in the slide, like the image title, source, etc., but I wanted it simple. Now let's look at the code.

<pre><code class="language-javascript">// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a &lt;body&gt; attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.controller(&quot;MainCtrl&quot;, function($scope, ImageSearch, $ionicSlideBoxDelegate) {

	$scope.images = [];
		
	$scope.doSearch = function() {
		if(!$scope.search) return;
		console.log(&quot;search for &quot;, $scope.search);	
		ImageSearch.getImages($scope.search).then(function(results) {
			$scope.images = results.data.d.results;
			setTimeout(function() {
				$ionicSlideBoxDelegate.slide(0);
				$ionicSlideBoxDelegate.update();
				$scope.$apply();
			});
		});
	};
	
})

.service(&quot;ImageSearch&quot;, function($http) {
	
	return {
		getImages:function(term) {
			var appid = &quot;fgQ7ve/sV/eB3NN/+fDK9ohhRWj1z1us4eIbidcsTBM&quot;;
			$http.defaults.headers.common['Authorization'] = 'Basic ' + btoa(appid + ':' + appid);
			return $http.get(&quot;https://api.datamarket.azure.com/Bing/Search/v1/Image?$format=json&amp;Query='&quot;+escape(term)+&quot;'&amp;$top=10&quot;);
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

The Bing API changed a bit since my last demo, but for the most part is still relatively easy to use. Their documentation wasn't always very direct. Outside of that I had no real issues. And yes - that's my appid included in the source code. This is a perfect example of where I could use a <a href="https://ibm.biz/BluemixMobileFirst">MobileFirst</a> HTTP Adapter. I described this process here: 
<a href="http://www.raymondcamden.com/2015/05/06/working-with-mp3s-id3-and-phonegapcordova-adding-ibm-mobilefirst">Working with MP3s, ID3, and PhoneGap/Cordova – Adding IBM MobileFirst</a>. Using the adapter would also let me modify how Bing returns results. I could use lowercase and I could return just the URLs, making my mobile perform better since less network data would be going back and forth. 

Outside of the service it is a simple matter of updating the scope - but I ran into an interesting issue. I noticed that if I was on slide X and searched for something else...

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/iOS-Simulator-Screen-Shot-Sep-16-2015-10.52.39-AM.png" alt="iOS Simulator Screen Shot Sep 16, 2015, 10.52.39 AM" width="500" height="709" class="aligncenter size-full wp-image-6771" />

then the "current slide" remained at where you were before. That's where $ionicSlideBoxDelegate.slide(0) comes into play. But doing so introduced a weird bug involving AngularJS and digests. I hate those things. <a href="https://twitter.com/mhartington">Mike Hartington</a> from the Ionic team helped me out on Slack and recommended the timeout/$scope.$apply() solution you see above. That made it work perfectly.

All in all, a simple demo, but I hope this is useful for folks. You can find the complete source code for this demo here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/ionicslidebox1">https://github.com/cfjedimaster/Cordova-Examples/tree/master/ionicslidebox1</a>