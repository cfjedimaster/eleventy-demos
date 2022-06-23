---
layout: post
title: "Writing to Google Photos from Pipedream - Some Tips"
date: "2022-04-28T18:00:00"
categories: ["serverless"]
tags: ["pipedream"]
banner_image: /images/banners/photos.jpg
permalink: /2022/04/28/writing-to-google-photos-from-pipedream-some-tips.html
description: Some notes about writing photos to Google Photos via Pipedream
---

A few days ago I blogged about [automatically backing up Switch screenshots](https://www.raymondcamden.com/2022/04/23/store-nintendo-switch-screenshots-in-the-cloud-using-pipedream) via Pipedream. In that article I demonstrated automatically copying the photos to a Dropbox folder, but my original plan had been to use a Google Photos album. I ran into multiple issues there so I switched to Dropbox. I've figured out the issues and I'd like to share this with others. This will be a bit rough so I apologize in advance, but if you've got any questions, just ask me and I'll try to help.

## Getting the Album ID

When I initially started to work on my workflow, I made a new album via the Google Photos UI, noted the URL and plucked out what I thought was the obvious ID value. Turns out, the "real" ID of an album is *not* displayed anywhere in the UI. No, instead you need to write code that makes use of the API. This code will get all your albums, display the ID and name, and let you find the one you want. 

I added a code step to Pipedream just for this purpose. You can get your albums, at most 50 at a time, like so:

```js
import { axios } from "@pipedream/platform"
export default defineComponent({
  props: {
    google_photos: {
      type: "app",
      app: "google_photos",
    }
  },
  async run({steps, $}) {
    let data = await axios($, {
      url: `https://photoslibrary.googleapis.com/v1/albums?pageSize=50`,
      headers: {
        Authorization: `Bearer ${this.google_photos.$auth.oauth_access_token}`,
      },
    });
    
    data.albums.forEach(d => {
      console.log(d.id,d.title);
    });
    

  },
})
```

Note though that if you have more than 50 albums, you will need to paginate. The URL above takes a `pageToken` attribute that uses the result of the previous call to get the next page. You could build a fancy recursive function, or do what I did - just hard code it so I could see page 2 which was enough for me.

## Getting the Album ID - Again

Ok, so the next tip is really, *really* important. The code above is useless. Yes, useless. Why? Because the Google Photos API has a strict restriction on who can can write to albums. Turns out - only the OAuth application that created the album can write to the album. This doesn't apply to reads so it wasn't an issue with my previous experiments. 

Luckily it's rather easy to make an album. Here's just the relevant change you would need to make:

```js
return await axios($, {
	url: `https://photoslibrary.googleapis.com/v1/albums`,
	headers: {
		Authorization: `Bearer ${this.google_photos.$auth.oauth_access_token}`,
	},
	method:'POST', 
	data: {
		album: {
			title:'My Photo Album Brings All the Boys to the Yard'
		}
	}
});
```

The result of this call will contain your ID. Note it - then disable the step. (Or delete it from the workflow, you really won't need it again.)

## The Upload Process

My last tip was the most painful as it feels like it took forever to figure out. I want to thank [David Lieb](https://twitter.com/dflieb) for pointing me in the right direction. 

So, the process to write to an album is mostly straight forward. First, you upload your data to an upload endpoint. This returns a upload token value. Then you hit an API call to create a new "mediaItem" and associate it with the album.

Two simple calls - but I was stuck for a while. My issue came about because I was uploading the file incorrectly, and the first call from the upload API didn't make that really clear to me. I'd then do the second call and get a vague error back:

```json
{
	"code":3, 
	"msg":"Failed: There was an error while trying to create this media item."
}
```

The docs for the [Upload API](https://developers.google.com/photos/library/guides/upload-media) are pretty clear, but I believe my issue stemmed from my use of Axios, something I don't normally use. You need to post the raw bits of your image to the endpoint. I thought I was doing that, and as I said, the result from the upload call was always kosher (as far as I knew), but it wasn't uploading the right way.

For me the trick involved ensuring I was using an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), and not just a string version of the binary data. One quick way to get an ArrayBuffer if you are using Axios to fetch your data is like so:

```js
const response = await axios('https://static.raymondcamden.com/images/banners/raypgday2.jpg', 
	{ responseType: 'arraybuffer' })
```

I know you can also craft ArrayBuffers from binary input so if you aren't using Axios to fetch the initial image, that should be an option as well. 

Once you have that, you can then do the upload:

```js
return await axios.post('https://photoslibrary.googleapis.com/v1/uploads', response.data, {
	headers: {
		Authorization: `Bearer ${this.google_photos.$auth.oauth_access_token}`,
		'Content-Type':'application/octet-stream',
		'X-Goog-Upload-Content-Type': 'image/jpeg',
		'X-Goog-Upload-Protocol': 'raw'
	}
})
```

And then add to the album:

```js
return await axios($, {
	url: `https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate`,
	headers: {
		Authorization: `Bearer ${this.google_photos.$auth.oauth_access_token}`,
	},
	method:'POST',
	data:{
		albumId:'AMfAEpyJS6RUSMaZkPxMpsQdW7UnosYYqGYEo4tsVonPchcOZe77ToJRzTNO26eor8hmwx6U2Ag1',
		newMediaItems:[{
			description:'Switch Screenshot',
			simpleMediaItem:{
			uploadToken:steps.get_upload_token.$return_value,
			fileName:'foo.jpg'
			}
		}]
	}
})
```

And just to prove it worked - here's the result in the Google Photos UI - back when I was skinny.

<p>
<img data-src="https://static.raymondcamden.com/images/2022/04/gp1.jpg" alt="Photo album with uploaded picture" class="lazyload imgborder imgcenter">
</p>