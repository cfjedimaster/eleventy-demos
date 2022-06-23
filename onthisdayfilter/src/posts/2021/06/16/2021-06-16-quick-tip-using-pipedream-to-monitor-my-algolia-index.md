---
layout: post
title: "Quick Tip - Using Pipedream to Monitor my Algolia Index"
date: "2021-06-16T18:00:00"
categories: ["misc"]
tags: ["pipedream"]
banner_image: /images/banners/sheet_music.jpg
permalink: /2021/06/16/quick-tip-using-pipedream-to-monitor-my-algolia-index.html
description: An example of using Pipedream as a quick service to monitor the health of my search service.
---

Last year (sometimes that surprises me, time has been so weird with COVID) I wrote about using Algolia with Eleventy, and specifically how I added it here ([Adding Algolia Search to Eleventy and Netlify - Part Two](https://www.raymondcamden.com/2020/07/01/adding-algolia-search-to-eleventy-and-netlify-part-two)). A few weeks ago I discovered an issue with my implementation that caused the index on Algolia's side to be empty. I fixed that issue and updated my blog post with a detailed description on top. Everything was perfect.

<p>
<img data-src="https://static.raymondcamden.com/images/2021/06/kitten_unicorn.jpg" alt="Kitten Unicorn FTW" class="lazyload imgborder imgcenter">
</p>

Except when I tried [searching](https://www.raymondcamden.com/search) for something yesterday and nothing worked. I hopped on over to the Algolia dashboard and saw my index was empty again. I went over to the Netlify dashboard, fired off another build, and couldn't recreate the issue. Last time it was a race condition so one test obviously wasn't enough, but *something* is up. 

Unfortunately, a full Netlify build is ten plus minutes so rerunning that a bunch of times wasn't an option. It was also the end of the day and frankly I was just done. I decided to try something else. I went over to [Pipedream](https://pipedream.com) and built a "monitor" script. My workflow runs once a day and then uses a bit of Node:

```js
async (event, steps, auths) => {
	const algoliasearch = require("algoliasearch");
	
	const client = algoliasearch(auths.algolia.application_id, auths.algolia.api_key);
	const indices = await client.listIndices();
	this.myIndex = indices.items.find(i => i.name === 'raymondcamden');
	console.log(this.myIndex);
}
```

Algolia doesn't provide a utility to find the size of an index, but if you use the `listIndices` API you can find the value there. The `find` filter is filtering to my index name. I built the above as one step, then added another custom step:

```js
async (event, steps) => {
	if(steps.algolia.myIndex.entries > 6000) $end(`Looks like I have data. Total was ${steps.algolia.myIndex.entries}`);
}
```

All this does is a quick sanity check on my index size. I've got over six thousand posts so as long as it's some number above that, I can end the workflow early. By that way, that line of code could obviously have been in the previous step. Pipedream doesn't force you to to do one thing per step. I just prefer to build my workflows like that. Makes me feel like a real programmer. Honest.

The final step of my worklow is an email step:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/06/mail.jpg" alt="Mail step" class="lazyload imgborder imgcenter">
</p>

And that's it. If you want to see the entire workflow yourself, here's the link: <https://pipedream.com/@raymondcamden/algolia-test-p_yKCaROg> I'll let folks know if I figure out the issue!

Photo by <a href="https://unsplash.com/@zion_photo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Louis Smith</a> on <a href="https://unsplash.com/s/photos/look-after?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  