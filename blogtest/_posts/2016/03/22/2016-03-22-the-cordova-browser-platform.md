---
layout: post
title: "The Cordova Browser Platform"
date: "2016-03-22T15:09:00-07:00"
categories: [mobile]
tags: [cordova]
banner_image: /images/banners/browserplatform.png
permalink: /2016/03/22/the-cordova-browser-platform
---

Nearly two years ago I first wrote about the Cordova Browser platform (<a href="http://www.raymondcamden.com/2014/09/24/browser-as-a-platform-for-your-phonegapcordova-apps/">Browser as a platform for your PhoneGap/Cordova apps</a>). After seeing an update on the Apache Cordova blog (<a href="http://cordova.apache.org/announcements/2016/03/04/cordova-browser-4.1.0.html">Cordova Browser 4.1.0</a>), I thought it might be nice to take another look at it and see how far along it has come.

<!--more-->

First and foremost, what is the point of the browser platform? Speaking for myself, and I'll clarify what that means in a second, I think the browser platform is a way to test your Cordova applications in the browser. You have other ways of doing this. For example, `cordova serve` and `ionic serve`. However, the "Browser platform" acts a bit differently. It attempts to actually make your application work on the browser. What do I mean by that? If you simply serve up your www assets, then you won't have a deviceready event (technically, Ionic will fire one for you) and you won't have support for things like the camera or other "device only" features. 

On the flip side, the Browser platform actually *supports* the Camera. I'll be demonstrating how it does so a bit later, but you can use the same APIs you use on your device within the browser and actually get things done.

Now - here is where my opinion and those of the Cordova group (which technically I'm part of too ;) differ a bit. I think the *intention* of the browser platform is to actually support going to production with your app. To me, that just seems a bit too much. The camera *does* work, but it is more of a workaround then what I think a typical end user may expect in a production app. Again, this is just my opinion, but to me, the Browser platform is great for testing, but not necessarily something I'd go live with.

Working with the Browser Platform
---

Before you begin working with the Browser platform, there are a few things you should know. First, you have to actually add the platform. That means running `cordova platform add browser`. And if you want the latest, then you need to specify `cordova platform add browser@4.1.0`. Soon that version will be the default, and if you're reading this in the future you should probably just take the default, it could 6.0.0 by now. 

And obviously, if you are only using the Browser platform to test and you find it isn't working out for you, then be sure to go ahead and remove it: `cordova platform rm browser`.

![Browser platform](https://static.raymondcamden.com/images/2016/03/browser1.png)

To start testing the platform, simply `cordova run browser`, or `cordova run` if you only have one platform. When you do, a new instance of Chrome will pop up. I use Chrome as my default browser, but a new instance was launched as opposed to a new tab opening in my current browser. That's good imo but just keep that in mind. You'll also get a running log of requests in Terminal. What you see will be based on what plugins and other assets you use. Here is an example:

![Browser logs](https://static.raymondcamden.com/images/2016/03/browser2.png)

This is a live listing and will update as your app requests new resources. Can you configure how the browser is loaded? Yes. If you look in `platforms/browser/cordova/`, you'll see a `run` file whichi is used by the Cordova CLI. It's also a quick way to see the help. The `run` script supports two arguments: `browser` and `port`. `browser` defaults to Chrome. `port` defaults to 8000. Here is how I'd switch the port and browser:

`cordova run browser -- --port=8001 --target=Firefox`

As you edit files in `www`, remember that Cordova runs your code out of the `platforms` folder. For my testing, I opened a new tab and ran `cordova prepare browser` whenever I edited. That got old pretty quickly. I knew I could set upa Grunt task to automate that, but it seemed over the top. Then I found a cool utility called [filewatcher](https://github.com/thomasfl/filewatcher). This is a command line tool that lets you watch files and run an arbitrary command when something changes. This is what I used:

`filewatcher "www/**/*.*" "cordova prepare browser"`

Working with Plugins
---

Ok, so how do you use plugins? Exactly the same way you do for any other platform. Find the plugin you want, install it, and then follow their API. At the [Plugin Repository](http://cordova.apache.org/plugins/) you'll notice a button to filter by browser support:

<img src="https://static.raymondcamden.com/images/2016/03/browser3.png" class="imgborder">

Notice that there is a bug with the registry in that you don't get a pretty little icon indicating that the Browser platform is supported. This is a known bug. (As in a known bug as of a few hours ago.)

Of course, the devil is in the details. For each supported plugin, you need to carefully read to see exactly *how* the platform will be supported. The [barcode plugin](https://www.npmjs.com/package/phonegap-plugin-barcodescanner), for example, doesn't actually let you scan a barcode. Instead, it simply prompts you to manually type in a value for the 'scanned' barcode. I used this recently in a production app though and it was great... for testing. 

I decided to take a quick "tour" through the official plugins for Cordova and see which supported the Browser platform and how well they did. Below you'll see a report detailing what I found. All of the code used in this test is up on my GitHub repo here: [https://github.com/cfjedimaster/Cordova-Examples/tree/master/browser1](https://github.com/cfjedimaster/Cordova-Examples/tree/master/browser1)

Battery
---

The first plugin I tested was the Battery plugin. First off, this plugin does *not* follow the [Battery API](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API). If you've used that before, just keep it in mind. I did two tests:

<pre><code class="language-javascript">
window.addEventListener("batterystatus", function(info) {
	console.log("[batterystatus event] Level: " + info.level + " isPlugged: " + info.isPlugged);
}, false);

window.addEventListener("batterylow", function(info) {
	console.log("[batterylow event] Level: " + info.level);
}, false);
</code></pre>

I never got around to seeing if `batterylow` fired, but my `batterystatus` handler did correctly report my battery level and plugin status:

`[batterystatus event] Level: 100 isPlugged: true`

Camera
---

First off, be sure to note that the 'Quirks' information for the Camera plugin clearly points out that only Base64 image URIs are returned by the plugin. Normally Cordova devs recommend against that, but if you want to test on the Browser platform you'll need to use it. 

What's cool - is that you have support for both new images and existing images. How does it work? I added two buttons, one for each use case, and then used the following code.

<pre><code class="language-javascript">
var renderPic = function(data) {
	var image = document.getElementById('myImage');
	image.src = "data:image/jpeg;base64," + data;		
};

var cameraError = function(err) {
	console.log('[camera error]',err);	
};

document.querySelector('#testCameraExisting').addEventListener('click', function() {
	
	navigator.camera.getPicture(renderPic, cameraError, {
		sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
		destinationType:Camera.DestinationType.DATA_URL
	});
	
});

document.querySelector('#testCameraNew').addEventListener('click', function() {
	
	navigator.camera.getPicture(renderPic, cameraError, {
		sourceType:Camera.PictureSourceType.CAMERA,
		destinationType:Camera.DestinationType.DATA_URL
	});
	
});
</code></pre>

In general, this is completely vanilla Camera code. So what does it do? For the source type of CAMERA, it actually fires up your webcam using getUserMedia.

<img src="https://static.raymondcamden.com/images/2016/03/browser4.png" class="imgborder">

The live video is added to the bottom of the DOM along with a capture button. When you click it, then your success handler will fire. Here is the result rendered in the DOM as my code specified.

<img src="https://static.raymondcamden.com/images/2016/03/browser5.png" class="imgborder">

**Very Important Warning!!** The live video stream also broadcasts your audio. That means if you're rocking out to some music, you'll get some really gross feedback. Be sure you mute beforehand.

**Another Important Warning!!** If you get this error:

<pre><code class="language-markup">
Refused to load media from 'blob:http{% raw %}%3A//localhost%{% endraw %}3A8000/d62e77b1-8354-4f25-abd2-f0634de5a4f5' because it violates the following Content Security Policy directive: "media-src *".
</code></pre>

You will need to edit the CSP definition in index.html to specifically allow for blob URLs under `media-src`. Here is mine:

<pre><code class="language-javascript">
&lt;meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: 
https://ssl.gstatic.com http://www.raymondcamden.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; 
media-src * blob:"&gt;
</code></pre>

If you select PHOTOLIBRARY as your source, then you get a simple file chooser. As before, it gets dropped at the end of the DOM. (I won't add a screenshot of that since we all know what an HTML file chooser looks like.) You select your file then it is used as the result.

<img src="https://static.raymondcamden.com/images/2016/03/browser6.png" class="imgborder">

Device
---

So yeah, device just works. I added a button to my demo to dump out the `device` object. Here is what it shows:

<img src="https://static.raymondcamden.com/images/2016/03/browser7.png" class="imgborder">

Device Motion
---

According to the docs, you can test the device motion plugin in the Browser platform and will fire off random values. In my experience, things were a bit flakey. First, here is the code I used. I had one button to get the *current* motion of the device, and then two more to set up a watch and clear it.

<pre><code class="language-javascript">
var watchId;

var renderAcc = function(data) {
	console.log('[acceleration]' + JSON.stringify(data));
};

var accError = function(err) {
	console.log('[acceleration error]',err);	
};

document.querySelector('#testAcc').addEventListener('click', function() {
	
	navigator.accelerometer.getCurrentAcceleration(renderAcc,accError);
	
});

document.querySelector('#testAccWatch').addEventListener('click', function() {
	console.log('[acceleration] begin watch');
	watchId = navigator.accelerometer.watchAcceleration(renderAcc,accError,
	{% raw %}{frequency:1000}{% endraw %});
	
});

document.querySelector('#testAccStop').addEventListener('click', function() {
	console.log('[acceleration] clear watch');		
	navigator.accelerometer.clearWatch(watchId);
	
});
	
</code></pre>

When I tested the code to get the current motion, the error handler was thrown first and then the success handler:

<img src="https://static.raymondcamden.com/images/2016/03/browser8.png" class="imgborder">

I filed a [bug report](https://issues.apache.org/jira/browse/CB-7629) for that. 

Next - when I did a watch test, the value was random, but only once. I got the same result over every iteration of watch success handler. I filed a [bug report](https://issues.apache.org/jira/browse/CB-10938) for that as well.

Finally, the clear command also threw the error handler, but did properly stop the plugin from reporting values.

Device Orientation
---

Unlike device motion, device orientation worked perfectly. It is random as well, and if you do a watch, you get random values for every request. 

<img src="https://static.raymondcamden.com/images/2016/03/browser9.png" class="imgborder">

File and FileTransfer
---

Yeah, no, I'm not touching these. For Firefox and IE, the Browser platform will use IndexedDB for File support, which is kinda cool I guess. Chrome has a file system feature that is deprecated but still works. For FileTransfer, it just uses XHR and FormData. If you aren't aware, a few years ago support was added for Ajax based file uploads. All modern browsers should support this well now.

Globalization
---

For the most part, this plugin kinda halfway-works on the Browser platform. It uses the excellent Moment.js for most of it's work, but coverage is spotty. So for example, you can't do currency formatting. I noticed this odd line in the quirks:

"The array of months contains 12 elements."

Which seemed an odd quirk, but then I saw this under Windows Phone 8:

"The array of months contains 13 elements."

Um.... ok. I whipped up a simple example where I can get locale information and do a simple percentage format. Here is the code.

<pre><code class="language-javascript">
var globError = function(err) {
	console.log('[globalization error]',err);	
};

document.querySelector('#testGlob').addEventListener('click', function() {
	
	navigator.globalization.getPreferredLanguage(function(lang) {
		console.log('[globalization] preferredLanguage: '+JSON.stringify(lang));
	});

	navigator.globalization.getLocaleName(function(locale) {
		console.log('[globalization] localeName: '+JSON.stringify(locale));
	});

	navigator.globalization.getDateNames(function(names) {
		console.log('[globalization] getDateNames:months: '+JSON.stringify(names));
	},globError, {% raw %}{type:'wide', item:'months'}{% endraw %});

	navigator.globalization.getDateNames(function(names) {
		console.log('[globalization] getDateNames:days: '+JSON.stringify(names));
	},globError, {% raw %}{type:'wide', item:'days'}{% endraw %});
	
});

document.querySelector('#testGlobInput').addEventListener('click', function() {
	var input = document.querySelector('#numberGlob').value;
	console.log('[globalization] initial input to format: '+input);
	navigator.globalization.numberToString(
		Number(input),
		function (number) {
			console.log('[globalization] formatted number: '+number.value);
		},
		globError,
		{% raw %}{type:'percent'}{% endraw %}
	);
});	
</code></pre>

And here is a sample in the browser.


<img src="https://static.raymondcamden.com/images/2016/03/browser10.png" class="imgborder">

InAppBrowser
---

I had assumed this would just do a window.open, but surprisingly, it actually uses an iframe. Here is the code I used to test:

<pre><code class="language-javascript">
document.querySelector('#testIAB').addEventListener('click', function() {
	iabRef = cordova.InAppBrowser.open('http://www.raymondcamden.com','_blank','location=yes');
});
</code></pre>

And here is how it rendered:

<img src="https://static.raymondcamden.com/images/2016/03/browser11.png" class="imgborder">

As with the camera plugin, it is rendered at the bottom of the dom. Note the gray border and basic controls. 

Media
---

For media, you can only do audio playback, not recordings. It works pretty much as expected:

<pre><code class="language-javascript">
/*
mp3 source: 
http://www.gutenberg.org/ebooks/10246
Sensation Jazz: One-Step by All-Star Trio
*/
var mp3 = './10246-m-001.mp3';
var media;

document.querySelector('#testMedia').addEventListener('click', function() {
	media = new Media(mp3, function() {
		console.log('[media] Success');
	}, function(err) {
		console.log('[media error]', err);	
	}, function(s) {
		/*
		Media.MEDIA_NONE = 0;
		Media.MEDIA_STARTING = 1;
		Media.MEDIA_RUNNING = 2;
		Media.MEDIA_PAUSED = 3;
		Media.MEDIA_STOPPED = 4;
		*/
		console.log('[media status]', s);		
	});
	
	setTimeout(function() {
		console.log('[media] Duration is '+media.getDuration());
	},100);

	media.play();

});

document.querySelector('#testMediaStop').addEventListener('click', function() {
	media.stop();
});
	
</code></pre>

Note the setTimeout for duration. I noticed it took a little bit before you could get an accurate reading of the duration.

Network
---
Unfortunately, this is pretty poor. From the quirks: "Browser can't detect the type of network connection. navigator.connection.type is always set to Connection.UNKNOWN when online." My tests verified that.

SplashScreen
---

Yes! This works in the Browser platform. As crazy as it sounds, you can actually fire up a splash screen in front of your main application. You want to copy the code from the "Browser Quirks" section of the docs and then setup your image. Once you do, it should just work, although I noticed `SplashScreenWidth` and `SplashScreenHeight` did not seem to do anything. Here is an example:

<img src="https://static.raymondcamden.com/images/2016/03/browser12.png" class="imgborder">


Wrap Up
---

So yeah, over all, I think things are pretty solid, especially if you approach this as a way of testing. As a plugin developer, you can easily create a mock interface for your particular feature to allow you to use the browser and more rapidly develop your code. A colleague of mine, Nic Raboy, wrote an interesting article a few weeks back about the pitfalls of this type of development: [Why You Should Not Use Ionic Serve For Hybrid Apps](https://www.thepolyglotdeveloper.com/2016/02/why-you-should-not-use-ionic-serve-for-hybrid-apps/). As I said in the comments there, I do not agree. I believe as long as you have a solid understanding of what your limitations are, testing your mobile apps in the browser (or I should say, developing, not 'final testing') is both useful and practical. I hope this look at the Browser platform was helpful, and let me know if you have any questions by posting a comment below.