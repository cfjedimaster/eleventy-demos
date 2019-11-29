---
layout: post
title: "Quick Cordova tip - Preventing multiple sounds at once"
date: "2015-02-27T08:51:48+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2015/02/27/quick-cordova-tip-preventing-multiple-sounds-at-once
guid: 5740
---

I'm working on a simple application that acts - a bit - like a sound board. You select an item, click a button, and you hear an MP3. While letting one of my kids play with it, they quickly discovered that if they hit the button multiple times in a row, the sound would play multiple times, overlapping each other. While not the end of the world (this is the kind of bug that would only occur if the user was <i>trying</i> to do exactly that), I thought I should probably prevent this from happening.

<!--more-->

Here's the original method:

<pre><code class="language-javascript">
$scope.play = function(mp3) {
	mp3 = "data/mp3/" + mp3;
	if(device.platform.toLowerCase() === "android") mp3 = "/android_asset/www/" + mp3;

	if(window.Media) {
		var media = new Media(mp3, null, function(err) {
			alert(JSON.stringify(err));	
		});
		media.play();
	}
};
</code></pre>

If you read the docs for the <a href="http://plugins.cordova.io/#/package/org.apache.cordova.media">media plugin</a>, you will discover that there are multiple ways to know when a Media object is done playing. In theory, I could use that to determine when it is safe for a new MP3 to play. But why go complex when you use simpler logic? How about simply seeing if the media variable is instantiated and call stop()? Calling stop is harmless if the sound is already done and it quickly handles the issue with one line of code (well, one line and one small mod). 

I moved my media variable outside the function and updated my function like so:

<pre><code class="language-javascript">
var media;
$scope.play = function(mp3) {
			
	mp3 = "data/mp3/" + mp3;
	if(device.platform.toLowerCase() === "android") mp3 = "/android_asset/www/" + mp3;

	if(window.Media) {
		if(media) media.stop();
		media = new Media(mp3, null, function(err) {
			alert(JSON.stringify(err));	
		});
		media.play();
	}
};
</code></pre>

And that's that. Now if you click the button like crazy, the previous sound stops before starting up again.