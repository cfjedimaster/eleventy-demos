---
layout: post
title: "Some initial thoughts on building desktop apps with Ionic and Electron"
date: "2015-07-23T11:34:56+06:00"
categories: [development,html5,javascript]
tags: [ionic]
banner_image: 
permalink: /2015/07/23/some-initial-thoughts-on-building-desktop-apps-with-ionic-and-electron
guid: 6514
---

Earlier this week I was working with a desktop app (which I can't talk about... yet) that had an Ionic-look to it. On a whim, I opened up the package contents and discovered it was an <a href="http://electron.atom.io/">Electron</a> app. If you've never heard of it, Electron is an open source project that lets you build desktop apps (for Mac, Windows, and Linux) using web technologies. The last time I did anything in this space was with Adobe AIR, which was years ago. I've played with Electron a tiny bit, but I had not tried to use Ionic with it so I thought I'd give it a shot. Before digging in, I want to bring up two very important points.

<!--more-->

First, I've spent maybe three hours looking into this subject, and obviously have not built a production application yet. This post focuses on some of the things I ran into while testing things out, but it is safe to assume more issues probably exist. As time goes on I'll probably blog other things to consider and I hope my readers will share their own discoveries.

Second, while Electron makes it easy to build a desktop app, I cannot stress enough that you need to remember that app development is not the same as web development. When I talk about Cordova and how it makes it easy to use the web to build mobile apps, I try very hard to remind people that building a mobile app is nothing like building a web page. Repeat that after me: "Building a mobile app is nothing like building a web page."

Ok, so with that out of the way, let's talk shop.

<h2>The Basics</h2>

The first thing I did was to see what would happen if I took a generic Ionic app and just plain ran it under Electron. To do that, I created a new Ionic app and used the -no-cordova flag. If you aren't aware, you can tell the Ionic CLI to create a new project and skip including all the Cordova bits. You <i>still</i> get a bunch of extra stuff like the bower file and gulp script, so I simply copied out the www folder.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot18.png" alt="shot1" width="261" height="149" class="aligncenter size-full wp-image-6515 imgborder" />

Then, following the <a href="http://electron.atom.io/docs/v0.29.0/tutorial/quick-start/">Electron quick start</a>, I added a package.json file and main.js. For my main.js, I copied their code exactly, but removed the bits to open dev tools. (More on that in a bit.)

<pre><code class="language-javascript">var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({% raw %}{width: 800, height: 600}{% endraw %});

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});</pre></code>

Here's how my directory structure looked. And again, this is the result of taking the www contents from Ionic's default template (tabs) and adding in the files Electron requires.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot24.png" alt="shot2" width="255" height="197" class="aligncenter size-full wp-image-6516 imgborder" />

At this point I went and just tried running it with the Electron CLI. Surprisingly, it just plain worked. In fact, even the $ionicPlatform.ready fired. As far as I can tell, it noticed that cordova.js didn't load and assumed I was running the app on a desktop browser. 

So as I said, it just worked, which was cool, but then I began digging in and figuring out bits and pieces of code I needed to rip out and modify.

The first thing I did was remove cordova.js since - obviously - this was no longer a Cordova application. Here's the index.html for my app with that modification. I also added a title value. This is going to come into play in a bit.

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width&quot;&gt;
    &lt;title&gt;My App&lt;/title&gt;

    &lt;link href=&quot;lib/ionic/css/ionic.css&quot; rel=&quot;stylesheet&quot;&gt;
    &lt;link href=&quot;css/style.css&quot; rel=&quot;stylesheet&quot;&gt;

    &lt;script src=&quot;lib/ionic/js/ionic.bundle.js&quot;&gt;&lt;/script&gt;

    &lt;script src=&quot;js/app.js&quot;&gt;&lt;/script&gt;
    &lt;script src=&quot;js/controllers.js&quot;&gt;&lt;/script&gt;
    &lt;script src=&quot;js/services.js&quot;&gt;&lt;/script&gt;
  &lt;/head&gt;
  
  &lt;body ng-app=&quot;starter&quot;&gt;
    &lt;ion-nav-bar class=&quot;bar-stable&quot;&gt;
      &lt;ion-nav-back-button&gt;
      &lt;/ion-nav-back-button&gt;
    &lt;/ion-nav-bar&gt;

    &lt;ion-nav-view&gt;&lt;/ion-nav-view&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>

Next, inside app.js I completely emptied out the run block. We don't need to test for the keyboard plugins, and ionicPlatform.ready does not make sense in this content. Electron lets you do 'Desktop stuff', but doesn't make you wait for an event in your code. 

I then noticed something odd. Here's the app running:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot32.png" alt="shot3" width="500" height="375" class="aligncenter size-full wp-image-6517" />

And here it is with another tab selected:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot43.png" alt="shot4" width="500" height="375" class="aligncenter size-full wp-image-6518" />

Did you notice the title? The title of the app changes as I change my view. Now, that could be nice, but to me, it doesn't make sense. The app should have a core title, like "My App", the one I used in html earlier, and the header could continue to be more context-driven. Unfortunately, the code that updates the title is built into Ionic itself and can't be disabled. I raised the issue in an Ionic chat room, and Leandro Zubrezki spent some time helping me out. The following solution is 100% his idea.

In order to prevent the title from updating, you can listen for the $ionicView.afterEnter event and stop it. So for example:

<pre><code class="language-javascript">$scope.$on('$ionicView.afterEnter', function(ev, data) { 
      ev.stopPropagation();
});</code></pre>

This can be used in your controllers, but quickly gets repetitive. While talking with Leandro, he suggested using the root level state to define a controller and run it from there. Here is that top level state from the Tabs demo:

<pre><code class="language-javascript">.state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller:'TestCtrl'
})</code></pre>

The change here is the addition of TestCtrl (not the best name). I then added this to the controllers.js file:

<pre><code class="language-javascript">.controller('TestCtrl', function($scope) {
  
  console.log('test ctrl');
  $scope.$on('$ionicView.afterEnter', function(ev, data) { 
      ev.stopPropagation();
  });

})</code></pre>

And that was it! It worked fine at that point. 

One more tip. Don't forget you can enable dev tools for your app from the menu.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot51.png" alt="shot5" width="800" height="619" class="aligncenter size-full wp-image-6519" />

By default this will appear in the app. Don't forget you can 'pop it' out using the icon highlighted below.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot71.png" alt="shot7" width="500" height="375" class="aligncenter size-full wp-image-6520" />

That icon actually has three states - right, bottom, and popped out. So if it looks like this:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot81.png" alt="shot8" width="343" height="119" class="aligncenter size-full wp-image-6521" />

Clicking will just send it to the bottom. Click and hold to open a menu and select the icon I showed earlier. Using this, I was able to have my dev tools nicely separate from the app which made debugging easier. I also made use of the Reload option too so I didn't have to restart the app from the command line. 

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot91.png" alt="shot9" width="452" height="700" class="aligncenter size-full wp-image-6522 imgborder" />

Speaking of the command line, it is worth noting that console.log messages will show up there too.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot101.png" alt="shot10" width="800" height="301" class="aligncenter size-full wp-image-6523" />

Whew - that was a lot. So if you want to see the code behind the modified Tabs demo, you can find it here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/ionic_electron_tabs">https://github.com/cfjedimaster/Cordova-Examples/tree/master/ionic_electron_tabs</a>

<h2>A Demo</h2>

With a basic understanding of how to make this work in place, I decided to try a desktop version of my <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/rssreader_ionic">RSS Reader</a>. Here it is up and running:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot112.png" alt="shot11" width="600" height="450" class="aligncenter size-full wp-image-6524 imgborder" />
 
<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot122.png" alt="shot12" width="600" height="450" class="aligncenter size-full wp-image-6525 imgborder" />

Not the most thrilling app, but let me discuss how I changed it for Electron. 

I began by making the modifications I mentioned above - removing cordova.js and ionicPlatform.ready. I then needed to do the "title fix" as I mentioned before. This was a bit weird for me as my app did not already have an abstract state on top. I ran into issues with this and got some great help from Mike Hartington. Here is my new app.js with the change to state. 

<pre><code class="language-javascript">(function() {
/* global angular,window,cordova,console */

	angular.module('starter', ['ionic','rssappControllers','rssappServices'])

	.constant(&quot;settings&quot;, {
		title:&quot;Raymond Camden's Blog&quot;,
		rss:&quot;http://feeds.feedburner.com/raymondcamdensblog&quot;
	})

	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

		$stateProvider
		    .state('root', {
			    url: '/root',
			    abstract: true,
			    controller:'RootCtrl',
				template:'&lt;ion-nav-view /&gt;'
			  })
			.state('root.Home', {
				url: '/home',
				controller: 'HomeCtrl',
				templateUrl: 'partials/home.html'
			})
			.state('root.Entries', {
				url: '/entries',
				controller: 'EntriesCtrl',
				templateUrl: 'partials/entries.html',
			})
			.state('root.Entry', {
				url: '/entry/:index',
				controller: 'EntryCtrl',
				templateUrl: 'partials/entry.html',
			})
			.state('root.Offline', {
				url: '/offline',
				templateUrl: 'partials/offline.html'
			});

		$urlRouterProvider.otherwise(&quot;/root/home&quot;);

	}])

	.run(['$ionicPlatform','$rootScope','$state', function($ionicPlatform, $rootScope, $state) {

		$rootScope.goHome = function() {
			$state.go(&quot;root.Entries&quot;);
		};

	}]);

}());</code></pre>

Essentially, my root state has a blank template because that's required in Angular. Well, not blank, but a template with just a nav-view. All I really wanted was my root controller. I won't show the code as it is the same event hack I described above.

Next, I had to make another modification. My RSS Reader app used the Network Information Cordova plugin (and ngCordova) to check to see if you were online. This is somewhat simpler in Electron - you just use navigator.onLine:

<pre><code class="language-javascript">if(navigator.onLine) {
	rssService.getEntries(settings.rss).then(function(entries) {
		$ionicLoading.hide();
		$rootScope.entries = entries;
		$state.go("root.Entries");
	});

} else {
	console.log("offline, push to error");
	$ionicLoading.hide();
	$state.go("root.Offline");
}</code></pre>

So far so good. My final change was to the "Read Entry on Site" button. In the Cordova demo, this uses the InAppBrowser. But in Electron, we can actually use a shell command to open a url. The cool thing is that this will then use the user's desired browser to open a new tab:

<pre><code class="language-javascript">$scope.readEntry = function(e) {
	var shell = require('shell');
	shell.openExternal(e.link);
};</code></pre>

Pretty cool, right? If you want the full source code, you may find it here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/rssreader_electron">https://github.com/cfjedimaster/Cordova-Examples/tree/master/rssreader_electron</a>

<h2>Conclusion</h2>

All in all, I think this is an interesting idea. Ionic provides a great UI, and it looks just as good on desktop as it does mobile, and obviously the power of Angular to help architect your application is just as useful here. Certainly there are issues to keep in mind when building a desktop app that won't apply to mobile, but they are things you can address. I'd love to hear what people think, and if you build something (or have built something), please share it in the comments below!