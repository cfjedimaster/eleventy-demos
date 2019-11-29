---
layout: post
title: "An Example of Ajax Searching with Vue.js"
date: "2018-03-01"
categories: [javascript]
tags: [vuejs]
banner_image: /images/banners/ajaxsearch.jpg
permalink: /2018/03/01/an-example-of-ajax-searching-with-vuejs
---

Last week I gave my very first [presentation on Vue.js](https://www.raymondcamden.com/2018/02/23/slide-and-assets-from-my-vuejs-talk/). In that talk I used the heck out of [CodePen](https://codepen.io/) for my demos. I love how simple it is, I love that folks can edit and run my code. All in all, it is a just a great platform that works really well with Vue. But - for my presentation I really wanted a few demos that were entirely standalone. I really like CodePen, but I worry that it is a bit too "abstract" at times, or by itself. I'm not sure if that makes sense, but in the end, I just wanted to have a few demos that were file based, 100% complete, and so forth.

I really liked one of the demos I built, so I thought it would be nice to share it individually as a post. It isn't anything that I haven't covered before per se, but like I said, I liked it. :) The demo covers a pretty common use case: Providing a search interface that uses a remote API and return the results. 

For my demo, I used the [iTunes API](https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/), which is surprisingly simple to use and doesn't require a key. Thank you, Apple. All the demo will do is provide a search interface and then render the results. Let's begin by looking at the front end:

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width">
		<style>
		[v-cloak] {% raw %}{display: none}{% endraw %}
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
				<b>Released:</b> {% raw %}{{result.releaseDate |{% endraw %} formatDate}}
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

I'll focus on the Vue-specific parts in the template above. First, note the `v-cloak` declaration. Vue will automatically remove this style from the DOM after it has loaded. By adding a simple `display:none` definition for the style, we have a handy way of handling FOUC (Flash of Unstyled Content). 

Next I've set up a text field and button for my search. I could make this more complex per the specs of the API, but this is nice and simple. The text field is tied to a value called `term` and my button fires a click event to run a method `search`. 

Beneath that I've got a div that loops over the result. The only thing probably interesting here is the use of a simple filter for the date. You'll see how that is defined in a bit.

Finally - look at the last two divs. These both are set to show up based on various flags. One for no results and one for the searching event.

Alright - now let's look at the JavaScript:

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
			this.searching = true;
			fetch(`https://itunes.apple.com/search?term=${% raw %}{encodeURIComponent(this.term)}{% endraw %}&limit=10&media=music`)
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

I begin by defining the filter, `formatDate` which just makes use of the Intl API. I've got an article on this idea coming out next week. My main app is relatively simple. I've got 4 pieces of data of which two are just flags. My real data is just the term and results. I've got one method, `search`, that hits the iTunes API and then renders the result. 

You can test this version yourself here: https://cfjedimaster.github.io/webdemos/ajax-search/index.html. The full source code can be found here: https://github.com/cfjedimaster/webdemos/tree/master/ajax-search

Ok, not exactly rocket science, but hopefully a bit useful. For the heck of it, I wrote a second version. This version adds audio playback. First, I added this to the front end:

```html
<button @click="play(result.previewUrl)">&#9658; Play Sample</button>
```

Then I updated the JavaScript:

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
			this.searching = true;
			fetch(`https://itunes.apple.com/search?term=${% raw %}{encodeURIComponent(this.term)}{% endraw %}&limit=10&media=music`)
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

I added an `audio` variable meant to represent the current piece of audio being played. Then my `play` method simply makes use of the Audio API to play it. Note that I have code to stop it on a new search or when selecting a new sample. Before I had this though it was kind of fun to click like crazy and hear all the samples playing at once.

You can try this version here: https://cfjedimaster.github.io/webdemos/ajax-search-2/. And the code may be found here: https://github.com/cfjedimaster/webdemos/tree/master/ajax-search-2. 

As always, if you have any questions about this, let me know by leaving me a comment below.

<i>Header photo by <a href="https://unsplash.com/photos/EXCeGbyolPY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Annie Theby</a> on Unsplash</i>