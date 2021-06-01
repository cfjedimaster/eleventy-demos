---
layout: post
title: "Building a Netlify Stats Viewer in Vue.js"
date: "2019-10-05"
categories: ["javascript", "static sites"]
tags: ["vuejs"]
banner_image: /images/banners/clouds.jpg
permalink: /2019/10/05/building-a-netlify-stats-viewer-in-vuejs
description: 
---

I'm in somewhat of a "stats building" mood lately as this is my second (see last month's post on building a [stats page for Untappd](https://www.raymondcamden.com/2019/09/28/using-oauth-and-vuejs-to-build-an-untappd-stats-page)) post on the same topic. For today's demo I'm building a stats viewer for Netlify's cool Analytics feature. (You can read [my review](https://www.raymondcamden.com/2019/07/12/netlify-analytics-an-initial-look) of the feature from when it launched.) This particular demo actually has *less* stats than Netlify but it does have a cool feature they don't support yet - changing the date range.

If you want to check out the code, you can find it up on GitHub: <https://github.com/cfjedimaster/vue-demos/tree/master/netlify-stats>. 

The Vue application makes use of the following parts:

* Vuex - nothing special here really.
* Vue Router - I made use of my first navigation guard here.
* vue-chartjs - I just made one chart so it's not terribly deep integration.
* BootstrapVue - I made use of their dynamic table stuff which was pretty cool.
* And of course, [Netlify's API](https://www.netlify.com/docs/api/).

I'm not going to share all of the code in the blog post as you can read it yourself at the repo, but I'd like to call out a few things. Here's a screen shot so you can see how it looks with my site.

<img src="https://static.raymondcamden.com/images/2019/10/nstats.jpg" alt="Demo output" class="imgborder imgcenter">

## OAuth Flow

Like my last demo, I make use of Netlify's OAuth flow so I can make calls to the API with your data. For the most part this was simple except for a few hiccups. First off, when you define your application in Netlify's administrator (this is done in your profile settings as it isn't site specific), the redirect URL is listed as optional. That is not the case. I could never get it to work when leaving it blank and passing it in my application. Maybe I did something wrong, but you want to keep it in mind. 

My OAuth flow begins with a button. When you click it, I fire off this method:

```js
login() {
	let url = netlify.getUrl(this.$store.state.clientId);
	document.location.href = url;
}
```

My Vuex store has my clientID value, hard coded, and I pass this to my Netlify API library to have it generate a URL. Here's that method:

```js
getUrl(clientid) {
	let redirect_url = window.location.href + 'callback';
	let url = `https://app.netlify.com/authorize?client_id=${clientid}&response_type=token&redirect_uri=${redirect_url}`;
	return url;
},
```

Note the hard coded `callback` path. That's built in my `Callback.vue` file and all it does is store the access token returned by Netlify:

```js
created() {
if(document.location.hash && document.location.hash.indexOf('access_token') >= 0) {
	let access_token = document.location.hash.split('=')[1].split('&')[0];
	this.$store.commit('storeToken', access_token);
	this.$router.replace('sites');
}
}
```

## Displaying Your Sites

The Sites view of my application first asks for your sites via the API and then filters it to sites using the Analytics feature. Remember that this is a paid feature so your sites won't have it by default. This is how it's called:

```js
async created() {
	let sites = await netlify.getSites(this.$store.state.token);
	this.sites = sites.filter(s => {
		return typeof s.capabilities.analytics !== 'undefined';
	});
},
```

And here's the Netlify call being made:

```js
async getSites(token) {

	let url = `https://api.netlify.com/api/v1/sites`;
	let response = await fetch(url,{ 
		headers: new Headers({
			'Authorization': 'Bearer '+ token, 
		})
	});
	return await response.json();

},
```

I render the sites using Bootstrap Cards. I've only got one so it isn't too exciting:

<img src="https://static.raymondcamden.com/images/2019/10/nsites.png" alt="Sites rendered as cards" class="imgborder imgcenter">

Currently I don't handle the "you have no available sites" option but I'd gladly take a PR adding it. To give you an idea of how Bootstrap handles the cards, here's the source of that part of the view.

```html
<b-container>
	<b-row>
		<b-col cols="4">
			<b-card
				v-for="site in sites"
				:key="site.id"
				:title="site.name"
				:img-src="site.screenshot_url"
				img-top
				class="mb-2"
				>
				
				<b-card-text>
					{% raw %}{{ site.ssl_url }}{% endraw %}
				</b-card-text>

				<b-button @click="select(site)" variant="primary">Select</b-button>
			</b-card>
		</b-col>
	</b-row>
</b-container>
```

### The Analytics

Alright, now for the fun part. As I said, my analytics are pretty limited, I mainly wanted to handle date filters. I report on three things:

* Page views
* Top pages
* Top sources

Currently the Netlify Analytics API is *not* documented, but if you use devtools while on their site you can clearly see the calls being made. Each endpoint had a pretty simple API where you could pass a max count where it made sense and use date values (as times since epoch) for filtering. So here's those calls:

```js
async getPages(token, site, from, to) {

	let url = `https://analytics.services.netlify.com/v1/${site}/pages?from=${from}&to=${to}&timezone=-0500&limit=15`;
	let response = await fetch(url,{ 
		headers: new Headers({
			'Authorization': 'Bearer '+ token, 
		})
	});
	let result = await response.json();
	return result.data;
},

async getPageViews(token, site, from, to) {

	let url = `https://analytics.services.netlify.com/v1/${site}/pageviews?from=${from}&to=${to}&timezone=-0500&limit=15`;
	let response = await fetch(url,{ 
		headers: new Headers({
			'Authorization': 'Bearer '+ token, 
		})
	});
	let result = await response.json();
	let data = result.data.map(i => {
		return {
			date:i[0],
			views:i[1]
		};
	});
	return data;
},

async getSources(token, site, from, to) {

	let url = `https://analytics.services.netlify.com/v1/${site}/sources?from=${from}&to=${to}&timezone=-0500&limit=15`;
	let response = await fetch(url,{ 
		headers: new Headers({
			'Authorization': 'Bearer '+ token, 
		})
	});
	let result = await response.json();
	return result.data;
}
```

Each one is pretty darn similar. I only do some mapping in `getPageViews` as I didn't like the original shape of the result. 

For page views I made use of a Vue wrapper for ChartJS. The docs were a bit weird at times, but I got it working. To be honest I definitely need to use it a heck of a lot more to be comfortable with it, but I loved the result. The other two reports make use of [BootstrapVue tables](https://bootstrap-vue.js.org/docs/components/table/) which support binding to data. Last time I had used their "simple" table but I really like how well the more advanced ones did things. Column customization is powerful, but I don't think I 100% understand how they work. Here's one example.

```html
<b-table :items="pages" striped hover :fields="pagesFields">
	<template v-slot:cell(path)="data">
		<a :href="data.item.link" target="_new">{% raw %}{{ data.item.path}}{% endraw %}</a>
	</template>
	<template v-slot:cell(count)="data">
		{% raw %}{{ data.item.count | num }}{% endraw %}
	</template>
</b-table>
```

To be clear, I only needed the customizations to get links in my first column and formatting in my second. There may be simpler ways of doing this.

### The Navigation Guard

The final bit was handling cases where you reload and have *not* logged in yet. I did this using a navigation guard, one of the more advanced features of the Vue Router, although it was pretty easy to use:

```js
router.beforeEach((to, from, next) => {
  if(!store.state.token &&
    (to.name === 'analytics' || to.name === 'sites')) {
      next('/');
  }
  next();
});
```

I could have done the `to.name` part easier with route metadata. I'll do that next time. :)

And that's really it. You are absolutely welcome to try the online version, but obviously it will only work if you are a Netlify user and have sites with analytics.

<https://netlify-stats.raymondcamden.now.sh/>

<i>Header photo by <a href="https://unsplash.com/@wirhabenzeit?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Dominik Schröder</a> on Unsplash</i>