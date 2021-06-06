---
layout: post
title: "Quick Netlify Tip for Redirects"
date: "2021-05-24T18:00:00"
categories: ["static sites"]
tags: []
banner_image: /images/banners/this-way.jpg
permalink: /2021/05/24/quick-netlify-tip-for-redirects
description: Ensure your redirects file is in your site build
---

Since this just bit me in the butt - for the second time - I figured I'd do a real quick blog post. This isn't to help me remember, but to ensure it comes up next time I google for it. 

I was working on a local [11ty](https://www.11ty.dev/) site with the Netlify CLI dev command. For folks who don't know, this lets you simulate the Netlify environment locally. While a great tool, you sometimes run into issues where things behave differently locally compared to production. 

For me, I ran into just such an issue Saturday morning. I had set up a simple `_redirects` file to support giving my serverless functions a nicer, and simpler, path:

```
/api/*	/.netlify/functions/:splat	200
```

This worked locally just fine, but in production, I kept getting a 404. Also, when I looked at my deploy log, I saw a message stating that no redirect rules were processed. On a whim, I duplicated my redirect in my `netlify.toml` file, deployed, and it woked fine.

I [posted](https://answers.netlify.com/t/redirects-not-being-processed-in-production-works-fine-locally/38106) on the Netlify forums, and after some back and forth, a Netlify support person asked if my `_redirects` file was in the published directory. I'm using Eleventy and for non-supported files, you need to tell it to explicitly copy the file to output. This is done with one simple command (I'm sharing a few just to give you more examples):


```js
eleventyConfig.addPassthroughCopy("css");
eleventyConfig.addPassthroughCopy("js");
eleventyConfig.addPassthroughCopy("images");
eleventyConfig.addPassthroughCopy("fonts");
eleventyConfig.addPassthroughCopy("_redirects");
```

As soon as I did that, and deployed, it worked perfectly. I do find it odd that a `netlify.toml` file in the root of my project works fine, even though it's not copied to output, but `_redirects` has to be copied for it to work. I think it should be consistent. 

Anyway - as I said - this hit me twice now so hopefully I won't forget. 

<p>
<img data-src="https://static.raymondcamden.com/images/2021/05/he_will_forget.jpg" alt="Spoiler: He will forget" class="lazyload imgborder imgcenter">
</p>

Photo by <a href="https://unsplash.com/@jamietempleton?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jamie Templeton</a> on <a href="https://unsplash.com/s/photos/directions?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>


