---
layout: post
title: "An iTunes Audio Enabled Search Built in Vue.js"
date: "2019-09-18"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/keyboard.jpg
permalink: /2019/09/18/an-itunes-audio-enabled-search-built-in-vuejs
description: An example of the iTunes API and Audio API used with Vue.js
---

<strong>(Before I begin, a quick note. The iTunes API will <i>randomly</i> throw CORS issues, most likely due to a misconfigured server in their network. To use this in production I'd add a serverless proxy. You may, or may not, run into this while testing.)</strong> When I present on Vue.js, one of the demos I show makes use of the [iTunes Search API](https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/). It isn't necessarily that exciting of a demo, and I don't use iTunes very often, but the fact that it has interesting data and does *not* require a key of any sort makes it a good candidate for simple demos. I thought I'd quickly demonstrate this with Vue.js in the simplest form possible, and then work through some updates to improve the application. 

### Version One

In the first version, I'm just going to do a search against the API and render the results in the simplest way possible. I will provide some feedback when the search begins so the user knows what's going on, but that's pretty much. Let's start with the HTML:

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width">
		<style>
		[v-cloak] {display: none}
		</style>
		<link rel="stylesheet" href="style.css">
	</head>
	<body>

		<div id="app" v-cloak>
			<input v-model="term" type="search">
			<button @click="search">Search</button>
			<p/>

			<div v-for="result in results" class="result">
				<img :src="result.artworkUrl100">
				<b>Artist:</b> {% raw %}{{result.artistName}}{% endraw %}<br/>
				<b>Track:</b> {% raw %}{{result.trackName}}{% endraw %}<br/>
				<b>Released:</b> {% raw %}{{result.releaseDate | formatDate}}{% endraw %}
				<br clear="left">
			</div>

			<div v-if="noResults">
				Sorry, but no results were found. I blame Apple.
			</div>

			<div v-if="searching">
				<i>Searching...</i>
			</div>

		</div>

		<script src="https://unpkg.com/vue"></script>
		<script src="app.js"></script>
	</body>
</html>
```

We've got a simple form on top where you enter your terms with a button that will kick off the search. Beneath that are three divs. The first renders the results. I chose to show the artwork, artist, track, and release date. The API returns more information but I figured that was enough. The second div is only shown when no results are returned. The final div is used to indicate that the search is in progress. Now let's look at the JavaScript.

```js
Vue.filter('formatDate', function(d) {
	if(!window.Intl) return d;
	return new Intl.DateTimeFormat('en-US').format(new Date(d));
}); 

const app = new Vue({
	el:'#app',
	data:{
		term:'',
		results:[],
		noResults:false,
		searching:false
	},
	methods:{
		search:function() {
			this.results = [];
			this.searching = true;
			fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(this.term)}&limit=10&media=music`)
			.then(res => res.json())
			.then(res => {
				this.searching = false;
				this.results = res.results;
				this.noResults = this.results.length === 0;
			});
		}
	}
});
```

My code begins by defining a filter `formatDate` that makes use of the Intl spec. (If this sounds interesting, read the [article](https://vuejsdevelopers.com/2018/03/12/vue-js-filters-internationalization/) I wrote on the topic.) The application itself is fairly simple. I've got one method that fires off the request to the API. Note that I'm limiting both the total number of results and the media type to music. When done, I set the results, set the flag for no results, and that's it. 

You can demo this version here: <https://cfjedimaster.github.io/vue-demos/itunes-search/ajax-search/>. Try searching for "duran duran" because I said so. ;)

<img src="https://static.raymondcamden.com/images/2019/09/vue1.png" alt="Results of searching for Duran Duran" class="imgborder imgcenter">

### Version Two

The second version is virtually the same, except for the addition of the [Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) to play the samples returned by the API. The only thing changed in the HTML is the result view so I'll just share that part:

```html
<div v-for="result in results" class="result">
	<img :src="result.artworkUrl100">
	<b>Artist:</b> {% raw %}{{result.artistName}}{% endraw %}<br/>
	<b>Track:</b> {% raw %}{{result.trackName}}{% endraw %}<br/>
	<b>Released:</b> {% raw %}{{result.releaseDate | formatDate}}{% endraw %}<br/>
	<button @click="play(result.previewUrl)">&#9658; Play Sample</button>
	<br clear="left">
</div>
```	

In the JavaScript, I've added support for the `play` method. Here's the code:

```js
const app = new Vue({
	el:'#app',
	data:{
		term:'',
		results:[],
		noResults:false,
		searching:false,
		audio:null
	},
	methods:{
		search:function() {
			if(this.audio) {
				this.audio.pause();
				this.audio.currentTime = 0;
			}
			this.results = [];
			this.searching = true;
			fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(this.term)}&limit=10&media=music`)
			.then(res => res.json())
			.then(res => {
				this.searching = false;
				this.results = res.results;
				this.noResults = this.results.length === 0;
			});
		},
		play:function(s) {
			if(this.audio) {
				this.audio.pause();
				this.audio.currentTime = 0;
			}
			this.audio = new Audio(s);
			this.audio.play();
		}
	}
});
```

Note I have an `audio` object defined in my data. I need a "global" audio object so I can cancel a previous preview if you start a new one. (For fun, disable that logic and then play a bunch of previews at once.) And that's literally it. For this demo you should search for "hatchie", one of my favorite new bands.

<img src="https://static.raymondcamden.com/images/2019/09/vue2.png" alt="Demonstrates adding play support to search results" class="imgborder imgcenter">

You can demo this here: <https://cfjedimaster.github.io/vue-demos/itunes-search/ajax-search-2/>

### Version the Third

For the third and final version I put some lipstick on the pig and added [BootstrapVue](https://bootstrap-vue.js.org/). As you can guess, this is a Vue component library that wraps the Bootstrap UI project. I didn't do a lot to it, but you can see the result here:

<img src="https://static.raymondcamden.com/images/2019/09/vue3.png" alt="Nicely styled results" class="imgborder imgcenter">

This is my first time using BootstrapVue (well, first time in quite some time), and in general it went ok. I don't like how you have to hunt sometimes to find random properties, for example it took me a while to figure out how to do spacing. (And to be fair, "a while" was maybe two minutes or so.) Since the JavaScript didn't change at all, I'll just show the HTML update.

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width">
		<style>
		[v-cloak] {display: none}
		#app {
			padding-top: 50px;
		}
		</style>
		<link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap/dist/css/bootstrap.min.css" />
		<link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.min.css" />
		<script src="//unpkg.com/vue@latest/dist/vue.min.js"></script>
		<script src="//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.min.js"></script>
	</head>
	<body>

		<div id="app" v-cloak>
			<b-container >
				
				<b-row>
					<b-col sm="9">
						<b-form-input v-model="term" type="search"></b-form-input>
					</b-col>
					<b-col sm="3">
						<b-button @click="search" block variant="dark">Search</b-button>
					</b-col>
				</b-row>

				<b-row v-if="searching">
					<b-col sm="12">
						<i>Searching...</i>
					</b-col>
				</b-row>

				<b-row>
					<b-col sm="3" class="my-3" v-for="result in results" class="result">
						<b-card :title="result.trackName"
						class="h-100"
						img-top
						:img-src="result.artworkUrl100">
							<b-card-text>
							From {% raw %}{{ result.artistName }}{% endraw %}, released on {% raw %}{{result.releaseDate | formatDate}}{% endraw %}.
							</b-card-text>
							<b-button @click="play(result.previewUrl)" variant="dark">&#9658; Play Sample</b-button>
						</b-card>
					</b-col>
				</b-row>

				<b-row v-if="noResults">
					<b-col sm="12">
						Sorry, but no results were found. I blame Apple.
					</b-col>
				</b-row>

			</b-container>
		</div>

		<script src="app.js"></script>
	</body>
</html>
```

You can see I'm loading in various Bootstrap libraries (both JS and CSS) in my head. I've pretty much changed all of my HTML tags into Vue components. I assume most make sense as is, but obviously you can check the [BootstrapVue docs](https://bootstrap-vue.js.org/docs/) for more information. (You can ask me too of course!) All in all it was a mostly painless process, but I wish they had more of a dark theme. (They may, but I couldn't find it outside of dark UI elements.) 

You can test this version here: <https://cfjedimaster.github.io/vue-demos/itunes-search/ajax-search-3/>

Finally, all of the code may be found here: <https://github.com/cfjedimaster/vue-demos/tree/master/itunes-search>
