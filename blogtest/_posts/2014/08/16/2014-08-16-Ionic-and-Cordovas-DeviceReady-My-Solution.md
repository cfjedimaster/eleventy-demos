---
layout: post
title: "Ionic and Cordova's DeviceReady - My Solution"
date: "2014-08-16T13:08:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2014/08/16/Ionic-and-Cordovas-DeviceReady-My-Solution
guid: 5288
---

<p>
Folks know that I've been madly in love with the <a href="http://ionicframework.com/">Ionic framework</a> lately, but I've run into an issue that I'm having difficulty with. I thought I'd blog about the problem and demonstrate a solution that worked for me. To be clear, I think my solution is probably <strong>wrong</strong>. It works, but it just doesn't <i>feel</i> right. I'm specifically sharing this blog entry as a way to start the discussion and get some feedback. On the slim chance that what I'm showing <i>is</i> the best solution... um... yes... I planned that. I'm brilliant. 
</p>
<!--more-->
<h2>The Problem</h2>

<p>
So let's begin by discussing the problem. Given a typical Ionic app, your Angular code will have a .run method that listens for the ionicPlatform's ready event. Here is an example from the "base" starter app (<a href="https://github.com/driftyco/ionic-app-base/blob/master/www/js/app.js">https://github.com/driftyco/ionic-app-base/blob/master/www/js/app.js</a>):
</p>

<pre><code class="language-javascript">&#x2F;&#x2F; Ionic Starter App

&#x2F;&#x2F; angular.module is a global place for creating, registering and retrieving Angular modules
&#x2F;&#x2F; &#x27;starter&#x27; is the name of this angular module example (also set in a &lt;body&gt; attribute in index.html)
&#x2F;&#x2F; the 2nd parameter is an array of &#x27;requires&#x27;
angular.module(&#x27;starter&#x27;, [&#x27;ionic&#x27;])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    &#x2F;&#x2F; Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    &#x2F;&#x2F; for form inputs)
    if(window.cordova &amp;&amp; window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      &#x2F;&#x2F; Set the statusbar to use the default style, tweak this to
      &#x2F;&#x2F; remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
})</code></pre>

<p>
The ionicPlatform.ready event is called when Cordova's deviceready event fires. When run on a desktop, it is fired when on window.load. Ok, so in my mind, this is where I'd put code that's normally in a document.ready block. So far so good.
</p>

<p>
Now let's imagine you want to use a plugin, perhaps the Device plugin. Imagine you want to simply copy a value to $scope so you can display it in a view. If that controller/view is the <i>first</i> view in your application, you end up with a race condition. Angular is going to display your view and fire off ionicPlatform.ready asynchronously. That isn't a bug of course, but it raises the question. If you want to make use of Cordova plugin features, and your application depends on it <i>immediately</i>, how do you handle that easily?
</p>

<p>
One way would be to remove ng-app from the DOM and bootstrap Angular yourself. I've done that... once before and I see how it makes sense. But I didn't want to use that solution this time as I wanted to keep using ionicPlatform.ready. I assumed (and I could be wrong!) that I couldn't keep that and remove the ng-app bootstraping.
</p>

<p>
So what I did was to add an intermediate view to my application. A simple landing page. I modified the stateProvider to add a new state and then made it the default. In my ionicPlatform.ready, I use the location service to do a move to the previously default state.
</p>

<pre><code class="language-javascript">.run(function($ionicPlatform,$location,$rootScope) {
  $ionicPlatform.ready(function() {
    &#x2F;&#x2F; Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    &#x2F;&#x2F; for form inputs)
    if(window.cordova &amp;&amp; window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      &#x2F;&#x2F; org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

	  $location.path(&#x27;&#x2F;tab&#x2F;dash&#x27;);
	  $rootScope.$apply();
  });
})</code></pre>

<p>
This seemed to do the trick. My controller code that's run for the views after this was able to use Cordova plugins just fine. How about a real example?
</p>

<h2>The Demo</h2>

<p>
One of the more recent features to land in Ionic is <a href="http://ionicframework.com/docs/components/#striped-style-tabs">striped-style tabs</a>. This is an Android-style tab UI and it will be applied automatically to apps running on Android. The difference is a bit subtle when the tabs are on the bottom:
</p>

<p>
<img src="https://static.raymondcamden.com/images/defaulttabs 2.png" />
</p>

<p>
But when moved to the top using tabs-top, it is a bit more dramatic.
</p>

<p>
<img src="https://static.raymondcamden.com/images/tabsontop.png" />
</p>

<p>
Ok... cool. But I wondered - how can I get tabs on top <i>just</i> for Android? While I'm not one of those people who believe that UI elements have to be in a certain position on iOS versus Android, I was curious as to how I'd handle this programmatically.
</p>

<p>
Knowing that it was trivial to check the Device plugin, and having a way now to delay the view until my plugins were loaded, I decided to use the approach described above to ensure I could access the platform before that particular view loaded.
</p>

<p>
Here is the app.js file I used, modified from the tabs starter template.
</p>


<pre><code class="language-javascript">&#x2F;&#x2F; Ionic Starter App

&#x2F;&#x2F; angular.module is a global place for creating, registering and retrieving Angular modules
&#x2F;&#x2F; &#x27;starter&#x27; is the name of this angular module example (also set in a &lt;body&gt; attribute in index.html)
&#x2F;&#x2F; the 2nd parameter is an array of &#x27;requires&#x27;
&#x2F;&#x2F; &#x27;starter.services&#x27; is found in services.js
&#x2F;&#x2F; &#x27;starter.controllers&#x27; is found in controllers.js
angular.module(&#x27;starter&#x27;, [&#x27;ionic&#x27;, &#x27;starter.controllers&#x27;, &#x27;starter.services&#x27;])

.run(function($ionicPlatform,$location,$rootScope) {
  $ionicPlatform.ready(function() {
    &#x2F;&#x2F; Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    &#x2F;&#x2F; for form inputs)
    if(window.cordova &amp;&amp; window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      &#x2F;&#x2F; org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

	  $location.path(&#x27;&#x2F;tab&#x2F;dash&#x27;);
	  $rootScope.$apply();
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  &#x2F;&#x2F; Ionic uses AngularUI Router which uses the concept of states
  &#x2F;&#x2F; Learn more here: https:&#x2F;&#x2F;github.com&#x2F;angular-ui&#x2F;ui-router
  &#x2F;&#x2F; Set up the various states which the app can be in.
  &#x2F;&#x2F; Each state&#x27;s controller can be found in controllers.js
  $stateProvider

    &#x2F;&#x2F; setup an abstract state for the tabs directive
  	.state(&#x27;home&#x27;, {
		url:&quot;&#x2F;home&quot;,
		templateUrl:&#x27;templates&#x2F;loading.html&#x27;,
		controller:&#x27;HomeCtrl&#x27;
	})
    .state(&#x27;tab&#x27;, {
      url: &quot;&#x2F;tab&quot;,
      abstract: true,
      templateUrl: function() {
		  if(window.device.platform.toLowerCase().indexOf(&quot;android&quot;) &gt;= 0) {
			  return &quot;templates&#x2F;tabs_android.html&quot;;			  
		  } else {
			  return &quot;templates&#x2F;tabs.html&quot;;
		  }
	  },
    })

    &#x2F;&#x2F; Each tab has its own nav history stack:

    .state(&#x27;tab.dash&#x27;, {
      url: &#x27;&#x2F;dash&#x27;,
      views: {
        &#x27;tab-dash&#x27;: {
          templateUrl: &#x27;templates&#x2F;tab-dash.html&#x27;,
          controller: &#x27;DashCtrl&#x27;
        }
      }
    })

    .state(&#x27;tab.friends&#x27;, {
      url: &#x27;&#x2F;friends&#x27;,
      views: {
        &#x27;tab-friends&#x27;: {
          templateUrl: &#x27;templates&#x2F;tab-friends.html&#x27;,
          controller: &#x27;FriendsCtrl&#x27;
        }
      }
    })
    .state(&#x27;tab.friend-detail&#x27;, {
      url: &#x27;&#x2F;friend&#x2F;:friendId&#x27;,
      views: {
        &#x27;tab-friends&#x27;: {
          templateUrl: &#x27;templates&#x2F;friend-detail.html&#x27;,
          controller: &#x27;FriendDetailCtrl&#x27;
        }
      }
    })

    .state(&#x27;tab.account&#x27;, {
      url: &#x27;&#x2F;account&#x27;,
      views: {
        &#x27;tab-account&#x27;: {
          templateUrl: &#x27;templates&#x2F;tab-account.html&#x27;,
          controller: &#x27;AccountCtrl&#x27;
        }
      }
    });

  &#x2F;&#x2F; if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise(&#x27;&#x2F;home&#x27;);

});

</code></pre>

<p>
You can see where I use the location.path mechanism after the ionicPlatform.ready event has fired. You can also see where I sniff the device platform to determine which template to run. tabs_android.html is the exact same as tabs.html - but with the tabs-top class applied (*). The biggest drawback here is that the application would error when run on the desktop. That could be avoided by sniffing for the lack of window.device and just setting it to some default: <code>window.device = {% raw %}{platform : "ios"}{% endraw %};</code>
</p>

<p>
So that's it. What do you think? I have to imagine there is a nicer way of handling this. Maybe I'm being lazy but I want to use Ionic's killer directives and UX stuff <i>along with</i> Cordova plugins and not have to use an awkward workaround like this.
</p>

<p>* A quick footnote. I noticed that if I tried to add tabs-top to the ion-tabs directive, it never worked. For example, this is what I tried first: <code>&lt;ion-tabs ng-class=&quot;{% raw %}{&#x27;tabs-top&#x27;:settings.isAndroid}{% endraw %}&quot;&gt;</code> I used code in my controller that always set it to true (I wasn't worried about the device plugin yet) and it never actually updated the view. It's like the controller scope couldn't modify the view for some odd reason.