---
layout: post
title: "A Google Static Maps Eleventy Plugin"
date: "2022-02-02T18:00:00"
categories: ["javascript","jamstack"]
tags: ["eleventy"]
banner_image: /images/banners/wood-map.jpg
permalink: /2022/02/02/a-google-static-maps-eleventy-plugin.html
description: A simple Eleventy plugin to support Google Static Maps
---

I've long been a fan of [Google Static Maps](https://developers.google.com/maps/documentation/maps-static/overview) (technically the "Maps Static API" which sounds weird) for quite some time, except for when, you know, I worked for a [competitor](https://www.here.com/). I've blogged about this product for *years* now as I love it's simplicity. It's not even really an API, but just a carefully crafted URL. So for example, a map of Lafayette could be done like so:

<img src="https://maps.googleapis.com/maps/api/staticmap?center=Lafayette,LA&zoom=13&size=500x500&maptype=roadmap&key=AIzaSyCA0y7kh6V8poL-faDyVf3TpnLDNf9XtQY" width="500" height="500">


The image URL is: https://maps.googleapis.com/maps/api/staticmap?center=Lafayette,LA&zoom=13&size=500x500&maptype=roadmap&key=AIzaSyCA0y7kh6V8poL-faDyVf3TpnLDNf9XtQY

The attributes of note are `center`, `zoom`, `size`, and `maptype`. The API supports precise latitude and longitude, but when you don't have that and just have an address in text, then you can use the `center` attribute. There's a *lot* to the API including adding multiple markers and other decorations. Check the [docs](https://developers.google.com/maps/documentation/maps-static/overview) for examples. 

I thought it would be fun to build support for this in Eleventy via a [shortcode](https://www.11ty.dev/docs/shortcodes/). I create a new empty Eleventy site and added a simple function to handle outputting the URL in the right format:

```js
require('dotenv').config();
const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_KEY;

module.exports = function(eleventyConfig) {


	eleventyConfig.addShortcode("staticmap", function(address, width=500, height=500, zoom=13, maptype="roadmap") {
		return `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=${zoom}&size=${width}x${height}&maptype=${maptype}&key=${GOOGLE_MAPS_KEY}`;
	});

};
```

Technically I probably shouldn't use defaults for height and width, but this lets me build a map with literally just the address. In practice you could use it like so:

```html
{% raw %}
<img src="{% staticmap "lafayette, la" %}">

<p>
<img src="{% staticmap "bellingham, wa" 900 900 %}" width="900" height="900">
</p>

<p>
<img src="{% staticmap "moscow" 400 400 13 "satellite" %}">
</p>
{% endraw %}
```

My first version handled outputting the img tag for you, but I thought folks may want to modify the class and other parameters so I figured returning just the URL was best. You can see a test of this in my Eleventy Demos repo here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/googlemaps>

Ok, so that worked just fine, and was like three lines of code, but I figured, why not make it a proper [Eleventy plugin]? So I created a new directory and moved my logic for the shortcode over there, and added basic validation support for the key:

```js
module.exports = (eleventyConfig, options) => {

	if(!options || !options.key) {
		throw new Error('The Google Static Maps key must be passed.');
	}

	eleventyConfig.addShortcode("staticmap", function(address, width=500, height=500, zoom=13, maptype="roadmap") {
		return `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=${zoom}&size=${width}x${height}&maptype=${maptype}&key=${options.key}`;
	});

}
```

I threw this up on it's own repo (<https://github.com/cfjedimaster/eleventy-plugin-googlestaticmaps>) and published it to npm. Now in my Eleventy demo, I can `npm install eleventy-plugin-googlestaticmaps` and use it via the plugin API:

```js
require('dotenv').config();

const mapPlugin = require('eleventy-plugin-googlestaticmaps');

const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_KEY;

module.exports = function(eleventyConfig) {

	eleventyConfig.addPlugin(mapPlugin, {
		key:GOOGLE_MAPS_KEY
	});

};
```

I used this in a new demo and created a quick data file named `stores.json`:

```json
[
	{
		"name":"Store Alpha", 
		"address":"4300 Ambassador Caffery Pkwy, Lafayette, LA 70508"
	},
	{
		"name":"Store Beta", 
		"address":"2706 S Fieldspan Rd, Duson, LA 70529"
	},
	{
		"name":"Store Gamma", 
		"address":"807 S 5th St, Iota, LA 70543"
	},
	
	{
		"name":"Store Delta", 
		"address":"402 N Martin Luther King Hwy, Lake Charles, LA 70601"
	}	
]
```

I then whipped up an example using pagination:

```html
{% raw %}---
pagination:
    data: stores
    size: 1
    alias: store
permalink: "stores/{{ store.name | slug }}/"
---

<p>
You can find {{ store.name }} at {{ store.address }}.
</p>

<p>
<img src="{% staticmap store.address 500 500 %}" width="500" height="500">
</p>{% endraw %}
```

That's not terribly exciting, but it works:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/02/maps1.jpg" alt="Picture of the rendered output from the template, including the store name, address, and map." class="lazyload imgborder imgcenter">
</p>

You can find this demo here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/googlemaps2>

Enjoy, and please feel free to file PRs against the [plugin repository](https://github.com/cfjedimaster/eleventy-plugin-googlestaticmaps) if you've got any ideas!

Photo by <a href="https://unsplash.com/@iambrettzeck?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Brett Zeck</a> on <a href="https://unsplash.com/s/photos/world-map?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  