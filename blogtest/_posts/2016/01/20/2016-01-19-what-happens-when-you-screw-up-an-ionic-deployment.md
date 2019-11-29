---
layout: post
title: "What happens when you screw up an Ionic Deployment?"
date: "2016-01-20T09:48:27+06:00"
categories: [javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2016/01/20/what-happens-when-you-screw-up-an-ionic-deployment
guid: 7406
---

Last week I had the honor of presenting at the <a href="http://www.meetup.com/Ionic-NYC-Meetup/">Ionic NYC</a> meetup. While talking about the <a href="http://docs.ionic.io/docs/deploy-overview">Deploy</a> service, someone asked what would happen if you sent bad code to the deployment. I thought that was a great question and I did exactly that in front of the audience so we could all see.

<!--more-->

For folks not familiar with what Ionic's Deploy service does, it basically lets you push updates to your application without doing a formal app store approval. There are restrictions of course. You can't add (or remove) plugins. But basically anything under the www is fair game. Things like typo fixing, new images, audio assets will work fine. You can even add completely new features by updating your app's JavaScript and templates. 

And yes - this <strong>is allowed</strong> by both Apple and Google. You don't want to abuse this though. If your app is a "Kitten Viewer" and you push an update that changes it to a post-apocalyptic shooter (still involving kittens) then you will most likely get a slap down. (If someone has created a post-apocalyptic kitten game, please let me know.)

There is a bit of a setup to enable this feature (fully documented via the link above) that takes roughly five minutes, and the code is really simple considering how complex the actions are. Here is an example taken from the docs that demonstrates how to check for and actually do an update.

<pre><code class="language-javascript">
var deploy = new Ionic.Deploy();
  
// Update app code with new release from Ionic Deploy
$scope.doUpdate = function() {
  deploy.update().then(function(res) {
    console.log('Ionic Deploy: Update Success! ', res);
  }, function(err) {
    console.log('Ionic Deploy: Update error! ', err);
  }, function(prog) {
    console.log('Ionic Deploy: Progress... ', prog);
  });
};

// Check Ionic Deploy for new code
$scope.checkForUpdates = function() {
  console.log('Ionic Deploy: Checking for updates');
  deploy.check().then(function(hasUpdate) {
    console.log('Ionic Deploy: Update available: ' + hasUpdate);
    $scope.hasUpdate = hasUpdate;
  }, function(err) {
    console.error('Ionic Deploy: Unable to check for updates', err);
  });
}
</code></pre>

In general, it just plain works, and works really well! Using the code above, if you run doUpdate(), then the app will grab the assets and automatically reload the app. (And if you are curious, you can also get an update and <i>not</i> automatically reload. You've got a lot of options actually - check the docs!)

So what happens when you screw up? Like - skip testing? No one ever skips testing, right? I built an incredible simple app with the grand total of two buttons:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/Simulator-Screen-Shot-Jan-20-2016-9.27.09-AM.png" alt="Simulator Screen Shot Jan 20, 2016, 9.27.09 AM" width="375" height="307" class="aligncenter size-full wp-image-7407 imgborder" />

The red button handles both checking, and installing, an update. The green button calls a service. 

<pre><code class="language-javascript">
angular.module('starter', ['ionic','ionic.service.core','appService'])

.controller('MainCtrl', function($scope,cowbellService) {

	$scope.doUpdate = function() {
		
		//automatically deploy
		var deploy = new Ionic.Deploy();
		
		// Check Ionic Deploy for new code
		deploy.check().then(function(hasUpdate) {     
			console.log('Ionic Deploy: Update available: ' + hasUpdate);
			if(hasUpdate) {
				console.log('Ok, lets do an update.');
				deploy.update().then(function(res) {
					console.log('Ionic Deploy: Update Success! ', res);
				}, function(err) {
					console.log('Ionic Deploy: Update error! ', err);
				}, function(prog) {
					console.log('Ionic Deploy: Progress... ', prog);
				});
								
			}
		}, function(err) {
			console.error('Ionic Deploy: Unable to check for updates', err);
		});
	};
		
	$scope.doCowbell = function() {
		alert(cowbellService.getCowbell());	
	};
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova &amp;&amp; window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
</code></pre>

By the way - I used an alert in the code because it was quick and dirty. In a real app, avoid alert and use the Dialog plugin. The service is incredibly simple:

<pre><code class="language-javascript">
angular.module('appService', [])
.factory('cowbellService', function($http,$q) {
	
	return {

		getCowbell: function() {
			return "You rang the cowbell!";
		}
		
	};
});
</code></pre>

Alright - so as a first test, let's break the service.

<pre><code class="language-javascript">
angular.module('appService', [])
.factory('cowbellService', function($http,$q) {
	
	return {

		getCowbell: function() {
			return "You rang the cowbell!"+x;
		}
		
	};
});
</code></pre>

In the code above, I've added a runtime error to the service that will only be a problem when the user clicks the button. I deployed via the CLI: <code>ionic upload --note="screw up" --deploy="production"</code>. I then clicked the red button, noted the update in my console, and tried the green button. As expected, clicking the green button will no longer work, and in the console, the error is clearly visible.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/shot1-3.png" alt="shot1" width="750" height="286" class="aligncenter size-full wp-image-7408" />

Ok, so in theory, not the end of the world. You can deploy a fix, or roll back, and life goes on. But what if you <i>really</i> screw up? In my main JavaScript file, I added a syntax error on top. I then deployed that - ran the update - and...

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2016/01/shot2-2.png" alt="shot2" width="750" height="619" class="aligncenter size-full wp-image-7409" />

So yeah, at this point, you're screwed. You can't do an update anymore as the core functionality of the entire app is broken. You would need to do a "real" app store update to correct it.

To be absolutely clear - this is not any kind of bug on Ionic's side. This is completely my fault. That being said, I can say that the Ionic folks are looking into ways to help prevent stuff like this from happening. Or you could actually just test your code. Just an idea - not trying to be pushy.

Another option to consider is making use of <a href="http://docs.ionic.io/docs/deploy-channels">deploy channels</a>. As you can guess, these are 'groups' that let you specify who should get an update. You could make a channel just for yourself and your own device and send it just there.

Anyway, I hope this was interesting, and between you and me, I like breaking stuff. Here is a video where I go through the same process and you can see everything in action.

<iframe width="640" height="360" src="https://www.youtube.com/embed/H9f4Q5kzobk" frameborder="0" allowfullscreen></iframe>

p.s. Thanks again to <a href="http://twitter.com/ericbobbitt">@ericbobbitt</a> for help with this post and my understanding of Ionic services in general!