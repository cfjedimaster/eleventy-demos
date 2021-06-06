---
layout: post
title: "How to Enable your Jamstack Site to have a \"Rain Day\""
date: "2020-07-06"
categories: ["static sites"]
tags: ["eleventy"]
banner_image: /images/banners/farmers-market.jpg
permalink: /2020/07/06/how-to-enable-your-jamstack-site-to-have-a-rain-day
description: How to enable your Jamstack site to check the weather in the morning
---

So this is perhaps a bit of an edge case, but I was thinking about it this weekend and decided to build a quick demo of it just to see if it would actually work. Imagine a simple Jamstack site for a farmer's market. Now imagine that this particular market is closed when there is bad weather. What if we could build a Jamstack site that checked the weather in the morning and added a warning to the site that they may be closed due to rain? Here's how I implemented this idea.

First, I began with an incredibly simple one page site built with [Eleventy](https://www.11ty.dev/). You can see the site in all it's glory at <https://weather-demo.netlify.app/>. Here's how it renders normally:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/07/w1.jpg" alt="Website with no weather warning" class="lazyload imgborder imgcenter">
</p>

Now here is what it does when it thinks it may close due to weather:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/07/w2.jpg" alt="Website with weather warning" class="lazyload imgborder imgcenter">
</p>

The giant red arrow is there just to point out the change. My CSS isn't quite good enough to do something like that. ;) So how did I build this?

First, I found a weather API. It just so happens, my employer HERE has a [Weather API](https://developer.here.com/documentation/destination-weather/dev_guide/topics/overview.html). Obviously anyone would do, but I like ours so I used it. The API basically supports two formats - an observation (what's going on now) and a forecast. The observation also reports on future weather so I went with that. A basic API request could look like so:

```
https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey=${HERE_KEY}&product=observation&name=YOUR+LOCATION&metric=false
```

Where the key needs to be supplied and a location of some sort. You can also use a latitude and longitude pair or zip code if you like. Also, the last bit disables that crazy metric thing that probably won't go anywhere. Hitting this returns data for the location and possible alternatives, but if we focus on one report, the first one returned, we see the following detailed weather data:

```js
{
  daylight: 'D',
  description: 'Scattered clouds. Warm.',
  skyInfo: '9',
  skyDescription: 'Scattered clouds',
  temperature: '82.90',
  temperatureDesc: 'Warm',
  comfort: '88.75',
  highTemperature: '83.48',
  lowTemperature: '74.48',
  humidity: '72',
  dewPoint: '73.00',
  precipitation1H: '*',
  precipitation3H: '*',
  precipitation6H: '*',
  precipitation12H: '*',
  precipitation24H: '*',
  precipitationDesc: '',
  airInfo: '*',
  airDescription: '',
  windSpeed: '5.75',
  windDirection: '310',
  windDesc: 'Northwest',
  windDescShort: 'NW',
  barometerPressure: '29.97',
  barometerTrend: '',
  visibility: '10.00',
  snowCover: '*',
  icon: '2',
  iconName: 'mostly_sunny',
  iconLink: 'https://weather.ls.hereapi.com/static/weather/icon/2.png',
  ageMinutes: '10',
  activeAlerts: '0',
  country: 'United States',
  state: 'Louisiana',
  city: 'Lafayette',
  latitude: 30.2241,
  longitude: -92.0198,
  distance: 2.32,
  elevation: 11,
  utcTime: '2020-07-06T12:38:00.000-05:00'
}
```

That's a *lot* of data, and sadly 82 degrees is nice compared to what it would normally be without all the cloud cover. You can check the [API reference](https://developer.here.com/documentation/destination-weather/dev_guide/topics/resource-response-type-report.html) for detailed information about each part, but for my use I thought the `precipitation12H` would be useful. I figured if I checked this in the morning, it would be a good way to see if the market may need to close that day. I built the following in `_data/weather.js`. For folks who don't know Eleventy, this will create data my pages can use at build time. In this case, the data will be available as a variable named `weather`.

```js
const fetch = require('node-fetch');

// used to auth with HERE API
const HERE_KEY = 'c1LJuR0Bl2y02PefaQ2d8PvPnBKEN8KdhAOFYR_Bgmw';
// used for location of the market
const LOC = 'Lafayette, LA';

module.exports = async function() {
	let url = `https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey=${HERE_KEY}&product=observation&name=${encodeURIComponent(LOC)}&metric=false`;
	
	let resp = await fetch(url);
	let data = await resp.json();
	let report = data.observations.location[0].observation[0];
	console.log(report);

	// Add a simplification
	report.rainWarning = (report.precipitation12H !== '*' && report.precipitation12H > 0.02);

	return report;

}
```

You can see where I make the fetch to the API as well as where I grab the first location and observation. Finally, I add a "simplification" of my "will be possibly close" logic in the `rainWarning` value. What's cool is that if I switch to another provide for my weather data, I can just preserve this logic in the data file and my template won't need to worry. Speaking of the template, this is how I handled it:

```html
---
layout: main
title: Camden Farmer's Market
---

<section class="hero">
	<div class="hero-inner">
		<h1>Camden Farmer's Market</h1>
	</div>
</section>

<main>
	<div class="content">
	<p>
	Welcome to Camden Farmer's Market. We are located at 311 Elmondia Falling Street, Lafayette, LA 70508.
	</p>

	<p>
	Our hours are 7 days a week, 6AM to 4PM, except for federal and local holidays. <strong>Closed during inclement weather!</strong>
	</p>
	{% raw %}
	{% if weather.rainWarning %}
	<p>
		<strong>WARNING - The weather report has predicted rain and it is likely we will be closed.</strong>
	</p>
	{% endif %}

	{% endraw %}	
	<span>Photo by <a href="https://unsplash.com/@gndclouds?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">William Felker</a> on <a href="https://unsplash.com/s/photos/farmers-market?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>

	</div>
</main>
```

Just a basic IF check and nothing more. I could go more complex, but for a simple site like this, it's enough of a warning. And speaking of that warning, that brings up an interesting issue. How do we add this when our site is static?

Well first off, we could simply use JavaScript in the browser and hit the API when the client visits the site. This particular API does not support CORS but does support JSONP. However, that means every hit to the page will hit the API. HERE has an incredibly generous free tier, but I'd still like to avoid that. In this particular case, a market that opens at 6AM, I could simply check the weather at 5AM. How? I'm hosting the site on Netlify, and they support a unique build URL that you can hit to generate a new build. You can find this in your "Build hooks" setting for your site:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/07/w3.jpg" alt="Build hook" class="lazyload imgborder imgcenter">
</p>

Next I needed a way to run this on a schedule. For this I decided to use [Pipedream](https://pipedream.com/). It may be overkill, but I created a quick Workflow that used a CRON source and a "send http request" step.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/07/w4.jpg" alt="Pipedream workflow to automate building the site" class="lazyload imgborder imgcenter">
</p>

By the way, I totally suck at CRON so I used [crontab.guru](https://crontab.guru/) to help me write the expression.

So just to recap:

* My Jamstack site, on build, will check the weather report and see if rain is coming in the next 12 hours.
* My home page looks for this boolean and adds a warning when it's true.
* Pipedream will call the Netlify Build webhook daily at 5AM to refresh the site.

And that's it. Obviously not perfect, but also automated so hopefully less work for the poor soul running a market at 6AM!

<span>Photo by <a href="https://unsplash.com/@gndclouds?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">William Felker</a> on <a href="https://unsplash.com/@gndclouds?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>