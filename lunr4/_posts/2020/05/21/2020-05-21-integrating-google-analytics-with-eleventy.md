---
layout: post
title: "Integrating Google Analytics with Eleventy"
date: "2020-05-21"
categories: ["javascript","static sites"]
tags: ["eleventy"]
banner_image: /images/banners/paper_graph.jpg
permalink: /2020/05/21/integrating-google-analytics-with-eleventy
description: How to use Google Analytics with Eleventy
---

Before I begin, this article is *not* about adding Google Analytics to your site. Google provides a HTML/JS snippet you can just copy and paste into your code and that's about as simple as you can get. For Eleventy, you would do this in your main layout file so it's include everywhere. There ya go, if that's what you wanted, you can stop reading. ;) This article is about how to integrate Google Analytics *data* into your site, and is a followup to the [blog post](https://www.raymondcamden.com/2020/05/18/integrating-netlify-analytics-and-eleventy) I did earlier this week demonstrating how to do that with Netlify Analytics. 

Hopefully you've read that previous article as this one will follow a similar pattern. As with most things Google API related, I spent a huge amount of time with authentication and authorization issues and much less time using their API. It's gotten a point where I dread working with their APIs. Not because their APIs don't work well, but because authentication seems to be so difficult, especially if you're not using OAuth. Alright, enough of a rant, let's do this.

## Getting the Analytics

Google Analytics has a [REST API](https://developers.google.com/analytics/devguides/reporting/core/v4) that lets you get any reporting information out via API calls that you would have available via the dashboard. Using it in a Node.js environment requires you to first create a service account. Generate the JSON key for that account and save it to your file system. (I'll use the file system for this information in the first portion of the article, and then talk about how to move away from that.) 

Next, you'll want to install the `googleapis` package. This contains wrappers for all of their supported APIs. 	

Now for the crucial part. When you create a service account, it will include an email address in the data. It will look something like this:

```js
"client_email": "damnga@myprojectname.iam.gserviceaccount.com",
```

Yes, "damnga" is "damn google analytics" - I was frustrated. Copy the email address, go to your Google Analytics dashboard, and add it as a user to the property your working with. This can be done via the Admin link. 

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/ga1.png" alt="View User Management" class="lazyload imgborder imgcenter">
</p>

All it needs is "Read &amp; Analyze" permissions. While in your dashboard, also click the "View Settings" link and get your View ID:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/ga2.png" alt="View ID" class="lazyload imgborder imgcenter">
</p>

Alright, once you've done that, let's look at the code, bit by bit at first. Start off initializing the library:

```js
const {google} = require('googleapis');
let creds = require('./credentials4.json');


const auth = new google.auth.GoogleAuth({
	credentials:creds,
	scopes: ['https://www.googleapis.com/auth/analytics.readonly']
});

const ap = google.analyticsreporting({
	version:'v4',
	auth:auth
});
```

Now you're ready to make reports. The API supports batching so you can ask for multiple things at once. In general most Google APIs are simple once you've gotten past the auth part, but the Analytics API is rather complex. I wanted a report over the past seven days of page views. Here's how I did it:

```js
const res = await ap.reports.batchGet({
requestBody: {
	reportRequests: [
	{
		viewId: '73496341',
		dateRanges: [
		{
			startDate: '7daysAgo',
			endDate: 'yesterday',
		},
		],
		dimensions:[
		{ "name": 'ga:pagePath' },
		],
		metrics: [
		{
			expression: 'ga:pageviews',
		},
		],
		orderBys:[
		{ fieldName: "ga:pageviews", sortOrder:'DESCENDING' }
		],
		pageSize:10
	},
	],
},
});
```

From what I can gather, `metrics` is what you are asking for and `dimensions` is what you want back, in this case a report of the path that generated the page views. I do sorting and limiting as well. The result data is complex as well. I'll share it here but feel free to skim it:

```js
{
	"rows": [
		{
			"dimensions": [
				"/article/perform-date-manipulations-based-on-adding-or-subtracting-time/"
			],
			"metrics": [
				{
					"values": [
						"153"
					]
				}
			]
		},
		{
			"dimensions": [
				"/"
			],
			"metrics": [
				{
					"values": [
						"41"
					]
				}
			]
		},
		{
			"dimensions": [
				"/article/create-a-random-nonce-string-using-javascript/"
			],
			"metrics": [
				{
					"values": [
						"16"
					]
				}
			]
		},
		{
			"dimensions": [
				"/all/"
			],
			"metrics": [
				{
					"values": [
						"8"
					]
				}
			]
		},
		{
			"dimensions": [
				"/article/traversing-dom-subtrees-with-recursive-walk-the-dom-function/"
			],
			"metrics": [
				{
					"values": [
						"7"
					]
				}
			]
		},
		{
			"dimensions": [
				"/article/check-if-a-value-is-an-array/"
			],
			"metrics": [
				{
					"values": [
						"5"
					]
				}
			]
		},
		{
			"dimensions": [
				"/tag/array/"
			],
			"metrics": [
				{
					"values": [
						"5"
					]
				}
			]
		},
		{
			"dimensions": [
				"/article/map-a-nodelist-to-an-array-of-properties/"
			],
			"metrics": [
				{
					"values": [
						"3"
					]
				}
			]
		},
		{
			"dimensions": [
				"/submit/"
			],
			"metrics": [
				{
					"values": [
						"3"
					]
				}
			]
		},
		{
			"dimensions": [
				"/tag/math/"
			],
			"metrics": [
				{
					"values": [
						"3"
					]
				}
			]
		}
	],
	"totals": [
		{
			"values": [
				"275"
			]
		}
	],
	"rowCount": 30,
	"minimums": [
		{
			"values": [
				"1"
			]
		}
	],
	"maximums": [
		{
			"values": [
				"153"
			]
		}
	]
}
```

I turned this into simpler data like so:

```js
let report = res.data.reports[0].data;
let data = report.rows.map(r => {
return { path: r.dimensions[0], views: r.metrics[0].values[0]};
});
```

Which gives me the simpler:

```js
[
	{
		"path": "/article/perform-date-manipulations-based-on-adding-or-subtracting-time/",
		"views": "153"
	},
	{
		"path": "/",
		"views": "41"
	},
	{
		"path": "/article/create-a-random-nonce-string-using-javascript/",
		"views": "16"
	},
	{
		"path": "/all/",
		"views": "8"
	},
	{
		"path": "/article/traversing-dom-subtrees-with-recursive-walk-the-dom-function/",
		"views": "7"
	},
	{
		"path": "/article/check-if-a-value-is-an-array/",
		"views": "5"
	},
	{
		"path": "/tag/array/",
		"views": "5"
	},
	{
		"path": "/article/map-a-nodelist-to-an-array-of-properties/",
		"views": "3"
	},
	{
		"path": "/submit/",
		"views": "3"
	},
	{
		"path": "/tag/math/",
		"views": "3"
	}
]
```

Woot. That worked, now let's get this into Eleventy!

## Integrating with Eleventy

As with my [previous demo](https://www.raymondcamden.com/2020/05/18/integrating-netlify-analytics-and-eleventy), I moved my Node code into an Eleventy `_data` file called `popularpages.js`. Here it is:

```js
require('dotenv').config();

const {google} = require('googleapis');
let creds = JSON.parse(process.env.GOOGLE_AUTH);

const auth = new google.auth.GoogleAuth({
	credentials:creds,
	scopes: ['https://www.googleapis.com/auth/analytics.readonly']
});

const ap = google.analyticsreporting({
	version:'v4',
	auth:auth
});

module.exports = function() {

	return new Promise(async (resolve, reject) => {

		const res = await ap.reports.batchGet({
			requestBody: {
			reportRequests: [
				{
				viewId: '73496341',
				dateRanges: [
					{
					startDate: '7daysAgo',
					endDate: 'yesterday',
					},
				],
				dimensions:[
					{ "name": 'ga:pagePath' },
				],
				metrics: [
					{
					expression: 'ga:pageviews',
					},
				],
				orderBys:[
					{ fieldName: "ga:pageviews", sortOrder:'DESCENDING' }
				],
				pageSize:10
				},
			],
			},
		});

		let report = res.data.reports[0].data;
		let data = report.rows.map(r => {
			return { path: r.dimensions[0], views: r.metrics[0].values[0]};
		}).filter(d => {
			if(d.path.indexOf('article') === -1) return false;
			return true;
		});;

		resolve(data);

	});

};
```

Outside of "shaping" it into the format Eleventy wants, there's two main changes. First, I load in my Google auth via an environment variable. I took the JSON, removed the line breaks, and set it as an environment variable locally and as an environment variable in my Netlify site settings.

The second change is the `filter` call. For the site in question ([JavaScript Cookbook](https://www.javascriptcookbook.com)), I only wanted to show popular articles and not include tag pages or other pages. As with the last example, this is the part you would want to tweak for your own needs. 

Then I put it on my home page. 

{% raw %}
```html
<h3>Popular Articles</h3>

{% for article in popularpages limit:5 %}
	{% assign articleData = article.path | toData: collections.articles %}
	<a href="{{article.path}}">{{articleData.title}}</a> - {% dateFormat articleData.published %}<br/>
{% endfor %}
```
{% endraw %}

The `toData` filter there is how I "translate" a path into the proper Eleventy data including the title and publication date. While the filter is pretty much the same as my previous example, here it is:

```js
let titleArticleCache = {};
eleventyConfig.addFilter('toData', (p, articles) => {
	if(titleArticleCache[p]) return titleArticleCache[p];
	for(let i=0;i<articles.length;i++) {
		if(articles[i].url == p) {
		titleArticleCache[p] = { title: articles[i].data.title, published: articles[i].data.published};
		return titleArticleCache[p];
		}
	}
	// cache that we couldn't match
	titleArticleCache[p] = { title: ''};
	return titleArticleCache[p];
});
```

And here's how it looks:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/ga3.png" alt="Example output" class="lazyload imgborder imgcenter">
</p>

You can see it live at the [JavaScript Cookbook](https://www.javascriptcookbook.com/) and the complete code at the GitHub repo: <https://github.com/cfjedimaster/javascriptcookbookstatic>