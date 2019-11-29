---
layout: post
title: "Cordova/Ionic Sample App: My Sound Board"
date: "2015-07-30T10:18:16+06:00"
categories: [development,javascript]
tags: [cordova,ionic]
banner_image: 
permalink: /2015/07/30/cordovaionic-sample-app-my-sound-board
guid: 6560
---

Today's demo is something I started working on Sunday "for fun", but when it turned into an unholy mess (see <a href="http://www.raymondcamden.com/2015/07/27/recording-and-saving-audio-in-cordova-applications">Recording and saving audio in Cordova applications</a>), it took me a bit longer to wrap than I expected. The idea was simple. "Sound Boards" are apps that contain a collection of sounds, typically related to a movie or TV show. My coworker <a href="http://www.tricedesigns.com/">Andy</a> built a cool sound board themed around Halloween a few years back: <a href="http://www.tricedesigns.com/2012/10/23/halloween-fun-with-phonegap/">Halloween Fun with PhoneGap</a>. I wanted to build a sound board too, but instead of shipping it with a set of sounds, I wanted it to be completely customized. The idea being you could record your own sounds. In a fit of extreme creativity, I called it - "My Sound Board".

<!--more-->

Let me share some of the screens behind the app and then I'll dive into the code. On launch, the app will present you with a list of sounds you currently have or prompt you to record a new one.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot114.png" alt="shot1" width="394" height="700" class="aligncenter size-full wp-image-6562 imgborder" />

Clicking record brings you to a new UI:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot27.png" alt="shot2" width="394" height="700" class="aligncenter size-full wp-image-6563 imgborder" />

On this screen you can record a sound, play it back to test, and name it. The recording interface will be device specific on Android, but on iOS it is a standard UI created by the Media Capture plugin itself. Here it is on my HTC M8.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot34.png" alt="shot3" width="394" height="700" class="aligncenter size-full wp-image-6564 imgborder" />

And here it is on an iPhone.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shotThu2.png" alt="shotThu2" width="395" height="700" class="aligncenter size-full wp-image-6565" />

Once you've saved a few sounds, you can see the list grow.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot44.png" alt="shot4" width="394" height="700" class="aligncenter size-full wp-image-6566 imgborder" />

I then used a cool Ionic feature that makes it easy to add delete buttons to a list. If you swipe right, you get a button:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot52.png" alt="shot5" width="394" height="700" class="aligncenter size-full wp-image-6567 imgborder" />

All I had to do then was wire up the logic to handle deleting. So - about that code - let's take a look. I won't cover the workaround I mentioned in this weeks <a href="http://www.raymondcamden.com/2015/07/27/recording-and-saving-audio-in-cordova-applications">blog post</a>, but I <strong>strongly</strong> suggest reading it. I'll begin with the controller code for the home page:

<pre><code class="language-javascript">.controller('HomeCtrl', function($scope, Sounds, $ionicPlatform) {
  	
	var getSounds = function() {
		console.log('getSounds called');
		Sounds.get().then(function(sounds) {
			console.dir(sounds);
			$scope.sounds = sounds;
		});
	}

	$scope.$on('$ionicView.enter', function(){
		console.log('enter');
		getSounds();
	});
	
	$scope.play = function(x) {
		console.log('play', x);
		Sounds.play(x);	
	}
	
	$scope.delete = function(x) {
		console.log('delete', x);
		Sounds.get().then(function(sounds) {
			var toDie = sounds[x];
			window.resolveLocalFileSystemURL(toDie.file, function(fe) {
				fe.remove(function() {
					Sounds.delete(x).then(function() {
						getSounds();
					});
				}, function(err) {
					console.log("err cleaning up file", err);
				});
			});
		});
	}
	
	$scope.cordova = {% raw %}{loaded:false}{% endraw %};
	$ionicPlatform.ready(function() {
		$scope.$apply(function() {
			$scope.cordova.loaded = true;
		});
	});
		 
})</code></pre>

There's nothing really interesting here except for the $ionicView.enter handler. That's how I handle getting my sounds every time you hit the home page. Technically, that is a bit wasteful. I should only care when I <em>modify</em> my sounds. But this was simpler, and as it stands, if you aren't recording and leaving the home page, then there is no real performance issue. Note that delete is a bit complete. I decided that my Sound service would not worry about files. My RecordCtrl for example handles the file copying that I mentioned in the earlier post. So when I delete, I have to kill the file myself, and then tell the service.

Ok, let's look at the view.

<pre><code class="language-markup">&lt;ion-view view-title=&quot;My Sound Board&quot;&gt;

  &lt;ion-content class=&quot;padding&quot;&gt;

    &lt;div ng-if=&quot;sounds.length &gt; 0&quot;&gt;
			&lt;ion-list show-delete=&quot;false&quot; can-swipe=&quot;true&quot;&gt;
				&lt;ion-item ng-repeat=&quot;sound in sounds&quot; ng-click=&quot;play($index)&quot;&gt;
					{% raw %}{{sound.name}}{% endraw %}
					
					&lt;ion-option-button class=&quot;button-assertive&quot; ng-click=&quot;delete($index)&quot;&gt;
					Delete
					&lt;/ion-option-button&gt;		

				&lt;/ion-item&gt;
			&lt;/ion-list&gt;
    &lt;/div&gt;
	&lt;div ng-if=&quot;sounds.length &lt; 1&quot;&gt;
		&lt;p&gt;
			No sounds yet. Why not record a new one?
		&lt;/p&gt;
	&lt;/div&gt;

    &lt;a href=&quot;#/new&quot; class=&quot;button button-balanced button-block&quot; ng-show=&quot;cordova.loaded&quot;&gt;
      Record New Sound
    &lt;/a&gt;
		 
  &lt;/ion-content&gt;

&lt;/ion-view&gt;</code></pre>

Right away, I can say I don't like the two divs there. I have to think Angular has a way of doing an ELSE type condition. Can anyone suggest an improvement? I absolutely love how Ionic adds the "swipe to show button" logic. I literally just used can-swipe and then defined a button. 

Now let's look at the service.

<pre><code class="language-javascript">angular.module('mysoundboard.services', [])

.factory('Sounds', function($q) {

	var deleteSound = function(x) {
		console.log(&quot;calling deleteSound&quot;);
		var deferred = $q.defer();
		getSounds().then(function(sounds) {
			sounds.splice(x,1);
			localStorage.mysoundboard = JSON.stringify(sounds);
			deferred.resolve();
		});
	
		return deferred.promise;			
	
	}
	
	var getSounds = function() {
		var deferred = $q.defer();
		var sounds = [];
		
		if(localStorage.mysoundboard) {
			sounds = JSON.parse(localStorage.mysoundboard);
		}
		deferred.resolve(sounds);
	
		return deferred.promise;
	}
	
	var playSound = function(x) {
		getSounds().then(function(sounds) {
			var sound = sounds[x];

			/*
			Ok, so on Android, we just work.
			On iOS, we need to rewrite to ../Library/NoCloud/FILE'
			*/
			var mediaUrl = sound.file;
			if(device.platform.indexOf(&quot;iOS&quot;) &gt;= 0) {
				mediaUrl = &quot;../Library/NoCloud/&quot; + mediaUrl.split(&quot;/&quot;).pop();
			}
			var media = new Media(mediaUrl, function(e) {
				media.release();
			}, function(err) {
				console.log(&quot;media err&quot;, err);
			});
			media.play();			
		});		
	}
	
	var saveSound = function(s) {
		console.log(&quot;calling saveSound&quot;);
		var deferred = $q.defer();
		getSounds().then(function(sounds) {
			sounds.push(s);
			localStorage.mysoundboard = JSON.stringify(sounds);
			deferred.resolve();
		});
	
		return deferred.promise;			
	}

	return {
		get:getSounds,
		save:saveSound,
		delete:deleteSound,
		play:playSound
	};
});</code></pre>

I decided to use LocalStorage for my persistence. Normally I recommend against LocalStorage when working with user generated content like this. But I decided that since the user data would be fairly small (a short array), then it was safe. The ease of use of LocalStorage is what sealed the deal. I felt kind of bad using outside stuff like LocalStorage and the Media plugin, but I got over it. 

And that's pretty much it. Here is a video with some sounds I recorded of my kids. The whole reason I even thought of this app was that one of my boys wanted to record his younger sisters being silly, so naturally I made use of them.

<iframe width="480" height="360" src="https://www.youtube.com/embed/7dWsllX7qkw?rel=0" frameborder="0" allowfullscreen></iframe>

Finally, you can find the complete source code for this application here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/mysoundboard">https://github.com/cfjedimaster/Cordova-Examples/tree/master/mysoundboard</a>. I need to add a readme to the folder, and I promise I'll get to that. Eventually.