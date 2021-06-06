---
layout: post
title: "Using Pre-Built Lunr Indexes with Eleventy"
date: "2021-01-22"
categories: ["static sites"]
tags: ["eleventy"]
banner_image: /images/banners/search.jpg
permalink: /2021/01/22/using-pre-built-lunr-indexes-with-eleventy
description: Switching to Pre-Built Lunr indexes with Eleventy sites
---

Way back in 2019 I wrote a blog post on [integrating Lunr with Eleventy](https://www.raymondcamden.com/2019/10/20/adding-search-to-your-eleventy-static-site-with-lunr). [Lunr](https://lunrjs.com/) is a pretty nifty light-weight search engine. One of the features it has is the ability to use a [pre-built index](https://lunrjs.com/guides/index_prebuilding.html). This saves the client from having to build the index on the fly. I took a look at this earlier and built up a demo I'd like to share.

First off, you should definitely read my [earlier post](https://www.raymondcamden.com/2019/10/20/adding-search-to-your-eleventy-static-site-with-lunr). I'm not going to cover all of that again as the older post still works well today. In essence it boils down the following steps:

* Determine what you want to search.
* Determine how you're going to build your index. This is a bit different from the first step as while you may decide you want to search blog entries, you need to figure out exactly what the index will contain. So perhaps the first three paragraphs of the blog entry and the tags used for the post. You have to weigh what you want to search against the size of your index. You don't want user's having to download a 500K file just to search.
* In your client side code, load your data and build the index from it.
* Then whip up your search code.

That's a bit high level, but as I said, the previous post goes into more detail. According to the Lunr docs, pre-building indexes can be beneficial:

<blockquote>
<p>
For large numbers of documents, it can take time for Lunr to build an index. The time taken to build the index can lead a browser to block; making your site seem unresponsive.
</p>

<p>
A better way is to pre-build the index, and serve a serialised index that Lunr can load on the client side much quicker.
</p>
</blockquote>

Creating a pre-built index is simple. You take the same code you used to build your index and just `JSON.stringify` it. If we're doing this before the client tries to search then it needs to be server-side, and luckily Eleventy makes this easy with the [afterBuild](https://www.11ty.dev/docs/events/#afterbuild) event. I first used this in my last post (["Accessing Eleventy Data on the Client Side"](https://www.raymondcamden.com/2021/01/18/accessing-eleventy-data-on-the-client-side)) and it works pretty much as you would expect. 

Here's what I added to my `.eleventy.js` file:

```js
const outputDir = './_site/';
const fs = require('fs');
const lunr = require('lunr');

eleventyConfig.on('afterBuild', () => {
	let data = fs.readFileSync(outputDir + '/raw.json','utf-8');
	let docs = JSON.parse(data);

	let idx = lunr(function () {
		this.ref('id');
		this.field('title');
		this.field('content');

		docs.forEach(function (doc, idx) {
			doc.id = idx;
			this.add(doc); 
		}, this);
	});

	fs.writeFileSync(outputDir + 'index.json', JSON.stringify(idx));
});
```

First, you'll note I hard code the output directory. It's a known issue that the Eleventy config file doesn't have access to these settings and hopefully that will be corrected in the future. I begin by reading in a file named `raw.json`. In the previous post on working with Eleventy and Lunr, I used Liquid to create my raw data file and named it `index.json`. That was a bad name as it really wasn't the index, but rather the *source* of what I use to build my index. 

I read in the file and create my index in literally the same fashion I did in the earlier post. Once done, I write the file back out again and use the name `index.json`. So now my site has both the raw data of my index and the actual built index.

In order to use this, I needed to change my search code. I know I said to read the previous post, but just in case you didn't, here's how I loaded my data and built my index:

```js
async created() {
	let result = await fetch('/index.json');
	docs = await result.json();
	// assign an ID so it's easier to look up later, it will be the same as index
	this.idx = lunr(function () {
		this.ref('id');
		this.field('title');
		this.field('content');

		docs.forEach(function (doc, idx) {
			doc.id = idx;
			this.add(doc); 
		}, this);
	});
	this.docs = docs;
},
```

Remember that initially I named my raw data `index.json` - sorry if that's confusing. So how do we use the pre-built index? Here's the new version:

```js
async created() {
	let index = await fetch('./index.json');
	let indexData = await index.json();
	this.idx = lunr.Index.load(indexData);

	let docs = await fetch('./raw.json');
	this.docs = await docs.json();
},
```

Two big changes. First, I load the index and pass it to `lunr.Index.load` to have it ready for searching. I then do a second call to get my raw data again. One of the weird things about Lunr is that search results do not contain the actual record you search but a reference to it. Well that's not weird per se, it's probably effecient, but in order to display my results properly, I need those original docs too. 

In my testing, my pre-built index was bigger than the raw data. That makes some sense I guess. But the end result of this change is that I'm doing two network loads, one potentially big, in order to save the indexing time. You would have to hope that this change is, overall, wortwhile performance wise and that the network "penalty" is comparatively less. Hopefully. :)

Anyway, this was an interesting experiment. If you want to see the source, you can find it here: [https://github.com/cfjedimaster/eleventy-demos/tree/master/lunr2]. As always, if you've tried this yourself I'd love to hear about it. Leave me a comment below.
