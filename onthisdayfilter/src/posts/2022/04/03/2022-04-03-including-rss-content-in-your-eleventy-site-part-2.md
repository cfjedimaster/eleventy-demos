---
layout: post
title: "Including RSS Content in your Eleventy Site - Part 2"
date: "2022-04-03T18:00:00"
categories: ["jamstack"]
tags: ["eleventy"]
banner_image: /images/banners/newspapers.jpg
permalink: /2022/04/03/including-rss-content-in-your-eleventy-site-part-2.html
description: A follow up to my post on using RSS data with Eleventy sites
---

A few weeks ago I blogged about how to include RSS data in your Eleventy site: [Including RSS Content in your Eleventy Site](https://www.raymondcamden.com/2022/03/08/including-rss-content-in-your-eleventy-site). Last week, I had the honor of giving my first presentation to the [Eleventy Meetup](https://11tymeetup.dev/) and for that talk, I took my earlier code and iterated on it a bit to show more examples and add a bit more usefulness to the tip. If you want to watch that presentation, you can do so below (and see [@jeromecoupe](https://twitter.com/jeromecoupe) excellent tal too!). I thought I'd also share the updates here for folks who prefer reading over wathing a video.

<iframe width="560" height="315" src="https://www.youtube.com/embed/FHjsSPsMUUc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="display:block;margin:auto"></iframe>

Alright, before I begin, be sure to read the [first post](https://www.raymondcamden.com/2022/03/08/including-rss-content-in-your-eleventy-site) so you understand the basics. Basically I use a simple npm package (`rss-parser`) to grab the content in an Eleventy `_data` file and then use it in a template. That simple usage worked well enough for my need (see the list of Medium articles on my [About](/about) page), but for the meetup, I wanted to take it a bit further.

## Better Dates

In my initial example, I only used the link and title from the RSS feed. Adding the date would have been nice, but I would have needed to parse the ISO date. Turns out there's a real nice library that helps with this, [date-fns](https://www.npmjs.com/package/date-fns). Using this, I modified the `_data` file to massage the dates. 

```js
const Parser = require('rss-parser');
let parser = new Parser();

const date_fns = require('date-fns');

module.exports = async function() {

	let feed = await parser.parseURL('https://medium.com/feed/@cfjedimaster');

	feed.items.forEach(f => {
		f.niceDate = date_fns.formatISO(date_fns.parseISO(f.isoDate), {representation: 'date'});

	});
	return feed.items;
	
};
```

Then I could use it in my output like so:

```html
{% raw %}<ul>
{% for article in medium2 %}
<li><a href="{{ article.link }}">{{ article.title }}</a> <i>(published {{ article.niceDate }})</i></li>
{% endfor %}
</ul>
{% endraw %}
```

Simple and effective. Here's how it looks:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/04/rss2-1.jpg" alt="RSS items showing a nice date" class="lazyload imgborder imgcenter">
</p>

## Show Full Content

Some RSS feeds contain the full content of the article. For my next demo, I used Eleventy's pagination support to turn the RSS data into dynamic pages. First, the pagination template:

```html
{% raw %}---
pagination:
   data: medium2
   size: 1
   alias: article
permalink: "syndicated-articles/{{ article.title | slug }}/index.html"
---

<h2>{{ article.title }}</h2>
<p>
Posted on {{ article.niceDate}}, originally from <a href="{{article.link}}" target="_new">{{article.link}}</a>.
</p>

{{ article.content }}
{% endraw %}
```

I'm using a permalink under a `syndicated-articles` and I turn the article title into a URL safe slug. Now I also make use of the `content` variable. Here's where `rss-parser` acted a bit. For my Medium feed, the `content` field did not exist, but instead, it used `content:encoded`. Nothing in the docs said this should happen (and I plan on filing a bug report when I get a moment), so I modified my `_data` file to use a bit of logic to normalize it for me. Here is a snippet from the file from the loop:

```js
feed.items.forEach(f => {
	f.niceDate = date_fns.formatISO(date_fns.parseISO(f.isoDate), {representation: 'date'});
	if(!f.content && f['content:encoded']) f.content = f['content:encoded'];
});
```

Again, I don't see why this happened and why Medium's field caused this, nor did I see it documented, but I plan on doing the right thing and reporting it. 

Also note that if you do this, the HTML of the feed may not work well with your site, and obviously, <strong>ensure you have permission to replicate content!!</strong>

## Multiple Feeds

That last thing I did was rewrite the `_data` file to support multiple different RSS feeds. Note that this makes it take a bit longer, but as long as you don't go crazy and add hundreds of feeds, you should be ok. Here's the updated `_data` file. 

```js
const Parser = require('rss-parser');
let parser = new Parser();

const date_fns = require('date-fns');

const feeds = [
'https://scottstroz.com/feed.xml',
'https://www.raymondcamden.com/feed.xml',
'https://recursive.codes/blog/feed'
]

function normalizeItem(i, feed) {
		i.niceDate = date_fns.formatISO(date_fns.parseISO(i.isoDate), {representation: 'date'});
		if(!i.content && i['content:encoded']) i.content = i['content:encoded'];
		i.blog = { title:feed.title, desc: feed.description, link: feed.link };
		return i;
}

module.exports = async function() {

	let result = []
	for(let i=0; i<feeds.length; i++) {
		let feed = await parser.parseURL(feeds[i]);
		let items = feed.items.map(f => normalizeItem(f, feed));
		result.push(...items);
		console.log('Processed',feeds[i]);
	}

	// sort by date
	result.sort((a, b) => (new Date(b.isoDate)) - (new Date(a.isoDate)));

	return result;
	
};
```

There's a few things I do here outside of grabbing N feeds. First, I include the metadata from the individual feed in each feed item. I do this so that when I display the feed items later, I can note where the item comes from. It's a bit of duplication but I'm fine with that. I'm also still parsing the date and handling `content:encoded` where necessary. Finally, I sort everything by the date. Here's the updated display:

```html

<h3>Recent Articles from My Friends</h3>

<ul>
{% for article in multi %}
<li><a href="{{ article.link }}">{{ article.title }}</a> 
<i>(published on {{ article.blog.title}} at {{ article.niceDate }})</i></li>
{% endfor %}
</ul>
```

Note that the main change here is including the blog where the item came from. Here's how this looks:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/04/rss2-2.jpg" alt="List of items" class="lazyload imgborder imgcenter">
</p>

All of this may be found in my Eleventy demos repo here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/use_rss>

Let me know if this helps!