---
layout: post
title: "ngCordova Released"
date: "2014-06-04T11:06:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2014/06/04/ngCordova-Released
guid: 5237
---

<p>
So I know (think?) there is a significant portion of my audience who do not use Twitter, and for those of you who have avoided that trap (don't let anyone fool you, it is a trap), you may have missed me recently raving about the <a href="http://ionicframework.com/">Ionic Framework</a>. Briefly, Ionic is a way to work with Cordova/PhoneGap apps using Angular directives. It has an <strong>incredible</strong> collection of UI and UX controls that can be helpful to you. I'm still new to Angular and I've found their controls easy to use. I plan on blogging about this a bit more later, but I wanted to tell you about something <strong>else</strong> these folks created - <a href="http://ngcordova.com/">ngCordova</a>.
</p>
<!--more-->
<p>
<img src="https://static.raymondcamden.com/images/ngCordova.png" style="float:left;margin-right:10px;margin-bottom:10px" />
</p>

<p>
ngCordova is a set of Angular directives focused on Cordova APIs. For folks who already use Angular, this provides an easier and more "Angular-ish" way to work with Cordova. As an example (and yes, I stole this right from the docs), here is how you would make use of the Camera API:
</p>

<br clear="left">

<pre><code class="language-javascript">
module.controller('PictureCtrl', function($scope, $cordovaCamera) {

  $scope.takePicture = function() {
    $cordovaCamera.getPicture({

      // See all the possible Camera options from the Camera docs [1]:
      /// https://github.com/apache/cordova-plugin-camera/blob/master/doc/index.md#cameraoptions

    }).then(function(imageData) {

      // Success! Image data is here

    }, function(err) {

      // An error occured. Show a message to the user

    });
  }

});</code></pre>

<p>
And here is a bar code example:
</p>

<pre><code class="language-javascript">
module.controller('MyCtrl', function($scope, $cordovaBarcodeScanner) {
  $cordovaBarcodeScanner.scan().then(function(result) {
    // Scanner result
  }, function(err) {
  });
</code></pre>

<p>
As you can see, it is all promisy (yes, that is a new word) and a bit simpler to work with in my opinion. I'd like to see more of course (the File API really needs to be implemented as well - it needs promises bad) but it is off to a great start.
</p>

<p>
Check it out. And - oh yes - it is 100% free and open source!
</p>