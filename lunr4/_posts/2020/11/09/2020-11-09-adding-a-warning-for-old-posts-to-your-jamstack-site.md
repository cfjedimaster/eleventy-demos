---
layout: post
title: "Adding a Warning for Old Posts to Your Jamstack Site"
date: "2020-11-09"
categories: ["static sites"]
tags: ["eleventy"]
banner_image: /images/banners/egypt.jpg
permalink: /2020/11/09/adding-a-warning-for-old-posts-to-your-jamstack-site
description: How to add a message to older content on your static site.
---

While doing some important research this past weekend (yes, it was research), I ran into something interesting on a Forbes article:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/11/forbes.jpg" alt="Forbes article with a header saying the post is older than two years." class="lazyload imgborder imgcenter">
</p>

Look at that warning on the bottom. This is an incredibly useful warning for readers to let them know the content may be out of date. And while the topic here was a video game, you can imagine this being even more useful on a technical blog. I thought this was such a good idea I went ahead and implemented it here:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/11/old.jpg" alt="A picture demonstrating a post saying that it is more than two years old." class="lazyload imgborder imgcenter">
</p>

So how did I do it? I'm using [Eleventy](https://www.11ty.dev/) for my Jamstack framework and [Liquid](https://shopify.github.io/liquid/) for my template language, but this could be implemented anywhere. 

First, I needed to figure out what would be considered "old". I decided to follow Forbes' lead here and use two years as a delineation. In theory then my code would be something along the lines of this pseudo-code:

```
if post's date more than 365*2 days ago
   add warning
end if
```

Liquid doesn't have a "age in days" function built in. This [StackOverflow](https://stackoverflow.com/questions/37340705/shopify-liquid-find-number-of-days-between-two-dates) post demonstrates how to do it in "in the template", but I thought a filter would be a bit simpler. Here's the template code I used:

```html
{% raw %}{% assign age = date | ageInDays %}
{% assign twoyears = 365 | times: 2 %}
{% if age > twoyears %}<p class="oldPost">This post is more than 2 years old.</p>{% endif %}{% endraw %}
```

I begin by getting the "age" of the post. This is done by passing in the `date` value which is driven by the post. The result is how many days old the post is. I then create a variable for the number of days in two years. Yes, I could have simply used 730, but I like having it spelled out like that. Finally, I do a simple condition. 

Here's my filter:

```js
eleventyConfig.addFilter('ageInDays', d => {
	let date = new Date(d);
	let now = new Date();
	let diff = now.getTime() - date.getTime();
	let day_diff = Math.floor(diff / (1000 * 3600 * 24)); 
	return day_diff;
});
```

This is pretty typical JavaScript date math. I didn't bother with a library like Moment.js nor do I check to see if a post is in the future. I know my content and I know I don't do that (i.e., write posts for future publication). If you implement this in your site though you may want to take that into consideration. Also, I use `Math.floor` and I could see people using `round` instead. Since I know I'm doing a check for two years, I wasn't too concerned.

And that's it. Now, there is one more issue to consider. This condition is only executed when the site is built. That means if I don't run a site build every day, it's possible some articles will "age out" and not be properly marked. This is a common thing to consider in the Jamstack. Given that content is only as fresh as it's build time, you may need to consider automating your build process to a certain schedule. As with most things in development, "it depends." For me, I know I try to post once or twice a week, so I know the number of items not properly marked will get taken care of fairly shortly.

<span>Photo by <a href="https://unsplash.com/@aussieactive?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">AussieActive</a> on <a href="https://unsplash.com/s/photos/ancient-egypt?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>