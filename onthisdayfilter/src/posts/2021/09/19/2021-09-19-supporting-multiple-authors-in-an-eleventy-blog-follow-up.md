---
layout: post
title: "Supporting Multiple Authors in an Eleventy Blog - Follow-Up"
date: "2021-09-19T18:00:00"
categories: ["jamstack"]
tags: ["eleventy"]
banner_image: /images/banners/group-of-people.jpg
permalink: /2021/09/19/supporting-multiple-authors-in-an-eleventy-blog-follow-up.html
description: An udate to my earlier Eleventy demo showing how to handle multiple authors
---

About a year ago I wrote up a blog post demonstrating how to set up an Eleventy blog that supports multiple authors ([Supporting Multiple Authors in an Eleventy Blog](https://www.raymondcamden.com/2020/08/24/supporting-multiple-authors-in-an-eleventy-blog)). While you should definitely read that post first, the gist of it goes like this:

* Define authors in a simple JSON data file and ensuring each one has a unique key.
* Include an authors field in front matter so you can specify the author
* Define a filter that let you get the author's name for the post
* Define an author template that shows all the posts for the author

While this worked fine, a few days ago I got an email asking if this supported multiple authors *per post*. Unfortunately, it didn't. Despite me using `authors` as a front matter key name, if you actually did pass multiple authors it didn't recognize them as a list. I whipped up a quick modification to make this work.

First off, I decided on a simple comma-separated list for multiple authors. Here's an example:

```
---
title: Epsilon Post
layout: post
date: 2020-08-02
tags: post
author: brinaldi,rcamden
---

This is Epsilon
```

Note that YAML *does* support specifying an array, or list, but honestly, I find that format not terribly easy to use. (Ok, I'd have to Google it, so it's not *that* hard.) 

After creating a post like this, I had to make two changes. First, consider the previous version of `post.md`:

```html
---
layout: main
---
{% raw %}
<h2>{{ title }}</h2>
{% if author %}
	{% assign myAuthor = authors | getAuthor: author %}

	<p>
	Written by <a href="/authors/{{ author }}">{{ myAuthor.name }}</a>
	</p>
{% endif %}

{{ content }}
{% endraw %}
```

It makes use of the `getAuthor` filter to convert the author primary identifier to a real name. To support multiple authors. I first change the `getAuthor` filter to `getAuthors`:

```js
eleventyConfig.addFilter("getAuthors", (authors,label) => {
	let labels = label.split(',');
	return authors.filter(a => labels.includes(a.key));
});
```

All I do here is take the label, split it on commas, an filter to any author in the new array. Then, back in the `post.md`, I change it to this:

```html
---
layout: main
---
{% raw %}
<h2>{{ title }}</h2>
{% if author %}
	{% assign myAuthors = authors | getAuthors: author %}
	<p>
	Written by 
		{% for theAuthor in myAuthors %}
			<a href="/authors/{{ theAuthor.key }}">{{ theAuthor.name }}</a>{% unless forloop.last %}, {% endunless %}
		{% endfor %}
	</p>
{% endif %}

{{ content }}{% endraw %}
```

You can see now that I loop over a list of authors and output a comma if the loop has more than one item. This made individual blog posts work fine. Here's a post with two authors:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/09/ma1.jpg" alt="Post showing multiple authors" class="lazyload imgborder imgcenter">
</p>

The second change I had to make was to the authors template. The template was fine, but the `getPostsByAuthor` filter had to be updated:

```js
eleventyConfig.addFilter("getPostsByAuthor", (posts,author) => {
	return posts.filter(p => {
		if(!p.data.author) return false;
		let authors = p.data.author.split(',');
		return authors.includes(author);
	});
});
```

And that's basically it. I did *not* edit the previous demo in my GitHub repository as I wanted a nice way to compare both, so instead I saved this into a new directory: <https://github.com/cfjedimaster/eleventy-demos/tree/master/multiauthor2>

As always, if you've got any questions about this, just let me know!