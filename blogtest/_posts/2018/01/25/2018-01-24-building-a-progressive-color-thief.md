---
layout: post
title: "Building a Progressive Color Thief"
date: "2018-01-25"
categories: [development,javascript]
tags: [pwa,javascript]
banner_image: 
permalink: /2018/01/25/building-a-progressive-color-thief
---

A little over *five* years ago (omg, really?) I wrote a [PhoneGap demo](https://www.raymondcamden.com/2012/01/13/Demo-of-Color-Palettes-and-PhoneGap/) that made use of a JavaScript library called [Color Thief](http://lokeshdhakar.com/projects/color-thief/). Color Thief (by [Lokesh Dhakar](http://lokeshdhakar.com/)) is a library that can inspect an image for dominent colors. My PhoneGap demo was simple. It accessed the device camera to let the user take a picture and then used Dhakar's library to get the dominant colors. Here's a screen shot from the ancient demo:

<img src="https://static.raymondcamden.com/images/shot3.png" class="imgborder">

A little over a year later, I followed up that initial post with a new version that was 100% web standards based: [Capturing camera/picture data without PhoneGap](https://www.raymondcamden.com/2013/05/20/capturing-camerapicture-data-without-phonegap/). 

Then, four years later, I updated it <em>yet again</em> using the [MediaDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices) API: [New Camera Hotness from Chrome](https://www.raymondcamden.com/2017/01/24/new-camera-hotness-from-chrome). Unfortunately that API still isn't available in iOS.

I was thinking about this app last night and thought it would be a good use case for a progressive web app (PWA). It is fairly simple, but adding "add to homescreen" and offline support should be trivial, right? To be clear, there's more to PWA than that, but I thought those two features alone would be a great use case for the Color Thief app.

I began by updating the code from years ago which meant I had a chance to add Vue. (Woot!) Here is the HTML:

```markup
<!DOCTYPE HTML>
<html>
	<head>
	<meta name="viewport" content="width=320, user-scalable=no" />
	<meta http-equiv="Content-type" content="text/html; charset=utf-8">
	<title>ColorThief Demo</title>
	<link rel="stylesheet" href="app.css">
	</head>

	<body>

		<div id="app" v-cloak>

			<input type="file" capture="camera" accept="image/*" @change="gotPic">
			<div v-if="imageSrc">
			<img id="yourimage" :src="imageSrc" @load="getSwatches" ref="theImage">
			</div><div v-else>
				<h2>Welcome to Color Thief</h2>
				<p>
					Select an image using the button above and Color Thief will find the 5 most prominent colors.
				</p>
				<p>
					Awesome <a href="http://lokeshdhakar.com/projects/color-thief/">Color Thief</a> library by <a href="http://lokeshdhakar.com/">Kokesh Dhakar</a>.
				</p>
			</div>
			<div id="swatches">
				<div v-for="swatch in swatches" class="swatch" :style="swatch.style"></div>
			</div>
		
		</div>

		<script type="text/javascript" charset="utf-8" src="color-thief.js"></script>
		<script src="vue.min.js"></script>
		<script src="app.js"></script>

	</body>

</html>
```

I've got the file input on top to allow for camera access. On desktop this will still work nicely by letting me select a file. I've got some intro text that goes away once the app runs with an image. Now let's look at the JavaScript:

```js
const app = new Vue({
	el:'#app',
	data() {
		return {
			imageSrc:null,
			swatches:[]
		}
	},
	methods:{
		gotPic(event) {
			this.imageSrc = URL.createObjectURL(event.target.files[0]);
		},
		getSwatches() {
	
			let colorThief = new ColorThief();
			let colorArr = colorThief.getPalette(this.$refs.theImage,5);
			//reset
			this.swatches = [];	
			colorArr.forEach(c => {
				let style = {
					backgroundColor:"rgb(" + c[0] + "," + c[1] + "," + c[2] +")"
				}
				this.swatches.push({% raw %}{style}{% endraw %});			
			});
		}
	}
});
```

It basically comes down to two functions. One to set an image source to the location of a file you select or picture you take with your device. THe second simply calls the Color Thief library. You can run this yourself here:

https://cfjedimaster.github.io/webdemos/pwa_colorthief/

In case you don't want to - here's the initial view:

![Screen shot](https://static.raymondcamden.com/images/2018/1/pwact.jpg)

and here it is with an image selected:

![Screen shot 2](https://static.raymondcamden.com/images/2018/1/pwact2.jpg)

I ran the Progressive Web App Ligthouse audit in Chrome devtools and got...

![Lighthouse report for the initial version](https://static.raymondcamden.com/images/2018/1/pwact3.jpg)

Ok. All those issues make sense and aren't a surprise. So let me walk through the changes I made to turn this into a simple PWA. (And again, I'm not doing everything, and I'm fine with that. I'm making improvements and that's *always* a good thing!)

Add to Homescreen
===

In order to improve the "add to homescreen" support, and allow for an automatic prompt (remember, that's two different things, ask me in the comments below if you don't know what I mean), I began by adding an app manifest. Here's the one I used:

```js
{
	"short_name":"Color Thief",
	"name":"Color Thief",
	"description":"Lets you get prominent colors from a picture taken with your camera.",
	"display":"fullscreen",
	"icons":[
		{
			"src": "img/icon192.png",
			"sizes": "192x192",
			"type": "image/png"
		},
		{
			"src": "img/icon512.png",
			"sizes": "512x512",
			"type": "image/png"
		}
	],
	"orientation":"portrait",
	"start_url":"./index.html",
	"background_color":"#fff",
	"theme_color":"#fff"
}
```

I initially started off with just the first 7 items you see above. The Lighthouse audit dinged me for not having `background_color` and `theme_color` so I added them as white just to shut it up. For the icons, I fired up paint.net, made an image with the right size, and typed. Not very artistic, but it worked:

<img src="https://cfjedimaster.github.io/webdemos/pwa_colorthief_2/img/icon512.png">

Notice how I put the text a bit off center. That's design.

On the HTML side, I had to add in a link to the manifest:

```markup
<meta name="viewport" content="width=device-width, user-scalable=no" />
<meta http-equiv="Content-type" content="text/html; charset=utf-8">
<title>ColorThief Demo</title>
<link rel="stylesheet" href="app.css">
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#ffffff">
```

I also did two other fixes. First, my viewport wasn't correct. Secondly, the Lighthouse audit wanted a `theme-color` meta tag. Not sure why as it's specified in the manifest, but there ya go. I should also point out that I did *not* add in the additional meta tags to support iOS. This won't prevent folks on iOS from adding to their home screen, they just won't get the nice icon. The good news is that iOS 11.3 is adding PWA support, and in general, folks upgrade on iOS very quickly. (In general - apparently that is going a bit slower than normal for iOS 11.) 

At this point, I have what I need for a better "add to homescreen" experience. Android/Chrome Desktop users won't get an automatic prompt though because I don't have a service worker, so let's fix that.

The Service Worker
===

My service worker will be fairly simple. I want to cache, and use the cache, for the resources of my app. This will allow it to work offline. That's fairly boilerplate code and I was able to use the same service worker file I've used for my previous demos. All I changed was the list of files to cache:

```js
var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
	'./',
	'./index.html?utm_source=homescreen',
	'./js/color-thief.js',
	'./js/vue.min.js',
  	'./js/app.js',
	'./app.css',
  	'./manifest.json'
];

self.addEventListener('install', function(event) {
	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then(function(cache) {
			console.log('Opened cache');
			return cache.addAll(urlsToCache);
		})
		.catch(function(e) {
			console.log('Error from caches open', e);
		})
	)
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
	  caches.match(event.request)
		.then(function(response) {
		  // Cache hit - return response
		  if (response) {
				console.log('got it from cache', event.request);
				return response;
		  }
		  return fetch(event.request);
		}
	  )
	);
  });
  
```

This service worker will always use the cache if it exists. Caching strategies is a *very* complex topic, but just know that you have many different options in this area and can get very precise about how you would like your app to use the cache.

The final change to actually use the service worker. I added that to my main app.js:

```js
const app = new Vue({
	el:'#app',
	data() {
		return {
			imageSrc:null,
			swatches:[]
		}
	},
	mounted() {
		if("serviceWorker" in navigator) {
			navigator.serviceWorker.register('./serviceworker.js')
			.then((registration) => {
				console.log('Service Worker installed!');
			}).catch((err) => {
				console.error('Service Worker failed', err);
			});
		}
	},
	methods:{
		gotPic(event) {
			this.imageSrc = URL.createObjectURL(event.target.files[0]);
		},
		getSwatches() {
	
			let colorThief = new ColorThief();
			let colorArr = colorThief.getPalette(this.$refs.theImage,5);
			//reset
			this.swatches = [];	
			colorArr.forEach(c => {
				let style = {
					backgroundColor:"rgb(" + c[0] + "," + c[1] + "," + c[2] +")"
				}
				this.swatches.push({% raw %}{style}{% endraw %});			
			});
		}
	}
});
```

If you can't see it - look in the `mounted()` method. Basically, if serviceworker exists as an API in the browser, register it. And that's basically it. You can run this version of the app here:

https://cfjedimaster.github.io/webdemos/pwa_colorthief_2/

In Chrome, both desktop and mobile, you *may* be prompted to add it to your home screen. On desktop they call it "app shelf" for some reason, but the icon is added to your desktop:

![Desktop icon](https://static.raymondcamden.com/images/2018/1/pwact4.jpg)

And the resulting Lighthouse audit:

![Lighthouse audit](https://static.raymondcamden.com/images/2018/1/pwact5.jpg)

WOOT!!! 100!! I am a JavaScript GOD! Ok, no, not really, and as I've said multiple times already in this post, building a PWA will involve more than what I've done here, but in about 30 minutes of work I:

* Dramatically improved the "add to homescreen" experience
* Made it so that Chrome will actually prompt the user to do so
* And made it work completely offline

That's a win in my book! Let me know if you have any questions. The complete source code for both versions may be found here: https://github.com/cfjedimaster/webdemos. `pwa_colorthief` is the first version and `pwa_colorthief_2` is the improved one.