---
layout: post
title: "Implementing Google Custom Search Engine's JSON API in the JAMStack"
date: "2020-03-22"
categories: ["serverless"]
tags: ["javascript"]
banner_image: /images/banners/search.jpg
permalink: /2020/03/22/implementing-google-custom-search-engines-json-api-in-the-jamstack
description: Using Google Custom Search Engine JSON API via Serverless functions
---

I've been a fan of Google's [Custom Search Engine](https://cse.google.com) support for quite some time now. I use it [here](/search) to handle adding search to my site. In all the time I've used CSE though, I've only used it via the "embed" option (again, as you see on my site), but Google also supports a [JSON API](https://developers.google.com/custom-search/v1/overview) which gives you more fine grained control over displaying search results. I recently had to build a demo for someone using ColdFusion, so I thought I'd take a stab at demonstrating how to do with with serverless functions and the JAMStack.

Before I begin, some high level things to know. In general, the API is relatively simple to use. You get an API key, you get your search engine ID, and then you make a HTTP request. Google provides you with 100 requests per day which is probably fine for most folks. As I said, in general it works just fine, but there's some details you should note.

First, each search request will return the total number of results. That allows for pagination. But you are not allowed to ask for more than 100 results. So if a search for "foo" returned 250 results, you can only show the first ten "pages" of results. That's not too bad, I can't see most users clicking through over ten pages of results, but you want to ensure your code handles this correctly. 

Secondly, in some testing I saw the total number of results fluctuate while paging. So I'd search for "foo" and see X results. I'd go to the next page and still see X. But then on page 4, all of a sudden the total number changed. If I then went to page 5, the total went back to X again. 

Thirdly, also related to paging, the total number of results you can return in one request is ten. That seems odd to me, but I guess Google really wants to ensure you use those 100 requests. Again, probably not a big deal to most folks, but it's something you want to keep in mind.

A basic request looks like so: `https://www.googleapis.com/customsearch/v1?key=KEY&cx=CX&q=TERM` 

Everything there should be relatively obvious except for `cx` which is your search engine ID. If you go to the CSE portal, select one of your CSEs, you can see it here:

<img class="lazyload" data-src="https://static.raymondcamden.com/images/2020/03/cse1a.png" alt="Image from CSE Portal" class="imgborder imgcenter">

The other variable you would use is `start` which controls pagination. This number cannot go over 91. 

There are many more parameters you can use that are covered in the [reference guide](https://developers.google.com/custom-search/v1/cse/list#request). 

Alright, so let's consider a simple example of this using Netlify functions. I began by building the serverless function. I set up both my API key and CX value as environment variables.

```js
/* eslint-disable */
const fetch = require('node-fetch');

const apiKey = process.env.CSE_KEY;
const cx = process.env.CSE_CX;

exports.handler = async function(event, context) {
  let query = event.queryStringParameters.query;
  if(!query) {
    return {
      statusCode: 500,
      body:'Must pass query parameter in the query string.'
    }
  }

  let start = event.queryStringParameters.start || 1;
  if(start <= 0 || start > 91) start = 1;

  let url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&start=${start}`;
  let resp = await fetch(url);
  let data = await resp.json();
  // reduce the result a bit for simplification
  let result = {};
  result.info = data.searchInformation;
  result.info.totalResults = parseInt(result.info.totalResults, 10);
  result.items = data.items.map(d => {
    delete d.kind;
    if(d.pagemap && d.pagemap.cse_thumbnail) {
      d.thumbnail = { 
        src: d.pagemap.cse_thumbnail[0].src, 
        width: d.pagemap.cse_thumbnail[0].width, 
        height: d.pagemap.cse_thumbnail[0].height
      } 
    }
    delete d.pagemap;
    delete d.cacheId;
    return d
  });

  return {
    statusCode: 200,
    headers : {
      'Content-Type':'application/json'
    },
    body: JSON.stringify(result)
  }

}
```

I begin with a bit of validation on the query string parameters passed to the function. `query` must be passed. `start` is optional and defaults to 1. I do a bit of basic validation on it to ensure it doesn't go below 0 or over 91. 

I then do a HTTP request. The [response](https://developers.google.com/custom-search/v1/cse/list#response_1) contains a lot of information, not all that I need, so to simplify things a bit I transform the response before returning it. I focus on two elements, `searchInformation` and `items`. `searchInformation` is exactly that, information about the search. Oddly, `totalResults` is a string so I fix that on the server side. For my items, I remove things that I consider to not be important. You may feel differently and if so, just remove that `map` call. The end result is a JSON packet that looks like this (I removed most of the items to keep the size down):

```js
{
  "info": {
    "searchTime": 0.203461,
    "formattedSearchTime": "0.20",
    "totalResults": "507",
    "formattedTotalResults": "507"
  },
  "items": [
    {
      "title": "Testing Camera Quality Settings and PhoneGap/Cordova",
      "htmlTitle": "<b>Testing</b> Camera Quality Settings and <b>PhoneGap</b>/Cordova",
      "link": "https://www.raymondcamden.com/2015/04/27/testing-camera-quality-settings-and-phonegapcordova",
      "displayLink": "www.raymondcamden.com",
      "snippet": "Testing Camera Quality Settings and PhoneGap/Cordova. by Raymond Camden \non April 27, 2015 | 4 Comments. As you know, when using the Camera plugin ...",
      "htmlSnippet": "<b>Testing</b> Camera Quality Settings and <b>PhoneGap</b>/Cordova. by Raymond Camden <br>\non April 27, 2015 | 4 Comments. As you know, when using the Camera plugin&nbsp;...",
      "formattedUrl": "https://www.raymondcamden.com/.../testing-camera-quality-settings-and- phonegapcordova",
      "htmlFormattedUrl": "https://www.raymondcamden.com/.../<b>testing</b>-camera-quality-settings-and- <b>phonegap</b>cordova"
    },
    {
      "title": "Using Ripple for PhoneGap Development",
      "htmlTitle": "Using Ripple for <b>PhoneGap</b> Development",
      "link": "https://www.raymondcamden.com/2013/02/06/Using-Ripple-for-PhoneGap-Development",
      "displayLink": "www.raymondcamden.com",
      "snippet": "Feb 6, 2013 ... As a test, you can simply point to an HTML file on your local server and then click \nthe Ripple icon. Click to enable Ripple and the page is reloaded ...",
      "htmlSnippet": "Feb 6, 2013 <b>...</b> As a <b>test</b>, you can simply point to an HTML file on your local server and then click <br>\nthe Ripple icon. Click to enable Ripple and the page is reloaded&nbsp;...",
      "formattedUrl": "https://www.raymondcamden.com/.../Using-Ripple-for-PhoneGap- Development",
      "htmlFormattedUrl": "https://www.raymondcamden.com/.../Using-Ripple-for-<b>PhoneGap</b>- Development",
      "thumbnail": {
        "src": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQpl4a1d40RU7E28NnLmbDVXB4pk_aPj6-7gdOf3DCsNIq2UevXu8fTyBvV",
        "width": "251",
        "height": "201"
      }
    },
  ]
}
```

And technically - that's all I need for the back end. For the front end, I built a simple Vue.js front end. Here's the HTML portion of my form:

```html
<div id="app" v-cloak>
	<h2>Search</h2>
	<p>
	<input v-model="search" type="search"> <button @click="doSearch" :disabled="searching">Search</button>
	</p>

	<div v-if="results">
		<h3>Results</h3>
		<div v-for="result in results">
			<p>
				<span v-if="result.thumbnail">
					<img :src="result.thumbnail.src" :width="result.thumbnail.width" :height="result.thumbnail.height" class="thumbnail" />
				</span>
				<a :href="result.link" target="_new">{% raw %}{{ result.title }}{% endraw %}</a><br/>
				{% raw %}{{ result.snippet }}{% endraw %}
				<br clear="left" />
			</p>
		</div>
		<p>
		<span v-if="showPrevious"><button @click="doPrevious">Previous Results</button></span>
		<span v-if="showNext"><button @click="doNext">Next Results</button></span>
		</p>
	</div>

</div>
```

I've got a form up top and then a block to handle showing results. That block handles iterating over each result and optionally showing buttons for next and previous results. Now here's the JavaScript:

```js
const app = new Vue({
	el:'#app',
	data: {
		search:'',
		searching:false,
		results:null,
		start:1,
		showPrevious: false, 
		showNext: false
	},
	created() {
		let params = new URLSearchParams(window.location.search);
		let passedInSearch = params.get('search');
		if(passedInSearch) {
			this.search = passedInSearch;
			this.doSearch();
		}
	},
	methods: {
		async doSearch() {
			if(this.search === '') return;
			this.searching = true;
			this.results = null;
			this.showPrevious = false;
			this.showNext = false;
			let resp = await fetch(`/.netlify/functions/search?query=${encodeURIComponent(this.search)}&start=${this.start}`);
			let data = await resp.json();

			this.searching = false;
			this.results = data.items;
			// pagination:
			if(this.start > 10) {
				this.showPrevious = true;
			}
			if(data.info.totalResults > this.start + 10 && (this.start + 10 <= 91)) {
				this.showNext = true;
			}
		},
		doPrevious() {
			this.start -= 10;
			this.doSearch();
		}, 
		doNext() {
			this.start += 10;
			this.doSearch();
		}
	}
});
```

In general this is just a simple wrapper to a back end API, but pay particular attention to the `created` block. Some sites (not mine in it's current form) support having a search box in the header, or side bar, that let a user enter text, hit a button, and then sends them to a page to display results. In order to support that in my demo, I use `created` to look at the query string and see if a value is there. If so, I use that to update my form field value for searching and immediately fire off a request.

So I'd love to show this to you. It *is* live right now on a demo site. But since I've got a limit of 100 requests per day, I don't think I can safely share it. You are welcome to the [source code](https://github.com/cfjedimaster/NetlifyTestingZone) but you'll have to trust me on how awesome it looks. Wait, don't trust me, look at this most excellent screen shot:

<img class="lazyload" data-src="https://static.raymondcamden.com/images/2020/03/cse2.png" alt="Screen shot" class="imgborder imgcenter">
