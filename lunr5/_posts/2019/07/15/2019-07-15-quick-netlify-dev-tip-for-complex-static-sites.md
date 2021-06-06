---
layout: post
title: "Quick Netlify Dev Tip for Complex Static Sites"
date: "2019-07-15"
categories: ["development","static sites"]
tags: []
banner_image: /images/banners/tip.jpg
permalink: /2019/07/15/quick-netlify-dev-tip-for-complex-static-sites
description: 
---

Hey everyone, this tip will probably have a *very* limited audience, but it was a huge deal for me so I wanted to share it with others in case they run into the same issue. In case you don't know it, [Netlify Dev](https://www.netlify.com/products/dev/) is a way to run the Netlify Platform locally. Which means features like redirects, functions, and more will work locally. 

As a practical example, I use the redirects feature quite a bit as my site has gone through different engines and domains over the years. Being able to quickly test that support locally is awesome. 

However, I ran into an interesting issue with my site. This blog has over six thousand entries. A complete build takes a bit over ten minutes. So when I work locally, I use a different config file that modifies the `exclude` parameter:

```
exclude: [_posts/2003,_posts/2004,_posts/2005,_posts/2006,_posts/2007,_posts/2008,_posts/2009,_posts/2010,_posts/2011,_posts/2012,_posts/2013,_posts/2014,_posts/2015,_posts/2016,_posts/2017,_posts/2018/01,_posts/2018/02,_posts/2018/03,_posts/2018/04,node_modules]
```

I also wrote a quick shell script called `start.sh` to make using this config easier:

```bash
#!/bin/bash
bundle exec jekyll serve --config _config.dev.yml 
```

As a quick aside, the `jekyll` CLI does support a "only render last N posts" option, but I discovered that *after* I had used the `exclude` feature. Like with most things there's more than one way to solve the problem.

This different configuration takes my typical build time down to about five seconds which is more than quick enough. 

Sweet!

<img src="https://static.raymondcamden.com/images/2019/07/happycat.jpg" alt="Smiling Cat" class="imgborder imgcenter">

Unfortunately, when I started using Netlify Dev, I noticed immediately that my builds were taking the usual, very long, time. I was ok with it a bit as it let me do testing of my redirects but it was definitely less than ideal.

So of course I went over to the forum and [posted](https://community.netlify.com/t/configure-jekyll-config-with-netlify-dev/2038/4) a question about this. 

And since I posted a question, I, of course, discovered how to do it about a minute later. 

Turns out the CLI supports a way to bypass the normal startup command that Dev uses. It's as simple as passing `-c` and the command you need. This is what I use for my blog:

```bash
netlify dev -c "bundle exec jekyll serve --config _config.dev.yml"
```

I modified my `start.sh` to use that and I'm good to go. Running both Jekyll locally and Netlify Dev.

<img src="https://static.raymondcamden.com/images/2019/07/nd1.jpg" alt="Console output showing the netlify dev version running" class="imgborder imgcenter">

<i>Header photo by <a href="https://unsplash.com/@sam_truong?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Sam Truong Dan</a> on Unsplash</i>