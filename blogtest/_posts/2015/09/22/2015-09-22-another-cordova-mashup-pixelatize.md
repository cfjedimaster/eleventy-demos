---
layout: post
title: "Another Cordova Mashup - Pixelatize"
date: "2015-09-22T13:35:56+06:00"
categories: [development,javascript,mobile]
tags: [cordova,ionic]
banner_image: 
permalink: /2015/09/22/another-cordova-mashup-pixelatize
guid: 6797
---

One of the things I love about Cordova is how you can take existing client-side libraries and mash them up with the device features Cordova provides. The example I typically give of this is a <a href="http://www.raymondcamden.com/2012/01/13/Demo-of-Color-Palettes-and-PhoneGap">demo</a> I built a few years ago that mashes up the camera and a library called <a href="http://lokeshdhakar.com/projects/color-thief/">Color Thief</a>. A few days ago I saw <a href="http://jennmoney.biz/">Jenn Schiffer</a> (who is a pretty cool individual and someone you should <a href="https://twitter.com/jennschiffer">follow on Twitter</a>) release a library called <a href="https://github.com/jennschiffer/pixelatize">Pixelatize</a>. As you can probably guess by the name (which, by the way, is freaking hard to type right multiple times in a row), it takes an image and pixelates it. She has an online demo <a href="http://pancaketheorem.com/stuff/pixelatize/">here</a> so can you test it in your browser. I thought it would be fun to connect this to the device camera with Cordova. Here is how I did it.
<!--more-->

First, I created a new Ionic blank template. For my UI, I decided I'd include a button to take the picture, an image for the original picture, a slider that lets you determine how pixelated the result should be, and the result image. To be honest, this is a bit much and could be layed out better. I think I could remove the original image since you probably don't care about that, but whatever, this was just a fun demo. Here's the code for the index.html page.

<pre><code class="language-javascript">&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width&quot;&gt;
    &lt;title&gt;&lt;/title&gt;

    &lt;link href=&quot;lib/ionic/css/ionic.css&quot; rel=&quot;stylesheet&quot;&gt;
    &lt;link href=&quot;css/style.css&quot; rel=&quot;stylesheet&quot;&gt;

    &lt;script src=&quot;lib/ionic/js/ionic.bundle.js&quot;&gt;&lt;/script&gt;

    &lt;script src=&quot;cordova.js&quot;&gt;&lt;/script&gt;

    &lt;!-- your app's js --&gt;
    &lt;script src=&quot;js/app.js&quot;&gt;&lt;/script&gt;
    &lt;script src=&quot;lib/pixelatize.js&quot;&gt;&lt;/script&gt;
  &lt;/head&gt;
  &lt;body ng-app=&quot;starter&quot;&gt;

    &lt;ion-pane&gt;
      &lt;ion-header-bar class=&quot;bar-stable&quot;&gt;
        &lt;h1 class=&quot;title&quot;&gt;Pixelatize Demo&lt;/h1&gt;
      &lt;/ion-header-bar&gt;
      &lt;ion-content class=&quot;padding&quot; ng-controller=&quot;MainCtrl&quot;&gt;

        &lt;button class=&quot;button button-block button-positive&quot; ng-click=&quot;selPicture()&quot; ng-disabled=&quot;appNotReady&quot;&gt;Select Picture&lt;/button&gt;

        &lt;img id=&quot;selectedImage&quot;&gt;

        &lt;p&gt;
        &lt;label for=&quot;pixelSize&quot;&gt;Pixel Size 
        &lt;input type=&quot;range&quot; id=&quot;pixelSize&quot; ng-model=&quot;pixelSize&quot; min=&quot;1&quot; max=&quot;15&quot;&gt;&lt;/label&gt;
        &lt;/p&gt;

        &lt;canvas id=&quot;image&quot; &gt;&lt;/canvas&gt;
      &lt;/ion-content&gt;
    &lt;/ion-pane&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>

There's nothing fancy here. Note though that I'm using a canvas for the second image. This comes directly from Jenn's demo. Now let's look at the application logic.

<pre><code class="language-javascript">// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a &lt;body&gt; attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.controller('MainCtrl', function($scope, $ionicPlatform) {
  $scope.appNotReady = true;
  $scope.pixelSize = 10;

  $ionicPlatform.ready(function() {
    $scope.appNotReady = false;
    $scope.$apply();
    var imgDom = document.querySelector(&quot;#selectedImage&quot;);
    var canvasDom = document.querySelector(&quot;#image&quot;);

    $scope.selPicture = function() {

      navigator.camera.getPicture(function(url) {
        imgDom.onload = function() {
          pixelatizeModule.pixelatizeImage(imgDom, canvasDom, parseInt($scope.pixelSize,10));
        }
        imgDom.src = url;
      }, function(err) {
        console.log('err', err);
      }, {
        quality: 50,
        sourceType:Camera.PictureSourceType.CAMERA,
        destinationType:Camera.DestinationType.FILE_URI,
        targetWidth:300,
        targetHeight:300
      });
    };

  });

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

There isn't much here. I basically just shell out to the Camera API when you hit the button. Once the image is loaded, I then call Jenn's library. During testing I just used the photo gallery on the iOS Simulator but switched to the real camera when I was done. If you were building a "real" app for this you could easily use two buttons to let the user decide between their existing photos and a brand new one.

The final bit of code is Jenn's library, which I modified a bit to fit the JavaScript module pattern. I feel smart when I do crap like that, but any bugs here are from me, not her code. 

<pre><code class="language-javascript">
var pixelatizeModule = (function() {

  var ctx, imgWidth, imgHeight;

  var getAverageRGB = function(imgData) {
    var red = 0;
    var green = 0;
    var blue = 0;
    var total = 0;
    
    for ( var i = 0; i &lt; imgData.length; i += 4 ) {
      if ( imgData[i+3] !== 0 ) {
        red += imgData[i+0];
        green += imgData[i+1];
        blue += imgData[i+2];
        total++;
      }
    }
    
    var avgRed = Math.floor(red/total);
    var avgGreen = Math.floor(green/total);
    var avgBlue = Math.floor(blue/total);
    
    return 'rgba(' + avgRed + ',' + avgGreen + ',' + avgBlue + ', 1)';
  };
  
  var pixelatize = function(size) {
    for ( var x = 0; x &lt; imgWidth; x += size ) {
      for ( var y = 0; y &lt; imgHeight; y += size ) {
        var pixels = ctx.getImageData(x, y, size, size);
        var averageRGBA = getAverageRGB(pixels.data);
        ctx.fillStyle = averageRGBA;
        ctx.fillRect(x, y, size, size);
      }
    }
  };

  return {

    pixelatizeImage:function(imgDom, canvasDom, pixelSize) {
      ctx = canvasDom.getContext('2d');

      img = new Image();
      img.onload = function() {
        imgWidth = img.width;
        imgHeight = img.height;
        canvasDom.setAttribute('width', imgWidth);
        canvasDom.setAttribute('height', imgHeight);
        ctx.drawImage(img,0,0);
        pixelatize(pixelSize);
      }
      img.src = imgDom.src;

    }
  }

}());</code></pre>

It is surprisingly small and simple for what it does - but there's no way in hell I would have figured this out. So how about some samples?

First, a scary one:
<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/device-2015-09-22-131734.png" alt="device-2015-09-22-131734" width="422" height="750" class="aligncenter size-full wp-image-6798 imgborder" />


Then a cooler one:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/device-2015-09-22-131823.png" alt="device-2015-09-22-131823" width="422" height="750" class="aligncenter size-full wp-image-6799 imgborder" />

You can find the complete code for this here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/pixelatize">https://github.com/cfjedimaster/Cordova-Examples/tree/master/pixelatize</a>. Enjoy!