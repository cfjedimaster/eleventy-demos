---
layout: post
title: "Using the Onymos Media Component"
date: "2016-03-01T08:06:00-07:00"
categories: [development,mobile]
tags: [cordova]
banner_image: 
permalink: /2016/03/01/using-the-onymos-media-component
---

One of the more interesting aspects of the rise of hybrid mobile development is the rich ecosystem
of plugins available to developers to make use of within their applications. When I started with PhoneGap nearly five years ago, there were a core set of plugins covering basic device functionality and that was it. Since that time, the available [plugins](http://cordova.apache.org/plugins/) have exploded. Today I'm going to review a commercial plugin offering from [Onymos](https://www.onymos.com). The [Onymos Media](https://www.onymos.com/products/media) plugin is like the default Camera plugin on steroids.

<!--more-->

First and foremost - let me state up front that this is a *commercial* plugin. It isn't open source and it [costs money](https://www.onymos.com/pricing). Frankly I'm ok with paying for functionality so this isn't a deal breaker for me. I know it is for some folks so I want to get that out of the way first. The plugin (and related services) cost $99 a month which isn't cheap, but I can honestly say that this seems like a reasonable price for everything that is offered.

So what does it do? As I said, the plugin acts like an enhanced version of the Camera plugin so the features - for the most part - revolve around capturing pictures and working with videos.

* It helps correct orientation differences.
* It expands the locations that a user can select media. 
* It has *client-side* compression technology for both images and video. What that means is a large video on the device can be compressed before uploading. This makes it much easier to share videos via your application.
* It lets you convert media into Base64, including video.
* It can generate thumbnails from video (pictures too of course).
* And here is the coolest part. It provides a storage mechanism for your media. This feature supports both upload and download, as well as the ability to search against stored media. You can either use storage directly from Onymos or point to your Amazon S3 bucket.

Setup of the plugin is a bit more complex than typical. The plugin itself is installed just like any other: `cordova plugin add onymos_components/onymos-plugin-media`. But then to use it, you will need to initialize it with your credentials (for the purchased product) and then wait for a callback to know when it is completely ready. Obviously how and when you do this is application dependant. For my test, I simply put it in my main controller and inside an ionicPlatform.ready call.

<pre><code class="language-javascript">
$ionicPlatform.ready(function() {
	console.log(&#x27;trying the thing&#x27;);
	onymosConnectObj = {
		customerId : &#x27;secret&#x27;, 
		envType : &#x27;PRD&#x27;, 
		onymosAuthToken : &#x27;another secret&#x27;,
		awsAccessKey : &#x27;so secret it hurts&#x27;, 
		awsSecretKey : &#x27;yet another secret&#x27;
	};

	window.OnymosMediaUI.onymosInitialize ( 
		onymosConnectObj,

		function onymosInitializeSuccess (status) {
			console.log(status);
			$scope.app.ready = true;
			$scope.$apply();
		},

		function onymosInitializeFailure (error) {
			console.log(error);
		}
	);

});
</code></pre> 

In the code block above, you can see I'm setting up my configuration values and then passing it to a `onymosInitialize` function. I then handle the success or failure. In my case, I set some flags in the scope to let me know things were ready.

For my test, I simply wanted to see a thumbnail for video. Currently you can only select an existing video, you can't take a new video, but you could do that with another call and *then* ask the Onynmos plugin to work with it. 

<pre><code class="language-javascript">
$scope.doVideo = function() {
	console.log(&#x27;trying video&#x27;);
	window.OnymosMediaUI.onymosMediaSelect(1, 
		OnymosMediaConstants.PictureSourceType.PHOTOLIBRARY, 
		OnymosMediaConstants.MediaType.ALLMEDIA,
		function(mediaURI) {
			console.log(&#x27;got success&#x27;, mediaURI);
			var thumb = window.OnymosMediaUI.onymosMediaGetThumbnail(1);
			console.log(&#x27;thumb is &#x27;+thumb);
			$scope.thumb = thumb;
			$scope.$apply();
		}, 
		function(error) {
			console.log(&#x27;got error&#x27;, error);	
		}
	);
};
</code></pre>

So I won't go into terribly deep detail here, you can read the [docs](https://www.onymos.com/start/cordova-components) yourself, but one of the core concepts of the plugin that was a bit confusing at first was the idea of a `callId`. This is basically a unique identifier for a particular media usage. For most people, they will have one media "use" on a view, ie a button to click to work with media. In some apps you may have two. The `callId` basically creates a handle to one set of data at a time. The rest of the code should make sense. I'm selecting from the photo library and working with all media. I then ask for a thumbnail and set it to a scope variable. Back in my view, I have a simple `img` tag with a ng-src pointing to this.

Here is a screen shot of the video selection in action. You can see it compressing the video automatically.

![Shot](https://static.raymondcamden.com/images/2016/03/onymos1s.jpg)

Once compressed, the thumbnail generation works as you would expect. I could have made this quite a bit smaller if I wanted to.

![Shot](https://static.raymondcamden.com/images/2016/03/onymos2.jpg)

The compression technology is pretty impressive. I didn't play with it much in my demo, but the Onymos folks have an [online demo](https://www.onymos.com/blog) that demonstrates this rather well. The video demo portion is especially cool - they got the size down to 16% of the original and the quality looks darn good.

![Screen shot from Onymos demo](https://static.raymondcamden.com/images/2016/03/onymos3.jpg)

The other big benefit of the Onymos Media plugin is the upload/search/download aspect. As I said above, you can upload media and store it either on their server or your own S3 bucket. The Upload API is pretty powerful. You can:

* Resize
* Optimize
* Target a device type (mobile, tablet, and desktop)
* Designate a thumbnail size
* Specify an upper limit for size

And on top of that you can then set an array of tags to associate with the media. This then ties into the Search API. It lets you specify tags and then provides a nice list of results that includes thumbnails. You can also include the media itself as well by pointing to the URI. So for example, a video tag could simply change it's `src` attribute to load in the result. 

All in all, this seems like a very powerful plugin, and while it isn't free, you get support as well and in my own work with the company, they were very quick to respond to my questions as well as my suggestions. In a few places I found the docs to be a bit awkward and they were quick to listen to my ideas and help me out. Definitely check them out and keep an eye out for their other plugins coming soon.