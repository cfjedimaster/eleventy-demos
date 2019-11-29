---
layout: post
title: "Turning My No Man's Sky App Into a PWA"
date: "2017-10-12T08:38:00-07:00"
categories: [development,javascript]
tags: [javascript,pwa]
banner_image: 
permalink: /2017/10/12/turning-my-no-mans-sky-app-into-a-pwa
---

A few weeks back I blogged about an [app](https://www.raymondcamden.com/2017/08/31/building-a-no-mans-sky-utility-with-node-and-vuejs/) I built for one of my favorite games, "No Man's Sky." The app was a simple single page app (SPA) that let me calculate items I needed to complete goals in the game. I've spent the last month or so researching PWAs (Progressive Web Apps) and while I'm far from being an expert, I feel comfortable enough now to look into how I can enhance my existing sites to support being PWAs, or at least moving them in that direction.

Creating a PWA can seem daunting. It certainly did to me. Consider Google's ["PWA Checklist"](https://developers.google.com/web/progressive-web-apps/checklist) which has what seems to be an incredible amount of tasks laid out. To be fair, it isn't a huge list and it's includes instructions on both testing *and* fixing each item, which is awesome. But still - it's intimidating. 

What I've tried to do in my approach to PWAs is stress the importance of taking it one step at a time and *not* fixating on covering every single item. Some won't even make sense. For example, there is absolutely no reason to include push notifications in your app unless you actually need it. 

Every single thing you do to improve your web site is a *good thing* for your users. If you don't ever make it to "real PWA", don't worry about it. Your users will still appreciate the improvements!

Getting Started
===

Ok, so let's get started. Let me begin by defining what I plan to add to the application. My app is already kinda responsive (although could be better) and served over HTTPS. I'm going to focus on two things:

* Adding an app manifest file to support "save to device" with a nice shortcut.
* Adding caching for offline support via a Service Worker so I can run it offline. To be fair, I only plan on using this app when playing the game and I'm pretty much always online at home, but there ya go.

Adding a Manifest
===

The app manifest, technically the [Web App Manifest](https://developers.google.com/web/fundamentals/web-app-manifest/) is the easiest step. It's literally a simple JSON file that describes the app. You have quite a few options here in terms of app names (for example, you'll probably want a shorter name on the device home screen), icons, launch options and colors. 

This is the manifest I went with - which supports some, but not all of the available options.

<pre><code class="language-javascript">{
	"short_name":"NMS Resource Tracker",
	"name":"No Man's Sky Resource Tracker",
	"icons":[
		{
			"src":"images/icons/nms.png",
			"type":"image/png",
			"sizes":"144x144"
		}
	],
	"start_url":"index.html?utm_source=homescreen",
	"display":"standalone"
}
</code></pre>

The `short_name` value is what will be on the device screen and as you can see, I've shortened "No Man's Sky" to NMS. Even this may be too long so I may end up removing "Resource". I specified one icon, but could support multiple. I also slightly modified the URL to include a flag that Google Analytics can pick up. Finally, I told it to launch in "standalone" mode which basically means no URL and other browser chrome.

And that's it. To add this to my site, I added this tag to the HTML file:

<pre><code class="language-markup">&lt;link rel="manifest" href="manifest.json"&gt;
</code></pre>

Chrome provides good support for parsing and showing you manifest details. Check it out below:

![Dev tools](https://static.raymondcamden.com/images/2017/10/nmspwa1.jpg)

What's not on that screenshot is the "Add to homescreen" link on the far right side. What this does (as far as I can tell) is simulate the new ["Web App Install Banner"](https://developers.google.com/web/fundamentals/engage-and-retain/app-install-banners/) feature. This is where Chrome will actually prompt the user to add the site to the home screen. The feature has a certain set of requirements (you can't force it!) but this devtools feature lets you force it in testing. It also lets you see if you "fail" any of the tests, so for example, when I click it now I get:

	(index):1 Site cannot be installed: no matching service worker detected. You may need to reload the page, or check that the service worker for the current page also controls the start URL from the manifest

If I had forgotten an icon or did "not enough" in the manifest, it would have noted that first. Basically it reports the first error it finds and you may find yourself fixing one issue after another to make it happy.

<strong>But to be clear, this is ONLY for the new 'auto prompt' feature!</strong> Your user's can absolutely add them. Here is what that looks like. This the first prompt I get:

![Shot](https://static.raymondcamden.com/images/2017/10/nmspwa2.jpg)

Note the icon and short name in use. Oddly, you get a second prompt too. I honestly don't know why this one shows up. 

![Shot](https://static.raymondcamden.com/images/2017/10/nmspwa3.jpg)

Maybe it's to let you know what the icon will be? Anyway, after all of this, it does end up on your device.

![Shot](https://static.raymondcamden.com/images/2017/10/nmspwa4.jpg)

In case you may not see it, let's focus in a bit.

![Shot](https://static.raymondcamden.com/images/2017/10/nmspwa5.jpg)

Welcome to what I call the "Not a PWA Mark of Shame". This is something Chrome added somewhat recently and I have very strong feelings about this. Basically it is a "mark" that the icon represents a web page that is not a "real" PWA. As I said, I have feelings. Negative feelings. But let's move on. Just be aware that the mark won't go away until you have added a proper service worker to site. 

Not that it's that much different, but here is the app running after opening it via the device homescreen. Note there is no URL banner on top.

![Shot](https://static.raymondcamden.com/images/2017/10/nmspwa6.jpg)

Adding Caching Via a Service Worker
===

For the next step, I'm going to add offline support via caching and a service worker. Service workers are a pretty big topic. I'd suggest reading the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers) on them for an introduction. I also *highly* recommend ["Building Progressive Web Apps"](http://shop.oreilly.com/product/0636920052067.do) by Tal Ater. I'm going to do a more formal review of the book later this month, but screw waiting for that, buy it right now.

Caching strategies can get very complex. But for my simple app the strategy will simply be - use the cache if it exists, otherwise hit the network. 

I began by updating my main JavaScript file to have it load the service worker:

<pre><code class="language-javascript">document.addEventListener(&#x27;DOMContentLoaded&#x27;, init, false);
function init() {

	if(&quot;serviceWorker&quot; in navigator) {
		navigator.serviceWorker.register(&#x27;serviceworker.js&#x27;)
		.then((registration) =&gt; {
			console.log(&#x27;Service Worker installed!&#x27;);
		}).catch((err) =&gt; {
			console.error(&#x27;Service Worker failed&#x27;, err);
		});
	}

}
</code></pre>

This is fairly boilerplate "if I support X use it" type code. Now for the service worker. This is a modified form of the code from Tal Ater's book and is also pretty boilerplate. I think you could use this code as is on any site, as long as you're ok with the caching strategy.

<pre><code class="language-javascript">var CACHE_NAME = &#x27;my-site-cache-v3&#x27;;
var urlsToCache = [
	&#x27;https:&#x2F;&#x2F;cfjedimaster.github.io&#x2F;nomanssky&#x2F;client&#x2F;index.html&#x27;,
	&#x27;https:&#x2F;&#x2F;cfjedimaster.github.io&#x2F;nomanssky&#x2F;client&#x2F;index.html?utm_source=homescreen&#x27;,
  &#x27;https:&#x2F;&#x2F;cfjedimaster.github.io&#x2F;nomanssky&#x2F;client&#x2F;app.css&#x27;,
  &#x27;https:&#x2F;&#x2F;cfjedimaster.github.io&#x2F;nomanssky&#x2F;client&#x2F;data.json&#x27;,
  &#x27;https:&#x2F;&#x2F;cfjedimaster.github.io&#x2F;nomanssky&#x2F;client&#x2F;manifest.json&#x27;,
  &#x27;https:&#x2F;&#x2F;unpkg.com&#x2F;vue&#x27;,
  &#x27;https:&#x2F;&#x2F;cfjedimaster.github.io&#x2F;nomanssky&#x2F;client&#x2F;app.js&#x27;
];

self.addEventListener(&#x27;install&#x27;, function(event) {
	&#x2F;&#x2F; Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then(function(cache) {
			console.log(&#x27;Opened cache &#x27;+CACHE_NAME);
			return cache.addAll(urlsToCache);
		})
		.catch(function(e) {
			console.log(&#x27;Error from caches open&#x27;, e);
		})
	)
});

self.addEventListener(&#x27;fetch&#x27;, function(event) {
	event.respondWith(
	  caches.match(event.request)
		.then(function(response) {
		  &#x2F;&#x2F; Cache hit - return response
		  if (response) {
				console.log(&#x27;got it from cache&#x27;, event.request);
				return response;
		  }
		  return fetch(event.request);
		}
	  )
	);
  });
  
self.addEventListener(&quot;activate&quot;, function(event) {  
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
	    	return Promise.all(
				cacheNames.map(function(cacheName) {          
					if (CACHE_NAME !== cacheName) {
						return caches.delete(cacheName);          
					}        
				})      
			);    
		})  
	);
});
</code></pre>

From top to bottom, the basic logic is:

* On install, grab a list of URLs to download into the cache. Basically everything my site uses *except* for Google Anaytics. I believe Google Analytics supports an offline version so you can get stats later, but I'm not concerned about that.
* On fetch, which is any network request, see if I have the item in cache and if so, return it from there. To be clear, *this happens even if you're online!* So even folks who aren't offline get a nice benefit of fetching the items locally instead of over the wire.
* Finally - there is a bit of code to "clean up" caches when I update my code, or in my case, I forget a few things to cache.

To test, I used the "Offline" checkmark in Chrome DevTools and confirmed everything still worked right. And it did. Which is awesome. 

I then tested "Add to homescreen" in devtools, which on Desktop will do this:

<img src="https://static.raymondcamden.com/images/2017/10/nmspwa7.jpg" class="imgborder" alt="Shot">

If you're asking, "What the hell is the shelf?" you aren't alone. I'll get to that in a second. Like the mobile version, this is followed by a second prompt:

<img src="https://static.raymondcamden.com/images/2017/10/nmspwa8.jpg" class="imgborder" alt="Shot">

And yes - it becomes a shortcut on the desktop (note, this is via Canary, not the released Chrome):

![Shot](https://static.raymondcamden.com/images/2017/10/nmspwa9.jpg)

Note that the full name of the site was used, not the short name. When double clicked, it actually launched like a "real" desktop app. It had a custom icon and instance on the taskbar:

![Shot](https://static.raymondcamden.com/images/2017/10/nmspwa10.jpg)

And even kinda looked like an app:

![Shot](https://static.raymondcamden.com/images/2017/10/nmspwa11.jpg)

Odd though that the upper left hand corner icon wasn't right. But that could be something I need to set in my manifest.json.

Unfortunately, testing this on my mobile device proved... frustrating. The "Add to Homescreen" prompt via remote dev tools did *not* throw an error but refused to actually do anything. I noted that the [app install banner](https://developers.google.com/web/fundamentals/app-install-banners/) documentation page said that I needed a 192x192 icon. When I had read the doc last week, I swear it had said 144x144. But I noted the page was recently updated so that could be part of the issue. It also said - and I missed this - that you *can't* force the install on mobile, which is unfortunate. All in all, *this* particular feature seems to be in flux a bit but honestly, I don't care because I confirmed it worked offline - which is awesome!

You can see for yourself here: https://cfjedimaster.github.io/nomanssky/client/index.html

What's Left?
===

So the big thing missing here is iOS support. Adding nice "Add to Homescreen" support is done via meta tags documented [here](https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html) and isn't too hard to do. Unfortunately, there's no service worker support in iOS yet, but Apple has expressed interest in adding it. And of course, if it does end up in iOS12, a huge amount of people will get support for it right away. For offline support I could handle that with App Cache, which is not quite as fun as service workers, but wouldn't be too hard to add since I've only got around 6 URLs.