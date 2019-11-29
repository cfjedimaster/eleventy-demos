---
layout: post
title: "Chaining multiple Cordova File Transfers with ngCordova"
date: "2015-04-13T11:28:39+06:00"
categories: [development,html5,javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2015/04/13/chaining-multiple-cordova-file-transfers-with-ngcordova
guid: 5996
---

One issue you may run into with the <a href="http://plugins.cordova.io/#/package/org.apache.cordova.file-transfer">FileTransfer</a> plugin is that it only lets you do one transfer at a time. You can get around this by using XHR2 (for uploads anyway), but I thought it would be nice to demonstrate how to work with multiple transfers using promises. The FileTransfer plugin does not use promises by default, but luckily you can simply use <a href="http://ngcordova.com/">ngCordova</a> and use the promisified (that's a word) version of the plugin.

<!--more-->

For this demo I'm using Ionic and ngCordova, although in theory you can use ngCordova without Ionic. I created a new application with the blank template. I then used bowser to install ngCordova, which wasn't actually necessary since the CLI supports adding it:

<blockquote class="twitter-tweet" lang="en"><p><a href="https://twitter.com/raymondcamden">@raymondcamden</a> <a href="https://twitter.com/Ionicframework">@Ionicframework</a> Already there! Just need to document it. ionic add ngCordova</p>&mdash; uoʇƃuıʇɹɐɥ ǝʞıɯ (@mhartington) <a href="https://twitter.com/mhartington/status/587641401896218625">April 13, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

I then whipped up the following demo. I don't like putting everything in one JS file for my Angular projects, but since this is just a demo, I guess that's ok. 

<pre><code class="language-javascript">angular.module('starter', ['ionic','ngCordova'])
.config(['$compileProvider', function($compileProvider) {

	   $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?{% raw %}|ftp|{% endraw %}mailto{% raw %}|content|{% endraw %}file|assets-library):/);

}])
.controller('Main', [&quot;$ionicPlatform&quot;, &quot;$cordovaFileTransfer&quot;, &quot;$q&quot;, &quot;$scope&quot;,
    function($ionicPlatform, $cordovaFileTransfer, $q, $scope) {
    console.log(&quot;running Main controller&quot;);
    $scope.images = [];

    $ionicPlatform.ready(function() {
      //resources to download
      var resources = [
        &quot;https://placekitten.com/g/200/300&quot;,
        &quot;https://placekitten.com/g/200/350&quot;,
        &quot;https://placekitten.com/g/400/350&quot;,
        &quot;https://placekitten.com/g/300/200&quot;,
        &quot;https://placekitten.com/g/188/188&quot;
      ];

      var promises = [];

      resources.forEach(function(i,x) {
        var targetPath = cordova.file.documentsDirectory + &quot;image&quot;+x+&quot;.jpg&quot;;
        promises.push($cordovaFileTransfer.download(i, targetPath, {}, true));
      });

      $q.all(promises).then(function(res) {
        console.log(&quot;in theory, all done&quot;);
        for(var i=0; i&lt;res.length; i++) {
          $scope.images.push(res[i].nativeURL);
        }
      });
    });

}])
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
});</code></pre>

Ok, let's take this from the top. First off - the config block is just there to allow for File based URIs in my dom. Angular is a bit anal (ok, secure) about what it allows for image urls. The next bit is my controller, Main. I've got 5 URLs for different kittens at placekitten.com. I create an array to store my promises, and then just loop over the URLs. For each one I call the ngCordova-wrapped file transfer download method. Since it returns a promise I end up with an array of promises. 

Finally, I use Angular's all method for their $q library to simply say, "Do this when they are all done." I then push the final URLs into an array that is used in my view. Here's the index.html:

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width&quot;&gt;
    &lt;title&gt;&lt;/title&gt;

    &lt;link href=&quot;lib/ionic/css/ionic.css&quot; rel=&quot;stylesheet&quot;&gt;
    &lt;link href=&quot;css/style.css&quot; rel=&quot;stylesheet&quot;&gt;

    &lt;!-- IF using Sass (run gulp sass first), then uncomment below and remove the CSS includes above
    &lt;link href=&quot;css/ionic.app.css&quot; rel=&quot;stylesheet&quot;&gt;
    --&gt;

    &lt;!-- ionic/angularjs js --&gt;
    &lt;script src=&quot;lib/ionic/js/ionic.bundle.js&quot;&gt;&lt;/script&gt;

    &lt;script src=&quot;lib/ngCordova/dist/ng-cordova.js&quot;&gt;&lt;/script&gt;
    &lt;script src=&quot;cordova.js&quot;&gt;&lt;/script&gt;

    &lt;!-- your app's js --&gt;
    &lt;script src=&quot;js/app.js&quot;&gt;&lt;/script&gt;
  &lt;/head&gt;
  &lt;body ng-app=&quot;starter&quot;&gt;

    &lt;ion-pane&gt;
      &lt;ion-header-bar class=&quot;bar-stable&quot;&gt;
        &lt;h1 class=&quot;title&quot;&gt;Ionic Blank Starter&lt;/h1&gt;
      &lt;/ion-header-bar&gt;
      &lt;ion-content ng-controller=&quot;Main&quot;&gt;
        &lt;div ng-repeat=&quot;img in images&quot;&gt;
          &lt;img ng-src=&quot;{% raw %}{{img}}{% endraw %}&quot;&gt;
        &lt;/div&gt;
      &lt;/ion-content&gt;
    &lt;/ion-pane&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>

And that's it. The result is a set of cat pictures, which, to be honest, is what all apps should end up with:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/iOS-Simulator-Screen-Shot-Apr-13-2015-11.24.03-AM.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/iOS-Simulator-Screen-Shot-Apr-13-2015-11.24.03-AM.png" alt="iOS Simulator Screen Shot Apr 13, 2015, 11.24.03 AM" width="422" height="750" class="alignnone size-full wp-image-5997" /></a>

Similar code would work for uploads as well. Again, you do not need to use Ionic/ngCordova for this. You could create your own promises and do this by hand with a bit more work. (I've got a vide on <a href="https://www.youtube.com/watch?v=a4ud8oH3h-8">deferreds and jQuery</a> that may make this easier for you.)