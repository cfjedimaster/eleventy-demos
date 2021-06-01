---
layout: post
title: "Serverless JAMStack AndCats Demo"
date: "2019-11-14"
categories: ["javascript","static sites"]
tags: ["vuejs"]
banner_image: /images/banners/lovecats.jpg
permalink: /2019/11/14/serverless-jamstack-andcats-demo
description: A look at using JAMStack and the Bing Image API
---

Many years ago, I built a [demo](https://www.raymondcamden.com/2013/08/27/Another-Node-Experiment-AndKittens) called "AndKittens". This was a simple Node application that used wildcard subdomains and the [Bing Image Search API](https://azure.microsoft.com/en-us/services/cognitive-services/bing-image-search-api/) to let you find pictures of kittens and... whatever. You would use the subdomain to specify what you wanted, so for example, bacon.andkittens.us would return pictures of kittens and bacon. I thought it might be interesting to rebuild this in the JAMStack with a serverless backend. 

I've been kind of down on Microsoft Azure lately. While I really like the platform, I don't like that it doesn't have a good free tier. To be clear, it *does* have multiple free tiers and such, but it's tricky to ensure you remain within them. Some things, like Azure Functions, are technically free, but you have to pay for the disk space to store them. To be clear, I don't think Azure is overpriced. But it doesn't support the "tinker/play" developer model well. I had pretty much decided I'd stop using it completely, but I really wanted this demo to work with the Bing Image API so I decided to bite the bullet and try it again.

Another change I decided on was to skip the dynamic subdomain part. You can absolutely to wildcard domains with Netlify and Zeit and other platforms, but I decided on a simpler solution - a search box. Here's an example of how it looks.

<img src="https://static.raymondcamden.com/images/2019/11/baconcat.jpg" alt="Picture of cat with bacon" class="imgborder imgcenter">

The picture rotates every five seconds so in theory you could just leave it up and watch forever. (Although I only fetch 50 images from the API.) 

Let's take a look at the code. The complete repository may be found here: <https://github.com/cfjedimaster/andkittensserverless>

First, the front end. The HTML is rather simple:

```html
<html>
	<head>
		<title>Stuff and Cats</title>
		<style>
			/* 	https://css-tricks.com/perfect-full-page-background-image/ */

			img.bg {
				/* Set rules to fill background */
				min-height: 100%;
				min-width: 1024px;
				
				/* Set up proportionate scaling */
				width: 100%;
				height: auto;
				
				/* Set up positioning */
				position: fixed;
				top: 0;
				left: 0;
			}

			#ui {
				position: absolute;
				top: 30px;
				left: 30px;
			}
		</style>
	</head>
	<body>

		<div id="app">
				<img class="bg" :src="currentImage" v-if="currentImage">
				<div id="ui">
				<input v-model="term" type="search"> <button @click="search" :disabled="!term">Search</button>
				</div>
		</div>

		<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
		<script src="app.js"></script>
	</body>
</html>
```

The most interesting part of this I think is the full image background CSS I got from [CSS-Tricks](https://css-tricks.com/perfect-full-page-background-image/). I *love* that site and I absolutely recommend folks bookmark it. I've got a minimal amount of code to handle rendering stuff, first the image and then a form. I'm using Vue.js for my interactivity, and here's the code for that.

```js
const app = new Vue({
	el:'#app',
	data: {
		term:'',
		images:[],
		currentImage:null,
		timer:null,
		index:0
	},
	methods: {
		async search() {
			if(this.timer) clearInterval(this.timer);
			let resp = await fetch(`/api/search?term=${this.term}`);
			let data = await resp.json();
			this.images = data;
			this.currentImage = this.images[0].url;
			this.timer = setInterval(this.changeImage, 5000);
		},
		changeImage() {
			this.index++;
			this.currentImage = this.images[this.index].url;
			if(this.index > this.images.length-1) this.index = -1;
		}
	}
});
```

Basically - wait for the user to click for search, and when they do, hit my serverless API, get the results, and iterate over each one in an interval. 

The last bit is my wrapper for the image API. Bing's Image API supports a lot of different options, but I kept it simple - search for some term and cats (not kittens this time), keep it kid safe, and look for wallpaper size results.

```js
const fetch = require('node-fetch');

const key = process.env.key;
const api = 'https://api.cognitive.microsoft.com/bing/v7.0/images/search?safeSearch=strict&size=wallpaper&count=50';

module.exports = async (req, res) => {

	let term = req.query.term;
	if(!term) term='kittens';

	let resp = await fetch(api+ '&q=' + encodeURIComponent(term) + '%20AND%20cats', {
		method:'get',
		headers: {
			'Ocp-Apim-Subscription-Key':key
		}
	});
	let json = await resp.json();
	let results = json.value.map(i => {
		return {
			url: i.contentUrl,
			displayHost:i.hostPageDisplayUrl,
			host:i.hostPageUrl,
			name:i.name
		}
	});
	
	res.json(
		results
	)
	
}
 ``` 

 I'd call out two things of importance here. First note I hide my API key using Now secrets. That's how it shows up in `process.env.key`. Then note I map the results a bit to make them much smaller. Bing's API returns a *lot* of information about each result, but I only need a few. I actually use less than what I'm returning here and could further optimize this if I wanted to.

 Anyway, if you want to give this a try, and hopefully not put me over the free tier, check it out at <https://rckittens.now.sh> and let me know what you think.

 <i>Header photo by <a href="https://unsplash.com/@mariashanina?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Maria Shanina</a> on Unsplash</i>
