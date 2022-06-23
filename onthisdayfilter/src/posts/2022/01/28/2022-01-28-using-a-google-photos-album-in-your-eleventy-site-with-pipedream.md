---
layout: post
title: "Using a Google Photos Album in your Eleventy Site with Pipedream"
date: "2022-01-28T18:00:00"
categories: ["javascript","jamstack"]
tags: ["pipedream","eleventy"]
banner_image: /images/banners/photos.jpg
permalink: /2022/01/28/using-a-google-photos-album-in-your-eleventy-site-with-pipedream.html
description: Integrating a Google Photos Album in your Eleventy site with Pipedream
---

Ok, first off, let me apologize if the title seems a bit SEO-spammy. I really wanted to ensure I included all the major "players" involved in this particular demo and the title is - well, a bit busy! That being said, my [blog post](https://www.raymondcamden.com/2022/01/26/accessing-google-photos-with-pipedream) earlier this week on using Google Photos with Pipedream got me thinking about other ways I could use it, and of course, I started thinking about integration with [11ty](https://www.11ty.dev/). I came up with a little demo I think folks may like.

Imagine an artist who uses Google Photo albums as a way to share examples of their work. They may create an album specifically for items they want to showcase. Or perhaps any site simply wants to include a gallery of images and wants to use Google Photos as the source. By taking what I learned in the previous Pipedream workflow, I was able to setup an Eleventy demo showing this in action.

The demo may be found here: <https://eleventy-google-photos.netlify.app/>. Note that the front end of this is pretty minimal. I used a bit of CSS I found ([Pinterest style (Masonry) layout using pure CSS](https://kulor.medium.com/pinterest-style-masonry-layout-using-pure-css-493c1206d01d)) and the thumbnails simply link to the regular image. Normally I'd have an HTML page per image so I could keep the site layout and such, but as the important bits was the data, I didn't worry too much. 

So, how does it work?

## The Serverless Endpoint

The first step was to get a list of images for a Google Photos album. I created a [Pipedream](https://pipedream.com) workflow that uses Google's API to fetch an album passed to the Pipedream workflow in the query string. It's two main steps. The first gets the album based on the query string value.

```js
async (event, steps, auths) => {
	if(!steps.trigger.event.query.album) $end("Missing album name in query string.");

	let result = await require("@pipedreamhq/platform").axios(this, {
	url: 'https://photoslibrary.googleapis.com/v1/albums',
		headers: {
			Authorization: `Bearer ${auths.google_photos.oauth_access_token}`,
		},
	});

	let favorite = result.albums.find(a => {
		return a.title.toLowerCase() === steps.trigger.event.query.album.toLocaleLowerCase();
	});

	if(!favorite) $end("Invalid album name passed.");

	return favorite.id;
}
```

The only real fancy part here is that I remembered to lower case the input and the album names so that it was a bit easier to use. The second step gets the photos for the album, and as before, I'm ignoring pagination for now.

```js
async (event, steps, auths) => {
	let result = await require("@pipedreamhq/platform").axios(this, {
		url: 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
		headers: {
			Authorization: `Bearer ${auths.google_photos.oauth_access_token}`,
		},
		method:'post',
		data: {
			albumId:steps.get_album.$return_value,
			pageSize:100
		}
	});

	return result.mediaItems.map(m => m.baseUrl);

}
```

Note the return of `baseUrl`. This is a URL that does *not* require authentication to work. So all I need now is a final step to return everything:

```js
async (event, steps, auths) => {

	await $respond({
	status:200,
	headers: {
		'Content-Type':'application/json'
	},
	body:steps.get_photos.$return_value
	})
}
```

The net result is I can take the URL for the workflow and simply do: https://theurl?album=something to get the photos from that album. You can see this workflow (and again, my URL will be private) here: <https://pipedream.com/@raymondcamden/getalbumphotos-p_mkCDwpQ>

## Getting the Images in Eleventy

On the Eleventy side, I could use something like `node-fetch` to get the image URLs, download them, and copy them in, but guess what? The [Eleventy Image plugin](https://www.11ty.dev/docs/plugins/image) does *everything*. Not only can I tell it to fetch an image at a URL, it can also resize it for me automaticaly! Here's my data file.

```js
require('dotenv').config();
const Image = require("@11ty/eleventy-img");
const fetch = require('node-fetch');
const fs = require('fs');

const ALBUM = 'EleventyTest';
const PHOTO_API = process.env.IMAGE_ENDPOINT + `?album=${ALBUM}`;
// desired *initial* size, this will be still be scaled appropriately
const WIDTH = 800;
const HEIGHT = 800;

module.exports = async function() {

	/*
	clean the img folder
	*/
	emptyImageFolder();

	let data = await fetch(PHOTO_API);
	let photos = await data.json();

	/*
	for each photo, rewrite URL to add H/W
	*/
	photos = photos.map(p => {
		return p + `=w${WIDTH}-h${HEIGHT}`
	});

	console.log('got ',photos.length,' photos');
	let result = [];

	for(let i=0; i<photos.length; i++) {

		let stats = await Image(photos[i], {
			widths: [null,300],
			formats:['jpeg']
		});

		/*
		stats has a lot of info we can simplify. we specified ONE dimension, but the plugin 
		will always return 2 with the second being the original
		*/
		let imageResult = {
			width: stats.jpeg[1].width,
			height: stats.jpeg[1].height,
			thumbnail_width: stats.jpeg[0].width,
			thumbnail_height: stats.jpeg[0].height,
			url: stats.jpeg[1].url,
			thumbnail_url: stats.jpeg[0].url
		};

		result.push(imageResult);
	}

	return result;
}

function emptyImageFolder() {
	let imgDir = './img/';
	if(!fs.existsSync(imgDir)) return;
	let files = fs.readdirSync(imgDir);
	for(file of files) {
		fs.unlinkSync(imgDir + file);
	}
	return;
}
```

So - I begin by hitting the endpoint and getting the array of images. Google Photos does something kinda cool with their API where you can append values to the URL to change the image returned. This is all [nicely documented](https://developers.google.com/photos/library/guides/access-media-items#base-urls) and you can see where I modify the URLs to require a specific width and height (note that Google will keep the proper aspect ration). For each image, I create an Image instance with the plugin and specify a width of 300 to create a thumbnail. The use of `null` there means keep the original size as well. In case that didn't make sense, I'm asking for the original size and one set to 300 pixels wide. For an online image gallery I'd probably actually want the 'big' image to also be constrained to something that looks nice in my layout. Obviously you would want to tweak this for your needs. 

The result of calling the Image plugin is a set of metadata that I 'reshape' into a simpler object of values for the height and width of the original and the thumbnail. I also get the URLs for each. 

At the end, my data file returns an array of images. I can then use this back in my front end. Here's a portion of the code from the home page:

```html
{% raw %}<div class="masonry-container">
{% for image in images %}
	<div class="masonry-item">
	<a href="{{image.url}}">
	<img src="{{ image.thumbnail_url }}" width="{{ image.thumbnail_width }}" height="{{ image.thumbnail_height }}">
	</a>
	</div>
{% endfor %}
</div>
{% endraw %}
```

As I said, instead of linking right to the image I'd normally link to a page that wrapped the bigger image, but again, I was focusing on the "get the images" part more.

And that's it. Pretty simple with both Pipedream and Eleventy handling the more mundane parts. Let me know if this helps or if you end up using it anywhere. You can find the complete code here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/eleventyGoogleAlbum> 

One last note - the biggest issue with this particular demo is that it won't update automatically. I could modify the Pipedream workflow to be hard coded to one particular album and then use client-side JavaScript instead. Or - I could simply schedule a rebuild once a day or such. Also, I could setup a 'secret' URL the artist could bookmark to hit and then rebuild on demand when they need. There's multiple options you could use here to make this more seamless.

Photo by <a href="https://unsplash.com/@filmlav?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Fernando Lavin</a> on <a href="https://unsplash.com/s/photos/photo-albums?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  