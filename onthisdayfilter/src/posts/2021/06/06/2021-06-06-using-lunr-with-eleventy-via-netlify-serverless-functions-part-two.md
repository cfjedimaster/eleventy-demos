---
layout: post
title: "Using Lunr with Eleventy via Netlify Serverless Functions - Part Two"
date: "2021-06-06T18:00:00"
categories: ["javascript","jamstack"]
tags: ["eleventy"]
banner_image: /images/banners/search.jpg
permalink: /2021/06/06/using-lunr-with-eleventy-via-netlify-serverless-functions-part-two.html
description: A followup to my post demonstrating using Lunr via serverless functions
---

A few days ago I posted (["Using Lunr with Eleventy via Netlify Serverless Functions"](https://www.raymondcamden.com/2021/06/02/using-lunr-with-eleventy-via-netlify-serverless-functions)) about how you could use [Lunr](https://lunrjs.com/) via serverless functions. The thinking was that it would help make Lunr more useful for large content sites. In a "typical" Lunr example, you load your data and client all in the browser, which means indexing a lot of content wouldn't be very effecient. That post demonstrated that you absolutely could run Lunr in a serverless function, but it bothered me that the index was being recreated on every search. 

The index is how Lunr is able to return matches based on input. It takes your raw data, applies some magic to it based on your text, and makes it so it can return more appropriate results for what your users are searching for. As the index process is pretty important, it's also something that takes time to build. (To be clear, it's incredibly fast in my testing, but obviously as your usage increases, it's going to take more time to build the index.) 

Lunr supports [pre-built](https://lunrjs.com/guides/index_prebuilding.html) indexing to make this process go quicker and I covered how to use them in Eleventy earlier this year: ["Using Pre-Built Lunr Indexes with Eleventy"](https://www.raymondcamden.com/2021/01/22/using-pre-built-lunr-indexes-with-eleventy)

For today's post, I took my previous demo and modified it to use a pre-built index. The change was pretty simple, I think. (But as always, [reach out](https://twitter.com/raymondcamden) if you have questions.) I decided to use Eleventy's [afterBuild](https://www.11ty.dev/docs/events/#afterbuild) event to create my index:

```js
eleventyConfig.on('afterBuild', () => {
	console.log('running afterBuild');
	const data = require('./netlify/functions/search/data.json');
	const index = createIndex(data);
	fs.writeFileSync('netlify/functions/search/index.json', JSON.stringify(index));
	console.log('Wrote out my index.');
});
```

The function, `createIndex`, is the same from the previous blog post, but here it is again:

```js
function createIndex(posts) {
  return lunrjs(function() {
    this.ref('id');
    this.field('title');
    this.field('content');
    this.field('date');

    posts.forEach((p,idx) => {
      p.id = idx;
      this.add(p);
    });
  });
}
```

Lunr indexes can be serialized to JSON so I simply store the result in a file next to my data file. Modifying the search function was even quicker. Instead of building an index, I read in the file and pass it to a Lunr utility function:

```js
const data = require('./data.json');
const index = lunrjs.Index.load(require('./index.json'));
```

And that's it. You can find the code here (<https://github.com/cfjedimaster/eleventy-demos/tree/master/lunr5>) and a demo here (<https://eleventy-lunrtest2.netlify.app/search/>). Use "pdf" as a good search term to see results. I also made the search code a bit nicer to let you know when it's working. As always, let me know what you think!
