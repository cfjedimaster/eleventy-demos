---
layout: post
title: "Accessing Google Photos with Pipedream"
date: "2022-01-26T18:00:00"
categories: ["javascript"]
tags: ["pipedream"]
banner_image: /images/banners/photo_album.jpg
permalink: /2022/01/26/accessing-google-photos-with-pipedream.html
description: How to use Pipedream's service to interact with your Google Photos
---

**Edit: On May 19, 2022, I discovered an issue with my caching logic. Specifically, the URLs returned by getting a list of photos are only available for *one* hour. So I edited my cache to be 1 hour, not 6. I've tweaked the text around that area of the blog post as well.**

Our family has had a Google Nest Hub in our kitchen for a year or two now. All of us use it every day for the most part. We'll use it for music, weather forecasts, and basic information queries. When not in use though it's got one of my favorite features - a digital photo album. I set mine up to continuously rotate photos from one of my Google Photos albums. Seeing the pictures always makes me smile and I was curious if I could bring that experience to the web. Obviously I could just open my browser to the [Google Photos](https://photos.google.com) website, but I really wanted something like the hardware - a random picture. Here's how I ended up building it using one of my favorite workflow services, [Pipedream](https://pipedream.com).

I began by creating a HTTP triggered workflow. I went into this process not knowing exactly how the Google Photos API would work, but I had hoped I could stream the bits back in the request allowing me to do something simple like, `<img src="pipedream url">`. 

Next I needed to make use of the Google Photos API. I did this by searching for "Google Photos" when adding a step. Note that this did *not* show up in the first page of apps oddly and I had to click "Load More Apps":

<p>
<img data-src="https://static.raymondcamden.com/images/2022/01/photos1.jpg" alt="Shot of PD UI to add a new step" class="lazyload imgborder imgcenter">
</p>

This drops in a simple code step with an auth connection dropdown:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/01/photos2.jpg" alt="Code step for PD Google Photos action" class="lazyload imgborder imgcenter">
</p>

I've shared in the past how Pipedream *really* makes authentication easy but I've got to mention it again. Nearly every time I've used a Google service in the past, roughly 75% of my time is just getting the damn authentication right. Once I get past that hurdle, their APIs are typically easy to use. Pipedream handles that for me. Once I you add an account, it simply provides the auth info for you so you can focus on actually *using* the API.

I will warn you that at the time of me writing this, Google has not yet verified Pipedream's access for this service. You will get a scary-ish warning like so:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/01/photos3.jpg" alt="Warning from Google" class="lazyload imgborder imgcenter">
</p>

The approval process is handled by Google and Pipedream started it sometime ago, so right now the delay is Google's fault. That being said, I trust Pipedream so I went ahead and approved it. Hopefully if you're reading this in the future, the warning is gone. 

With Pipedream handling the authentication, I can focus on process. The first step is to find my Favorites album:

```js
async (event, steps, auths) => {
	let result = await require("@pipedreamhq/platform").axios(this, {
		url: 'https://photoslibrary.googleapis.com/v1/albums',
		headers: {
			Authorization: `Bearer ${auths.google_photos.oauth_access_token}`,
		},
	});

	let favorite = result.albums.find(a => {
		return a.title === 'Favorites';
	});

	return favorite.id;
}
```

Basically, I went to the Google Photos docs, found the endpoint for albums, and just pasted it in. Super simple and direct! I then simply filter the array down to the album I care about and return the ID.

Next, I need the photos from that album. I added yet another action using Google Photos, and wrote this code:


```js
async (event, steps, auths) => {
	let result = await require("@pipedreamhq/platform").axios(this, {
		url: 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
		headers: {
			Authorization: `Bearer ${auths.google_photos.oauth_access_token}`,
		},
		method:'post',
		data: {
			albumId:steps.get_favorites_album.$return_value,
			pageSize:100
		}
	});

	return result.mediaItems;
}
```

Note that I'm using the biggest page they support, one hundred. I've got about 69 photos in the album so I'll need to figure out a solution to paginate later on. 

Next, I added a vanilla Node.js step to get a random picture:

```js
async (event, steps) => {

	// goes from min to max-1
	const getRandomInt = function(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
	}

	return steps.get_photos.$return_value[getRandomInt(0, steps.get_photos.$return_value.length)];

}
```

One note on the above logic. I'm pretty sure the Google Home device doesn't just pick randomly, and instead iterates through the album. Or perhaps it's random, but unique. I could do that. I chose not to. :) 

For the final step, I added another Google Photos action, and returned the binary data from the workflow:

```js
async (event, steps, auths) => {

	const result = await require("@pipedreamhq/platform").axios(this, {
		url: steps.select_photo.$return_value.baseUrl,
		headers: {
			Authorization: `Bearer ${auths.google_photos.oauth_access_token}`,
		},
		responseType:'arraybuffer'
	});

	await $respond({
		status:200,
		headers: {
			'Content-Type':'image/jpeg'
		},
		body:result
	})

}
```

And it worked! I opened my browser to the URL and got a pic. As I reloaded, it randomly selected new ones (here's one of my favorite favorites):

<p>
<img data-src="https://static.raymondcamden.com/images/2022/01/photos4.jpg" alt="Daughter reading a Star Wars comic" class="lazyload imgborder imgcenter">
</p>

So... I was done. And happy with it. But - of course - I decided to tweak it a bit. Specifically I decided to add a cache. Pipedream has an incredibly simple key/value system called [$checkpoint](https://pipedream.com/docs/workflows/steps/code/state/#workflow-state). It lets you store data at a per workflow or step level. Going through my workflow, I made the following changes.

First, in my code to figure out the Favorites album, I cached it forever:

```js
async (event, steps, auths) => {

	if($checkpoint && $checkpoint.favoriteAlbum) return $checkpoint.favoriteAlbum;

	let result = await require("@pipedreamhq/platform").axios(this, {
	url: 'https://photoslibrary.googleapis.com/v1/albums',
	headers: {
		Authorization: `Bearer ${auths.google_photos.oauth_access_token}`,
	},
	});

	let favorite = result.albums.find(a => {
		return a.title === 'Favorites';
	});

	if(!$checkpoint) $checkpoint = { };
	$checkpoint.favoriteAlbum = favorite.id;

	return favorite.id;

}
```

Next, in my step to get photos, I added a one hour cache. Honestly I probably only add a photo to this album a few times a month, but one hour is the max allowed by Google for using the URLs.

```js
async (event, steps, auths) => {

	/*
	Fetch photos once every one hour
	*/
	let cacheDuration = 1 * 60 * 60 * 1000;
	let now = Date.now();

	if($checkpoint && $checkpoint.photoCacheTime && (now - $checkpoint.photoCacheTime < cacheDuration) && $checkpoint.photoCache) return $checkpoint.photoCache;
	console.log('not cached'); 

	let result = await require("@pipedreamhq/platform").axios(this, {
	url: 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
	headers: {
		Authorization: `Bearer ${auths.google_photos.oauth_access_token}`,
	},
	method:'post',
	data: {
		albumId:steps.get_favorites_album.$return_value,
		pageSize:100
	}
	});

	// cache baseUrl
	let photos = result.mediaItems.map(m => m.baseUrl);
	$checkpoint.photoCacheTime = now;
	$checkpoint.photoCache = photos;
	console.log('stored cache time of ', $checkpoint.photoCacheTime);

	return photos;

}
```

And that was it. Maybe five or so minutes of work, but the difference was amazing. On average, my initial workflow was taking four seconds to process. After this change that time went down to one second. 

Want to try this yourself? Fork my workflow here: <https://pipedream.com/@raymondcamden/randomfavoritephoto-2-p_mkCDxrY>

By the way, you can build a cheap auto reload web page in two seconds with the old meta refresh tag:

```html
<!DOCTYPE html>
<html>
<head>
<title>
Favorite Photos
</title>
<meta http-equiv="refresh" content="5;url=./test.html">
</head>

<body>
	<img src="https://secreturl">
</body>
</html>
```

Enjoy, and let me know what you think!

Photo by <a href="https://unsplash.com/@lauracathleen?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Laura Fuhrman</a> on <a href="https://unsplash.com/s/photos/photo-album?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  

