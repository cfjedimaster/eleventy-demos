---
layout: post
title: "Welcome to RaymondCamden.com 2018"
date: "2018-05-15"
categories: [misc]
tags: [development]
banner_image: /images/banners/welcome2018.jpg
permalink: /2018/05/15/welcome-to-raymondcamden-2018
---

Today marks the release of the latest version of my blog. I'm back to [Jekyll](https://jekyllrb.com/) and sporting a new theme by [Just Good Themes](http://justgoodthemes.com/). If you're curious, here's a bit of background into why I switched.

The last time I [blogged](https://www.raymondcamden.com/2018/02/12/installing-jekyll-on-windows/) on Jekyll, I was a bit upset with it. In fact, I said this: "So yes, I’m officially done with Jekyll." But... things happen. At work, we use Jekyll for our [docs](https://goextend.io/docs) and [blog](https://goextend.io/blog), and I actually had little to no difficulty getting both of those working in WSL on both my laptop and desktop. Given that experience, I began to think about migrating my blog back. 

What spurred that even more was me finally figuring out how to get Jekyll to exclude most of my content locally. Maybe this wasn't a feature last time I used it, but now it is rather trivial. Here's the config setting I use:

```yaml
exclude: [_posts/2003,_posts/2004,_posts/2005,_posts/2006,_posts/2007,_posts/2008,_posts/2009,_posts/2010,_posts/2011,_posts/2012,_posts/2013,_posts/2014,_posts/2015,_posts/2016,_posts/2017]
```

With this in play, my startup and reload time is about four seconds. Still a bit slow but acceptable. (And if I really cared, I could knock out various months in 2018 as well.) While Hugo definitely has Jekyll beat on speed, I cannot describe how much I disliked using it. Everything it did annoyed me. To be clear, I'm not saying it is a bad project. It is incredible fast, has lots of features, and served me here well for years. But as a *developer*, I really disliked using it. On the other hand, I enjoy hacking around with Jekyll. 

Using it with Netlify was pretty simple. I followed [this blog post](https://www.netlify.com/blog/2017/05/11/migrating-your-jekyll-site-to-netlify/) which basically came down to adding 2 files and changing my build settings. Build times are pretty decent too:

![Image showing build times in Netlify](https://static.raymondcamden.com/images/2018/05/netlifybuilds.png)

One thing I really like about this theme, but which may be a bit annoying to regular readers, is that every post has a clear callout to the author (me). At first that seemed a bit silly since every single post here is from me (I have had a few guest posts, but not in years), but since most folks come in here via a Google search and probably have no idea who I am, I think it will be a nice change.

Speaking of "regular readers", note that I'm no going to use FeedBurner to host my RSS feed. If you want to subscribe to my RSS, just use this URL: https://www.raymondcamden.com/feed.xml. I'm toying with the idea of setting up an email subscription list, but I'm not sure if that is worth the effort.

The only real "bug" I am aware of now is that my tag and categories archive are single pages. That means I've got (nearly) 6000 links on them which is pretty ridiculous. Jekyll can't generate new files so to fix this, I need to create files for each tag and category and have them run one simple template. That's pretty trivial work, but I just haven't done it yet. Once I do I'll update the links on the right. There are a few Markdown issues on some older posts, but I'll address those whenever I see activity (something I was doing on the old theme for even older posts).

Outside of that - well - I hope you like it!

<i>Header photo by <a href="https://unsplash.com/photos/Ig4UvpKDyMg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Artem Bali</a> on Unsplash</i>