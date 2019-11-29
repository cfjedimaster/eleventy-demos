---
layout: post
title: "Using Device Motion on the Web"
date: "2017-04-25T16:30:00-07:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2017/04/25/using-device-motion-on-the-web
---

I'm currently working on an article for [TDN](http://developer.telerik.com/) that looks at how web standards have advanced in comparison to the default list of plugins supported for Apache Cordova. In my research, I looked at the [Device Orientation API](https://w3c.github.io/deviceorientation/spec-source-orientation.html). Specifically, I was interested in device motion. For Cordova, motion and orientation are split into two plugins, but spec-wise, they are covered in - well - one spec.  In general, it is a fairly simply API to use. Here is an example from the Mozilla Developer Network page on [device motion](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent):

<pre><code class="language-javascript">window.addEventListener('devicemotion', function(event) {
  console.log(event.acceleration.x + ' m/s2');
});
</code></pre>

Fairly simple, right? Unlike the Cordova plugin which lets you get the current value or listen for the values at an interval, the web standards API is just an event. When it fires, it fires.

I did some basic testing where I just listened for the event and logged the values. I found that in many cases, it fired *all* the time, whether or not the device was moving. I added a bit of logic to my code to limit my logging to cases where X, Y, or Z had at least a value of 1 or higher (after taking the absolute value). This restored some sanity at least. The best news, though, is how well this is supported. From [CanIUse](http://caniuse.com/#feat=deviceorientation):

![CanIUse](https://static.raymondcamden.com/images/2017/4/caniuse.png)

That's *dang* good! About the only issue here is desktop Safari, which we all know is only used to watch Apple keynotes. 

Ok, so with that being done, I thought I'd take a stab at building "shake" support. Basically - monitor device motion and detect when it has been 'shaken' - which really comes down to math. Given we know how much they have moved, have they moved "enough" to consider it a shake.

About a year ago, I built a demo of this for Ionic: [Working with Ionic Native - Shake, Rattle, and Roll](https://www.raymondcamden.com/2016/07/07/working-with-ionic-native-shake-rattle-and-roll). The logic boils down to tracking the deltas (changes) in motion over the 3 axis and keeping track of when they move a significant amount a few times. Some of the numbers I used came from me simply playing with hardware and seeing what "felt" right, so obviously it could be adjusted. Here's what I came up with:

<pre><code class="language-javascript">document.addEventListener(&#x27;DOMContentLoaded&#x27;, init, false);
function init() {
	console.log(&#x27;Engage&#x27;);
	window.addEventListener(&#x27;devicemotion&#x27;, motion, false);
}

let lastX, lastY, lastZ;
let moveCounter = 0;

function motion(e) {
	let acc = e.acceleration;
	if(!acc.hasOwnProperty(&#x27;x&#x27;)) {
		acc = e.accelerationIncludingGravity;
	}

	if(!acc.x) return;

	&#x2F;&#x2F;only log if x,y,z &gt; 1
	if(Math.abs(acc.x) &gt;= 1 &amp;&amp;
	Math.abs(acc.y) &gt;= 1 &amp;&amp;
	Math.abs(acc.z) &gt;=1) {
		&#x2F;&#x2F;console.log(&#x27;motion&#x27;, acc);
		if(!lastX) {
			lastX = acc.x;
			lastY = acc.y;
			lastZ = acc.z;
			return;
		}

		let deltaX = Math.abs(acc.x - lastX);
		let deltaY = Math.abs(acc.y - lastY);
		let deltaZ = Math.abs(acc.z - lastZ);
		
		if(deltaX + deltaY + deltaZ &gt; 3) {
			moveCounter++;
		} else {
			moveCounter = Math.max(0, --moveCounter);
		}

		if(moveCounter &gt; 2) {
			console.log(&#x27;SHAKE!!!&#x27;);
			moveCounter = 0;
		}

		lastX = acc.x;
		lastY = acc.y;
		lastZ = acc.z;
		
	}
}
</code></pre>

Looking at the `motion` event, one of the first things I had to do was account for acceleration being null and switching to `accelerationIncludingGravity`. If you read the spec, you'll see this little nugget:

<blockquote>
Implementations that are unable to provide acceleration data without the effect of gravity (due, for example, to the lack of a gyroscope) may instead supply the acceleration including the effect of gravity. This is less useful in many applications but is provided as a means of providing best-effort support. In this case, the accelerationIncludingGravity attribute must be initialized with the acceleration of the hosting device, plus an acceleration equal and opposite to the acceleration due to gravity.
</blockquote>

Basically - it's a fallback. Once I've figured out where to find my values, I begin doing some parsing.

The first IF block was used to control logging initially - I was trying to avoid very small movements. In theory I don't need it since I'm more concerned about the deltas, but I kept it there as another way to limit false positives. 

The rest of the method looks at the deltas, see if they are "enough" (and again, this was arbitrary based on my testing) and when I feel like it's time to consider it a shake, I log it.

I tested this with my iPhone and it worked really well. I tested this on my desktop Chrome, and it worked in terms of having an event to listen to, but obviously I didn't shake my desktop. I tested this on my Surface Book with Chrome and MS Edge and both worked great.

Here is a stupid animated GIF where I ran it in MS Edge and actually shook my laptop:

![Alt text](https://static.raymondcamden.com/images/2017/4/lc1.gif )

Pro Tip: Don't do that.

So at this point, I could actually call some other method to actually do something on the shake event, but I'll leave that up to the reader. What's cool is - you could do something like, "Shake to reload", and as long as you provide some other way to reload, this is totally fine than in cases where it isn't supported.

You can find the code for this here: https://github.com/cfjedimaster/webdemos/tree/master/device_motion

You can run this as well: https://cfjedimaster.github.io/webdemos/device_motion/

p.s. I probably don't need the `DOMContentLoaded` event listener at all. When I first started, I thought I'd do a complete demo and maybe show random content on shake, but I figured I'd be lazy and leave it as is. :)