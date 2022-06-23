---
layout: post
title: "Including RSS Content in your Eleventy Site"
date: "2022-03-08T18:00:00"
categories: ["jamstack"]
tags: ["eleventy"]
banner_image: /images/banners/newspapers.jpg
permalink: /2022/03/08/including-rss-content-in-your-eleventy-site.html
description: A quick example of using RSS content for an Eleventy page.
---

Before I begin, this post is *not* about generating an RSS page with Eleventy. If you need to do that, check the [plugin](https://www.11ty.dev/docs/plugins/rss/) that makes it (mostly) trivial to do. This post is about *consuming* RSS for your Eleventy site. I've got a page here ([About](/about)) where I track my external articles and books. At work, we use Medium to host our [blog](https://medium.com/adobetech) and I've been publishing there as part of my job. I was curious how I could get that content on my About page as well.

First off, Medium publishes an RSS feed for every profile and publication. You can find details on [their documentation](https://help.medium.com/hc/en-us/articles/214874118-Using-RSS-feeds-of-profiles-publications-and-topics), but for simple users like me, it's a simple matter of going from:

<https://medium.com/@cfjedimaster>

to

<https://medium.com/feed/@cfjedimaster>

This RSS feed contains articles I wrote in the past, pre-Adobe, as well as my content since joining Adobe. Basically, even though my articles are showing up in the Adobe publication, my RSS feed correctly shows everything I authored.

Alright, so adding this to my page means I need to parse RSS in Node. I've used [rss-parser](https://www.npmjs.com/package/rss-parser) before and that's what I went with here. I created a new `_data` file named `medium.js` with this code:

```js
const Parser = require('rss-parser');
let parser = new Parser();

module.exports = async function() {

	let feed = await parser.parseURL('https://medium.com/feed/@cfjedimaster');
	return feed.items;
	
};
```

The parser returns metadata about the RSS as well as the items, but all I care about is the items. I thought perhaps I'd do some transformation here as well, but I figured I'd add it to a template first and see if anything seemed necessary. Turns out I really didn't see a need.

So back in my About page (`/about.md`), I added the following:

```html
{% raw %}<h3>Recent Articles on Medium</h3>

Here is my most recent set of articles on Medium. For a full list, 
see my [profile](https://medium.com/@cfjedimaster).

<ul>
{% for article in medium %}
<li><a href="{{ article.link }}">{{ article.title }}</a></li>
{% endfor %}
</ul>
{% endraw %}
```

I thought about adding the article date too, but decided to keep it simple. Here's the result rendered out:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/03/rss.jpg" alt="RSS output" class="lazyload imgborder imgcenter">
</p>

And that's all there is to it. As a reminder, you can find the entire source code for this blog up in a [public repo](https://github.com/cfjedimaster/raymondcamden2020) if you want to see it in context. If having the most up-to-date version of the feed is important, you've got a few options.

The simplest is to just schedule a build roughly along with the schedule that makes sense for the content you are ingesting. So if a feed updates about once a day, you could schedule a build once a day.

The other option is to track the RSS feed with Pipedream. One of their sample workflows demonstrates this: [New Item in Feed from RSS API](https://pipedream.com/apps/rss/triggers/new-item-in-feed)

If you find this useful, let me know!