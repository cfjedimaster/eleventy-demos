---
layout: post
title: "Hiding Future Content with Eleventy"
date: "2020-08-07"
categories: ["static sites"]
tags: ["eleventy"]
banner_image: /images/banners/foggy-bank.jpg
permalink: /2020/08/07/hiding-future-content-with-eleventy
description: How to use custom filters and collections to hide Eleventy content for the future.
---

Here's a quick tip for something that's been on my mind lately with [Eleventy](https://www.11ty.dev) - hiding content so that it's published but not linked. What do I mean by that? Eleventy doesn't support the idea of "drafts" such that you can have content locally but not in production. You can use `permalink: false` (documented [here](https://www.11ty.dev/docs/permalinks/#disable-templating-in-permalinks)) to stop a page from being output, but it will still exist in collections. I thought a more useful case may be the ability to publish content for the future such that they are not listed in collections until their publish date has come to pass. This has the benefit of letting you see the content if you know the URL. This lets you write a post for next week, publish, and share the URL with a reviewer. In order for this to be effective though you need to have builds scheduled on a regular basis. It would be simple to schedule a daily, or even hourly, build on Netlify and other platforms (let me know if you want to see an example of that!). Let's consider a simple example.

First, I build an Eleventy site that contained one index page:

```html

<h2>Posts</h2>

<ul>
{% raw %}
{% for post in collections.posts  %}
	<li><a href="{{ post.url }}">{{ post.data.title }}</a> - {{ post.date }}</li>
{% endfor %}
{% endraw %}
</ul>
```

I then added a `posts` subdirectory with three blog posts. Each blog post had front matter like so:

```html
---
title: Alpha Post
tags: posts
date: 2020-08-02
---
```

Notice the date. For my three posts I picked two dates in the past and one in the future. 

My first attempt at hiding the future post was via [universal filter](https://www.11ty.dev/docs/filters/#universal-filters):

```js
eleventyConfig.addFilter("released", posts => {
	let now = new Date().getTime();
	return posts.filter(p => {
		if(now < p.date.getTime()) return false;
		return true;
	});
});
```

Basically I take the current time (which remember will be build time, hence my warning above about having a scheduled build process) and compare it to the post time. To use this in my index page, I just did this:

```html
<h2>Posts</h2>

{% assign posts = collections.posts | released %}
<ul>
{% raw %}{% for post in posts  %}
	<li><a href="{{ post.url }}">{{ post.data.title }}</a> - {{ post.date }}</li>
{% endfor %}{% endraw %}
</ul>
```

And that worked like a charm. But in order for it to be effective I'd have to ensure I used the filter everywhere I get content. Another option would be to use a [custom collection](https://www.11ty.dev/docs/collections/). I've used this before but only via the glob option. Being able to build a collection on another collection is sweet:

```js
eleventyConfig.addCollection("releasedPosts", function(collectionApi) {

	return collectionApi.getFilteredByTag("posts").filter(p => {
		let now = new Date().getTime();
		if(now < p.date.getTime()) return false;
		return true;
	});
});
```

Now I can change my home page to iterate over the new collection:

```html
<ul>
{% raw %}{% for post in collections.releasedPosts  %}
	<li><a href="{{ post.url }}">{{ post.data.title }}</a> - {{ post.date }}</li>
{% endfor %}{% endraw %}
</ul>
```

It's a small change I suppose but feels a bit safer. Both solutions also leave us open to changing the logic at some later time. For example, maybe I want to use another piece of front matter, like `hide: true`, instead. 

Again, this does *not* stop Eleventy from publishing the URL, but with nothing linking too it it's going to be (mostly) safe. Certainly safe enough for the process of having someone take a look at a post for review, or heck, even just to have it published later. Anyway, I hope this helps, and you can get the source for this here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/hide_tests>

<span>Photo by <a href="https://unsplash.com/@michaelwb?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Michael Browning</a> on <a href="https://unsplash.com/s/photos/hidden?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>