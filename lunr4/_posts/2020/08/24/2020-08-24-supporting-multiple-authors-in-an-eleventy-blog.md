---
layout: post
title: "Supporting Multiple Authors in an Eleventy Blog"
date: "2020-08-24"
categories: ["static sites"]
tags: ["eleventy"]
banner_image: /images/banners/group-of-people.jpg
permalink: /2020/08/24/supporting-multiple-authors-in-an-eleventy-blog
description: How to handle multiple authors in Eleventy, with custom author profile pages.
---

Here's a quick tip on how you could build an [Eleventy](https://www.11ty.dev/) blog supporting multiple authors. By that I mean have a blog where every post
is assigned an author with links to a unique profile page. If you just want to see the final result, the repository is here (<https://github.com/cfjedimaster/eleventy-demos/tree/master/multiauthor>) and the live demo is here - <https://admiring-fermi-e83d2d.netlify.app/>. 

Alright, so let's start off with a simple Eleventy blog. It's got a home page that lists items from a post collection:

```html
---
layout: main
---

<h1>Posts</h1>

<ul>
{% raw %}{% for post in collections.post %}
<li><a href="{{post.url}}">{{post.data.title}}</a></li>
{% endfor %}
{% endraw %}</ul>
```

And is driven by four blog posts that look basically like this:

```html
---
title: Alpha Post
layout: main
date: 2020-08-02
tags: post
---

This is Alpha
```

I'll skip sharing the layout as it's a basic Bootstrap template. But this is enough to get started. I can hit the home page and click to visit any of the four posts. Now let's start talking about author support.

I began by creating a new file in my `_data` folder named `authors.json`. For my demo, I decided each author would have:

* A name (self-explanatory)
* A bio (text about the author)
* A link to their website
* A link to their photo
* Their Twitter username
  
Certainly more could be done, like including a GitHub profile or LinkedIn. I also realized I was going to need a way to link posts to individual authors. While most likely the name values would be unique, I wanted to make it simpler. So for each author I defined a `key` value that was simply a unique code based on their name. Here's the data I'm using for my demo.

```js
[
	{
		"key":"rcamden",
		"name":"Raymond Camden",
		"bio": "Raymond likes cats.",
		"website":"https://www.raymondcamden.com",
		"photo":"https://static.raymondcamden.com/images/ray2019c.jpg",
		"twitter":"raymondcamden"
	},
	{
		"key":"brinaldi",
		"name":"Brian Rinaldi",
		"bio":"Brian something something or another.",
		"website":"https://remotesynthesis.com/",
		"photo":"https://miro.medium.com/fit/c/400/400/2*k9h7ypAlAlA7PvOUjwbejA.jpeg",
		"twitter":"remotesynth"
	}
]
```

Cool, so this gives us access to author data in our Eleventy pages. I want to include the author on blog posts as well as create unique author pages. Let's first get the blog posts updated. To keep it simple, I built a new layout file for my blog posts and switched all of them to use this in their front matter:

```
layout: post
```

The `post` layout looks like so:

```html
---
layout: main
---

{% raw %}<h2>{{ title }}</h2>
{% if author %}
	{% assign myAuthor = authors | getAuthor: author %}

	<p>
	Written by <a href="/authors/{{ author }}">{{ myAuthor.name }}</a>
	</p>
{% endif %}

{{ content }}{% endraw %}
```

Notice that I don't assume every post has an author, and it's feasible that on a site with many authors some posts may be more 'housekeeping' in nature and not really attributed to a specific person. If I do have an author value, I need to get information about the author. To do so, I created a filter, `getAuthor`, that accepts two parameters - all of the authors and the key. Why do I have to pass authors in? Because Eleventy custom filters don't have access either global data or collection values. Here's how the filter is defined in `.eleventy.js`:

```js
eleventyConfig.addFilter("getAuthor", (authors,label) => {
	let author = authors.filter(a => a.key === label)[0];
	return author;
});
```

As this returns the entire author object, I can use it in the text of my post layout. I use the key as a URL safe destination for the profile page and then display their name. This creates the link you see here:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/08/eam1.png" alt="A blog post with the author name and link." class="lazyload imgborder imgcenter">
</p>

For the author pages, I used the incredibly awesome Eleventy feature that lets you create [pages from data](https://www.11ty.dev/docs/pages-from-data/). I defined my author page like so:

```html
---
{% raw %}layout: main
pagination:
   data: authors
   size: 1
   alias: author
permalink: "/authors/{{author.key}}/"
eleventyComputed:
   title: "{{author.name}}"
---

<h2>{{ author.name }}</h2>

<p>
Website: <a href="{{author.website}}" target="_new">{{author.website}}</a><br/>
Twitter: <a href="https://twitter.com/{{author.twitter}}" target="_new">@{{author.twitter}}</a>
</p>

<img src="{{author.photo}}" style="float:left; max-height: 300px; padding-right: 10px">
<p>
{{author.bio}}
</p>

<br clear="left" />

<h2>Posts by Author</h2>

{% assign posts = collections.post | getPostsByAuthor: author.key %}
<ul>
{% for post in posts %}
	<li><a href="{{post.url}}">{{post.data.title}}</a></li>
{% endfor %}{% endraw %}
</ul>
```

From the top, you'll see the pagination aspect handles making one page per author. Next, I specify the permalink to match what I was using in the post layout. The next part may be a weird looking, but in order to get Eleventy to set page data that's dynamic based on the pagination, I have to use `eleventyComputed`. To be honest that feature still kinda confuses me but I only ever run into needing it in cases like this.

After the front matter I simply display the author (using all of my fine design skills) and then list out their posts. To get them, I use another filter, `getPostsByAuthor`. You can see it here:

```js
eleventyConfig.addFilter("getPostsByAuthor", (posts,author) => {
	return posts.filter(a => a.data.author === author);
});
```

Here's a sample author page:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/08/eam2.png" alt="A sample author page showing their info, picture, and lists of poss" class="lazyload imgborder imgcenter">
</p>

And that's it. You could certainly do more. Don't forget that front matter supports setting multiple values for a particular key, so you could even support posts written by more than one author. You could also build out individual RSS feeds for unique authors if you choose. Again, the repository for this demo is at <https://github.com/cfjedimaster/eleventy-demos/tree/master/multiauthor> and the live version may be visited at <https://admiring-fermi-e83d2d.netlify.app/>. Let me know if you have any questions, or suggestions, about this approach!

<span>Photo by <a href="https://unsplash.com/@hudsonhintze?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Hudson Hintze</a> on <a href="https://unsplash.com/s/photos/group-of-people?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>