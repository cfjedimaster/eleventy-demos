---
layout: post
title: "Eleventy 1.0 - New Option for Global Data"
date: "2021-11-02T18:00:00"
categories: ["static sites"]
tags: "post"
description: A look at a new way to create global data for Eleventy 1.0 sites.
---

Like my [last post](https://www.raymondcamden.com/2021/10/15/eleventy-10-dynamic-ignores), this is going to be another minor example, but it's yet another cool [Eleventy 1.0](https://www.11ty.dev/blog/eleventy-v1-beta/) I'm happy to see added. (Even if I won't use it much - more on that towards the end.) Today's post is all about a new way to add global data to Eleventy, the new [`addGlobalData`](https://www.11ty.dev/docs/data-global-custom/) function.

Before Eleventy 1.0, you could define global data for your templates by using the `_data` folder (the exact name being configurable as well). In that folder you could drop in either a JSON or JavaScript file. JSON was good for setting hard coded values. Here's one I use here called `site.json`:

```json
{
	"title":"Raymond Camden",
	"description":"DevRel at Adobe, Star Wars nerd, Web/Serverless hacker, lover of good beer and good books. Oh, and cats.",
	"url": "https://www.raymondcamden.com",
	"navigation": [
		{"text":"Home", "url":"/"},
		{"text":"About","url":"/about/"},
		{"text":"Speaking","url":"/speaking/"},
		{"text":"Subscribe","url":"/subscribe/"},
		{"text":"Contact","url":"/contact/"},
		{"text":"Search","url":"/search/"}
	],
	"author_name":"Raymond Camden",
	"author_image": "/images/avatar.jpg",
	"author_location": "Lafayette, LA",
	"author_bio": "Raymond is a senior developer evangelist for Adobe. He focuses on document services, JavaScript, and enterprise cat demos.",
	"author_url":  "https://www.raymondcamden.com",
	"twitter_username": "raymondcamden",
	"github_username": "cfjedimaster",
	"codepen_username": "cfjedimaster",
	"linkedin_username": "raymondcamden",
	"youtube_username": "theraymondcamden"
}
```

JavaScript files lets you create data more dynamically. So for example, if I wanted to include Star Wars ship data in my templates, I could created `ships.js`:

```js
const fetch = require('node-fetch');

module.exports = async function() {
	let resp = await fetch('https://swapi.dev/api/films/');
	let films = await resp.json();
	return films.results;
};
```

Now in Eleventy 1.0, there's an API you can use in yuour configuration file to specify the same kind of data. So for example:

```js
eleventyConfig.addGlobalData('name', 'Eleventy Test Site');

eleventyConfig.addGlobalData('complex', {
	facebook:'facebook foo',
	twitter:'twittet goo',
	insta:'insta zoo'
});
```

I used a simple string and object above, but any valid data works here. You can also use functions:

```js
eleventyConfig.addGlobalData('generated', () => {
	let now = new Date();
	return new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(now);
});
```

As well as async functions:

```js
eleventyConfig.addGlobalData('ships', async () => {
	let shipRequest = await fetch('https://swapi.dev/api/starships');
	let ships = await shipRequest.json();
	return ships.results;
});
```

You can return promises as well if async/await isn't your thing. 

This all works as expected so obviously I tried to break it a bit. One thing I was curious about was whether or not you could access *all* your global data. So I tried this:

```js
eleventyConfig.addGlobalData('test', Object.keys(eleventyConfig.globalData));
```

And it works. The `test` object was a list of the keys to all my data. But - and this is an important but - it only contains the key created before this particular line runs. If for some reason you add stuff afterwards, it won't reflect those changes. On a whim, I tried this:

```js
eleventyConfig.on('beforeBuild', () => {
	console.log('beforeBuild');
	eleventyConfig.addGlobalData('test2', Object.keys(eleventyConfig.globalData));
	console.log('done', JSON.stringify(eleventyConfig.globalData));
});
```

And while I can confirm the log message above showed `test2`, my templates did not have access to it. I've got an [open question](https://github.com/11ty/eleventy/discussions/2062) about this on the Eleventy discussion board. 

So... I like this! Will I use it? Probably not! Why? Right now I feel like my Eleventy config file is a bit complex, especially for this site. Having my global data in `_data` makes me feel like things are a bit more organized. I also like having it there from a source control perspective. If I change one of the values in `site.json`, I'd like that history to keep to itself if that makes sense. However, I cannot stress how much I appreciate that Eleventy provides multiple different ways of solving problems. One of the reasons I've ditched other static site generators is due to overly perscriptive functionality. I think it's great we've got multiple options now for this feature. 

Don't forget that Eleventy has a "order of priority" when it comes to data. You can see this list at the ["Sources of Data"](https://www.11ty.dev/docs/data-global-custom/#sources-of-data) documentation. Let me know what you think.
