---
layout: post
title: "Building a Customizable Weather App in Vue.js"
date: "2018-03-19T17:01:00+06:00"
categories: [javascript]
tags: [vuejs]
banner_image: /images/banners/weatherapp.jpg
permalink: /2018/03/19/building-a-customizable-weather-app-in-vue
---

I am somewhat of a weather app collector. Even though they all basically give the *exact* same information, I just have a thing for beautiful renderings of the weather. My default weather app, Yahoo Weather, can be stunning at times.

![Yahoo Weather App](https://static.raymondcamden.com/images/2018/03/yahooweather3.jpg)

A few days ago I discovered my new favorite - [Weather Kitty](http://weatherkittyapp.com/).

![Weather Kitty App](https://static.raymondcamden.com/images/2018/03/weatherkitty.jpg)

As you can guess, there is also a [Weather Puppy](http://weatherpuppy.com/), which is cute, but not cat cute. Sorry, nothing beats that. I was looking at the kitty app and realized that you can probably make a weather app on *any* topic and just churn out apps like crazy. Since "like crazy" is my main impetus for building things, I thought it would be fun (and educational!) to build a weather app in Vue. But not just any weather app. One that you could easily (with access to the code I mean) drop in your own photos. For example, one with your kids:

![My Kids App](https://static.raymondcamden.com/images/2018/03/kids2.jpg)

Or even a Marvel comics one - because - why not?

![Marvel](https://static.raymondcamden.com/images/2018/03/marvel.jpg)

In general, all of these apps tend to follow a similar pattern - get the weather and try to show an appropriate picture. In the case of the Yahoo app, it is a picture from the same geographical location. For others, it's just a picture that matches the current weather. 

My end goal here then is to create an app where you can simply provide the pictures. You will need to categorize them (here are the sunny pics, here are the rainy pics), but then you're good to go. You can plop the code up on a web site and then run the app from your browser. (And sure, if you want, you could build a hybrid mobile app too if you want, but why?)

For the first iteration of the code, I focused on getting the weather and rendering it over a hard coded picture. In the next version (which may be a while - I have a week of travel ahead of me) I'll work on the "It's raining, find the best picture" logic. You can find the current code base here: https://github.com/cfjedimaster/webdemos/tree/master/vueweather/v1. I did not upload the picture so be sure to supply your own. Ok, let's take a look at the individual components. First, the HTML.

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>Weather Demo 1</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" type="text/css" media="screen" href="main.css" />
</head>
<body class="darken">

	<div id="app" v-cloak>
		<div v-if="loading">
			<h1>Loading...</h1>
		</div>
		<div id="content" v-else>
			<h1>{% raw %}{{location}}{% endraw %}</h1>
			<p>
				<span class="temp">{% raw %}{{temp}}{% endraw %}&deg;</span><br/>
				Low: {% raw %}{{temp_low}}{% endraw %}&deg; High: {% raw %}{{temp_high}}{% endraw %}&deg;<br/>
				{% raw %}{{desc}}{% endraw %}
			</p>
		</div>
	</div>

	<script src="https://cdn.jsdelivr.net/npm/vue"></script>
	<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
	<script src="main.js"></script>
</body>
</html>
```

There's not much here. Basically I've got a loading div (that will go away when data has been received) and a few blocks for the forecast. Most weather apps support a way to add multiple cities and I have some ideas on how to support that, but I'm holding off for that till later. Also note that I've loaded [Axios](https://github.com/axios/axios). Axios is a HTTP client and seems to be popular with Vue developers. I thought it would be nice to force myself to give it a try and for the most part, it looked like a good idea. But within five minutes I ran into a [bug](https://github.com/axios/axios/issues/1000) with one of the core features, so I probably won't use it again. (That sounds a bit mean perhaps, but if I run into an issue right away with a library, I don't take that as a good sign.) 

I don't normally share the CSS, but I'll do so here. It was a bit of a strugle to get the background picture right and text lined up right. I'm 100% confident this could be done better:

```css

.darken {
	background-image:linear-gradient(
		rgba(0,0,0,0.5),
		rgba(0,0,0,0.5)
	), url(rainkids.jpg);
}

body {
	background-size:contain;
	background:url(rainkids.jpg);
}

#content {
	width: 100%;
	text-align: center;
	font-weight: bold;
	text-shadow: 1px 1px 2px black; 
	font-size: 2em;
}

.temp {
	font-size: 3em;
}

body {
	color: white;
	font-family: Arial, Helvetica, sans-serif;
}

[v-cloak] {% raw %}{display: none}{% endraw %};
```

Note the use of the gradient. This is done to slightly darken the background and make text a bit more clearer to read. Later, I need to make the background picture (which is used twice) something that I can edit via JavaScript. And speaking of JavaScript...


```js
const app = new Vue({
	el:'#app',
	data:{
		loading:true,
		lat:null,
		lon:null,
		location:null,
		temp:null,
		temp_low:null,
		temp_high:null,
		images:{
			"rain":[
				"clouds.jpg"
			]
		}
	},
	created() {

		navigator.geolocation.getCurrentPosition(pos => {
			console.log('got coordinates', pos.coords);
			this.lat = pos.coords.latitude;
			this.lon = pos.coords.longitude;
			this.loadWeather();
		});

	},
	methods:{
		loadWeather() {

			axios.get(`https://query.yahooapis.com/v1/public/yql?q=select{% raw %}%20*%{% endraw %}20from{% raw %}%20weather.forecast%{% endraw %}20where{% raw %}%20woeid%{% endraw %}20in{% raw %}%20(SELECT%{% endraw %}20woeid{% raw %}%20FROM%{% endraw %}20geo.places{% raw %}%20WHERE%{% endraw %}20text{% raw %}%3D%{% endraw %}22(${% raw %}{this.lat}{% endraw %}{% raw %}%2C${this.lon}{% endraw %}){% raw %}%22)&format=json&env=store%{% endraw %}3A{% raw %}%2F%{% endraw %}2Fdatatables.org%2Falltableswithkeys`)
			.then(res => {
				let weather = res.data.query.results.channel;
				console.log('response',weather);
				
				this.location = weather.location.city + ", " + weather.location.region;
				this.temp = weather.item.condition.temp;
				this.temp_low = weather.item.forecast[0].low;
				this.temp_high = weather.item.forecast[0].high;
				this.desc = weather.item.condition.text;
				this.loading = false;
				
			})
			.catch(e => {
				console.error(e);
			});
				
		}
	}

});
```

I begin by defining my Vue instance and some basic variables I'll use in the app. The only one I think may be confusing is the `images` block, which will be fleshed out later to let you define images for your app.

When the `created` event is fired, I do a Geolocation request. I don't properly handle the error state, but that could be added of course. Note that modern browsers require an https server to use this feature. While you definitely can test this on localhost, be aware of this restriction if you deploy to production. (And just freaking use https!)

Next is the `loadWeather` function. I went back and forth between multiple different weather API providers, but ended up with the [Yahoo Weather API](https://developer.yahoo.com/weather/). This is *not* a fan I'm a big fan of, but it is free and doesn't require a key. But look at the URL. Ick. (And I know it's ugly because it is using an embedded YQL string and YQL in general is pretty cool, but... ick!)

Once done - I simply upload my values and that's it. Want to test it? I pushed it up on Surge here: https://adhesive-flavor.surge.sh.

As I said above, the next step is to start working on image loading. What I'd like is the ability to provide multiple images per condition (so you don't always see the same thing) and a "fallback" option so that if you can't find pictures for every condition, you can at least show something. I'm definitely open to more suggestions as well - just let me know in a comment below!

<i>Header photo by <a href="https://unsplash.com/photos/YUSV-xtOHqo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Nilo Isotalo</a> on Unsplash</i>