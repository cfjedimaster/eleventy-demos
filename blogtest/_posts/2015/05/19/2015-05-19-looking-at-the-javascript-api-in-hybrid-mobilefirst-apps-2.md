---
layout: post
title: "Looking at the JavaScript API in Hybrid MobileFirst Apps (2)"
date: "2015-05-19T15:19:16+06:00"
categories: [development,javascript,mobile]
tags: [cordova,mobilefirst]
banner_image: 
permalink: /2015/05/19/looking-at-the-javascript-api-in-hybrid-mobilefirst-apps-2
guid: 6167
---

A few weeks back I <a href="http://www.raymondcamden.com/2015/04/28/looking-at-the-javascript-api-in-hybrid-mobilefirst-apps">blogged</a> about some of the JavaScript APIs you have available when building hybrid mobile applications with <a href="http://ibmmobile.info/IBM-MobileFirst">IBM MobileFirst</a>. I had meant to follow up on this a bit sooner but recent trips got in the way. Today I took some time to look at a few more of the APIs.

<!--more-->

<h4>WL.Badge.setNumber</h4>

As you can guess, this <a href="http://www-01.ibm.com/support/knowledgecenter/SSHS8R_7.0.0/com.ibm.worklight.apiref.doc/html/refjavascript-client/html/WL.Badge.html?cp=SSHS8R_7.0.0%2F9-0-0-1-4">API</a> lets you set the badge number for your application icon. It only applies to iOS and Windows Phone. The API is incredibly simple. You set a number. It shows up in the icon. If you set it to 0, the number is cleared. Yep, that's it. 

I wired up two buttons in an Ionic app for quick testing of this. Here is the JavaScript code I used:

<pre><code class="language-javascript">$scope.testBadge = function(e) {
    console.log("ok, test badge");
    WL.Badge.setNumber(2);
}

$scope.clearBadge = function(e) {
    console.log("ok, clear badge");
    WL.Badge.setNumber(0);
}</code></pre>

Here is a screen shot of the icon updated:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/iOS-Simulator-Screen-Shot-May-19-2015-2.59.25-PM.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/iOS-Simulator-Screen-Shot-May-19-2015-2.59.25-PM.png" alt="iOS Simulator Screen Shot May 19, 2015, 2.59.25 PM" width="423" height="750" class="aligncenter size-full wp-image-6168" /></a>

Unfortunately, it appears as if iOS 8 has new requirements for apps that try to add badges. In my testing with the iOS 8.X simulator, I got an error in my console stating that permission was required for this action. I'll try to get back to this later, but for now, keep that in mind.

<h4>WL.BusyIndicator</h4>

You can probably guess what this one does too - show and hide a "busy" indicator. The <a href="http://www-01.ibm.com/support/knowledgecenter/SSHS8R_7.0.0/com.ibm.worklight.apiref.doc/html/refjavascript-client/html/WL.BusyIndicator.html?cp=SSHS8R_7.0.0%2F9-0-0-1-5">docs</a> explain the full API, but the general usage is to create an instance of the indicator with the appropriate options and then call <code>show</code> on it. Where things get interesting is on Android. iOS supports an option to automatically hide the dialog, Android does not. So if you really want a "timed" dialog then you'll need to set a timeout:

<pre><code class="language-javascript">$scope.doBusy = function(e) {
    console.log("ok, do busy");
    var busy = new WL.BusyIndicator("body", {
	text:"This is text",
	bounceAnimation:false,
	textColor:"red",
	fullScreen:false,
	duration:5
    });
    busy.show();
    window.setTimeout(function() {
	busy.hide();
    }, 5*1000);
}</code></pre>

The options you see above are just some of the options, mainly the ones I was curious about. <code>bounceAnimation</code> (which defaults to false) was a bit weird when enabled so I don't see using it often. <code>fullScreen</code> also seemed to a bit too much on iPad, but could be ok on iPhone. In a real app the hide() call would be in the async callback of whatever thing you are waiting for. 

Here is how the indicator looks in iOS:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/iOS-Simulator-Screen-Shot-May-19-2015-3.12.42-PM.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/iOS-Simulator-Screen-Shot-May-19-2015-3.12.42-PM.png" alt="iOS Simulator Screen Shot May 19, 2015, 3.12.42 PM" width="423" height="750" class="aligncenter size-full wp-image-6169" /></a>

I think it looks nice, outside of the red text which I specifically asked for. (Remember, I'm where good design goes to die.)

And here it is in Android.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/device-2015-05-19-151454.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/device-2015-05-19-151454.png" alt="device-2015-05-19-151454" width="422" height="750" class="aligncenter size-full wp-image-6170" /></a>

That's it for today. As a reminder, if you want to see <i>all</i> of the hybrid API, check out the <a href="http://ibmmobile.info/ClientSideAPI">client-side API</a> docs.