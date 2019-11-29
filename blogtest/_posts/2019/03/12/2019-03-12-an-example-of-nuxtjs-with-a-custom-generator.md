---
layout: post
title: "An Example of Nuxt.js with a Custom Generator"
date: "2019-03-12"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/routes.jpg
permalink: /2019/03/12/an-example-of-nuxtjs-with-a-custom-generator
---

Last week I had the pleasure of speaking at [DevNexus](https://devnexus.com/) on multiple Vue.js topics, one of which was the [Nuxt.js framework](https://nuxtjs.org/). I had previously looked at Nuxt many months ago and decided I didn't like it. The main issue I ran into were documentation issues and - well to be honest - just a gut feeling. When I was asked if I could give a Nuxt presentation to cover for a speaker who had to cancel, I was happy for the opportunity to give Nuxt another look. In the end, I came away with a much different opinion. I still think the docs need a bit of tweaking (I'll mention one issue in this post), but overall I'm pretty damn impressed. Nuxt adds multiple shortcuts which let you follow a convention to skip a lot of boilerplate code. It's really a nice framework that I'm hoping to use, and blog on, a bit more this year. 

Ok, so now that the intro is over, let me get into the meat of what I want to cover. Nuxt works best as a universal (server-side rendering) application, but it also supports static output. When creating static output, it can either create a "traditional" set of HTML files and the like, or a SPA (Single Page Application). So far so good. 

One of the feature of Nuxt that I really like is the easy way to create routes in your Vue application. Want `/cat` to work? Simply add `cat.vue` and you're good to go. Nuxt also easily supports dynamic routes. Given that `cat.vue` returned a list of cats, you can create a dynamic route by adding `cats/_id.vue`, where the underscore represents a dynamic value. (You can read more about this feature [here](https://nuxtjs.org/guide/routing#dynamic-routes)). Again, so far so good. 

But what happens when you generate a static version of your Nuxt app? The docs covering [static generation](https://nuxtjs.org/guide/commands) have this to say: 

<blockquote>
If you have a project with dynamic routes, take a look at the generate configuration to tell Nuxt.js how to generate these dynamic routes.
</blockquote>

This leads you to the [generate configuration](https://nuxtjs.org/api/configuration-generate) docs which then say:

<blockquote>
Dynamic routes are ignored by the generate command.
</blockquote>

Bummer. However, Nuxt supports the ability to use a function to return routes in your generate configuration. This lets you add whatever logic you want. Let's consider an example of this. I built a simple Nuxt app with two routes. The home page retrieves a list of films from the Star Wars API:

```html
<template>
  <section class="container">
    <div>

		<h1>Films</h1>

		<b-list-group>
			<b-list-group-item v-for="film in films" :key="film.episode_id" 
			:to="'film/'+film.properId">{% raw %}{{film.title}}{% endraw %}</b-list-group-item>
		</b-list-group>

    </div>
  </section>
</template>

<script>

export default {
	data() {
		return {
		}
	},
	methods: {
	},
	async asyncData(context) {
		let { data } = await context.$axios.get('https://swapi.co/api/films/');
		// add a proper id
		data.results.forEach(d => {
			d.properId = d.url.substring(0,d.url.length-1).split('/').pop();
		});
		return { films: data.results }
	}
}
</script>
```

For the most part I assume this is rather self-explanatory (but as always, *please* ask if not!), with the only exception being the `forEach` where I grab the end of the URL value used for getting specific information about the film. (The Star Wars API "list" commands actually return full data so this isn't the best example, but let's ignore that for now.)

I then created `film\_id.vue` to handle displaying the detail:

```html
<template>
	<div>
	
		<h1>{% raw %}{{film.title}}{% endraw %}</h1>

		<p>
			<pre>
{% raw %}{{film.opening_crawl}}{% endraw %}
			</pre>
		</p>

		<p>
		<b-button to="/" variant="success">Home</b-button>
		</p>

	</div>

</template>

<script>
export default {

	async asyncData(context) {
		let { data } = await context.$axios.get('https://swapi.co/api/films/'+context.route.params.id);
		return { film: data }
	}

}
</script>
```

Again, my assumption is that this is trivial enough to not need any additional context, but just let me know if not. Alright, so in theory, if we generate a static version of this Nuxt app, it will simply ignore the dynamic routes and just render the first page. Right?

Wrong.

Turns out, Nuxt seems to pick up on the dynamic route and use "SPA" mode when generating static output. Remember I said Nuxt could output static content in two forms, a more "traditional" page per route or a SPA. The docs here are a bit misleading (and I've filed a bug report on this) since it seems to work just fine. You can see this live here: <https://deserted-squirrel.surge.sh/>

Ok, but if I wanted the "non" SPA version and waned to test that custom generate support? Let's see how it looks! This is what I added to `nuxt.config.js`:

```js
generate: {
	routes:function() {
		console.log('doing my generate like a pro');
		return axios.get('https://swapi.co/api/films/')
		.then((res) => {
			return res.data.results.map((film) => {
				let properId = film.url.substring(0,film.url.length-1).split('/').pop();
				return '/film/'+properId;
			})
		});

	}
}
```

And yeah, that's it. Note that those `console.log` messages *do* work and will show up in your terminal which can be real helpful for debugging. This created a directory called `film` (it was smart enough to create it when it didn't exist) and then a folder for each id with an `index.html` file underneath it. 

Easy enough! You can actually get even more complex with this support and I encourage you to check out the [docs](https://nuxtjs.org/api/configuration-generate) for more information. Finally, you can check out this version here: <http://typical-jump.surge.sh>

Any questions? Leave me a comment below!

<i>Header photo by <a href="https://unsplash.com/photos/G8hk3cl25ZA?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Matt Howard</a> on Unsplash</i>