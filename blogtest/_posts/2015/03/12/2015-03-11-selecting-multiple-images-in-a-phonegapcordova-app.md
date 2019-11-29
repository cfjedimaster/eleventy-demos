---
layout: post
title: "Selecting multiple images in a PhoneGap/Cordova app"
date: "2015-03-12T08:43:27+06:00"
categories: [development,javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2015/03/12/selecting-multiple-images-in-a-phonegapcordova-app
guid: 5820
---

A few days ago a reader asked me an interesting question: How can you select more than one image at a time in a PhoneGap/Cordova application? I did a bit of digging and came up with three different options for handling this. There are probably more, and if you would like to share how you've done it, please add a comment below.

<!--more-->

<h2>Option One - Camera API</h2>

The Camera API only lets you select one image at a time, so it may seem like it isn't a viable solution, but if your code simply keeps track of a list of selections, it may be an option. The user would need to click some button one time for each image they want to use, but depending on your use-case, that may be ok. For example, when I post a picture to Facebook, even though I <i>can</i> post multiple images, I can't honestly remember the last time I did. If Facebook only let me select one existing picture at a time, it wouldn't bother me at all, and that may work fine for your application too.

As an example of this, I created a simple Ionic application that lets you select an image. Every time you select an image, it gets added to a list that is rendered on screen. Here is the controller code I used to handle this:

<pre><code class="language-javascript">angular.module(&#x27;appControllers&#x27;, [])

.controller(&#x27;HomeCtrl&#x27;, [&#x27;$scope&#x27;, &#x27;$rootScope&#x27;, &#x27;$cordovaCamera&#x27;, function($scope, $rootScope, $cordovaCamera) {

	$scope.ready = false;
	$scope.images = [];
	
	$rootScope.$watch(&#x27;appReady.status&#x27;, function() {
		console.log(&#x27;watch fired &#x27;+$rootScope.appReady.status);
		if($rootScope.appReady.status) $scope.ready = true;
	});
	
	$scope.selImages = function() {
		
		var options = {
			quality: 50,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			targetWidth: 200,
			targetHeight: 200
		};

		$cordovaCamera.getPicture(options).then(function(imageUri) {
			console.log(&#x27;img&#x27;, imageUri);
			$scope.images.push(imageUri);
					
		}, function(err) {
		&#x2F;&#x2F; error
		});

	};
	
}])</code></pre>

Here is an awesome animated gif of this in action:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/anim1.gif"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/anim1.gif" alt="anim1" width="286" height="532" class="alignnone size-full wp-image-5821" /></a>

Obviously this would be tied to a form process of some sort. You would use the array of images as values with the FileTransfer plugin to send them to your server. 

You can view the full source code for this version here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/multiimageselect/multiimageselect1">https://github.com/cfjedimaster/Cordova-Examples/tree/master/multiimageselect/multiimageselect1</a>.

<h2>Option Two - Media-Capture API</h2>

Another option to consider would be the <a href="http://plugins.cordova.io/#/package/org.apache.cordova.media-capture">media capture</a> plugin. I don't use this terribly often and I tend to forget that it supports camera images as well. With this plugin, you can request multiple camera images. However, it does <i>not</i> support existing pictures - the user must take new pictures. Also, the user experience is pretty horrible. As I said, I don't use this terribly often and in my testing it wasn't obvious how you stopped the picture taking process. I had to click the device's back button (I only tested this one on Android) to get out of the picture taking cycle and on more than one occasion I accidentally closed the app. 

So as I said, this is probably not what I'd use - but it is an option. Here's the controller code updated to make use of that plugin:

<pre><code class="language-javascript">angular.module(&#x27;appControllers&#x27;, [])

.controller(&#x27;HomeCtrl&#x27;, [&#x27;$scope&#x27;, &#x27;$rootScope&#x27;, &#x27;$cordovaCapture&#x27;, function($scope, $rootScope, $cordovaCapture) {

	$scope.ready = false;
	$scope.images = [];
	
	$rootScope.$watch(&#x27;appReady.status&#x27;, function() {
		console.log(&#x27;watch fired &#x27;+$rootScope.appReady.status);
		if($rootScope.appReady.status) $scope.ready = true;
	});
	
	$scope.selImages = function() {
		
		var options = {
			limit: 10
		};

		$cordovaCapture.captureImage(options).then(function(results) {
			for (var i = 0; i &lt; results.length; i++) {
				$scope.images.push(results[i].fullPath);
			}
			if(!$scope.$$phase) {
				$scope.$apply();
			}
		}, function(err) {
			console.log(&#x27;err&#x27;);
			console.log(err);
		&#x2F;&#x2F; error
		});

	};
	
}])</code></pre>

You can view this version here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/multiimageselect/multiimageselect3">https://github.com/cfjedimaster/Cordova-Examples/tree/master/multiimageselect/multiimageselect3</a>

<h2>Option Three - cordova-imagePicker</h2>

For the final - and probably best - option there is the <a href="http://plugins.cordova.io/#/package/com.synconset.imagepicker">cordova-imagePicker</a> plugin. This plugin does pretty much exactly what the reader wanted - letting you select multiple images. It has an <i>incredibly</i> simple API allowing for a maximum number of pictures and automatic resizing/quality changes too. Here's how the code works with the defaults:

<pre><code class="language-javascript">angular.module(&#x27;appControllers&#x27;, [])

.controller(&#x27;HomeCtrl&#x27;, [&#x27;$scope&#x27;, &#x27;$rootScope&#x27;, &#x27;$cordovaCamera&#x27;, function($scope, $rootScope, $cordovaCamera) {

	$scope.ready = false;
	$scope.images = [];
	
	$rootScope.$watch(&#x27;appReady.status&#x27;, function() {
		console.log(&#x27;watch fired &#x27;+$rootScope.appReady.status);
		if($rootScope.appReady.status) $scope.ready = true;
	});

	$scope.selImages = function() {
		
		window.imagePicker.getPictures(
			function(results) {
				for (var i = 0; i &lt; results.length; i++) {
					console.log(&#x27;Image URI: &#x27; + results[i]);
					$scope.images.push(results[i]);
				}
				if(!$scope.$$phase) {
					$scope.$apply();
				}
			}, function (error) {
				console.log(&#x27;Error: &#x27; + error);
			}
		);

	};
	
}])</code></pre>


And here it is in action:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/Untitled2.gif"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/Untitled2.gif" alt="Untitled2" width="286" height="528" class="alignnone size-full wp-image-5822" /></a>

Honestly, this seems like the best option. You can see the full source code for this version here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/multiimageselect/multiimageselect2">https://github.com/cfjedimaster/Cordova-Examples/tree/master/multiimageselect/multiimageselect2</a>

(As a quick aside, yes, the numbers at the end of each folder don't match the order I did here. The media-capture example is multiimageselect3 and the nicer multi select plugin one is folder 2. Sorry if that's confusing - I just built them in a different order than how I wrote them up.)

As always - I'm curious about how people may have solved this problem in their own PhoneGap/Cordova projects. Please share your ideas below!