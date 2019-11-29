---
layout: post
title: "Working with IBM MobileFirst and Ionic - Bootstrapping"
date: "2015-03-24T16:01:04+06:00"
categories: [development,javascript,mobile]
tags: [ionic,mobilefirst]
banner_image: 
permalink: /2015/03/24/working-with-ibm-mobilefirst-and-ionic-bootstraping
guid: 5878
---

Yesterday I described how to make use of the <a href="http://www.ionicframework.com">Ionic</a> framework and IBM's <a href="http://www.ibm.com/mobilefirst/us/en/">MobileFirst</a> platform. Today I'm going to build on that first post and talk about bootstrapping. Specifically - how can you coordinate the use of your application with the Cordova deviceReady and MobileFirst initialization routines. 

<!--more-->

To give some context, I first talked about this issue last August in a blog post, <a href="http://www.raymondcamden.com/2014/08/16/Ionic-and-Cordovas-DeviceReady-My-Solution">Ionic and Cordova’s DeviceReady – My Solution</a>. In that post, I described how I wanted to coordinate the first view of my Ionic app with Cordova's deviceReady event. The solution I used there was to create a view that acted a bit like a splash screen. When the deviceReady event fired, I then pushed the user to the <i>real</i> initial page of the application and ensured they never went back to that initial temporary page.

At the time, that felt like a bit of a hack, but it also seemed sensible. However, other people suggested another approach. You can simply tell Angular to <i>not</i> bootstrap until deviceReady is fired. For whatever reason, that didn't seem as sensible as my approach back then, but now... yeah... now that makes sense. So how would we do this in a MobileFirst application?

The first thing to note is that within MobileFirst and hybrid applications, running <code>WL.Client.init</code> and using the success handler, <code>wlCommonInit</code>, gives you the same behavior as listening for deviceReady in a "regular" Cordova application. So basically - wlCommonInit <i>is</i> deviceReady. With that in mind, I began by removing the automatic bootstrap from my code. I changed:

<pre><code class="language-markup">&lt;body ng-app=&quot;starter&quot;&gt;</code></pre>

to

<pre><code class="language-markup">&lt;body&gt;</code></pre>

Then I modified my wlCommonInit to do a manual bootstrap:

<pre><code class="language-javascript">var wlInitOptions = {
	
	// # To disable automatic hiding of the splash screen uncomment this property and use WL.App.hideSplashScreen() API
	//autoHideSplash: false
		 
};

if (window.addEventListener) {
	window.addEventListener('load', function() {% raw %}{ WL.Client.init(wlInitOptions); }{% endraw %}, false);
} else if (window.attachEvent) {
	window.attachEvent('onload',  function() {% raw %}{ WL.Client.init(wlInitOptions); }{% endraw %});
}

function wlCommonInit(){
	
	// Common initialization code goes here
	var env = WL.Client.getEnvironment();
    if(env === WL.Environment.IPHONE || env === WL.Environment.IPAD){
        document.body.classList.add('platform-ios'); 
    } else if(env === WL.Environment.ANDROID){
        document.body.classList.add('platform-android'); 
    }

    angular.element(document).ready(function() {
	    angular.bootstrap(document, ['starter']);
    });
	
}</code></pre>

This works perfectly. But there's a twist. By default, an application doesn't connect to your MobileFirst server until you tell it to. This lets you delay or even skip actually connecting unless you need too. I definitely needed too, so I added that code in and moved my bootstrap code to there:

<pre><code class="language-javascript">var wlInitOptions = {
	
	&#x2F;&#x2F; # To disable automatic hiding of the splash screen uncomment this property and use WL.App.hideSplashScreen() API
	&#x2F;&#x2F;autoHideSplash: false
		 
};

if (window.addEventListener) {
	window.addEventListener(&#x27;load&#x27;, function() {% raw %}{ WL.Client.init(wlInitOptions); }{% endraw %}, false);
} else if (window.attachEvent) {
	window.attachEvent(&#x27;onload&#x27;,  function() {% raw %}{ WL.Client.init(wlInitOptions); }{% endraw %});
}

function wlCommonInit(){
	
	&#x2F;&#x2F; Common initialization code goes here
	var env = WL.Client.getEnvironment();
    if(env === WL.Environment.IPHONE || env === WL.Environment.IPAD){
        document.body.classList.add(&#x27;platform-ios&#x27;); 
    } else if(env === WL.Environment.ANDROID){
        document.body.classList.add(&#x27;platform-android&#x27;); 
    }

    WL.Client.connect({
	onSuccess:function() {
		console.log(&quot;Connected to MFP&quot;);
		angular.element(document).ready(function() {
			angular.bootstrap(document, [&#x27;starter&#x27;]);
		});			
	}, 
	onFailure:function(f) {
		console.log(&quot;Failed to connect to MFP, not sure what to do now.&quot;, f);	
	}
    });

}</code></pre>

The WL.Client.connect method does exactly what you expect - connect to the MobileFirst server. Seems like a small mod, right? But when I did this, I noticed something bad.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/Untitled21.gif"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/Untitled21.gif" alt="Untitled2" width="383" height="685" class="alignnone size-full wp-image-5879" /></a>

Can you see it? It is a FOUC (Flash of Unstyled Content). There's a simple fix for this though. We can simply use the splash screen to hide the site until things are ready. (And credit for suggesting this approach goes to Carlos again!) One of the initialization options you can provide is to <i>not</i> hide the splash screen. You can then use the JavaScript API to hide it. Here is that version.

<pre><code class="language-javascript">var wlInitOptions = {
	
	&#x2F;&#x2F; # To disable automatic hiding of the splash screen uncomment this property and use WL.App.hideSplashScreen() API
	autoHideSplash: false
		 
};

if (window.addEventListener) {
	window.addEventListener(&#x27;load&#x27;, function() {% raw %}{ WL.Client.init(wlInitOptions); }{% endraw %}, false);
} else if (window.attachEvent) {
	window.attachEvent(&#x27;onload&#x27;,  function() {% raw %}{ WL.Client.init(wlInitOptions); }{% endraw %});
}

function wlCommonInit(){
	
	&#x2F;&#x2F; Common initialization code goes here
	var env = WL.Client.getEnvironment();
    if(env === WL.Environment.IPHONE || env === WL.Environment.IPAD){
        document.body.classList.add(&#x27;platform-ios&#x27;); 
    } else if(env === WL.Environment.ANDROID){
        document.body.classList.add(&#x27;platform-android&#x27;); 
    }

	WL.Client.connect({
		onSuccess:function() {
			console.log(&quot;Connected to MFP&quot;);
			angular.element(document).ready(function() {
				WL.App.hideSplashScreen();
				angular.bootstrap(document, [&#x27;starter&#x27;]);
			});			
		}, 
		onFailure:function(f) {
			console.log(&quot;Failed to connect to MFP, not sure what to do now.&quot;, f);	
		}
	});

}</code></pre>

In the code snippet above, you can see the new option added to <code>wlInitOptions</code> and then the call to <code>WL.App.hideSplashScreen</code> to hide the screen. This worked too - but don't forget that the mobile browser simulator does not have a splash screen! At first I thought this workaround wasn't working, but then I tested in the iPhone Simulator and it worked perfectly.

So - thoughts on this approach? Does it make sense? I've recorded a video of this process that you can watch below. I'm also attaching a copy of my common folder here: <a href="http://www.raymondcamden.com/demos/2015/mar/24/common.zip">Download</a>

<iframe width="853" height="480" src="https://www.youtube.com/embed/CizxwdFAQ4s?rel=0" frameborder="0" allowfullscreen></iframe>