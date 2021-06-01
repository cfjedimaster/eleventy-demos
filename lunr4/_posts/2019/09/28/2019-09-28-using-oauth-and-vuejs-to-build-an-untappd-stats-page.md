---
layout: post
title: "Using OAuth and Vue.js to Build an Untappd Stats Page"
date: "2019-09-28"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/beer.jpg
permalink: /2019/09/28/using-oauth-and-vuejs-to-build-an-untappd-stats-page
description: 
---

Every now and then I try to remember to remind folks - I hope that my readers assume when I share stuff like this that I'm sharing as I learn. This is my first time doing anything with OAuth and Vue.js so most likely there's ways to do it better. As always, I *strongly* encourage my readers to leave me a comment below if they have any suggestions whatsoever. I wanted to build something with Vue.js that would use OAuth to talk to a service. At the same time, I also wanted to do something with [Untappd](https://untappd.com). Untappd is a "social network" type app for beer drinkers. I pretty much ignore the "social" aspect and just use it to record the unique beers I drink. Whenever I try a new beer I'll record and rate it in the app.

I've been a member of the site since March of 2011. It was also one of the first popular apps built using Cordova/PhoneGap. I've known for a while now that they've got an API and I thought it would be kind of neat to build a "stats" page using their service. Now to be clear, they already *have* stats available. You can go pretty deep at my profile page: <https://untappd.com/user/cfjedimaster>. And if you support the site you get even more stats. But of course, I didn't let that stop me from building something that I thought would give me more experience with Vue, and as I said, try to work with OAuth.

To begin, I read over the [API documentation](https://untappd.com/api/dashboard) and created my application. Authentication with the API works like so:

<ol>
<li>You link the user to an endpoint on Untappd.</li>
<li>The user will be prompted to login there.</li>
<li>The user is redirected back to your site, where you will use server-side code to fetch an access token.</li>
<li>You can then use the access token to make authenticated requests to the API.</li>
</ol>

Nothing too crazy, but obviously step three there requires a hybrid solution, you can't do it all in Vue.js. I decided to use the simple serverless functionality provided by [Zeit](https://zeit.co/home) (see my [blog post](https://www.raymondcamden.com/2019/09/06/a-look-at-zeits-zero-config-and-serverless-platform) in it earlier this month) as a way to handle that aspect. 

For my stats, and again, most of this is on the site, I decided to show the following:

* Total number of unique beers.
* Total number of checkins (I don't usually checkin a beer I've already recorded).
* Average ABV, IBU of my beers.
* My average rating.
* My favorite and least favorite beers.
* My favorite styles by number of checkins. I could have also done it by average rating and that would be better, but I kept it simple for now. (For folks curious, my truly favorite style is Märzen.)

Here's the initial screen prompting you to login:

<img src="https://static.raymondcamden.com/images/2019/09/u1.png" alt="Initial screen" class="imgborder imgcenter">

After clicking the login screen, you'll be prompted to login over at Untappd:

<img src="https://static.raymondcamden.com/images/2019/09/u2.jpg" alt="Untappd login" class="imgborder imgcenter">

Back on my site, I use the API to get your checkins and then render some lovely stats:

<img src="https://static.raymondcamden.com/images/2019/09/u3.jpg" alt="Stats view" class="imgborder imgcenter">

OK, so let's look at the code. Before I begin, note that you can find the entire codebase here: <https://github.com/cfjedimaster/vue-demos/tree/master/untappd>.

The initial state of the application assumes you are not logged in. I'll show in a bit how we detect that but here's the HTML for the login button:

```html
<b-button @click="login" v-if="showLogin" variant="success" size="lg">Login via Untappd</button-b>
```

You'll note that I'm using [BootstrapVue](https://bootstrap-vue.js.org/) again. Here's the login method:

```js
login() {
	let redirect_url = 'https://untappd.raymondcamden.now.sh/api/auth';
	let url = `https://untappd.com/oauth/authenticate/?client_id=${CLIENTID}&response_type=code&redirect_url=${redirect_url}`;
	document.location.href = url;
},
```

Untappd requires me to pass a `redirect_url` which is where, as you can guess, the user will be redirected to after logging in. This points to the serverless function I wrote. My `CLIENTID` value is from the application I created and is safe to use here in client-side code. Once redirected to Untappd and then returned, they hit my serverless function, auth.js:

```js
const fetch = require('node-fetch');

module.exports = async (req, res) => {

	const CLIENTID = process.env.UT_CLIENTID;
	const CLIENTSECRET = process.env.UT_CLIENTSECRET;
	const REDIRECT_URL = process.env.UT_REDIRECT_URL;

	let code = req.query.code;
	
	let response = await fetch(`https://untappd.com/oauth/authorize/?client_id=${CLIENTID}&client_secret=${CLIENTSECRET}&response_type=code&redirect_url=${REDIRECT_URL}&code=${code}`);
	let data = await response.json();
	res.writeHead(302, { Location: '/#access_token='+data.response.access_token });
	res.end();

}
```

Pretty small, right? Untappd sends me a code. I use that code, my `CLIENTID` and `CLIENTSECRET` values to then request an access token value. When I have that, I redirect the user back to the Vue app with the token in the URL hash. Back in the Vue app, my `created` handler picks up on it:

```js
async created() {
	if(document.location.hash && document.location.hash.indexOf('access_token') >= 0) {
		this.access_token = document.location.hash.split('=')[1];
		this.showLogin = false;
		this.showStats = true;
		await this.getBeers();
		this.prepareBeers();
	}
},
```

Now we get down to business. Untappd has an API limit of 100 calls per hour per user. The most beers I can get in one API call is 50. So I wrote functionality to:

* Get 50 beers at a time, to a max of 90 calls (4500 beers)
* Cache the results for one hour using LocalStorage.

Let's take a look at this code.

```js
async getBeers() {
	
	/*
	Untappd has kinda tight limits on API calls so we need to cache.
	*/

	console.log('get mah beers!');
	let beers = [];
	let profile = {};

	if(!this.hasCache()) {

		// get my info first
		let meRequest = await fetch(API + `user/info?access_token=${this.access_token}`);
		let profileData = await meRequest.json();
		profile = profileData.response.user;

		let hasMore = true;
		// x is used as a sanity check and to keep us under the limit of 100. I use 90 so I have some wiggle room
		let x = 0;
		let rootUrl = API + `user/beers/?access_token=${this.access_token}&limit=50`;
		let thisUrl = rootUrl;
		while(hasMore && x < 90) {
			console.log(thisUrl);
			let result = await fetch(thisUrl);
			let data = await result.json();
			beers = beers.concat(data.response.beers.items);
			if(data.response.pagination.next_url && data.response.pagination.next_url !== '') { 
				thisUrl = rootUrl + `&offset=${data.response.pagination.offset}`;
			} else {
				hasMore = false;
			}
			x++;
		}
		console.log('all done');
		this.setCache(beers, profile);
	} else {
		console.log('got from cache');
		let cache = this.getCache();
		beers = cache.beers; 
		profile = cache.profile;
	}
	console.log('ready for next');
	this.beers = beers;
	this.profile = profile;
	this.showLoading = false;
},
hasCache() {
	let cache = localStorage.getItem(CACHE_KEY);
	if(!cache) return false;
	let cache_ts = localStorage.getItem(CACHE_KEY_TS);
	if(!cache_ts) return false;
	let duration = new Date().getTime() - cache_ts;
	return duration < CACHE_MAX;
},
getCache() {
	return JSON.parse(localStorage.getItem(CACHE_KEY));
},
setCache(beers, profile) {
	localStorage.setItem(CACHE_KEY, JSON.stringify({beers, profile}));
	localStorage.setItem(CACHE_KEY_TS, new Date().getTime());
},
```

I begin by seeing if I have cached information. You can see that logic in `hasCache` and `getCache`. Typically I wouldn't store a large blob of JSON in LocalStorage, but IndexDB felt a bit too heavy for this. Feel free to argue with me about this! If I don't have a cache, I start off by first getting the user profile. Then I start getting your beers. This is done in a loop to handle pagination. I use the simple named `x` variable as my way of ensuring I stay within API limits. And yes, I screwed this up multiple times. 

Once I've got all the data, I have another method that prepares this data for rendering.

```js
prepareBeers() {
	console.log('Im now going to do some data massaging so we can render');
	this.$set(this.stats, 'totalUnique', this.beers.length);

	let myStyles = {};
	for(let i=0;i < this.beers.length; i++) {

		let beerCheckin = this.beers[i];
		this.$set(this.stats, 'totalRating', this.stats.totalRating += beerCheckin.user_auth_rating_score);
		this.$set(this.stats, 'totalAbv', this.stats.totalAbv += beerCheckin.beer.beer_abv);
		this.$set(this.stats, 'totalIbu', this.stats.totalIbu += beerCheckin.beer.beer_ibu);

		if(!myStyles[beerCheckin.beer.beer_style]) myStyles[beerCheckin.beer.beer_style] = 0;
		myStyles[beerCheckin.beer.beer_style]++;
	}

	// do averages
	this.$set(this.stats, 'avgRating', this.stats.totalRating / this.stats.totalUnique);
	this.$set(this.stats, 'avgAbv', this.stats.totalAbv / this.stats.totalUnique);
	this.$set(this.stats, 'avgIbu', this.stats.totalIbu / this.stats.totalUnique);

	this.topBeers = this.beers.sort((a, b) => {
		if(a.user_auth_rating_score > b.user_auth_rating_score) return -1;
		if(a.user_auth_rating_score < b.user_auth_rating_score) return 1;
		return 0;
	}).slice(0,10)
	.map(b => {
		return this.mapBeer(b);
	});

	/*
	Filtering zeros as I think those are false positives
	*/ 
	this.worstBeers = this.beers.filter(b => {
		return b.user_auth_rating_score !=0;
	})            
	.sort((a, b) => {
		if(a.user_auth_rating_score > b.user_auth_rating_score) return 1;
		if(a.user_auth_rating_score < b.user_auth_rating_score) return -1;
		return 0;
	}).slice(0,10)
	.map(b => {
		return this.mapBeer(b);
	});

	// Convert my hash into an array of objects
	let stylesArray = [];
	for(let key in myStyles) {
		stylesArray.push({name:key, value:myStyles[key]});
	}

	stylesArray = stylesArray.sort((a, b) => {
		if(a.value < b.value) return 1;
		if(a.value > b.value) return -1;
		return 0;
	}).slice(0,20);
	this.styles = stylesArray;

},
```

This is mostly boring things like getting averages and sorting and stuff. The only part really fun for me was using array methods in chain to filter and sort and the like. 

And that's it. If you want to try it (although if you don't use Untappd it won't work too well for you), simply go to <https://untappd.raymondcamden.now.sh>. Let me know what you think!

<i>Header photo by <a href="https://unsplash.com/@christinhumephoto?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Christin Hume</a> on Unsplash</i>