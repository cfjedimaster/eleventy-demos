---
layout: post
title: "Eleventy 1.0 - Global Data via Plugins Example"
date: "2021-11-07T18:00:00"
categories: ["jamstack"]
tags: ["eleventy"]
banner_image: /images/banners/allthewayto11.jpg
permalink: /2021/11/07/eleventy-10-global-data-via-plugins-example.html
description: A followup on my post concerning Eleventy's new addGloblData feature
---

A few days ago I [blogged](https://www.raymondcamden.com/2021/11/02/eleventy-10-new-option-for-global-data) about a new Eleventy 1.0 feature that gives a new way to use global data. This new feature adds a method call, `addGlobalData`, that can be used in your `eleventy.js` config file. I said I thought this was cool, but that I'd probably not use it. I'd rather have my global data living in my data folder where it's easier to see, easier to keep track of, and so forth. 

When I tweeted, Zach responded that this featured was added by [Mike Riethmuller](https://twitter.com/MikeRiethmuller) as a way for plugins to add to a site's global data. Immediately that lit a few light bulbs in my head and the feature made a lot more sense to me. I thought I'd whip up a demo or two to see this in action and here's what I came up with. 

Before I begin, let me say that the two plugins I describe below were just built for this demo and aren't meant for real usage. If you like em, cool, copy the copy from the repo link below. Just keep in mind though that they're a bit rough. Alright, so for my first demo, I built a "weather" plugin. Now, the idea of using weather data in a static site may or may not make sense. (See ["How to Enable your Jamstack Site to have a Rain Day"](https://www.raymondcamden.com/2020/07/06/how-to-enable-your-jamstack-site-to-have-a-rain-day) for an example.) But I've got a thing for weather data so I figured why not. 

I used the free weather API from [OpenWeatherMap](https://openweathermap.org/api) which has a simple endpoint that looks like so:

https://api.openweathermap.org/data/2.5/weather?zip=YOURZIP&appid=YOURKEY&units=imperial

I built an Eleventy plugin that lets you pass in a zip code and your key:

```js
const fetch = require('node-fetch');

module.exports = (eleventyConfig, options) => {

	// key is where to save the data
	if(!options) options = {};

	if(!options.name) options.name = 'weatherData';

	if(!options.key) {
		throw new Error('API key required for weather plugin.');
	}

	if(!options.zip) {
		throw new Error('Zip code required for weather plugin.');
	}

	eleventyConfig.addGlobalData(options.name, async () => {

		let req = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${options.zip}&appid=${options.key}&units=imperial`);
		let data = await req.json();
		return data;

	});
}
```

I could transform the data but I kept it as is. Note the option for `name`. This lets you have control over how the plugin writes to the global data scope. Back in my "main" Eleventy site, I loaded the plugin via a relative path as it's not in npm:

```js
const weatherPlugin = require('../weatherplugin/');
```

And then loaded it:

```js
const weatherAPIKey = process.env.KEY;

eleventyConfig.addPlugin(weatherPlugin, { 
	key: weatherAPIKey,
	zip:'90210'
});
```

I then used it in one of my templates:

```html
<p>
{% raw %}Current temp: {{ weatherData.main.temp }} degrees{% endraw %}
</p>
```

To demonstrate giving the data a unique name, you can specify it in the options:

```js
eleventyConfig.addPlugin(weatherPlugin, { 
	key: weatherAPIKey,
	zip:'70508',
	name:'localWeather'
});
```

Now to use it I simply pass the new variable name:

```html
<p>
{% raw %}Local Current temp: {{ localWeather.main.temp }} degrees{% endraw %}
</p>
```

Not necessarily rocket science, but kinda cool I think. To kick it up a notch, I built something along the lines of what Mike had in mind - integration with CMS APIs. I fired up a local WordPress server (using the excelllent [Local](https://localwp.com/) app) and built an *incredibly* barebones WordPress Eleventy plugin:

```js
const fetch = require('node-fetch');

module.exports = (eleventyConfig, options) => {

	if(!options) options = {};

	if(!options.name) options.name = 'posts';

	if(!options.host) {
		throw new Error('Host required for WordPress plugin.');
	}

	let headers = {};
	if(options.username && options.password) {
		headers['Authorization'] = 'Basic ' + Buffer.from(options.username + ":" + options.password).toString('base64');
	}

  	let url = options.host + '/wp-json/wp/v2/posts?orderby=date&order=desc';

	eleventyConfig.addGlobalData(options.name, async () => {
		try {
			let req = await fetch(url, {
			headers
			});
			let data = await req.json();
			data = data.map(p => {
				return {
					title:p.title.rendered,
					content:p.content.rendered,
					date:p.date
				}
			});
			return data;
		} catch(e) {
			console.log('error', e);
		}

	});

}
```

This plugin hits a configured WordPress host and fetches the lastest posts. I do a minor bit of remapping of the data but the end result is that WordPress posts are now available as global data. Back in my site I loaded it:

```js
const wpPlugin = require('../wordpress');
```

And then configured the plugin:

```js
eleventyConfig.addPlugin(wpPlugin, { 
	host:'https://funny-cave.localsite.io',
	username:'admin',
	password:'admin'
});
```

And literally - that's it! I could then add posts to my site using the pagination feature:

```html
{% raw %}---
pagination:
  data: posts
  size: 1
  alias: post
permalink: "posts/{{ post.title | slug }}/index.html"
---

<h1>{{ post.title }}</h1>

{{ post.content }}
{% endraw %}
```

This could all be a lot more polished, but like I said, these uses cases really help me understand how `addGlobalData` will be useful to Eleventy users. If you want to play with my demos, you can find them here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/plugindatademo>
