---
layout: post
title: "Simple photo filters with VintageJS and Cordova"
date: "2014-09-23T11:09:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2014/09/23/Simple-photo-filters-with-VintageJS-and-Cordova
guid: 5313
---

<p>
A quick demo today of something I ran into via StackOverflow. <a href="http://rendro.github.io/vintageJS/">VintageJS</a> is a JavaScript library that adds simple camera fitlers, like sepia and vignettes, to pictures. As long as your browser supports canvas, you can make use of the library rather easily. Here is one example, stolen from their docs.
</p>
<!--more-->
<pre><code class="language-javascript">
var img = document.getElementById('yourImage');
var options = {
    onError: function() {
        alert('ERROR');
    }
};
var effect = {
    vignette: 0.6,
    sepia: true
};
new VintageJS(img, options, effect);
</code></pre>

<p>
The library also integrates well with AngularJS, which is a plus for me as I'm trying to do most everything in Cordova with AngularJS now. (Well, most things past simple demos like the one I'm showing today.) I whipped up a quick demo to see how well it worked with the device camera, and unsurprisingly, it worked just fine. I began by creating a new project to base camera demos off of - "basic_camera". A while ago I set up a GitHub repo for my demos and I thought a basic camera example would be something I'd use often. You can find the source for that project here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/basic_camera">https://github.com/cfjedimaster/Cordova-Examples/tree/master/basic_camera</a>. It literally just uses two buttons and lets you source images from either the camera or the device library.
</p>

<p>
Using that as a base I simply added the VintageJS demo code to my success handler. Here is my entire JavaScript file.
</p>

<pre><code class="language-javascript">document.addEventListener(&quot;deviceready&quot;, init, false);
function init() {

	function onSuccess(imageData) {
		console.log(&#x27;success&#x27;);
		var image = document.getElementById(&#x27;myImage&#x27;);
		image.src = imageData;

		var options = {
			onError: function() {
				alert(&#x27;ERROR&#x27;);
			}
		};

		var effect = {
			vignette: 0.6,
			sepia: true
		};

		new VintageJS(image, options, effect);

	}

	function onFail(message) {
		alert(&#x27;Failed because: &#x27; + message);
	}	

	&#x2F;&#x2F;Use from Camera
	document.querySelector(&quot;#takePicture&quot;).addEventListener(&quot;touchend&quot;, function() {
		navigator.camera.getPicture(onSuccess, onFail, { 
			quality: 50,
			sourceType: Camera.PictureSourceType.CAMERA,
			destinationType: Camera.DestinationType.FILE_URI
		});

	});

	&#x2F;&#x2F;Use from Library
	document.querySelector(&quot;#usePicture&quot;).addEventListener(&quot;touchend&quot;, function() {
		navigator.camera.getPicture(onSuccess, onFail, { 
			quality: 50,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			destinationType: Camera.DestinationType.FILE_URI
		});

	});

}</code></pre>

<p>
And here is one result from the iOS Simulator:
</p>

<p>
<img src="https://static.raymondcamden.com/images/iOS Simulator Screen Shot Sep 23, 2014, 9.47.28 AM.png" class="bthumb" />
</p>

<p>
And here is an example running from my Nexus 7. My UI isn't optimized so forgive me for that. Also, I'm sorry my face is so scary. ;)
</p>

<p>
<img src="https://static.raymondcamden.com/images/device-2014-09-23-094841.png" class="bthumb" />
</p>

<p>
Pretty cool, and pretty simple. I put this version up in my GitHub repo as well: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/camera_vintagejs">https://github.com/cfjedimaster/Cordova-Examples/tree/master/camera_vintagejs</a>
<p>