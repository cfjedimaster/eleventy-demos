---
layout: post
title: "Adding Algolia Search to Eleventy and Netlify - Part Two"
date: "2020-07-01"
categories: ["static sites"]
tags: ["eleventy"]
banner_image: /images/banners/search.jpg
permalink: /2020/07/01/adding-algolia-search-to-eleventy-and-netlify-part-two
description: An update to my post on using Algolia with Eleventy
---

<div style="background-color:#c0c0c0; padding: 10px">
<p><strong>Important Update: May 18, 2021</strong></p>
<p>
Recently I noticed that my search feature wasn't working. When I checked my index, it was empty. I wasn't able to replicate
it consistently so I reached out to Algolia's support. Turns out, the `clear` API call I was doing was *not* synchronous. I don't mean the HTTP aspect. That was obvious and I was doing an await on it. But the actual operation itself wasn't complete when the HTTP call was done. This meant that my next operation, where I added 6k objects, would fail as it put me over the max for my free tier. 
</p>

<p>
You'll notice that Haroen in the comments below suggested using the SDK. So did support. And that helped right away. I'm not sure why I was opposed to using the SDK, maybe I just didn't want another dependency, but I wish I had just used it as it makes the code quite a bit simpler. So for example, I now do: <code>let clearResult = await index.clearObjects().wait();</code> to handle the clear and wait for it to finish. Much easier. 
</p>

<p>
You can see the code in my deploy-succeeded serverless function here: <a href="https://github.com/cfjedimaster/raymondcamden2020/blob/master/.functions/deploy-succeeded/deploy-succeeded.js">github.com/cfjedimaster/raymondcamden2020/blob/master/.functions/deploy-succeeded/deploy-succeeded.js</a> Sorry for the mistake folks!
</p>
</div>

This will be a quick update as I'm on vacation and should be busy playing XBox, but I've got an update to my 
post on [using Algolia with Eleventy](https://www.raymondcamden.com/2020/06/24/adding-algolia-search-to-eleventy-and-netlify). Please read it first as this post won't make much sense without it. In that post, I described a way to use [Algolia](https://www.algolia.com/) with [Eleventy](https://www.11ty.dev/). The process was basically:

* Generate a JSON index of your content.
* Push the index to Algolia
* Use their JavaScript library to add a search

The second bullet point was the crucial one. I made use of [algolia-indexing](https://github.com/pixelastic/algolia-indexing) to handle updating my index. This utility created a copy of your index, did atomic updates focusing only on what changed, and then copied back your index. This utility was super cool, but it wouldn't work for me. Algolia has a max of 10k records per index on their free tier, which is a very generous amount, but my blog has a bit over six thousand posts. 

I was prepared to "give up" when Algolia, just yesterday morning, [announced](https://blog.algolia.com/introducing-algolias-most-customer-friendly-pricing/) friendlier pricing. Follow that link for details, but the part that was most important to me was that indexing operations (adding, updating, and removing records) was now free. That means I could adapt a "delete everything and re-upload data" approach for my site.

Now to be clear, this means that for a few seconds, my search index is blank. I'm ok with that. Heck, as far as I can tell I'm the only one who actually uses my [search](/search) page. But you do want to keep that in mind before you consider using the approach I describe below. If you're below 5K records, I'd definitely suggest using [algolia-indexing](https://github.com/pixelastic/algolia-indexing) instead. 

Ok, so with that in mind, here's what I'm using on the blog. 

```js
/// HANDLE ALOGLIA
// first, get my index
let dataResp = await fetch('https://www.raymondcamden.com/algolia.json');

let data = await dataResp.json();
console.log('Successfully got the data, size of articles '+data.length, data[0].title);

let host = `https://${algCredentials.appId}.algolia.net`;

//first clear
let resp = await fetch(host + `/1/indexes/${algCredentials.indexName}/clear`, {
	method:'POST',
	headers: {
	'X-Algolia-Application-Id':algCredentials.appId,
	'X-Algolia-API-Key':algCredentials.apiKey
	}
});
let result = await resp.json();
console.log('clear result is '+JSON.stringify(result));

let batch = {
	"requests":[]
};

data.forEach(d => {
	batch.requests.push({
	'action':'addObject',
	'body':d
	})
});
console.log('batch data done');

//then batch
resp = await fetch(host + `/1/indexes/${algCredentials.indexName}/batch`, {
	method:'POST',
	body: JSON.stringify(batch),
	headers: {
	'X-Algolia-Application-Id':algCredentials.appId,
	'X-Algolia-API-Key':algCredentials.apiKey
	}
});

result = await resp.json();
if(result.objectIDs) console.log(`i had ${result.objectIDs.length} objects added`);
```

As I described in my last post, I generate a JSON file representing all my content. In my Netlify `deploy-succeeded' function, I fetch that file so I can use it for my updates.

The first thing I do is use the `clear` endpoint on my index, which does what you would assume, empty the index. Then I use the `batch` endpoint to add all my data. Notice I have to 'reshape' the JSON into an array of commands (`addObject`). I kinda wish Algolia had a "addAll" type endpoint that just took an array of objects. That would make the POST a bit smaller too. But it wasn't a big deal to create that data for the batch call. 

Speaking of time - Netlify has a limit of 10 seconds for serverless function executions. While trying to get Algolia working on my site last month I asked for an extension and got the max, 20 seconds. In my testing locally, I saw the duration typically take around 8 seconds, but sometimes it took 11. Most of the time spent was in network calls, so I don't believe it's going to be an issue when running on Netlify's CDNs, but it's something to keep in mind while testing on your local machine. The `netlify dev` command will enforce a 10 second limit so you may get errors there that you would not get in production. 

I think you could also argue that it doesn't make sense to re-index your data in every build, especially since you may update your site in a way that doesn't impact content (like changing a header graphic for example), but I'm ok with this for now. 

Of course, I also had to update my [search](/search) page as well. In my [last post](https://www.raymondcamden.com/2020/06/24/adding-algolia-search-to-eleventy-and-netlify) I explained how I used the JavaScript wrapper to build a simple search interface with Vue.js. For my site, I made it a bit nicer. Here's the method I use for my search:

```js
async doSearch() {
	this.results = null;
	if(this.search === '') return;
	this.searching = true;
	this.noResults = false;
	console.log('search for '+this.search);
	let resultsRaw = await this.index.search(this.search,{
		attributesToRetrieve:['title', 'url','date'],
		attributesToSnippet:['content'],
		hitsPerPage: 50
	});

	let options = { year: 'numeric', month: 'long', day: 'numeric' };
	let formatter = new Intl.DateTimeFormat('en-US',options);
	resultsRaw.hits.forEach(h => {
		h.date = formatter.format(new Date(h.date));
	});
	this.results = resultsRaw.hits;
	this.numResults = resultsRaw.nbHits;
	this.searching = false;
	this.noResults = this.results.length === 0;
}
```

A few things. First, notice I'm asking for `date` in the results. Showing the date for my results is important so I can see which results are more recent. Next, I ask for a snippet of the `content` property, this lets me display part of the content in the result. Finally, I make use of the `Intl` API to format the dates returned in my results. I'd normally use a Vue filter for that, but as they are deprecated in Vue 3, I'm trying to wean myself off of them. Here's a screen shot of how my search page renders:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/07/alg1.jpg" alt="An example of search results" class="lazyload imgborder imgcenter">
</p>

Let me be clear - this could look nicer. Blame me, not Algolia. But I'm incredibly happy to be able to rip out Google (and their ads) and replace it with a simpler, nicer system! You can find all the code for my implementation here: <https://github.com/cfjedimaster/raymondcamden2020> As always, questions and comments are welcome!