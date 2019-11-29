---
layout: post
title: "Working with IBM MobileFirst and the Ionic Framework"
date: "2015-03-23T09:42:58+06:00"
categories: [development,javascript,mobile]
tags: [ionic,mobilefirst]
banner_image: 
permalink: /2015/03/23/working-with-ibm-mobilefirst-and-the-ionic-framework
guid: 5857
---

<strong>Edit on March 30, 2015: Please see my follow up here for a few small tweaks: <a href="http://www.raymondcamden.com/2015/03/30/working-with-ibm-mobile-first-and-ionic-a-follow-up">Working with IBM Mobile First and Ionic – a follow up</a></strong>

A few weeks ago I <a href="http://www.raymondcamden.com/2015/02/16/working-with-hybrid-applications-and-ibm-mobilefirst">blogged</a> about using hybrid mobile applications and <a href="http://www.ibm.com/mobilefirst/us/en/">MobileFirst</a>. Today I'm going to demonstrate how to work with <a href="http://www.ionicframework.com">Ionic</a> and MobileFirst. What follows is a combination of the steps necessary for bringing any existing Cordova application into MobileFirst along with things necessary for Ionic specifically. As before, credit goes to my coworker <a href="https://twitter.com/csantanapr">Carlos Santana</a> for figuring these steps out. I've also recorded a video of the process you can watch at the end of this blog post.

<!--more-->

<h2>Create, and Start, your MF Server</h2>
To begin, I'm assuming you've got a MobileFirst server up and running already with a hybrid application. If you don't remember how to do that, please read my <a href="http://www.raymondcamden.com/2015/02/16/working-with-hybrid-applications-and-ibm-mobilefirst">earlier blog post</a> where I walk you through the commands you have to enter at the command line. 

I always take baby steps, so once you have your server running, confirm everything is kosher by opening up the console and running your app in the Mobile Browser Simulator.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/02/mf4.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/02/mf4.png" alt="mf4" width="800" height="412" class="alignnone size-full wp-image-5677"></a>

<h2>Set up the Bits</h2>
Ok, at the command line, or in Explorer/Finder, move the common folder elsewhere. Remember that the common folder is where your web assets live. You're going to want to copy some bits from this folder so for now don't delete it. 

Next, grab a copy of Ionic. I'm assuming you've already installed Ionic, but if not, follow the <a href="http://ionicframework.com/getting-started/">installation instructions</a>. Ionic's CLI will normally create a new project as a Cordova project, but all we want are the web assets. The CLI has a flag for that, --no-cordova. You can create a new application without a full Cordova project like so:

<pre><code>
ionic start --no-cordova ioniccode blank
</code></pre>

Notice I used the blank template and a folder called ioniccode. Open that folder up and you will see the following assets:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/shot13.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/shot13.png" alt="shot1" width="238" height="170" class="alignnone size-full wp-image-5859" /></a>

Copy that www folder into the root of your app folder and rename it common. Your app folder should then look something like this:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/shot22.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/shot22.png" alt="shot2" width="269" height="220" class="alignnone size-full wp-image-5860" /></a>

Again, both my original common folder (common-orig in the screen shot above) and the Ionic folder (ioniccode) can be removed later. As I said, I'm keeping them in so I can copy some bits over.

<h2>Update the Code</h2>

Ok, now you need to update the code a bit. Your common folder is a copy of the Ionic "Blank" starter, but what I describe here would apply to the other templates as well. 

First, we need to make some modifications to the index.html file:

<ul>
<li>You need to comment out (or just remove) cordova.js. This is necessary because MobileFirst will inject the script tag automatically.
<pre><code class="language-javascript">&lt;!--
&lt;script src=&quot;cordova.js&quot;&gt;&lt;&#x2F;script&gt;
--&gt;</code></pre></li>
<li>You need to copy in MobileFirst's jQuery alias.
<pre><code class="language-javascript">&lt;script&gt;window.$ = window.jQuery = WLJQ;&lt;&#x2F;script&gt;</code></pre></li>
<li>You need to add a new file to include the MobileFirst initialization stuff. Technically you don't need to add a new file, you could modify the existing app.js, but I think it makes sense to break this out into a new file. The default MobileFirst template uses three files, but we can combine them into one. I'm calling mine wlInit.js. MobileFirst used to be called Worklight, and a lot of the code uses "WL" as an acronym, so I used it in my file as well.
<pre><code class="language-javascript">&lt;script src=&quot;js&#x2F;wlInit.js&quot;&gt;&lt;&#x2F;script&gt;</code></pre>
</li>
</ul>

Here is the completely updated index.html file.

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width&quot;&gt;
    &lt;title&gt;&lt;&#x2F;title&gt;

    &lt;link href=&quot;lib&#x2F;ionic&#x2F;css&#x2F;ionic.css&quot; rel=&quot;stylesheet&quot;&gt;
    &lt;link href=&quot;css&#x2F;style.css&quot; rel=&quot;stylesheet&quot;&gt;
	&lt;script&gt;window.$ = window.jQuery = WLJQ;&lt;&#x2F;script&gt;

    &lt;!-- IF using Sass (run gulp sass first), then uncomment below and remove the CSS includes above
    &lt;link href=&quot;css&#x2F;ionic.app.css&quot; rel=&quot;stylesheet&quot;&gt;
    --&gt;

    &lt;!-- ionic&#x2F;angularjs js --&gt;
    &lt;script src=&quot;lib&#x2F;ionic&#x2F;js&#x2F;ionic.bundle.js&quot;&gt;&lt;&#x2F;script&gt;

    &lt;!-- cordova script (this will be a 404 during development) --&gt;
	  &lt;!--
    &lt;script src=&quot;cordova.js&quot;&gt;&lt;&#x2F;script&gt;
		--&gt;
    &lt;!-- your app&#x27;s js --&gt;
    &lt;script src=&quot;js&#x2F;app.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;script src=&quot;js&#x2F;wlInit.js&quot;&gt;&lt;&#x2F;script&gt;
  &lt;&#x2F;head&gt;
  &lt;body ng-app=&quot;starter&quot;&gt;

    &lt;ion-pane&gt;
      &lt;ion-header-bar class=&quot;bar-stable&quot;&gt;
        &lt;h1 class=&quot;title&quot;&gt;Ionic Blank Starter&lt;&#x2F;h1&gt;
      &lt;&#x2F;ion-header-bar&gt;
      &lt;ion-content&gt;
      &lt;&#x2F;ion-content&gt;
    &lt;&#x2F;ion-pane&gt;
  &lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

Next, open up style.css. This is blank (except for a comment) in the Ionic template, but we need to add the following style declaration:

<pre><code class="language-css">html, body {
    height: 100%;
}</code></pre>

This is required because the application ends up with a 0% height when run under MobileFirst. Odd - but just go with it.

Now open app.js. In the run() portion there is code that works with the Ionic keyword plugin. For now, we're going to simply disable it. In a later blog post I'll talk about working with plugins and MobileFirst, but for now, you can safely comment it out.

<pre><code class="language-javascript">// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
	  /*
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
	*/
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})</code></pre>

Ok, so for the last part, we need to create wlInit.js. As I said, this is code that handles initializing MobileFirst stuff. In later blog posts, I'll demonstrate some of those cool features with Ionic, but for now, we're going to keep the file pretty simple. You can copy and paste the contents of initOptions.js and main.js directly into your new file. (And again, this is a personal preference. If you want to keep them in two separate files, that's fine too, just be sure to include them both back in index.html.) 

We need to do one more small tweak. When using Ionic and a "regular" Cordova project, there is a hook that applies a style for Android and iOS. We don't have those hooks under MobileFirst, so we have to do it by hand, but that's easy enough. The MobileFirst JavaScript API has a <a href="http://www-01.ibm.com/support/knowledgecenter/SSHS8R_6.3.0/com.ibm.worklight.apiref.doc/html/refjavascript-client/html/WL.Client.html%23getEnvironment">getEnvironment</a> function that returns information about the running environment. We can use that to sniff iPhone and iPad versus Android. (And again, credit for this goes to Carlos.) Here is the entire file with that modification within wlCommonInit.

<pre><code class="language-javascript">&#x2F;&#x2F; Uncomment the initialization options as required. For advanced initialization options please refer to IBM MobileFirst Platform Foundation Knowledge Center 
 
 var wlInitOptions = {
	
	&#x2F;&#x2F; # To disable automatic hiding of the splash screen uncomment this property and use WL.App.hideSplashScreen() API
	&#x2F;&#x2F;autoHideSplash: false,
		 
	&#x2F;&#x2F; # The callback function to invoke in case application fails to connect to MobileFirst Server
	&#x2F;&#x2F;onConnectionFailure: function (){},
	
	&#x2F;&#x2F; # MobileFirst Server connection timeout
	&#x2F;&#x2F;timeout: 30000,
	
	&#x2F;&#x2F; # How often heartbeat request will be sent to MobileFirst Server
	&#x2F;&#x2F;heartBeatIntervalInSecs: 20 * 60,
	
	&#x2F;&#x2F; # Enable FIPS 140-2 for data-in-motion (network) and data-at-rest (JSONStore) on iOS or Android.
	&#x2F;&#x2F;   Requires the FIPS 140-2 optional feature to be enabled also.
	&#x2F;&#x2F;enableFIPS : false,
	
	&#x2F;&#x2F; # The options of busy indicator used during application start up
	&#x2F;&#x2F;busyOptions: {% raw %}{text: &quot;Loading...&quot;}{% endraw %}
};

if (window.addEventListener) {
	window.addEventListener(&#x27;load&#x27;, function() {% raw %}{ WL.Client.init(wlInitOptions); }{% endraw %}, false);
} else if (window.attachEvent) {
	window.attachEvent(&#x27;onload&#x27;,  function() {% raw %}{ WL.Client.init(wlInitOptions); }{% endraw %});
}

function wlCommonInit(){
	&#x2F;*
	 * Use of WL.Client.connect() API before any connectivity to a MobileFirst Server is required. 
	 * This API should be called only once, before any other WL.Client methods that communicate with the MobileFirst Server.
	 * Don&#x27;t forget to specify and implement onSuccess and onFailure callback functions for WL.Client.connect(), e.g:
	 *    
	 *    WL.Client.connect({
	 *    		onSuccess: onConnectSuccess,
	 *    		onFailure: onConnectFailure
	 *    });
	 *     
	 *&#x2F;
	
	&#x2F;&#x2F; Common initialization code goes here
	var env = WL.Client.getEnvironment();
    if(env === WL.Environment.IPHONE || env === WL.Environment.IPAD){
        document.body.classList.add(&#x27;platform-ios&#x27;); 
    } else if(env === WL.Environment.ANDROID){
        document.body.classList.add(&#x27;platform-android&#x27;); 
    }
}</code></pre>

And that's it. Once you build/deploy (and don't forget you can do that with <code>mfp bd</code>), you should then see your MobileFirst application using the awesome power of Ionic!

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/shot32.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/shot32.png" alt="shot3" width="835" height="580" class="alignnone size-full wp-image-5864" /></a>

I've attached my copy of the common folder to this blog entry. Also, Carlos created a GitHub repo with modified versions of all the Ionic templates here: <a href="https://github.com/csantanapr/mfp-ionic-templates">https://github.com/csantanapr/mfp-ionic-templates</a>.

Finally, you can watch a video of this entire process here. Sit back and enjoy the silky sounds of my caffeine-fueled voice. 

<iframe width="853" height="480" src="https://www.youtube.com/embed/_VQ7IeUARS8?rel=0" frameborder="0" allowfullscreen></iframe>

<a href="http://www.raymondcamden.com/demos/2015/mar/23/mobilefirst-ionic-common.zip">Download Zip</a>