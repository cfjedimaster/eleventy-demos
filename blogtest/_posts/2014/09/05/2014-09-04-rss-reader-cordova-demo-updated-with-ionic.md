---
layout: post
title: "RSS Reader Cordova demo updated with Ionic"
date: "2014-09-05T10:09:00+06:00"
categories: [development,javascript,mobile]
tags: []
banner_image: 
permalink: /2014/09/05/rss-reader-cordova-demo-updated-with-ionic
guid: 5301
---

<p>
A few years back I wrote a series of blog entries (linked to at the bottom) that discussed building a simple RSS reader application with PhoneGap/Cordova. The application used two variables, a simple name and RSS url, to drive an application that would grab the RSS feed, make a list, and let you read individual entries in the app. The final version of the app made use of the (non-core at the time) ChildBrowser plugin to let you read the entry on the site itself. (This was especially useful for RSS feeds like mine that show partial content in RSS.) I decided to update this application to make use of <a href="http://www.ionicframework.com">Ionic</a>. It isn't an incredibly complex app, but I thought folks would be interested in the update.
</p>
<!--more-->

<strong>Update on June 22, 2015: I recently looked over this code and made some big changes. See the update here: <a href="http://www.raymondcamden.com/2015/06/22/an-update-to-my-rss-reader-built-with-ionic">An update to my RSS Reader built with Ionic</a></strong>

<p>
First, let's discuss some of the architecture changes at a high level.
</p>

<ul>
<li>The previous version of the application used jQuery Mobile. jQuery Mobile handed both the UI and the Single Page Architecture of the application. Now Ionic will handle that both. Ionic has its own UI and it uses Angular beneath the hood. Once again I'll remind folks - I'm an Angular noob.</li>
<li>The previous version of the application had no support for offline mode. It <i>did</i> have support for the RSS feed being done. It would check for a LocalStorage copy of the entries. For this version I decided to add "proper" offline checking but just ignore RSS errors. I was maybe being a bit lazy in that regards but I'm definitely happy with the offline check now. Currently it just gives you a nice error and - well - that's it. You can't say "Check Again" or some such. But it is definitely an improvement. </li>
<li>In terms of UI, I didn't get too complex. I think more could be done probably, but for now, I'm happy with it.</li>
<li>Yesterday I <a href="http://www.raymondcamden.com/2014/9/4/Ionic-120-Released">blogged</a> about Ionic 1.2.0's new LiveReload feature. While it is <strong>very</strong> cool, it has an issue you should be aware of. Imagine your app, like mine, has an error state where it sends you to some path, like /error, and that's all you can do. When you test this under Ionic's LiveReload, as you edit your code the reload feature does a reload... on that URL. What I found was that I was "stuck" in /error and I couldn't get out. Now - for release - that's what I want. But I had expected LiveReload to reload the app <i>as a whole</i>, i.e. to go to /. To work around this, I added a few hacks to my code. I'll explain them when I get to the code. They are very short hacks so I won't bother removing them from the zip/GitHub repo, but you should be aware of why they are there. I filed a bug with Ionic on it: <a href="https://github.com/driftyco/ionic/issues/2144">https://github.com/driftyco/ionic/issues/2144</a>.</li>
</ul>

<p>
Ok, before we jump into the code, let's look at some screen shots!
</p>

<p>
On load, it uses an Ionic Loading widget while it checks for offline status and parses the RSS feed.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s122.png" />
</p>

<p>
After everything is checked, the entries are then displayed using Ionic's List control.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s218.png" />
</p>

<p>
Clicking an entry displays the RSS entry. Depending on the RSS URL, this may be a complete entry or a partial one. This - in particular - is where I think a bit more could be done to make it look nicer.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s310.png" />
</p>

<p>
Finally, we use the now core plugin, InAppBrowser, to support reading the entry on the web site.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s44.png" />
</p>

<p>
Ok, let's look at the code! (And yet another reminder - I'm new to Ionic and Angular.) First, the home page. Of special interest here is that I'm using ngCordova and Google's JavaScript API.
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width&quot;&gt;
    &lt;title&gt;RSS Reader&lt;&#x2F;title&gt;

    &lt;link href=&quot;lib&#x2F;ionic&#x2F;css&#x2F;ionic.css&quot; rel=&quot;stylesheet&quot;&gt;
    &lt;link href=&quot;css&#x2F;style.css&quot; rel=&quot;stylesheet&quot;&gt;
	  
    &lt;script src=&quot;lib&#x2F;ionic&#x2F;js&#x2F;ionic.bundle.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;script src=&quot;lib&#x2F;ng-cordova.js&quot;&gt;&lt;&#x2F;script&gt;
	  
    &lt;!-- cordova script (this will be a 404 during development) --&gt;
    &lt;script src=&quot;cordova.js&quot;&gt;&lt;&#x2F;script&gt;

	&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;https:&#x2F;&#x2F;www.google.com&#x2F;jsapi&quot;&gt;&lt;&#x2F;script&gt;

    &lt;script src=&quot;js&#x2F;app.js&quot;&gt;&lt;&#x2F;script&gt;
    &lt;script src=&quot;js&#x2F;controllers.js&quot;&gt;&lt;&#x2F;script&gt;
  &lt;&#x2F;head&gt;
  &lt;body ng-app=&quot;starter&quot;&gt;
	  
  	&lt;ion-nav-bar class=&quot;bar-positive&quot;&gt;
		&lt;ion-nav-buttons side=&quot;left&quot;&gt;
			&lt;button class=&quot;button&quot; ng-click=&quot;goHome()&quot; ng-show=&quot;notHome&quot;&gt;
			Home
			&lt;&#x2F;button&gt;
		&lt;&#x2F;ion-nav-buttons&gt;
	&lt;&#x2F;ion-nav-bar&gt;

  	&lt;ion-nav-view&gt;
	&lt;&#x2F;ion-nav-view&gt;

  &lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

<p>
Ok, now let's look at app.js. The big change here from core Ionic was to remove $ionicPlatform.ready from app.js. As I've <a href="http://www.raymondcamden.com/2014/8/16/Ionic-and-Cordovas-DeviceReady--My-Solution">blogged</a> before, you have a race condition between Cordova's DeviceReady and your Angular app actually starting. So I decided to use my first controller as a way to bootstrap that particular issue.
</p>

<pre><code class="language-javascript">(function() {
&#x2F;* global angular,window,cordova,console *&#x2F;
	
	angular.module(&#x27;starter&#x27;, [&#x27;ionic&#x27;,&#x27;ngCordova&#x27;,&#x27;rssappControllers&#x27;])

	.config([&#x27;$stateProvider&#x27;, &#x27;$urlRouterProvider&#x27;, function($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state(&#x27;Home&#x27;, {
				url: &#x27;&#x2F;&#x27;,
				controller: &#x27;HomeCtrl&#x27;, 
				templateUrl: &#x27;partials&#x2F;home.html&#x27;
			})
			.state(&#x27;Entries&#x27;, {
				url: &#x27;&#x2F;entries&#x27;, 
				controller: &#x27;EntriesCtrl&#x27;, 
				templateUrl: &#x27;partials&#x2F;entries.html&#x27;,
			})
			.state(&#x27;Entry&#x27;, {
				url: &#x27;&#x2F;entry&#x2F;:index&#x27;,
				controller: &#x27;EntryCtrl&#x27;, 
				templateUrl: &#x27;partials&#x2F;entry.html&#x27;,
			})
			.state(&#x27;Offline&#x27;, {
				url: &#x27;&#x2F;offline&#x27;, 
				templateUrl: &#x27;partials&#x2F;offline.html&#x27;
			});

		$urlRouterProvider.otherwise(&quot;&#x2F;&quot;);

	}])

	.run(function($ionicPlatform, $rootScope, $location) {

		&#x2F;&#x2F;EDIT THESE LINES
		&#x2F;&#x2F;Title of the blog
		$rootScope.TITLE = &quot;Raymond Camden&#x27;s Blog&quot;;
		&#x2F;&#x2F;RSS url
		$rootScope.RSS = &quot;http:&#x2F;&#x2F;www.raymondcamden.com&#x2F;rss.cfm&quot;;

		$rootScope.goHome = function() {
			$location.path(&#x27;&#x2F;entries&#x27;);
		};
		
	});

}());</code></pre>

<p>
Next - the controllers file. This is all pretty standard I think - nothing special. Again though I used a hack to detect when Ionic reloaded my app and I wasn't on the home page. Since the home page loads RSS entries, if they don't exist in the root scope, I just relocate back home. This worked for my app, it may not work for yours.
</p>

<pre><code class="language-javascript">(function() {
&#x27;use strict&#x27;;
&#x2F;* global window,angular,console,cordova,google *&#x2F;

	angular.module(&#x27;rssappControllers&#x27;, [])

	.controller(&#x27;HomeCtrl&#x27;, [&#x27;$ionicPlatform&#x27;, &#x27;$scope&#x27;, &#x27;$rootScope&#x27;, &#x27;$cordovaNetwork&#x27;, &#x27;$ionicLoading&#x27;, &#x27;$location&#x27;, function($ionicPlatform, $scope, $rootScope, $cordovaNetwork, $ionicLoading, $location) {
		
		$ionicLoading.show({
      		template: &#x27;Loading...&#x27;
		});
		
		function initialize() {
			console.log(&#x27;googles init called&#x27;);	
			var feed = new google.feeds.Feed($rootScope.RSS);
			
			feed.setNumEntries(10);
			feed.load(function(result) {
				$ionicLoading.hide();
				if(!result.error) {
					$rootScope.entries = result.feed.entries;
					console.log(&#x27;move&#x27;);
					$location.path(&#x27;&#x2F;entries&#x27;);
				} else {
					console.log(&quot;Error - &quot;+result.error.message);
					&#x2F;&#x2F;write error
				}
			});

		}
		
		$ionicPlatform.ready(function() {

			console.log(&quot;Started up!!&quot;);

			if(window.cordova &amp;&amp; window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}
			if(window.StatusBar) {
				window.StatusBar.styleDefault();
			}

			if($cordovaNetwork.isOnline()) {
				google.load(&quot;feeds&quot;, &quot;1&quot;,{% raw %}{callback:initialize}{% endraw %});
			} else {
				console.log(&quot;offline, push to error&quot;);
				$ionicLoading.hide();
				$location.path(&#x27;&#x2F;offline&#x27;);

			}

		});

	}])

	.controller(&#x27;EntriesCtrl&#x27;, [&#x27;$scope&#x27;, &#x27;$rootScope&#x27;, &#x27;$location&#x27;, function($scope, $rootScope, $location) { 
		console.log(&#x27;EntriesCtrl called&#x27;);
		&#x2F;*
		handle issue with Ionic CLI reloading
		*&#x2F;
		if(!$rootScope.entries) $location.path(&#x27;&#x2F;&#x27;);
		
		$rootScope.notHome = false;
		
		$scope.entries = $rootScope.entries;
		console.log(JSON.stringify($scope.entries[0]));

	}])
	
	.controller(&#x27;EntryCtrl&#x27;, [&#x27;$scope&#x27;, &#x27;$rootScope&#x27;, &#x27;$location&#x27;, &#x27;$stateParams&#x27;, function($scope, $rootScope, $location, $stateParams) { 
		console.log(&#x27;EntryCtrl called&#x27;);

		&#x2F;*
		handle issue with Ionic CLI reloading
		*&#x2F;
		if(!$rootScope.entries) $location.path(&#x27;&#x2F;&#x27;);

		$rootScope.notHome = true;
		
		$scope.index = $stateParams.index;
		$scope.entry = $rootScope.entries[$scope.index];
		
		$scope.readEntry = function(e) {
			window.open(e.link, &quot;_blank&quot;);
		};
		
	}]);

	
}());</code></pre>

<p>
So that's pretty much it. I have a few templates, but only the entry list is that interesting. Here it is.
</p>

<pre><code class="language-markup">&lt;ion-view title=&quot;{% raw %}{{TITLE}}{% endraw %}&quot;&gt;

	&lt;ion-content class=&quot;padding&quot;&gt;

		&lt;ion-list class=&quot;list list-inset&quot;&gt;

			&lt;ion-item ng-repeat=&quot;entry in entries&quot; href=&quot;#&#x2F;entry&#x2F;{% raw %}{{$index}}{% endraw %}&quot;&gt;
				{% raw %}{{entry.title}}{% endraw %}
			&lt;&#x2F;ion-item&gt;

		&lt;&#x2F;ion-list&gt;

	&lt;&#x2F;ion-content&gt;
	
&lt;&#x2F;ion-view&gt;

</code></pre>

<p>
All in all - it was cool to rewrite this. I still wish there was an easier solution for the DeviceReady issue (I swear it seems like I'm the only person annoyed by this) and the reloading, but in general, I <i>really</i> like this version better. I've still got respect for jQuery Mobile (and, ahem, <a href="http://www.amazon.com/dp/1782167897/ref=as_sl_pc_tf_lc?tag=raymondcamden-20&camp=14573&creative=327641&linkCode=as1&creativeASIN=1782167897&adid=1DJXVN87Y0VJGP253MDF&&ref-refURL=http{% raw %}%3A%{% endraw %}2F{% raw %}%2Fwww.raymondcamden.com%{% endraw %}2Fpage.cfm%2Fabout-me">sell a good book</a> on it ;), but Angular just feels much better for my Cordova apps, and Ionic's UI feels easier to use as well.
</p>

<p>
You can find the complete code under my main Cordova Examples repo, <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/rssreader_ionic">https://github.com/cfjedimaster/Cordova-Examples/tree/master/rssreader_ionic</a>.
</p>