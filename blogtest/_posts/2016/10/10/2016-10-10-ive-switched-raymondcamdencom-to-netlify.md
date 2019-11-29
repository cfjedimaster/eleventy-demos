---
layout: post
title: "I've switched RaymondCamden.com to Netlify"
date: "2016-10-10T08:06:00-07:00"
categories: [static sites]
tags: []
banner_image: 
permalink: /2016/10/10/ive-switched-raymondcamdencom-to-netlify
---

The title pretty much says it all. Since switching from WordPress early in 2015, I've been using [Surge](https://surge.sh/) as my web host for raymondcamden.com. Outside of a few hiccups, this has worked well. (And even when their were hiccups, it wasn't on me to fix!) I want to thank the folks at Surge for their consistent support and for providing a cool as hell service.

That being said, I've decided to move to [Netlify](https://www.netlify.com/). I was introduced to them a few months ago and decided to include them in the [book](http://shop.oreilly.com/product/0636920051879.do) I'm co-authoring on static site generators. The more I dug into them, the more impressed I was. Here is a short list of *some* of the features you get with Netlify:

* Lots of performance features that includes a global CDN, built-in DNS, atomic deployments, and this is slickest of all - they can automatically compress your images, JavaScript, and CSS files. Yes that's stuff you can do yourself with a good Grunt/Gulp script, but I love that Netlify does it built-in.
* The ability to build your site from git repos and even support different subsites based on a branch. So you could use a "staging" branch to support a stating version of your site. 
* Free SSL. Automatic SSL. 
* Notifications for builds and other events.
* Form handling. I'm not using that feature because right now it isn't as robust as Formspree, but once they add a few features, I'll switch.
* DNS management on the site itself. So when I moved my site over, I also choose to let them handle my DNS, which means I can also handle stuff like foo.raymondcamden.com at Netlify and skip going to GoDaddy.

There's more, and I go a bit deeper in the book, but you can read for yourself on their [features](https://www.netlify.com/features/) page. You can find [pricing](https://www.netlify.com/pricing/) information as well. For folks curious, I'm on the "Pro" level but I've been granted a free open source license. 

So how am I using Netlify? I've set up my site such that it is connected to my GitHub repo at [https://github.com/cfjedimaster/raymondcamdendotcom](https://github.com/cfjedimaster/raymondcamdendotcom). You can integrate with a Git repo two ways - either to just use the files as is - or to have Netlify actually build it for you. So basically - I write my post (like this one), update my Git repo, and in two to three minutes, my update is live. It was taking about ten minutes for Surge so that's a great speed improvement. 

I did have to tweak my layout a bit. Previously my layout included a right hand bar of recent posts, categories, and tags. This was dynamic based on my content. I've switched this to an empty div that is loaded in via Ajax. So now when I write a new post, the only files updated are that sidebar file, the home page, and a few pages for the minimal pagination I support. 

If anyone has any questions about my setup, just leave me a comment below!

I want to thank Netlify again for helping sponsor this blog with a free license and for all their support the last few days as I migrated.