---
layout: post
title: "Working with the Clipboard in Cordova apps"
date: "2015-11-11T14:14:51+06:00"
categories: [development,javascript,mobile]
tags: [cordova]
banner_image: 
permalink: /2015/11/11/working-with-the-clipboard-in-cordova-apps
guid: 7089
---

Earlier this week a friend of mine on Facebook noticed something odd. Facebook recognizes when you have URLs in your clipboard:

<!--more-->

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot11.png" alt="shot1" width="500" height="355" class="aligncenter size-full wp-image-7090 imgborder" />

Now - I think we can have a good discussion about whether or not this is creepy (I have some thoughts at the end!), but I was curious about how one would do this in a Cordova application. Turns out - it's quite easy. VersoSolutions has a Cordova plugin that provides both read and write access to the clipboard for Windows Phone, iOS, and Android devices: <a href="https://github.com/VersoSolutions/CordovaClipboard">https://github.com/VersoSolutions/CordovaClipboard</a>. Even nicer, <a href="http://ngcordova.com/docs/plugins/clipboard/">ngCordova</a> supports it too. So with that in mind, I built a simple demo.

The app is just one textarea and nothing more:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/Simulator-Screen-Shot-Nov-11-2015-2.04.07-PM.png" alt="Simulator Screen Shot Nov 11, 2015, 2.04.07 PM" width="500" height="229" class="aligncenter size-full wp-image-7091 imgborder" />

But if you copy a URL into your clipboard, the app will recognize it when your return:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/Simulator-Screen-Shot-Nov-11-2015-2.05.20-PM.png" alt="Simulator Screen Shot Nov 11, 2015, 2.05.20 PM" width="500" height="279" class="aligncenter size-full wp-image-7092 imgborder" />

And clicking the button will insert the text:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/Simulator-Screen-Shot-Nov-11-2015-2.05.26-PM.png" alt="Simulator Screen Shot Nov 11, 2015, 2.05.26 PM" width="500" height="187" class="aligncenter size-full wp-image-7093 imgborder" />

Not exactly rocket science, but you get the idea. So here's how I built it. First, the index.html page.

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width&quot;&gt;
    &lt;title&gt;CopyPasteDemo&lt;/title&gt;

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
  
		&lt;script src=&quot;lib/ngCordova/dist/ng-cordova.js&quot;&gt;&lt;/script&gt;
	&lt;/head&gt;
  &lt;body ng-app=&quot;starter&quot;&gt;

    &lt;ion-pane ng-controller=&quot;MainCtrl&quot;&gt;
      &lt;ion-header-bar class=&quot;bar-stable&quot;&gt;
        &lt;h1 class=&quot;title&quot;&gt;Ionic Blank Starter&lt;/h1&gt;
      &lt;/ion-header-bar&gt;
      &lt;ion-content&gt;
				
				&lt;div class=&quot;list list-inset&quot;&gt;
					&lt;label class=&quot;item item-input&quot;&gt;
						&lt;textarea placeholder=&quot;Comments&quot;ng-model=&quot;comments&quot;&gt;&lt;/textarea&gt;
					&lt;/label&gt;
					&lt;div ng-show=&quot;hasURL&quot;&gt;
						&lt;button class=&quot;button button-full button-assertive&quot; ng-click=&quot;pasteURL()&quot;&gt;
							You have copied a URL. Add it?
						&lt;/button&gt;
					&lt;/div&gt;
				&lt;/div&gt;
						
				
				
      &lt;/ion-content&gt;
    &lt;/ion-pane&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>

There's nothing particularly interesting here outside of the button which only shows up when a URL is available. Now let's look at the code.

<pre><code class="language-javascript">// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a &lt;body&gt; attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])

.controller('MainCtrl', function($scope,$ionicPlatform,$cordovaClipboard,$interval) {

	$scope.haURL = false;
	$scope.comments = &quot;&quot;;
	
	var theURL = &quot;&quot;;
	
	$ionicPlatform.ready(function() {
	
		//Begin looking for stuff in the clipboard
		$interval(checkForURL, 4*1000);

	});

	var isURL = function(s) {
		//Credit: http://stackoverflow.com/a/3809435
		var expr = /https?:\/\/(www\.)?[-a-zA-Z0-9@:{% raw %}%._\+~#=]{2,256}{% endraw %}\.[a-z]{% raw %}{2,6}{% endraw %}\b([-a-zA-Z0-9@:%_\+.~#?&amp;//=]*)/i;
		var regex = new RegExp(expr);
		var result = s.match(regex);
		if(result) return true;
		return false;
	};
	
	var checkForURL = function() {
		console.log('Checking the clipboard...');
		$cordovaClipboard
			.paste()
			.then(function (result) {
				console.log(result);
				if(result &amp;&amp; isURL(result)) {
					$scope.hasURL = true;
					theURL = result;
				} else {
					$scope.hasURL = false;
				}
			}, function (e) {
				// error - do nothing cuz we don't care
			});
		
	};
	
	$scope.pasteURL = function() {
		console.log(&quot;Paste &quot;+theURL);
		$scope.comments += theURL;		
		//remove from clippboard
		$cordovaClipboard.copy('').then(function () {
			$scope.theURL = '';
		}, function () {
			// error
		});	
		$scope.hasURL = false;
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

I begin by setting up an interval that runs every 4 seconds. That was somewhat arbitrary and actually a bit slow. Also, it runs forever and should be cleared when the user navigates away from this particular view. (If the application had more than one view of course.)

The function called every 4 seconds, checkForURL, uses the ngCordova wrapper for the clipboard plugin and simply grabs the text. If it can find any, and it is a URL, then we enable the button. 

The pasteURL function simply handles adding the URL and clearing the clipboard. Finally, it hides the button. 

You can find the complete source here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/copypaste/www">https://github.com/cfjedimaster/Cordova-Examples/tree/master/copypaste/www</a>.

So... let's spend a minute or so talking about the privacy aspects of this. As I mentioned earlier, my friend was surprised by this and a bit put off as he didn't even know Facebook was doing this. I can certainly see that point. I kind of figure that if the operating system itself allows for apps to read the clipboard than it must be "Ok", but I wonder how many people know this? Obviously it would be trivial to take that clipboard content and Ajax it up to a server. For "research" purposes of course. What do you think?