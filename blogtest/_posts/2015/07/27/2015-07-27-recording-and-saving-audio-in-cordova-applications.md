---
layout: post
title: "Recording and saving audio in Cordova applications"
date: "2015-07-27T14:02:15+06:00"
categories: [development,javascript,mobile]
tags: [cordova]
banner_image: 
permalink: /2015/07/27/recording-and-saving-audio-in-cordova-applications
guid: 6537
---

Ah, looking at that title there you probably think, "Surely this is a simple matter in Cordova and surely this is Raymond, once again, blogging something is incredibly obvious and simple just to drive people to his <a href="http://www.amazon.com/wishlist/2TCL1D08EZEYE">Amazon Wishlist</a>." Yep, that's what I thought too. This weekend I began work on a simple little Cordova app for my son. I thought it would be a great blog post too. But while working on it, I ran into an issue with audio recordings that drove me bat-shit crazy for a few hours, so I thought I'd better share so others don't have to bang their heads against the wall too.

<!--more-->

Because this problem turned into a royal cluster-you know what, I've decided to blog it about it in detail here and talk about the app itself later this week. For now, consider this use case:

"You want to allow the user to make an audio recording. Later, the user can play that recording."

Simple, right? So I began working on a form that would let the user make the recording as well as name it. I wanted them to be able to do the recording as well as play it back to ensure they liked it.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-27-2015-1.38.09-PM.png" alt="iOS Simulator Screen Shot Jul 27, 2015, 1.38.09 PM" width="422" height="750" class="aligncenter size-full wp-image-6538 imgborder" />

Clicking Record fires off a call to the Media Capture plugin:

<pre><code class="language-javascript">var captureError = function(e) {
	console.log('captureError' ,e);
}

var captureSuccess = function(e) {
	console.log('captureSuccess');console.dir(e);
	$scope.sound.file = e[0].localURL;
	$scope.sound.filePath = e[0].fullPath;
}

$scope.record = function() {
	navigator.device.capture.captureAudio(
		captureSuccess,captureError,{% raw %}{duration:10}{% endraw %});
}</code></pre>

This is boiler-plate Media Capture usage here. I'm storing both the URL and file path in $scope so I can save it later. The Play feature is also pretty trivial:

<pre><code class="language-javascript">$scope.play = function() {
	if(!$scope.sound.file) {
		navigator.notification.alert("Record a sound first.", null, "Error");
		return;
	}
	var media = new Media($scope.sound.file, function(e) {
		media.release();
	}, function(err) {
		console.log("media err", err);
	});
	media.play();
}</code></pre>

This worked fine in Android and iOS. But I noticed something weird. When I looked at the Media Capture object in captureSuccess, I saw this in Android:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot110.png" alt="shot1" width="500" height="192" class="aligncenter size-full wp-image-6539 imgborder" />

See the portion I called out there? Persistent. Cool. That gives me the warm fuzzies. However, in iOS, I saw this:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot25.png" alt="shot2" width="500" height="134" class="aligncenter size-full wp-image-6540 imgborder" />

As you can see, it is being stored in a temporary location, which is not good. Unfortunately, there is nothing in the Media Capture plugin that you can change to modify this behavior. Therefore - the answer was clear.

The File System!

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/onesimply.jpg" alt="onesimply" width="568" height="335" class="aligncenter size-full wp-image-6541" />

So in theory, this should be easy. First, we pick a persistent location that covers both Android and iOS. The File plugin provides such an alias: <code>cordova.file.dataDirectory</code>

We have a folder, right? So literally all we need to do is copy a file from one location to another. Copy. A damn. File. 

But we've got an issue. First, we have to give the file a unique name. To handle that, I just used time and the existing extension.

<pre><code class="language-javascript">var extension = $scope.sound.file.split(".").pop();
var filepart = Date.now();
var filename = filepart + "." + extension;
console.log("new filename is "+filename);</code></pre>

I then spent about an hour trying to get the copy command to work. I began by adding numerous console.log messages with the F word in it. If you don't know what that word is, ask your teenagers. I thought that with a file path, I could just do this:

<pre><code class="language-javascript">var file = new FileEntry(some damn path);</code></pre>

But nah, that would be too easy. You need to use <code>window.resolveLocalFileSYstemURL</code> first. And since the File copy command requires a path, you have to do this twice. Here's the code I ended up with. I removed a few console.log messages that may offend some readers. If you're curious, I went <i>way</i> beyond just saying the F-word.

<pre><code class="language-javascript">window.resolveLocalFileSystemURL(loc, function(d) {
	window.resolveLocalFileSystemURL($scope.sound.file, function(fe) {
		fe.copyTo(d, filename, function(e) {
			console.log('success inc opy');
			console.dir(e);
			$scope.sound.file = e.nativeURL;
			$scope.sound.path = e.fullPath;

			Sounds.save($scope.sound).then(function() {
				$ionicHistory.nextViewOptions({
				    disableBack: true
				});
				$state.go("home");
			});
			
		}, function(e) {
			console.log('error in coipy');console.dir(e);
		});					
	}, function(e) {
		console.log("error in inner bullcrap");
		console.dir(e);
	});</code></pre>

All in all, it isn't that bad. A few nested callbacks, and nearly half my code there is related to my app, not the actual issue, it just took me a while to get there.

Luckily, everything worked perfectly.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/yeah-right.jpg" alt="yeah-right" width="275" height="183" class="aligncenter size-full wp-image-6542" />

So at this point, I've saved the location of my audio file so I can use it in the Media api, but the new location doesn't work in the Media plugin anymore. Why? I don't freaking know. I <a href="http://www.raymondcamden.com/2014/06/23/Cordova-Media-API-Example">blogged</a> last year about how when you use the Media plugin and a relative path, you have to do something funky on Android, basically prefix your relative URL. In my case, I'm using a file:// url and I just assumed it would work.

And here is where things got awesome - it worked perfectly in Android but not iOS. Because - reasons. I brought this up on the Cordova Slack channel and @purplecabbage mentioned that a relative path may work. In my dev tools, I tried to manually create a Media object via the console. I discovered that - given the file name - I could access the file with the Media plugin by using this as the root: <code>"../Library/NoCloud/"</code>. 

So now my play code looks like so:

<pre><code class="language-javascript">var playSound = function(x) {
	getSounds().then(function(sounds) {
		var sound = sounds[x];

		/*
		Ok, so on Android, we just work.
		On iOS, we need to rewrite to ../Library/NoCloud/FILE
		*/
		var mediaUrl = sound.file;
		if(device.platform.indexOf("iOS") &gt;= 0) {
			mediaUrl = "../Library/NoCloud/" + mediaUrl.split("/").pop();
		}
		var media = new Media(mediaUrl, function(e) {
			media.release();
		}, function(err) {
			console.log("media err", err);
		});
		media.play();			
	});		
}</code></pre>

So... yeah. That's it. My app now works. I can record and test audio, and I can persist it to a permanent file system. As I said, I'll share the real app later this week.