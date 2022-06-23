---
layout: post
title: "Eleventy 1.0 - Dynamic Ignores"
date: "2021-10-15T18:00:00"
categories: ["jamstack"]
tags: ["eleventy"]
banner_image: /images/banners/allthewayto11.jpg
permalink: /2021/10/15/eleventy-10-dynamic-ignores.html
description: Eleventy 1.0's new support for dynamic file ignore settings.
---

So today's [Eleventy 1.0](https://www.11ty.dev/blog/eleventy-v1-beta/) feature is pretty minor, but since I [asked](https://github.com/11ty/eleventy/issues/894) for it, it's the most important feature ever! (Ok, no, not really, but I still like it.) Eleventy 1.0 nows supports the ability to dynamically ignore files. What does that mean?

<iframe src="https://assets.pinterest.com/ext/embed.html?id=291326669615728893" height="463" width="450" frameborder="0" scrolling="no" style="display:block; margin: 0 auto;" ></iframe>

Eleventy can be told to ignore files by using a file named `.eleventyignore`. This matches the same format as `.gitignore`. I use this feature on my blog as a way to make local development much quicker. Here's how mine looks:

```
/_posts/200*/**
/_posts/201*/**
/_posts/2020/**
/_posts/2021/01/**
/_posts/2021/02/**
/_posts/2021/03/**
/_posts/2021/04/**
/_posts/2021/05/**
/node_modules/
```

Basically, when working locally I have Eleventy ignore 90% of my previous blog posts. This makes builds go much quicker when I'm writing blog posts or testing other things locally. Note, as the [docs](https://www.11ty.dev/docs/ignores/) state, you do not have to include things already in your `.gitignore` so the `/node_modules` there could be removed.

Because of how I'm using the ignores feature, I'm sure to *not* include it in my repository as it would nuke most of my content in production. That means everytime I tweak it one place (like my desktop), I have to tweak it in another (like my laptop, and honestly, only if I really care to). 

In Eleventy 1.0, you can now both add, and remove, from the ignored files setting via [configuration](https://www.11ty.dev/docs/ignores/#configuration-api) settings. So for example:

```js
eleventyConfig.ignores.add('/_posts/200*/**');
eleventyConfig.ignores.add('/_posts/201*/**');
eleventyConfig.ignores.add('/_posts/2020*/**');
```

You could remove too, via delete:

```js
eleventyConfig.ignores.delete('/_posts/200*/**');
```

All of which means that if you have a case like mine where the ignore files are different based on environment, you could check `process.env.NODE_ENV` (or some other value) and dynamically ignore based on one environment versus another. 

Even better, this is *additive*. While for me I had no ignores in production, if you had stuff you wanted to ignore *everywhere* and optionally ignore more in one environment, you can still use `.eleventyignore` for the global items and the API for the dynamic one.

So again, simple feature, but I'm psyched to see it in Eleventy 1.0!