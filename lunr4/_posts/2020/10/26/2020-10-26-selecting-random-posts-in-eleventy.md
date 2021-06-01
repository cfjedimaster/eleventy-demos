---
layout: post
title: "Selecting Random Posts in Eleventy"
date: "2020-10-26"
categories: ["static sites"]
tags: ["eleventy"]
banner_image: /images/banners/random.jpg
permalink: /2020/10/26/selecting-random-posts-in-eleventy
description: A look at adding links to random pages in Eleventy
---

This is something that's been kicking around in my head for a few weeks and I finally found some time to build a demo of what I was thinking about. When working with a blog in Eleventy, what if you could direct folks to other blog posts once they've finished reading one? In this post, I'll demonstrate three different ways to link to random(ish) other posts in an Eleventy blog.

Alright, so let's look at the site before adding in the randomness. My Eleventy blog consists of a subdirectory of posts. This directory contains each blog post. Here's a sample one, alpha.md:

```html
---
layout: post
title: Alpha Post
tags: posts
date: 2020-10-01 12:00:00
---

This is the Alpha post.
```

I've got four posts total with each post using similar content. My home page renders the posts, newest to oldest:

```html
---
title: Home Page for Blog
layout: layout
---

<h2>Blog Demo</h2>

<p>
This folder is meant to be used as a basic blog that I will copy to use in <i>other</i> demos.
</p>

<h2>Posts</h2>

<ul>
{% raw %}{% for post in collections.posts reversed %}
  <li><a href="{{post.url}}">{{ post.data.title }}</a> ({{ post.date | dtFormat }})</li>
{% endfor %}
{% endraw %}</ul>
```

Not that it's relevant, but my `dtFormat` filter makes use of Intl support in Node.js. Here's the relevant function in my `.eleventy.js` file:

```js
const english = new Intl.DateTimeFormat('en');

eleventyConfig.addFilter("dtFormat", function(date) {
	return english.format(date);
});
```

That could be a lot fancier, but I love how it nice and simple. Now, let's look at the `post` layout:

```html
---
layout: layout
---

{% raw %}<h2>{{ title }}</h2>
<p><i>Published {{ date | dtFormat }}</i></p>

{{ content }}

<p>
<hr/>
</p>

{% assign randomPost = collections.posts | getRandom %}
<p>
You may also enjoy: <a href="{{randomPost.url}}">{{ randomPost.data.title }}</a>
</p>
{% endraw %}
```

The top half of the post just renders the title, date, and content of the post. The bottom is where I include a link to another random post. Let's look at that filter:

```js
eleventyConfig.addFilter("getRandom", function(items) {
	let selected = items[Math.floor(Math.random() * items.length)];
	return selected;
});
```

Nice and simple. It could be even shorter, I don't need to have two lines, but I kept it like that as I knew I was going to build better versions. Here's an example of how this renders:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/10/r1.jpg" alt="Blog post with random link at the bottom" class="lazyload imgborder imgcenter">
</p>

Cool! Except that it's entirely possible that the random post selected would be the same as the current one. Especially while the blog is just starting and only has a few entries. So I then created a new filter, `getRandom2`. This one expects the current page as an argument. Here's how I called it in the template:

```html
{% raw %}{% assign randomPost = collections.posts | getRandom2: page %}
<p>
You may also enjoy (avoid same url): <a href="{{randomPost.url}}">{{ randomPost.data.title }}</a>
</p>{% endraw %}
```

And here's the filter:

```js
eleventyConfig.addFilter("getRandom2", function(items,avoid) {
	/*
	this filter assumes items are pages
	we need to loop until we don't pick avoid, 
	*/
	if(!items.length || items.length < 2) return;
	
	let selected = items[Math.floor(Math.random() * items.length)];
	while(selected.url === avoid.url) {
		selected = items[Math.floor(Math.random() * items.length)];
	}
	return selected;
});
```

First, I ensure that I have at least two or more items. If I have one, or zero (which doesn't make sense as I'm calling it from a blog post, but whatever), then I return nothing. To get my random post that isn't my current post, I select a random one and loop until it's url does not match the current page's url. A while loop may not be best here. I could have made a new array with the current item filtered out and then selected randomly from there. As always - multiple ways to skin the cat.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/10/r2.jpg" alt="Skin the cat?!?!?" class="lazyload imgborder imgcenter">
</p>

I was going to wrap it up here, but then I thought of yet another version. While random selections are fine, it would be cool to perhaps select a random post in the same category. My sample post above didn't have categories, so for each post I added one:

```html
---
layout: post
title: Alpha Post
tags: posts
date: 2020-10-01 12:00:00
categories: sports
---
```

My sample blog has four posts. For three of them I used a value of `sports` and the last one used `music`. Now I want logic that follows this logic:

* If my category has 2 or more items, select one from that list and still bypass the current post.
* If I'm a category of one, select a random from all the rest, again ignoring the current post.

I added yet another link to my template (which you would't do on a real site, you would just use one):

```html
{% raw %}{% assign randomPost = collections.posts | getRandom3: page, categories %}
<p>
You may also enjoy (try same category, not same url): <a href="{{randomPost.url}}">{{ randomPost.data.title }}</a>
</p>
{% endraw %}
```

Note I'm now passing two arguments to a filter - both the current page as well as the current categories value. A quick note - I'm using the plural "categories", but for this demo I'm assuming only one category per post. So here's the filter:

```js
eleventyConfig.addFilter("getRandom3", function(items,avoid,category) {
	/*
	this filter tries to match to categories
	*/
	if(!items.length || items.length < 2) return;

	let myItems = items.filter(i => {
		return (i.data.categories === category) && (i.url !== avoid.url);
	});

	if(myItems.length === 0) {
		myItems = items.filter(i => {
			return i.url !== avoid.url;
		});
	}

	if(myItems.length === 0) return;
	return myItems[Math.floor(Math.random() * myItems.length)];
});
```

The filter begins by creating a new list of posts that filters out posts that don't match the category or have the same URL. If that list is blank, we create another list of posts that don't have the same URL. We do a final check to ensure we've got *something* left, and if so, return a random item.

If you find this interesting, you can check out the repository here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/randompost>. I also created a very simple "blog" project that I used as a seed for this demo. I'm not sure if that's going to be useful but you can find that here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/basicblog> 

Finally, if you want to see an example of the output - you can do so here: <https://eleventyrandom.vercel.app/> Obviously it isn't random in the built version, but every time a new post is added and the site is rebuilt, the links would change completely. Let me know what you think by leaving me a comment below!

<span>Photo by <a href="https://unsplash.com/@brett_jordan?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Brett Jordan</a> on <a href="https://unsplash.com/s/photos/random?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>