---
layout: post
title: "Using Remote Logging with Ionic and IBM MobileFirst"
date: "2015-03-31T16:26:58+06:00"
categories: [development,mobile]
tags: [ionic,mobilefirst]
banner_image: 
permalink: /2015/03/31/using-remote-logging-with-ionic-and-ibm-mobilefirst
guid: 5926
---

As the latest in my series of blog posts on <a href="http://ionicframework.com">Ionic</a> and <a href="http://www.ibm.com/mobilefirst/us/en/">MobileFirst</a>, today I'm going to demonstrate how to use the remote logging feature of MobileFirst with Ionic. I recommend you read my <a href="http://www.raymondcamden.com/2015/03/23/working-with-ibm-mobilefirst-and-the-ionic-framework">initial post</a> as  quick guide on how to run Ionic apps inside the MobileFirst platform.

<!--more-->

The "Remote Logging" feature is really just that - a logging service that stores data on your server (in this case, MobileFirst). What's nice from the client-side perspective is that it is incredibly simple to use. You send a log message and that's it. The API worries about <i>when</i> to send it and tries to wait till an opportune time before sending a bunch of log data. If you want, you can force it to send logs immediately, and by default, it will also send existing logs on application startup up. Let's begin by taking a look at the code. 

I created an instance of the Ionic tabs template, one of the default "starter" templates you can use with the Ionic CLI. Just to give you some context, here are some screen shots of the app in action. (And again, <i>all</i> of this comes from the template.)
<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/shot15.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/shot15.png" alt="shot1" width="281" height="500" class="alignnone size-full wp-image-5935" /></a>

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/shot23.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/shot23.png" alt="shot2" width="281" height="500" class="alignnone size-full wp-image-5936" /></a>

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/shot33.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/shot33.png" alt="shot3" width="281" height="500" class="alignnone size-full wp-image-5937" /></a>

I decided to create a service that would log when each tab was activated for the first time. I also create a log event for loading a chat detail (see the second screen shot above) and for toggling the radio button (see the third screen shot). I began by modifying the services.js file from the template. 

<pre><code class="language-javascript">.factory('Logger', function() {

	var logger = WL.Logger.create({% raw %}{autoSendLogs:true}{% endraw %});

	return {
		log:function(s) {
			logger.log('log', s);
		}
	}
})</code></pre>

Ok, not exactly rocket science, but hey, easy is good, right? I began by creating an instance of WL.Logger. You can find the full docs for that <a href="http://www-01.ibm.com/support/knowledgecenter/SSHS8R_7.0.0/com.ibm.worklight.apiref.doc/html/refjavascript-client/html/WL.Logger.html?cp=SSHS8R_7.0.0%2F9-0-0-1-20">here</a>. I set autoSendLogs to true, which does <strong>not</strong> mean that logs are sent immediately, but rather that I don't have to manually send them. This may be a bit confusing at first, but it's really just the API being <i>very</i> conservative about network traffic. Me setting it to true means that the service will send the logs automatically, but it will still wait until it feels like it has enough data to make it worthwhile, <i>or</i> until you restart the app and detects existing data. 

You can be fairly complex about the logging you do - both with the log level, the types of messages, and other metadata. If you plan on making heavy use of this service, you'll want to be pretty precise with your logs so you can search them easier later. I'm a simple guy so I used the simplest version possible. 

Back in my controllers.js file, I then added calls to this service in various places where it made sense for my demo.

<pre><code class="language-javascript">angular.module(&#x27;starter.controllers&#x27;, [])

.controller(&#x27;DashCtrl&#x27;, function($scope, Logger) {

	Logger.log(&quot;DashCtrl opened&quot;);

})
.controller(&#x27;ChatsCtrl&#x27;, function($scope, Chats, Logger) {
	$scope.chats = Chats.all();
	$scope.remove = function(chat) {
		Chats.remove(chat);
	}

	Logger.log(&quot;ChatsCtrl opened&quot;);

})

.controller(&#x27;ChatDetailCtrl&#x27;, function($scope, $stateParams, Chats, Logger) {
  $scope.chat = Chats.get($stateParams.chatId);
  Logger.log(&quot;Chat &quot;+$stateParams.chatId+ &quot; loaded.&quot;);
})

.controller(&#x27;AccountCtrl&#x27;, function($scope, Logger) {
	$scope.settings = {
		enableFriends: true
	};

	$scope.$watchCollection(&quot;settings&quot;, function(newValue, oldValue) {
		Logger.log(&quot;Enable Friends set to &quot;+$scope.settings.enableFriends);
	});
	
	Logger.log(&quot;AccountCtrl opened&quot;);

});</code></pre>

You can see where I've injected Logger and then make calls to the log method. One interesting thing about this service is that when you use the Mobile Browser Simulator (see my <a href="http://www.raymondcamden.com/2015/02/20/using-the-mobilefirst-mobile-browser-simulator">post</a> for a demo) the log messages will be sent to dev tools. That's handy! But this is <i>only</i> done in the Mobile Browser Simulator. When you test with XCode, for example, the messages are available in the XCode debug output but will not show up if you debug with Safari Remote Debugging. If you really wanted it to show up there then in my specific case I'd just modify the service to add a console.log. 

Ok, so that's the code, how does the server side look? When you have the MobileFirst console open, you can go to analytics by clicking the pretty little chart icon in the upper right nav.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/mf1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/mf1.png" alt="mf1" width="800" height="487" class="alignnone size-full wp-image-5930" /></a>

In this dashboard, click Search to bring up the Client Log Search form:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/mf2.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/mf2.png" alt="mf2" width="800" height="437" class="alignnone size-full wp-image-5931" /></a>

At this point, it is pretty much what you expect. Set your filters and go crazy:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/mf3.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/mf3.png" alt="mf3" width="800" height="430" class="alignnone size-full wp-image-5932" /></a>

Each log entry can be expanded for even more data:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/mi4.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/mi4.png" alt="mi4" width="800" height="402" class="alignnone size-full wp-image-5933" /></a>

So - all in all - a fairly cool service - and only a small part of MobileFirst. Let me know what you think. I've also created a video demonstrating this.

<iframe width="853" height="480" src="https://www.youtube.com/embed/pBPqfdmF0DI?rel=0" frameborder="0" allowfullscreen></iframe>