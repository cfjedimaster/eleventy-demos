---
layout: post
title: "Building a Simple Image Gallery with Eleventy"
date: "2021-04-07"
categories: ["static sites"]
tags: ["eleventy"]
banner_image: /images/banners/image-gallery.jpg
permalink: /2021/04/07/building-a-simple-image-gallery-with-eleventy
description: Using the Image plugin with Eleventy to build a simple gallery
---

For a while now I've been meaning to take a look at the [Image](https://www.11ty.dev/docs/plugins/image/) plugin for Eleventy and this week I finally got around to building a simple demo. I'm not sure I used the plugin exactly as intended (I'm great for using tool the wrong way!), but once I wrapped my head around the plugin, it was fairly simple to get it working. My idea was this:

* Start with a folder of "raw" images. The idea being I could just dump in photos right from my phone or elsewhere.
* Use Eleventy (and the Image plugin) to create a standard size version of each image
* Use Eleventy (and the Image plugin) to create a thumbnail of each image
* In my site, display the thumbnails with a chance to view the original (and by original I still mean the nicer version created from the raw copy)

I got my demo up and running here (<https://imagegallery-eta.vercel.app/>) and the source is available as well (<https://github.com/cfjedimaster/eleventy-demos/tree/master/imagegallery>). 

So how did I build it? I began by just playing with the plugin. I wrote this in `.eleventy.js`:

```js
const Image = require("@11ty/eleventy-img");
const glob = require("glob-promise");

const THUMB = 250;
const FULL = 650;

(async () => {

	let options = {
		widths: [THUMB,FULL],
		formats: ['jpeg'],
		filenameFormat:function(id, src, width, format, options) {
			let origFilename = src.split('/').pop();
			//strip off the file type, this could probably be one line of fancier JS
			let parts = origFilename.split('.');
			parts.pop();
			origFilename = parts.join('.');

			if(width === THUMB) return `thumb-${origFilename}.${format}`;
			else return `${origFilename}.${format}`;
		}
	};

	let files = await glob('./rawphotos/*.{jpg,jpeg,png,gif}');
	for(const f of files) {
		console.log('doing f',f);
		let md = await Image(f, options);
	};

})();
```

I use a glob library to get all the images from my `rawphotos` folder. For each, I call the Image plugin with options for width (250 and 650), formats (just JPG), and I customized the filename to keep the original name (minus the original extension) and add `thumb-` in front of the thumbnail versions. 

When I ran this, it properly added the files to my `img` folder:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/04/elimg1.jpg" alt="Explorer folder of img outputs" class="lazyload imgborder imgcenter">
</p>

Cool - so while that worked, I then had an interesting problem. I needed to integrate this into a "real" Eleventy site with an `.eleventy.js` that did other things as well. Here was my first attempt (spoiler, it didn't work):

```js
const Image = require("@11ty/eleventy-img");
const glob = require("glob-promise");

const THUMB = 250;
const FULL = 650;

async function generateImages() {

	let options = {
		widths: [THUMB,FULL],
		formats: ['jpeg'],
		filenameFormat:function(id, src, width, format, options) {
			let origFilename = src.split('/').pop();
			//strip off the file type, this could probably be one line of fancier JS
			let parts = origFilename.split('.');
			parts.pop();
			origFilename = parts.join('.');

			if(width === THUMB) return `thumb-${origFilename}.${format}`;
			else return `${origFilename}.${format}`;
		}
	};

	let files = await glob('./rawphotos/*.{jpg,jpeg,png,gif}');
	for(const f of files) {
		console.log('doing f',f);
		let md = await Image(f, options);
	};

};

module.exports = function(eleventyConfig) {

	eleventyConfig.on('beforeBuild', async () => {
		console.log('beforeBuild');
		await generateImages();
		console.log('images done');
	});
};
```

I basically moved my logic into a function, `generateImages`, and used the `beforeBuild` Eleventy event. However, you can't use `await` in this function. I mean you *can*, but it won't work properly. This is a [known bug](https://github.com/11ty/eleventy/issues/1359) that is already fixed... for the not yet released 1.0 version. I'm betting it will be soon.

For now, I simply took the code to generate the images and moved it into a script, `doImage.js`:

```js
const Image = require("@11ty/eleventy-img");
const glob = require("glob-promise");

const THUMB = 250;
const FULL = 650;

(async () => {

	let options = {
		widths: [THUMB,FULL],
		formats: ['jpg'],
		filenameFormat:function(id, src, width, format, options) {
			let origFilename = src.split('/').pop();
			//strip off the file type, this could probably be one line of fancier JS
			let parts = origFilename.split('.');
			parts.pop();
			origFilename = parts.join('.');

			if(width === THUMB) return `thumb-${origFilename}.${format}`;
			else return `${origFilename}.${format}`;
		}
	};

	let files = await glob('./rawphotos/*.{jpg,jpeg,png,gif}');
	for(const f of files) {
		console.log(`processing ${f}`);
		await Image(f, options);
	};

})();
```

Then I wrote code in `.eleventy.js` to read these images and make them available to templates. I go back and forth between using data files and collections, but decided on a collection today. 

```js
const Image = require("@11ty/eleventy-img");
const glob = require("glob-promise");

module.exports = function(eleventyConfig) {

	eleventyConfig.addPassthroughCopy("img");
	eleventyConfig.addPassthroughCopy("css");
	eleventyConfig.addWatchTarget("css");

	eleventyConfig.addCollection('images', async collectionApi => {

		let files = await glob('./img/*.jpeg');
		//Now filter to non thumb-
		let images = files.filter(f => {
			return f.indexOf('./img/thumb-') !== 0;
		});

		let collection = images.map(i => {
			return {
				path: i,
				thumbpath: i.replace('./img/', './img/thumb-')
			}
		});

		return collection;

	});

};
```

Basically, scan the `img` folder for files, ignore the thumbnails, and return an array of paths that also includes the thumb path. 

To make this work with the script, my build command would need to look something like: `node doImages && eleventy`.

To use this, I spent five minutes Googling for "javascript image litebox libraries" and settled on [CSSBox](https://github.com/TheLastProject/CSSBox), which is a simple CSS only solution. After adding the CSS script to my layout, all I had to do was output my images and use the styles that the library wanted. I had to do a bit of logic to handle the previous and next arrows.

```html
---
layout: main
---

<h1>Image Gallery</h1>

{% raw %}
<div id="gallery">
{% for image in collections.images %}
	<div class="cssbox">
		<a href="#image{{forloop.index}}" id="image{{forloop.index}}"><img src="{{image.thumbpath}}" class="cssbox_thumb">
		<span class="cssbox_full"><img src="{{image.path}}"></span></a>
		<a class="cssbox_close" href="#void"></a>
		{% if forloop.first == false %}
		<a class="cssbox_prev" href="#image{{ forloop.index | minus: 1 }}">&lt;</a>
		{% endif %}
		{% if forloop.last == false %}
		<a class="cssbox_next" href="#image{{ forloop.index | plus: 1}}">&gt;</a>
		{% endif %}
	</div>
{% endfor %}
</div>
{% endraw %}
```

For the most part simple, but I struggled with Liquid's syntac for addition. I kept trying to do `{% raw %}{{ x + 1 }}{% endraw %}` which doesn't work.

That's it. As I said, the Image plugin is pretty easy to use and I kinda wish I had taken a look at it before. My use of it (resizing and renaming) is just one example. You can also have it generate HTML for you which is pretty powerful. Let me know what you think!

Photo by <a href="https://unsplash.com/@invictar1997?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Soragrit Wongsa</a> on <a href="https://unsplash.com/s/photos/image-gallery?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  