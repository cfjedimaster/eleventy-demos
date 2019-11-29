---
layout: post
title: "Deploying a VuePress Site to Netlify"
date: "2018-05-16"
categories: [static sites]
tags: [vuejs]
banner_image: /images/banners/travel.jpg
permalink: /2018/05/16/deploying-a-vuepress-site-to-netlify
---

Before I begin, let me just state that what I'm covering today is already covered in the docs ([Deploys - Netlify](https://vuepress.vuejs.org/guide/deploy.html#netlify)), but for me it wasn't quite detailed enough and I wanted to run through, and then document, the process myself. I don't know if this is helpful, and as always, I hope my readers will tell me, but I figured I'd share how it worked for me. Also note that VuePress is still early on in development, so what I describe today may not make sense in the far flung future of flying cars and jetpacks.

First off - why [Netlify](https://netlify.com)? As my regular readers will know, I've been a user of them for raymondcamden.com for quite some time. They are - without a doubt - the *gold standard* for static site hosting services. Yes you can use Amazon S3, or [Surge](http://surge.sh/) (a service I like as well and use for quick demos), but in terms of all the additional features you get, nothing comes *close* to Netlify. Period.  

That being said - the feature I'm going to demonstrate setting up is their automatic build process for sites tied to GitHub. This is how my own blog works. I commit a new post to my repository, Netlify gets a ping, and then it begins a build process using Jekyll. So how does this look for VuePress?

Let's begin with an incredible simple VuePress site. VuePress makes zero requirements on your default structure so to keep things simple, I built a site with just two pages. I want to be clear that this is *not* a good representation of all the cool stuff VuePress has. I just wanted a "bare minimum" site for the purpose of this demo.

The first page is `index.md`:

```markdown
### Hello

[Alpha](./alpha.html)
```

And the second page is `alpha.md`:

```html
### Alpha

This is Alpha! Go [home](./).
```

And that's it. Just a two page static site. So how do we get this to Netlify?

### Step One - GitHub

The first thing I did was create a GitHub repo for the site: https://github.com/cfjedimaster/netlify-vuepress-demo. That's nice and simple and no big deal.

### Step Two - Netlify Site

Next - create a new Netlify site. You can do this via the CLI, but it's also pretty easy from the UI:

![Netlify new site](https://static.raymondcamden.com/images/2018/05/vpn1.jpg)

Select your repository, and in the next page, you need to provide build settings. Note, this is *not* going to work immediately, but we'll fix that.

For the build command, you want to use `npm run docs:build`.

For the publish directory, `.vuepress/dist`. The VuePress docs assume a `docs` subdirectory but our application's root is, well, the root folder itself. 

![Build settings](https://static.raymondcamden.com/images/2018/05/vpn2.jpg)

Go ahead and click `Deploy Site`, but as I said, expect it to fail.

### Step Three - Get it Netlify Ready

In order for the site to work correctly, we need to do a few things. First, we have to tell Netlify to install vuepress as part of the build process. To do this, create a package.json:

	npm init --force

You don't have to use `--force` of course, I use that to be lazy. In the package.json, then add a new script. Here is my complete file:

```js
{
  "name": "test1",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "docs:build": "vuepress build"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "vuepress": "^0.8.4"
  }
}
```

I'll be honest and say I'm still kinda new to using npm scripts. I really like them - but as I said - I'm new to them. Add this file to your repo, commit, and that's it. Like seriously. Here's a build history for my first test. You can see it failing before I figured out the package.json bits. 

![Build log](https://static.raymondcamden.com/images/2018/05/vpn3.jpg)

You can see this live site, I mean if you really want, here: https://tender-stonebraker-c8e749.netlify.com/. Cool part is - I edit my VuePress site and confirm it's cool locally and I can then simply commit my changes. Netlify will then pick up the change, run the build, and deploy the static site.

As I said - I hope this is helpful and if you have any questions, let me know in a comment below!

<i>Header photo by <a href="https://unsplash.com/photos/mcZCoMp92dU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">rawpixel</a> on Unsplash</i>