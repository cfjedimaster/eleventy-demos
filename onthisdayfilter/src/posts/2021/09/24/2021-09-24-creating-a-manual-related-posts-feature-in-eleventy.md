---
layout: post
title: "Creating a (Manual) Related Posts Feature in Eleventy"
date: "2021-09-24T18:00:00"
categories: ["jamstack"]
tags: ["eleventy"]
banner_image: /images/banners/chains.jpg
permalink: /2021/09/24/creating-a-manual-related-posts-feature-in-eleventy.html
description: How to handle post relations in Eleventy in a manual fashion.
---

Something I miss from my old blog-ware was the ability to define blog post relationships. While editing a post, I could easily select posts I wanted to create a connection with. When the blog post was rendered, these related entries were shown at the end in a consistent manner. These relationships were bidirectional so if post A linked to C, when rendering C I'd render a link to A as a related post. I was curious how this could be done with [Eleventy](https://www.11ty.dev). 

To be clear, there's already posts out there showing how to automate this process. So for example, given a blog post written in the category of `cats`, you can select other posts from that category, perhaps randomized, and link to them. I can see that being a great option to automatically entire readers to check out other content on your blog. 

But for this demo, I wanted a way to manually define this. I specifically want this post X to link to post Y. To make this work, I knew I needed to define the relationship in front matter. The question was - how? In my older blog, everything was database driven. Every blog post had a unique ID and then I had a join table for relationships. You don't get that for Eleventy.

What you do have are [page properties](https://www.11ty.dev/docs/data-eleventy-supplied/). One of those properties is the [`filePathStem`](https://www.11ty.dev/docs/data-eleventy-supplied/#filepathstem). Given a file like `/posts/alpha.md`, this will be `/posts/alpha`. This should be a unique value that is - probably - an easy thing for an Eleventy author to refer to.

So for example, if I wrote a post last year about my top ten cats, I know it's at `/posts/top-ten-cats.md` and I'd know the filePathStem should be `/posts/top-ten-cats`. Based on this, I could reference it in my front matter:

```html
---
layout: post
title: Gamma Post
tags: posts
date: 2020-10-10 12:00:00
related:
    - /posts/top-ten-cats
---

This is the Gamma post.
```

I've created a `related` property in my front matter as an array so I could related to multiple items, but certainly you can link to just one too.

Once that was done, I then edited my post layout like so:

```html
---
layout: layout
---
{% raw %}
<h2>{{ title }}</h2>
<p><i>Published {{ date | dtFormat }}</i></p>

{{ content }}

{% if related %}
	<h2>Related Entries</h2>
	{% assign relatedEntries = related | getRelated:collections.all %}
	<ul>
	{% for entry in relatedEntries %}
	<li><a href="{{ entry.filePathStem }}">{{ entry.data.title }}</a></li>
	{% endfor %}
	</ul>
{% endif %}
{% endraw %}
```

THe top portion is the basic layout and the `if` at the bottom is where the magic happens. If a post has related items, I need to get the 'real' objects so I can link to them. I do that via a filter called `getRelated`. Eleventy filters don't have access to collections so I need to pass it as a second argument. Remember that in a filter, the item *before* the filter name is the first argument. The result of this filter is a list of regular page objects so I can link out as usual.

Here's the filter in my `.eleventy.js` file:

```js
eleventyConfig.addFilter("getRelated", function(relatedPosts, all) {
	/*
	relatedPosts is an array of filePathStems, return an array
	of page obs that match
	*/
	
	return all.filter(p => {
		return relatedPosts.includes(p.filePathStem);
	});
	
});
```

One thing to note about this solution - its unidirectional. In theory you could make this work both ways. I'd remove the condition from the template (since the page you link to may have no related items defined) and then use code that looks at the current page's filePathStem to see if anyone links to it. I was ok with it being unidirectional but that's a modification that could be done. Here's how it looks in the awesomely designed demo I built:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/09/related1.jpg" alt="A blog post showing related entries in a list at the bottom." class="lazyload imgborder imgcenter">
</p>

If you want to play with this, you can grab the source here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/relatedentries>

Photo by <a href="https://unsplash.com/@jjying?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">JJ Ying</a> on <a href="https://unsplash.com/s/photos/links?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>