---
layout: post
title: "Another Netlify Analytics Hack - Stats Per URL"
date: "2020-10-08"
categories: ["static sites"]
tags: ["javascript"]
banner_image: /images/banners/roses.jpg
permalink: /2020/10/08/another-netlify-analytics-hack-stats-per-url
description: Using the Netlify API to determine page views by URL
---

I've blogged a few times on the Netlify Analytics API (["Building a Netlify Stats Viewer in Vue.js"](https://www.raymondcamden.com/2019/10/05/building-a-netlify-stats-viewer-in-vuejs)) and ["Integrating Netlify Analytics and Eleventy"](https://www.raymondcamden.com/2020/05/18/integrating-netlify-analytics-and-eleventy)) and today I've got some more code to share. Now - every time I do this - I remind folks that there is *not* a published doc for the Netlify Analytics API. That is still the case. Today I'll also add that what I'm sharing is *very* rough. It worked for me and it's up on GitHub ([repo](https://github.com/cfjedimaster/netlify-analytics-api)), but just keep in mind that I wrote this as a tool for myself. If it can help you too, great!

For a while now I've wished I had a way to get analytics about a particular blog post. Netlify's analytics for page views are all date-based. I can easily tell what pages were viewed over a time period. But what I really wanted was the ability to see page views for a post over *all* time. 

I decided to take a crack at it with some Node.js scripts. Why Note and not a client-side application? In order to get my stats, I'd need access to *all* of my data. Technically not everything for a recent blog post, but if I wanted to search more generically, like `/2020` to see page views for my content this year, I'd need analytics from the beginning of the year. Therefore I took this approach:

1) First, I wrote a script that gets data for one specific data. It stores this in a folder.
2) I wrote a script that takes the saved data from a cache and creates one array of URL and view counts.
3) I built a Vue app that sucks in the resulting JSON and let's me do a quick filter.

Let's take a look at these - and again - remember this is rough code. Let's call it - organic, farm fed, all-natural code. First up is `get.js`, which, as you can guess, sucks in data.

```js
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const token = process.env.NETLIFY_TOKEN;
const siteId = process.env.NETLIFY_SITEID;

// Earliest will be documented
let earliest = new Date(2019,10,1);

/*
to do, determine START DATE
look at cache and see what's done
do last+1 day + X more, probably 10
*/

/*
let begin = new Date(2019,10,1);
let end = new Date(begin);
end.setDate(begin.getDate() + 1);
console.log(begin, end);
*/
async function getForDay(from, siteId, token) {
	
	let to = new Date(from);
	to.setDate(from.getDate()+1);

	let url = `https://analytics.services.netlify.com/v1/${siteId}/pages?from=${from.getTime()}&to=${to.getTime()}&timezone=-0500&limit=99999`;
	
	let result = await fetch(url, {
		headers: {
			'Authorization':`Bearer ${token}`
		}
	});
	return (await result.json()).data;

}

/*
I look at my cache folder and see which files exist. Each file is
YYYY-MM-DD.json
and from this, I can figure out my most recent time
*/
function getLastCacheDate() {
	let files = fs.readdirSync('./cache');
	if(files.length === 0) return;
	let latest = new Date(1980,0,1);
	files.forEach(f => {
		let d = f.split('.')[0];
		let [y,m,dom] = d.split('-');
		let date = new Date(y, m-1, dom);
		if(date.getTime() > latest.getTime()) {
			latest = date;
		}
	});
	return latest;
}

(async () => {
	for(let i=0;i<1;i++) {
		let latest = getLastCacheDate();
		let begin = earliest;
		if(latest) {
			begin = new Date(latest);
			begin.setDate(latest.getDate()+1);
		} 

		console.log('Fetch for '+begin);
		let data = await getForDay(begin, siteId, token);
		console.log(`Data loaded, ${data.length} items`);
		let fileName = `./cache/${begin.getFullYear()}-${(begin.getMonth()+1)}-${begin.getDate()}.json`;
		fs.writeFileSync(fileName, JSON.stringify(data), 'utf-8');
		console.log(`${fileName} written.`);
	}
})();
```

From the top, I begin by using two env variables. The token is a personal access token as I described in my [last post](https://www.raymondcamden.com/2020/05/18/integrating-netlify-analytics-and-eleventy). The site ID represents my blog, where you are right now. This part:

```js
// Earliest will be documented
let earliest = new Date(2019,10,1);
```

Comes from the fact that the analytics API returns data about how long it's been generating logs:

```js
ingestion: {
    status: 'current',
    ingestion_start: 1575158400000,
    ingestion_end: 1602014400000
}
```

I converted `ingestion_start` to a date to get what you see in earliest. You could pick any date really. The `getForDay` function handles actually hitting the API and that's actually the simplest part of this whole script.

If you scroll down into the main block, you'll first see an odd loop, from 0 to 1. Once I got my code working, I was sucking down 25 days at a time. I felt like that was safe and not abusive to Netlify's API. However, I never wrote code to "stop" at the current day. So as I got close to October 6th (the last time I played with this I believe), I simply reduced the counter by hand. Hack. 

Next, `getLastCacheDate` looks at my cache folder to figure out when I last ran the code. My cache files are named YYYY-MM-DD to make it easier to work with dates, but I still screwed this up a few times. I'm actually running this in the loop which is a bit wasteful, but I'm ok with that. 

Finally, I take the resulting data and just store it. The results look like this:

```js
[
	{
		"path": "/2015/05/17/a-simple-cordova-task-runner-for-visual-studio-code/",
		"count": 4
	},
	{
		"path": "/2006/03/30/Soundings-ColdFusion-Survey-Update-151",
		"count": 4
	},
	{
		"path": "/2004/11/15/3D322D18-EEB5-E4F3-C9B08B0042A17015",
		"count": 4
	},
	{
		"path": "/2017/03/23/check-out-paveai-for-analytics/",
		"count": 4
	},
	// LOTS MORE ROWS!
]
```

My next script, `read.js`, handles combining these files:

```js
const fs = require('fs');

let files = fs.readdirSync('./cache');
let fileData = {};

files.forEach(f => {
	let data = JSON.parse(fs.readFileSync('./cache/'+f, 'UTF-8'));
	data.forEach(i => {
		if(!fileData[i.path]) fileData[i.path]=0;
		fileData[i.path] += parseInt(i.count,10);
	});
});

let keys = Object.keys(fileData);
keys = keys.sort((a,b) => {
	if(fileData[a] < fileData[b]) return 1;
	if(fileData[a] > fileData[b]) return -1;
	return 0;
});


let sorted = [];

keys.forEach(k => {
	sorted.push({path:k, views:fileData[k]});
	//console.log(k.padEnd(80)+' '+fileData[k]);
});
console.log(JSON.stringify(sorted));
```

I read them all, create one big array, sort it such that the highest viewed pages are on top, and then output it. Here's another snippet:

```js
[
	{
		"path": "/",
		"views": 68778
	},
	{
		"path": "/recentPosts/",
		"views": 46738
	},
	{
		"path": "/2016/09/28/some-quick-nativescript-tips/",
		"views": 44004
	},
	{
		"path": "/2017/06/29/handling-sms-with-openwhisk-ibm-watson-and-twilio/",
		"views": 37420
	},
	{
		"path": "/2017/07/07/handling-sms-with-openwhisk-ibm-watson-and-twilio-an-update/",
		"views": 26174
	},
	{
		"path": "/2018/02/08/building-table-sorting-and-pagination-in-vuejs",
		"views": 6219
	},
	{
		"path": "/2019/05/01/handling-errors-in-vuejs",
		"views": 3015
	},
	{
		"path": "/olddemos",
		"views": 2769
	},
	{
		"path": "/2019/08/08/drag-and-drop-file-upload-in-vuejs",
		"views": 2685
	},
	{
		"path": "/2020/09/04/vue-quick-shot-fullscreen-api",
		"views": 2499
	},
	//LOTS MORE ROWS!
]
```

To be honest, I was really surprised to see NativeScript as my number one post. It's also incredibly depressing to see how many pages get just around a hundred views of so. Of course, my blog was up for a roughly 16 years before I enabled Netlify Analytics so I'm going to worry most about my most recent content.

I ran `read.js` and saved the output to `output.json`. I then built this horribly simple Vue app:

```html
<html>
<head>
<style>
input {
	width:400px;
}
</style>
</head>

<body>

<div id="app">
	<input v-model="search" type="search" placeholder="Enter a search term here (3 char min)">
	<span v-if="results">Total for this search: {{ total }}</span>
	<table v-if="results">
		<thead>
			<tr>
				<th>Path</th>
				<th>Views</th>
			</tr>
		</thead>
		<tr v-for="result in results">
			<td>{{result.path}}</td>
			<td>{{result.views}}</td>
		</tr>
	</table>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
const app = new Vue({
	el:'#app',
	data:{
		data:null,
		search:''
	},
	async created() {
		let resp = await fetch('./output.json');
		console.log('test');
		try {
			this.data = await resp.json();
		} catch(e) {
			console.log('wtf');
			console.error(e);
		}
	},
	computed: {
		results() {
			if(this.search.length < 3 || !this.data) return;
			return this.data.filter(d => {
				return d.path.indexOf(this.search) >= 0;
			});
		},
		total() {
			if(!this.results || this.results.length === 0) return 0;
			return this.results.reduce((prev,curr) => {
				return prev + curr.views;
			}, 0);
		}
	}
});
</script>
</body>
</html>
```

Which basically has a form field on top and a table of results:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/10/a1.jpg" alt="Table of results" class="lazyload imgborder imgcenter">
</p>

64K page views on my vue content is pretty nice. I can also search by year since my pages follow a date based path system:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/10/a2.jpg" alt="Using /2020 as the path" class="lazyload imgborder imgcenter">
</p>

Not bad for a year that is totally insane and hellish, right?

And that's it. Again, you can grab the code at the [repo](https://github.com/cfjedimaster/netlify-analytics-api) if you wish and if folks have some ideas for improvements, I'm all ears. For now my plan is to update my cache every now and then, take a look, and carry on writing blog posts a few people read. :)

<span>Photo by <a href="https://unsplash.com/@mrthetrain?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Joshua Hoehne</a> on <a href="https://unsplash.com/s/photos/cache?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>