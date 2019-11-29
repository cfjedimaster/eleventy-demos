---
layout: post
title: "How to tell if a Cordova application is running in the simulator"
date: "2015-11-30T16:04:19+06:00"
categories: [javascript,mobile]
tags: [cordova]
banner_image: 
permalink: /2015/11/30/how-to-tell-if-a-cordova-application-is-running-in-the-simulator
guid: 7173
---

Just a quick note here but the most recent <a href="http://cordova.apache.org/news/2015/11/24/plugins-release.html">plugins release</a> included a cool little update to the <a href="https://www.npmjs.com/package/cordova-plugin-device">Device</a> plugin. If you've never used it before, the plugin provides basic information about the app's current working environment, including operating system and device model. In the most recent version, a new property was added: <code>isVirtual</code>.

<!--more-->

As you can probably guess, this property will tell you if you're running on a simulator or a real device. Now while I wouldn't recommend <i>shipping</i> code that uses this normally, during testing it could be real useful. As an example, here is code that simply toggles what kind of camera should be used - the device camera or the photo gallery:

<pre><code class="language-javascript">
var sourceType = device.isVirtual ? Camera.PictureSourceType.PHOTOLIBRARY:Camera.PictureSourceType.CAMERA;
	
navigator.camera.getPicture(picDone, picFail, {
	sourceType: sourceType,
	destinationType:Camera.DestinationType.FILE_URI
});</code></pre>

Not rocket science, but useful. Just to be complete, here is a screen shot of the same code running on my device and simulator.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot24.png" alt="shot2" width="800" height="714" class="aligncenter size-full wp-image-7174" />

And if you want, you can grab the source for this demo here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/checkforsim">https://github.com/cfjedimaster/Cordova-Examples/tree/master/checkforsim</a>.

For folks curious, running this on Genymotion actually shows that it is considered a simulator, not a real device, even though you run it from the command line like a real device. Surprising.