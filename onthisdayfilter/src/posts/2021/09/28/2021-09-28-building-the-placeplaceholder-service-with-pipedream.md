---
layout: post
title: "Building the PlacePlaceHolder Service with Pipedream"
date: "2021-09-28T18:00:00"
categories: ["javascript"]
tags: ["pipedream"]
banner_image: /images/banners/whitepaper.jpg
permalink: /2021/09/28/building-the-placeplaceholder-service-with-pipedream.html
description: How I built a randomized placeholder service with Pipedream
---

Before I begin, a few quick notes. Yes, that title is intentional and not a typo. Honest. Secondly, like most of my dumb ideas, I think there's some nuggets of interesting info in here, so I'll do my best to highlight those important bits while minimizing the dumb idea. (Which I enjoyed building no matter how dumb it was and that's the important part. ;) Lastly, this post will include some images that are randomized. I am fairly confident that no image will be inappropriate. If you see something bad though please let me know.

Yesterday a friend on Facebook shared that he had recently discovered [Fill Murray](https://www.fillmurray.com/), a Bill Murray placeholder service. So for example, the URL https://www.fillmurray.com/200/300 creates:

<p>
<img data-src="https://www.fillmurray.com/200/300" alt="Fill Murray" class="lazyload imgborder imgcenter">
</p>

This is one of *many* silly image placeholder services out there, with my favorite being, of course, [placekitten](https://placekitten.com/):

<p>
<img data-src="https://placekitten.com/500/500" alt="" class="lazyload imgborder imgcenter">
</p>

Commenting on the friends FB post along with others, we were sharing different placeholder services we like, when it occured to me - what if I build a placeholder service that dynamically returned another placeholder service?

The idea was simple - all of these services support, at minimum, a height and width. So give a request to my service for a sized images, I could dynamically pick a service and craft the proper URL. I'd then simply re-direct.

I fired up a new [Pipedream](https://www.pipedream.com) workflow with a HTTP trigger. Next, I created a step that would handle getting query parameters from the URL for height and width. I could have used path parameters instead but this was a quick hack.

```js
async (event, steps) => {
	/*
	do a quick abort for favicon
	*/
	if(steps.trigger.event.url.indexOf('favicon') >= 0) $end();

	/*
	I look for height and width (or h and w) in the URL parameters and copy them out for easier access
	*/
	if(steps.trigger.event.query.w) this.width = parseInt(steps.trigger.event.query.w,10);
	if(steps.trigger.event.query.width) this.width = parseInt(steps.trigger.event.query.width,10);
	if(steps.trigger.event.query.h) this.height = parseInt(steps.trigger.event.query.h,10);
	if(steps.trigger.event.query.height) this.height = parseInt(steps.trigger.event.query.height,10);
	if(!this.width) this.width = 350;
	if(!this.height) this.height = 350;
}
```

I allow people to pass width or w and height or h. If any dimension isn't passed, it defaults to 350. By the way, the conditional on top soon won't be necessary as Pipedream has a new HTTP trigger coming that can auto block favicon requests. 

The next step simply defines my services. My thinking was to create an array of objects where each object contains the name of the service (not really needed, so mostly just for debug purposes) and a function that would map height and width to the URL for the service. Initially I had something like this:

```js
services = [
  {
    name: 'placekitten',
    map: (w,h) => `http://placekitten.com/${w}/${h}`
  },
  {
    name: 'placecage',
    map: (w,h) =>  `http://placecage.com/${w}/${h}` 
  },

];
```

Look at those fat arrow functions. That's slick, right? I'd totally get hired by Google if I wrote that during my last interview with them. I didn't. Oh well. However, in my testing, something odd happened. 

I'd select a random item from the array and I'd get an error saying map wasn't a function. I thought the problem at first was due to the fact that map is a method of arrays. I quickly tried renaming it (mapF, yes, I'm creative), but it didn't work. I confirmed that I was getting a random item by outputting name, but map wasn't there. 

I then discovered this nuggest in the [docs](https://pipedream.com/docs/workflows/steps/#use-named-exports):

<blockquote>
You can export any JSON-serializable data from a step by setting properties of this:
</blockquote>

The important bit there is "JSON-serializable", which my functions were not. 

But luckily I figured out a workaround, although it's the kinda thing that I think would *not* get me hired by Google. I defined my services in a step like so:

```js
async (event, steps) => {
	this.services = [
		{
			name: 'placekitten',
			map: 'https://placekitten.com/${w}/${h}'
		},
		{
			name: 'placecage',
			map: 'https://www.placecage.com/${w}/${h}'
		},
		{
			name:'fillmurry',
			map: 'https://www.fillmurray.com/${w}/${h}'
		},
		{
			name:'placeholder',
			map: 'https://via.placeholder.com/${w}x${h}'
		},
		{
			name:'placedog',
			map: 'https://placedog.net/${w}/${h}'
		},
		{
			name:'placebear',
			map: 'https://placebear.com/${w}/${h}'
		},
		{
			name:'placebacon',
			map: 'http://placebacon.net/${w}/${h}'
		},
		{
			name:'placebeard',
			map: 'https://placebeard.it/${w}x${h}'
		},

	];
}
```

Still an array, but notice the URL pattern is juist a basic string. Now comes the fun part. Here's my final step: 

```js
async (event, steps) => {
	getRandomInt = function(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
	}

	makeTS = function(s) {
		return new Function("w","h","return `"+s+"`");
	}

	let service = steps.defineservices.services[getRandomInt(0, steps.defineservices.services.length)];
	let url = makeTS(service.map)(steps.getargs.width, steps.getargs.height);

	await $respond({
		status:302, 
		headers: {
			Location:url
		}
	})
}
```

I've been writing JavaScript since it came out in a Netscape beta and I don't think I ever used the [Function constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function). Basically I use the 'format' string inside a function that makes a new function and turns it into a template string. I then call that function: `let url = makeTS(service.map)(steps.getargs.width, steps.getargs.height);`

I don't know about you but that feels like some proper black magic vodoo shit right there. So given my root URL of https://placeplace.m.pipedream.net I can then do stuff like https://placeplace.m.pipedream.net?width=300&height=500:

<p>
<img data-src="https://placeplace.m.pipedream.net?width=300&height=500" alt="Placeholder test" class="lazyload imgborder imgcenter">
</p>

And here's a few more examples of differing sizes:

<p>
<img data-src="https://placeplace.m.pipedream.net?width=200&height=200" alt="Placeholder test" class="lazyload imgborder imgcenter">
</p>

<p>
<img data-src="https://placeplace.m.pipedream.net?width=400&height=400" alt="Placeholder test" class="lazyload imgborder imgcenter">
</p>

<p>
<img data-src="https://placeplace.m.pipedream.net?width=500&height=200" alt="Placeholder test" class="lazyload imgborder imgcenter">
</p>

If for some unknown reason you want to see the whole workflow, you can check it out here: <https://pipedream.com/@raymondcamden/placeplace-p_q6CzbDg>

Photo by <a href="https://unsplash.com/@kellysikkema?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Kelly Sikkema</a> on <a href="https://unsplash.com/s/photos/placeholder?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  