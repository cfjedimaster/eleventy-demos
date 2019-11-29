---
layout: post
title: "Getting Happy with Vue.js"
date: "2018-02-26T12:58:09+06:00"
categories: [javascript]
tags: [vuejs]
banner_image: /images/banners/maisie_bike.jpg
permalink: /2018/02/26/getting-happy-with-vuejs
---

A [happy day](https://www.raymondcamden.com/2018/02/26/hello-auth0/) deserves another happy blog post, right? A few weeks ago I signed up for an interesting listserv called [Data is Plural](https://tinyletter.com/data-is-plural). This is a weekly newsletter of "interesting" datasets. I put that in quote not because it's dangerous or anything, but the datasets are *incredibly* varied from week to week. I want to thank my super-smart former coworker [Erin McKean](http://erinmckean.com/) for sharing this resource.

<!--more-->

In the [last newsletter](https://tinyletter.com/data-is-plural/letters/data-is-plural-2018-02-21-edition), one of the datasets caught my eye - [HappyDB](https://rit-public.github.io/HappyDB/). HappyDB is a collection of one hundred thousand different "moments". Simply put - 100K little messages of joy. So for example:

<blockquote>
My Mother gave me a surprise visit at my home.
</blockquote>

And...

<blockquote>
I got engaged with my parents support.
</blockquote>

To be clear, this isn't all deep or emotional stuff. Sometimes the data contains stuff like this:

<blockquote>
Frankly, I am constipated over the past 2 days and not able to defecate, today my bowel got cleared that moment really makes me feel happy and my bowel feels well that moment makes me feel happy really.
</blockquote>

So yeah, there's that, but I'm going to focus on the fact that this is a giant pile of happiness. That's good, right? I thought it would be cool to turn this data into a little Vue.js application that randomly displayed one happy message at a time.

Now - as always - I know this isn't a practical idea. But I also knew that I'd learn a bit while building it. The first issue I ran into was getting the data into a form that would be usable by the web. The data is in CSV, and while I know libraries exist for this, I also figured I could do a one time conversion to JSON locally. I also knew that 100K strings would be a bit large. I decided to take a "slice" of the original data since no one was going to sit there and watch my app go through all 100k messages. With that in mind, here's what I built to prepare my data.

```js
const fs = require('fs');
const parse = require('csv-parse/lib/sync');
let contents = fs.readFileSync('./cleaned_hm.csv','UTF-8');

let rawData = parse(contents, {% raw %}{ from:2, to:5001}{% endraw %});

let data = [];
data = rawData.map(d => {
	return d[4];
});

fs.writeFileSync('./quotes.json', JSON.stringify(data));
console.log('Done - wrote '+data.length+ ' records.');
``` 

Yeah, not terribly complex. I used a nice little csv parsing library, read the file, and worked with 5000 entries. The end result was a JSON file that "weighed" 482K which is pretty big, but I thought it was acceptable. In theory I could zip it and use a client-side JavaScript Zip parser (yes, of course one exists), but for a fun little demo I thought that was overkill. Another idea I considered and threw out was storing the data in IndexedDB. I actually think that would make sense, but again, KISS (Keep it Simple, Stupid).

For the front end, I decided to use a simple transition. I'd show a message - fade it out and then fade in the new one (selected by random). This turned out to be difficult for me. Vue has [native support](https://vuejs.org/v2/guide/transitions.html) for transitions, but the docs really confused me. To be clear, there's nothing particularly wrong with them, but I had a hard time wrapping my head around them. Also, look at this:

```html
<transition name="fade">
	<p v-if="show">hello</p>
</transition>
```

The fact that a visual effect is in markup just didn't sit well in my head. I mean technically the `v-if` part of the paragraph tag represents something that can appear and disappear, but it doesn't bug me like the transition does. And again, I'm not saying Vue is doing it wrong. Just that mentally - my brain had a hard time with it. I'll also point out that Sarah Drasner has an article on the feature that is worth checking out as well: [Intro to Vue.js: Animations ](https://css-tricks.com/intro-to-vue-5-animations/).

Alright, so with that said, let me share the code I wrote. First, the front end:

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>Happy</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link href="https://fonts.googleapis.com/css?family=Happy+Monkey" rel="stylesheet"> 
	<link rel="stylesheet" type="text/css" media="screen" href="main.css" />
</head>
<body>

	<div id="app" v-cloak>
		<transition name="fade" mode="out-in">
			<p :key="text" v-bind:style="{% raw %}{fontStyle:loading}{% endraw %}">{% raw %}{{text}}{% endraw %}</p>
		</transition>
	</div>

	<div id="footer">Quotes are sourced from <a href="https://rit-public.github.io/HappyDB/">HappyDB</a>.</div>
	<script src="https://unpkg.com/vue@2.5.13/dist/vue.js"></script>
	<script src="main.js"></script>
</body>
</html>
```

The app is really just one paragraph tag wrapped in a transition. Now let's look at the code.

```js
const app = new Vue({
	el:'#app',
	data:{
		index:-1,
		quotes:[],
		text:'Loading the Happy...',
		loading:'italic'
	},
	created() {
		fetch('quotes.json')
		.then(res => res.json())
		.then(res => {
			this.quotes = res;
			console.log('loaded');

			this.newQuote();

			setInterval(() => {
				this.newQuote();
			}, 6000);
			
		});
	},
	methods:{
		newQuote() {
			index = getRandomInt(0, this.quotes.length-1);
			app.text = this.quotes[index];
			app.loading='';
		}
	}
});

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
```

The code handles loading in the JSON file, parsing it, and setting the local quotes array equal to the result. Then I select a random one and kick off an interval to load a new one every six seconds. Definitely not rocket science, but you can check out the live version here: https://cfjedimaster.github.io/webdemos/happy/.

This one was beautiful:

<blockquote>
I took my mom to a small hill at Lake Elsinore that was filled with a lot of flowers.
</blockquote>