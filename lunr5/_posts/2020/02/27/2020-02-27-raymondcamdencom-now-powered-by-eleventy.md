---
layout: post
title: "RaymondCamden.com now powered by Eleventy!"
date: "2020-02-27"
categories: ["static sites"]
tags: ["eleventy"]
banner_image: /images/banners/possum.jpg
permalink: /2020/02/27/raymondcamdencom-now-powered-by-eleventy
description: Details on my migration to Eleventy
---

Another year, another new blog engine for RaymondCamden.com. For folks who haven't been around for the past [seventeen years](https://www.raymondcamden.com/2003/02/12/395FA384-CC01-17D6-AE9B36479350D784), this blog has gone through a few transformations.

* For most of it's life, this blog was powered by a ColdFusion project I created called BlogCFC. I spent many years working on the project before moving on.
* It then spent a short amount of time as a Wordpress site on Google's platform. Wordpress is an incredibly nice blogging platform, but I struggled to keep the site up and running. That's probably my fault but I didn't want to spend the time required to keep the server healthy.
* I moved to the JAMStack in 2015 I believe, using [Hugo](https://gohugo.io/) as my platform. It was a lot of work to get things moving smoothly, but the first time I published my site as a static set of files and realized I never had to worry about a server again, I was sold. (I tried to find the exact post where I announced the first time I went static but I failed. Sorry.) Hugo was incredibly fast, especially after I tweaked how my site is built to better work with the size. 
* I moved to [Jekyll](https://jekyllrb.com/) in [May of 2018](https://www.raymondcamden.com/2018/05/15/welcome-to-raymondcamden-2018). I had grown frustrated with how Hugo did things. Frankly, it was just wasn't for me. Jekyll was easier to work with and "fast enough" for my builds. It got even faster when it hit version 4. Overall, Jekyll was great, but relied on Ruby which was difficult to install and update, at least for me.

So back in October of last year, I [discovered Eleventy](https://www.raymondcamden.com/2019/10/12/why-im-digging-eleventy). As a Node-based static site generator (SSG), I was really happy with the idea of no longer needing Ruby. It also just plain rocked. It was incredibly flexible and supported everything I needed out of the box. Frankly it is my favorite SSG now and I've been doing [explorations on it](https://www.raymondcamden.com/tags/eleventy/) over the past few months. 

With that in mind, I started work on a conversion of this site from Jekyll to Eleventy. I considered a theme change too, but decided I was happy with the current UI for now. I ran into issues of course and thought I'd document them below. You should not consider this a "Jekyll to Eleventy" post (Paul Lloyd has a [great post](https://24ways.org/2018/turn-jekyll-up-to-eleventy/) on this), but rather a look at what I ran into. My site is not typical in regards to what most people will hit. I've got a large set of existing content and it was crucial I maintained URL structure so as to not lose traffic. (I'll be checking Netlify Analytics to ensure that.) 

There isn't any particular order, but here's a look at the issues I ran into.

### Escape Tokens

When I use brackets in my code, like when I talk about Vue, I have to escape them because Liquid, the template engine Jekyll uses and Eleventy supports, uses them as well. Years ago when I blogged about Angular a lot, I had a particular way of escaping code that was ugly as heck. A year or so ago I found a simpler way that worked well with Liquid. 

Oddly - the old style of escaping threw errors when Eleventy tried to parse it. So I had to go through all of my old Angular posts and edit them by hand. It took maybe 2-3 hours, but it was painful in terms of getting it just right. I don't have an example of this handy, and honestly I'm not sure how I'd escape the escape here, but if anyone needs to see the "wrong" way, let me know. 

### Markdown files

Some of my Markdown files rendered a bit differently in Eleventy in terms of use of HTML. What I mean is that sometimes I'd sprinkle in HTML in my Markdown for things like forms. In Jekyll that was fine. In Eleventy this sometimes would result in the HTML being escaped and shown on screen. To fix it I literally just renamed the files in question, so for example I changed `search.md` to `search.html`. Eleventy still parses the files for front matter so my layouts worked just fine. 

### Site variables

Jekyll has the idea of site variables, like `site.foo`. Eleventy does not. I fixed that by simply adding a data file named `site.json`. 

### Liquid differences

This was the big one. A few weeks ago I [blogged](https://www.raymondcamden.com/2020/02/07/checking-and-upgrading-template-engines-in-eleventy) about how Eleventy ships with an older version of Liquid. This meant that some filters I used didn't work. To make matters worse, Jekyll adds it's own filters to Liquid.

But wait - it gets even better. Guess what Liquid does if it encounters an unknown filter? 

Nothing.

This was first raised as an [issue](https://github.com/Shopify/liquid/issues/422) almost six years ago and is still an open bug. It boggles the mind. I can totally see where a person may want that behavior, but to not have it configurable and defaulting to silently ignoring is just crazy (imo). So what this means is that if you do this:

```
{% raw %}
My name is {{ name | fancycapitalize }}
{% endraw %}
```

And `fancycapitalize` isn't recognized, it just returns the value of `name` as is. While I can see the merit of that perhaps, for someone who wants to ensure things are actually working it's a royal pain in the rear. 

So I ended up rewriting many filters and Eleventy makes this easy. You just drop in code inside your `.eleventy.js` file. You can see mine [here](https://github.com/cfjedimaster/raymondcamden2020/blob/master/.eleventy.js) if you want to dig. 

### Categories

Eleventy automatically supports parsing tags in your front matter and making them available in code. Categories however are not recognized. To be clear, you can add any data you want in your front matter and use those variables. But it's just tags that are recognized and picked up globally. I added my own support like so:

```js
eleventyConfig.addCollection("categories", collection => {
	let cats = new Set();
	let posts = collection.getFilteredByGlob("_posts/**/*.md");
	for(let i=0;i<posts.length;i++) {
		for(let x=0;x<posts[i].data.categories.length;x++) {
			cats.add(posts[i].data.categories[x].toLowerCase());
		}
	}

	return Array.from(cats).sort();
});
```

And look - I used fancy new Set code too. If you look at my `.eleventy.js` you'll see I grab posts like you see above twice. Once to add the `posts` collection and once to add `categories`. 

### RSS Support

I had a little trouble with RSS support. The [official plugin](https://www.11ty.dev/docs/plugins/rss/) is Atom only and I wanted to maintain my current flavor of RSS, RSS 2.0. 

I then tried [eleventy-xml-plugin](https://github.com/jeremenichelli/eleventy-xml-plugin) but it didn't seem to work. I filed an issue but haven't heard back. I left the plugin in my code, but it's not actually doing anything now. I got my own `feed.liquid` working and it seems alright, but it may not be perfect. 

### URLs

Here's a fun one. Here's how my permalinks looked in my Jekyll site:

```
permalink: /2015/11/11/working-with-the-clipboard-in-cordova-apps
```

Notice there's no .html or anything at the end. Believe it or not, I didn't actually know what files Jekyll was producing. It just worked. Turns out Jekyll was outputting something like:

```
/2015/11/11/working-with-the-clipboard-in-cordova-apps.html
```

The reason why my links could leave out .html is because Netlify supports it. You can see my [discussion](https://community.netlify.com/t/pretty-urls-with-the-setting-turned-off/8743) about it on the forums. I'm happy it just worked, but it proved problematic for Eleventy, specifically when running locally.

I needed a way to output to the same path but let me use URLs as I had been. My hackish way of doing it was like so:

```js
eleventyConfig.addCollection("posts", collection => {
	let posts = collection.getFilteredByGlob("_posts/**/*.md");
	for(let i=0;i<posts.length;i++) {
		posts[i].data.permalink += '.html';
		posts[i].outputPath += '/index.html';
	}

	return posts;
});
```

I'm not sure it makes sense, but it works. ;)

### Using EJS

I mentioned this in my initial post on Eleventy, but I love, love, *love* that I can switch template engines at will. My needs for my [stats](https://www.raymondcamden.com/stats) page were pretty complex. So as much as I don't like using EJS, it worked darn well for this page. You can see the source [here](https://github.com/cfjedimaster/raymondcamden2020/blob/master/stats.ejs)

### Ignoring Files

In order for my server to work well locally, I need to ignore most of my content. Eleventy supports a `.eleventyignore` file that uses globs, and it works well, but it caused me a small problem. You can't tell Eleventy to use a different file. That means if I checked in my `.eleventyignore` file to GitHub, it would deploy to production. So for now I just keep it local only (and use `.gitignore` to ensure I don't forget). I also filed an issue with Eleventy to support the ability to specify an ignore file at the command line. 

### Summary

I made the switch on Netlify this morning and so far, so good. Of course GitHub decided to have issues at - I swear - the exact same time. On Twitter I've mentioned a bit that build times seem to be a bit slower then Jekyll. But to be clear, we're talking differences of like 30 seconds to a minute. Given the power of Eleventy, I'm more than fine with that. Also, I'm still doing builds to production in less than five minutes for 6000+ pages. I did do a bit of tweaking in my `.eleventy.js` to cache a few things, but honestly I don't think I need to bother tweaking it more. 

For folks who want to dig into the code, the repo may be found here: <https://github.com/cfjedimaster/raymondcamden2020> I'm absolutely open to suggestions and improvements, so just let me know what you think!

<i>Header photo by <a href="https://unsplash.com/@md630?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Mikell Darling</a> on Unsplash</i>