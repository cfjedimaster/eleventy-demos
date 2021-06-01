---
layout: post
title: "Integrating Netlify Analytics and Eleventy"
date: "2020-05-18"
categories: ["javascript","static sites"]
tags: ["eleventy"]
banner_image: /images/banners/paper_graph.jpg
permalink: /2020/05/18/integrating-netlify-analytics-and-eleventy
description: How to use Netlify's Analytics API in Eleventy
---

Before I begin, know that I'm using an *undocumented* part of the [Netlify API](https://open-api.netlify.com/) so you should proceed with caution. I've been waiting for them to release the docs for sometime now (although it didn't stop me from building my own [demo](https://www.raymondcamden.com/2019/10/05/building-a-netlify-stats-viewer-in-vuejs)) and I'm not sure if it will ever happen, but in the meantime, I'll continue to play with it. Alright, so with that out of the way, this weekend I worked on a cool little thing I've added to my blog. While you can see it on the right hand side, it's this list of links here:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/pp1.png" alt="List of Popular Posts" class="lazyload imgborder imgcenter">
</p>

This list was created by hitting the Netlify Analytics API for the site, getting the most viewed content in the past seven days, and then "manipulated" a bit before rendering. Let me describe the steps it took to get here.

## Getting the Analytics

Step one was to get the raw data. First, I created a Personal Access Token. This is done under your user profile at Netlify in the Applications section:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/pp2.png" alt="Applications page" class="lazyload imgborder imgcenter">
</p>

Once I had the key, I first wrote a script to get all of my sites. This was just so I could get the ID of my blog.

```js
const fetch = require('node-fetch');
let token = 'my key brings all the boys to the yard';

(async () => {

	let result = await fetch(`https://api.netlify.com/api/v1/sites?access_token=${token}`);
	let data = await result.json();
	data.sort((a,b) => {
		if(a.name < b.name) return -1;
		if(a.name > b.name) return 1;
		return 0;
	});
	
	data.forEach(d => {
		console.log(d.name.padEnd(50, ' ') + d.site_id);
	});

})();
```

With the ID, I then used the undocumented API to get pages with the most views. I filter to a date range from now till seven days ago. In case your curious, I discovered these API calls by using my browser developer tools.

```js
const fetch = require('node-fetch');
let token = 'damn right its better than yours';
let siteId = 'the id';

(async () => {

	let today = new Date();
	let lastWeek = new Date();
	lastWeek.setDate(today.getDate() - 7);

	let url = `https://analytics.services.netlify.com/v1/${siteId}/pages?from=${lastWeek.getTime()}&to=${today.getTime()}&timezone=-0500&limit=10`;
	
	let result = await fetch(url, {
		headers: {
			'Authorization':`Bearer ${token}`
		}
	});
	let dataOb = await result.json();
	console.log(dataOb.data);	

})();
```

This is how the result looks:

```js
[
  { path: '/', count: 19221 },
  { path: '/recentPosts/', count: 13885 },
  { path: '/2019/05/01/handling-errors-in-vuejs', count: 683 },
  { path: '/2020/05/15/lets-make-everyone-a-queen', count: 619 },
  {
    path: '/2018/02/08/building-table-sorting-and-pagination-in-vuejs',
    count: 591
  },
  { path: '/2020/05/14/want-to-learn-vuejs', count: 570 },
  {
    path: '/2019/08/08/drag-and-drop-file-upload-in-vuejs',
    count: 484
  },
  {
    path: '/2019/08/12/working-with-the-keyboard-in-your-vue-app',
    count: 386
  },
  { path: '/2019/09/01/using-geolocation-with-vuejs', count: 370 },
  {
    path: '/2013/09/10/Adding-a-file-display-list-to-a-multifile-upload-HTML-control',
    count: 366
  }
]
```

Right away you'll notice the first result is for the home page, something I'm going to ignore. The second result, `/recentPosts/`, is a result of an optimization I did for the site that I'll explain in a bit, because it comes into factor for this how I added this feature as well. 

Alright, let's get this into Eleventy!

## Integrating with Eleventy

I began my integration with Eleventy by adding a new global data file named popularposts.js. This is - easily - one of my favorite features of Eleventy. By setting this up in my global data file I'm able to have it available for my pages later. Here is the code in the proper format with Eleventy: 

```js
const fetch = require('node-fetch');

module.exports = function() {

	let token = process.env.NETLIFY_TOKEN;
	let siteId = process.env.NETLIFY_SITE_ID;

	return new Promise(async (resolve, reject) => {

		let today = new Date();
		let lastWeek = new Date();
		lastWeek.setDate(today.getDate() - 7);

		let url = `https://analytics.services.netlify.com/v1/${siteId}/pages?from=${lastWeek.getTime()}&to=${today.getTime()}&timezone=-0500&limit=15`;
		
		let result = await fetch(url, {
			headers: {
				'Authorization':`Bearer ${token}`
			}
		});
		let dataOb = await result.json();

		let pages = dataOb.data.filter(d => {
			if(d.path === '/' || d.path === '/recentPosts/') return false;
			return true;
		});
		resolve(pages);

	});

};
```

There's a few things different though. First, note that the token and siteId are loaded via environment variables. I set these up in my site settings and noticed that it didn't work with `netlify dev`. This usually does work fine so I [posted](https://community.netlify.com/t/access-environment-variables-outside-of-functions/14834) on their support forums to see what's up. In the meantime I just set the variables myself.

Next, notice I added a filter to remove both `/` and `/recentPosts/`. I think most folks will need the first one, but not the second. It may have been better to use a regular expression to only match posts. Since my posts are all date based, I could have looked for /2*** for example. 

That worked great but then I realized a problem. While the Netlify API returned the path to the page, it didn't return the title or date of the blog post. This is where things then got a bit tricky. At the time this data file runs, you do not have access to collection information, where my posts live. That's because data *drives* the pages so it has to load first. 

In order to get this working, I did the following. First, here's my layout:

```html
{% raw %}{% if popularposts %}
<section class="widget widget-recent-posts">
<h2 class="widget-title">Popular Posts</h2>
<ul class="recent-posts">
	{% for post in popularposts limit:5 %}
		{% assign postData = post.path | toTitle: collections.posts %}
		{% if postData.title != "" %}
<li class="recent-item"><a href="{{ site.url }}{{ post.path }}">{{ postData.title }}</a> <span> {{ postData.date | date: "%B %e, %Y" }}</span></li>
		{% endif %}
	{% endfor %}
</ul>
</section>
{% endif %}
{% endraw %}
```

I first see if I have popularposts (my data call could fail), and then loop over each result. For each, I use a filter, `toTitle`, to "convert" the path into page data that includes my title and date. (So `toTitle` isn't the best name.) This filter is defined in `.eleventy.js`:

```js
let titlePostCache = {};
eleventyConfig.addFilter('toTitle', (p, posts) => {
  if(titlePostCache[p]) return titlePostCache[p];
  for(let i=0;i<posts.length;i++) {
    if(posts[i].url == p) {
      titlePostCache[p] = { title: posts[i].data.title, date: posts[i].date};
      return titlePostCache[p];
    }
  }
  // cache that we couldn't match
  titlePostCache[p] = { title: ''};
  return titlePostCache;
});
```

For each path, I loop over the posts collection, look for a match, and reutrn the title and date if so. Notice I use a cache for performance. 

This worked well, but when I initially put in my template, it required a rebuild of every single page in the site when run. Because of that I employed the same technique I used for my last five posts content. I put them both in a single file template (`/recentPosts/`) that's loaded via a quick jQuery call:

```js
$('#recentPosts').load('/recentPosts/');
```

I don't even use JSON, I just load the raw HTML right into the DOM on the side there. 

And that's it. Now, one thing you'll probably notice is that this data is only generated when I built the site. I can easily address that by scheduling a daily build. But as I blog once or twice a week *very* consistently and since this isn't "business crucial" information, I'm fine with it updating whenever I post a new blog entry (or make another tweak, like to my [speaking](/speaking) page. If you want to see more of the code behind this, you can find it at the repo for this blog: <https://github.com/cfjedimaster/raymondcamden2020>. 

p.s. I'm also planning on looking at a Google Analytics version of this. They've got an [API](https://developers.google.com/analytics/devguides/reporting/core/v3/reference) so if I get time this week, I'll post a follow up!

<i>Header photo by <a href="https://unsplash.com/@isaacmsmith?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Isaac Smith</a> on Unsplash</i>