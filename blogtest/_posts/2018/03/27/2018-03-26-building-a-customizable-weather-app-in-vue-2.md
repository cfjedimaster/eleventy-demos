---
layout: post
title: "Building a Customizable Weather App in Vue - 2"
date: "2018-03-27"
categories: [javascript]
tags: [vuejs]
banner_image: /images/banners/weatherapp.jpg
permalink: /2018/03/27/building-a-customizable-weather-app-in-vue-2
---

A few days ago I shared the first draft of a customizable Vue.js weather app ([Building a Customizable Weather App in Vue.js](https://www.raymondcamden.com/2018/03/19/building-a-customizable-weather-app-in-vue/)). Yesterday I had some time to work on an update and I thought I'd share my progress.

At the end of the first draft, my code would get your location and then use the [Yahoo Weather API](https://developer.yahoo.com/weather/) to fetch the forecast. What it didn't do was update the background to match the weather. To support this, I came up with the following procedure.

First - I'm going to take the weather type, which Yahoo uses a code for, and "collapse" it down into a few specific types. Yahoo supports nearly [fifty different types](https://developer.yahoo.com/weather/documentation.html) of weather, from tropical storms to dust. I figured it made sense to simplify the various types into a much smaller list. In theory, you could switch Yahoo out with another service and as long as you return the same core types, then the rest of the code would work fine.

Second - I wanted to make it so you (you being the person using my code for your own personalized app) could easily supply images. To support that, you can specify images by weather type like so:

```js
images = {
	type1: [ array of images ],
	type2: [ array of images]
}
```

By using an array, we can randomly select one to keep things a bit interesting so you don't see the same picture every time. 

Finally - to make it even easier for you - I support a "catchall" bucket of images that will be used if the code can't find images for a specific weather type. Or shoot, maybe you don't care about finding images for a particular type of weather and just want random pictures of your kids, weather be damned. Here's an example:

```js
images = {
	"rain": [ "kids_rain1.jpg", "kids_rain2.jpg" ],
	"snow": [ "snow_in_louisiana.jpg" ],
	"catchall": [
		"kidsa.jpg",
		"kidsb.jpg",
		"kidsc.jpg"
	]
}
```

I like this because it's simple and it allows you to be lazy too. Heck, you can even just use one image. Let's take a look at the updated code. 

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
			],
			"catchall":[
				"clouds.jpg"
			]
		},
		selectedImage:null
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

				//get the proper image
				this.selectedImage = this.getWeatherImage(weather);
				console.log(this.selectedImage);
				//reach out to the DOM, bad ray
				/*
				document.body.style.background = `url(${% raw %}{this.selectedImage}{% endraw %})`;
				document.body.style['background-image'] = `
				linear-gradient(
					rgba(1,0,0,0.5),
					rgba(0,0,0,0.5)
				), url(${% raw %}{this.selectedImage}{% endraw %});`;
				*/
				document.body.style.background = `url(${% raw %}{this.selectedImage}{% endraw %})`;

				this.loading = false;
				
			})
			.catch(e => {
				console.error(e);
			});
				
		},
		getWeatherImage(d) {
			/*
			Alrighty then - so to be clear, this is VERY specific for Yahoo. Yahoo supports (https://developer.yahoo.com/weather/documentation.html)
			49 unique weather codes. We're going to use some logic to break them down into a smaller subset. So for example, fair(day) and fair(night) will just be fair. blowing snow, snow, flurries, etc will be snow. In theory, what we simplify down to could be a set list such that if
			we switch to another service, we still return the same core results. In theory.

			Note that I expect some people may not like the 'groupings' I made. Change it how you will! :)
			Some of these I just completely punted on, like smokey and dust
			*/

			let weather = '';
			let code = d.item.condition.code;
			console.log('weather code is '+code);
			
			if(code >= 0 && code <= 4) weather = 'storm';
			if(code >= 5 && code <= 12) weather = 'rain';
			if(code >= 13 && code <= 16) weather = 'snow';
			if(code === 17 || code === 18) weather = 'rain'; // hail and sleet
			//todo: 19 dust
			if(code >= 20 && code <= 22) weather = 'foggy';
			if(code >= 23 && code <= 24) weather = 'windy';
			//todo: 25 cold (seriously - cold is a condition?)
			if(code >= 26 && code <= 30) weather = 'cloudy';
			if(code >= 31 && code <= 36) weather = 'clear'; // this include 36=hot
			if(code >= 37 && code <= 39) weather = 'storm';
			if(code === 40) weather = 'rain';
			if(code >= 41 && code <= 43) weather = 'snow';
			if(code === 44) weather = 'cloudy';
			if(code === 45) weather = 'storm';
			if(code === 46) weather = 'snow';
			if(code === 47) weather = 'storm';
			console.log('weather is '+weather);
			/*
			Ok, so now the logic is this.

			If the user specified this.images[TYPE], we expect it to be an an array and we 
			select a random one.

			Otherwise, we look for this.images.catchall, also an array, and pick randomly.
			*/
			if(this.images[weather]) {
				return this.images[weather][getRandomInt(0, this.images[weather].length)];
			} else {
				return this.images['catchall'][getRandomInt(0, this.images['catchall'].length)];
			}
		}
	}

});

//Thank you, MDN
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
```

The important part above is `getWeatherImage`. You can see my logic to convert Yahoo's multiple weather types to a simpler list. Finally I just select a random image. The last change was to update the background:

```js
document.body.style.background = `url(${% raw %}{this.selectedImage}{% endraw %})`;
```

You can see some commented out code there. I was using some CSS to darken the image and I was not able to dynamically update the URL. I ended punting on that. I'd love it if someone could help me figure that out.

You can find the code for this version here: https://github.com/cfjedimaster/webdemos/tree/master/vueweather/v2

What's next? Well, in theory, I could add support for multiple locations. I was considering that, but the last post didn't get any comments so I'm not sure if anyone is actually enjoying this. I'm totally fine with that (I had fun writing it!) but I'm not sure I'll go deeper unless there is some interest. Let me know what you think.