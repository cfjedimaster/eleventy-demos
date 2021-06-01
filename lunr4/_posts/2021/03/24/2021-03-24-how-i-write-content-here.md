---
layout: post
title: "How I Write Content Here..."
date: "2021-03-24"
categories: ["development","static sites"]
tags: ["eleventy"]
banner_image: /images/banners/writing.jpg
permalink: /2021/03/24/how-i-write-content-here
description: In which I describe how I write and publish content here...
---

A few days ago someone (sorry, I forgot to Like the tweet so I'd remember) asked me how I create content for my blog, specifically the tech stack and process. About a year ago I wrote about my tech stack in general ([My Tech Stack (So Far) in 2020](https://www.raymondcamden.com/2020/04/29/my-tech-stack-so-far-in-2020)) but I didn't go deep into the "process" of writing here. It's not too terribly complex and it works well for me. Since I'm the only user, I'm the only one I have to keep happy so keep that in mind if what I describe below seems weird or crazy. 

First off - a bit of history. I launched my blog in February of 2003 (you can still read that [first post](https://www.raymondcamden.com/2003/02/12/395FA384-CC01-17D6-AE9B36479350D784) if you want) on custom blogware written in Adobe ColdFusion. The software eventually morphed into an open source project called BlogCFC that went through numerous updates and editions and had a pretty large following in the ColdFusion community. The authoring experience was a simple web-based administrator with a simple form to write content. I did not use a rich text editor but did do things likes automatically insert paragraph tags and line breaks where appropriate. 

I kept it on ColdFusion for over ten years before moving to WordPress in 2015 or so. I had about five thousand or so blog posts under my belt by then. (To be clear, before I got into Twitter, I used my blog many times for short announcements, links to other posts, and things that I primarily do on Twitter now.) I *loved* WordPress, especially the authoring environment. I *hated* how fragile WordPress was and trying to keep my server running. I wanted my blog to "just work" and I was disappointed that was so hard with WordPress. I'm totally fine with that being my fault, but at the end of the day I didn't care, I just wanted something that worked. 

I kept it on WordPress for about a year before moving to the Jamstack in January of 2016 ([Welcome to RaymondCamden.com 2016](https://www.raymondcamden.com/2016/01/20/welcome-to-raymondcamden-2016)). First with [Hugo](http://gohugo.io/) and [Surge](https://surge.sh/). I eventually moved to [Jekyll](https://jekyllrb.com/) as I found Hugo to be a hard to use. I also migrated hosting to [Netlify](https://www.netlify.com/). Finally, I [moved](https://www.raymondcamden.com/2020/02/27/raymondcamdencom-now-powered-by-eleventy) to [Eleventy](https://www.11ty.dev/) in February of last year. 

So that's the history, but it doesn't answer the initial question - how do I create content?

First off, every blog post is a Markdown file. I don't create this by hand. I use a Node script called `genpos.js` (I'll be linking to a repository of everything at the end) that does a few things.

1) First, it creates a folder for the blog post based on YEAR/MONTH/DAY. It intelligently creates YEAR and MONTH when it needs to. Ditto for DAY of course if I somehow post twice in a day. 
2) Then it creates a base Markdown file to save me some typing. This Markdown file uses front matter that Eleventy recognizes and makes it easier for me to start writing. 
3) The script makes me provide a title which it then uses in the front matter and as part of the filename. 

So for me, I start like so:

```bash
./genpos.js "How I Write Content Here..."
```

Next, I run a script that uses the Netlify CLI to start a local dev server. This runs Netlify's local dev environment (which lets you test redirects and serverless functions) and runs my Eleventy install. What you won't find in my Git repo is an `.eleventyignore` file which looks like so:

```
/_posts/200*/**
/_posts/201*/**
/node_modules/
```

This tells Eleventy to ignore the first twenty years of my blog and makes it run a *heck* of a lot quicker locally. Netlify's CLI will pop up a tab in my browser and since my initial Node script made a file, I can actually see it immediately. It's just a title but I can click to go into it and start writing. Eleventy has hot reload so as I write and save, I can see how it looks. 

Images are another matter. When I switched to the Jamstack I had a huge amount of old images. I didn't want them in my Git repo for... I don't know. It just felt wrong. I also had a large number of attachments (zips for blog posts) as well. So I decided to use Amazon S3 for that. I set up a bucket and made it resolve to https://static.raymondcamden.com. 

When I have an image for a blog post, first I resize it to a max of 650 wide. I normally do this via a Windows Explorer plugin ([Image Resizer Utility](https://docs.microsoft.com/en-us/windows/powertoys/image-resizer). I then copy it to an S3 folder with a path of the form: `/images/YEAR/MONTH`. I don't make a folder per day as I don't usually have more than 10-20 images per month. 

To make it quicker to use in my editor, Visual Studio Code, I built a shortcut that outputs the relevant HTML. It's dynamic as well:

```js
	"img": {
		"prefix": "img",
		"body": [
			"<p>",
			"<img data-src=\"https://static.raymondcamden.com/images/$CURRENT_YEAR/$CURRENT_MONTH/$1\" alt=\"\" class=\"lazyload imgborder imgcenter\">",
			"</p>"
		],
		"description": "Images"
	},
```

I also use a "lazyload" library from Google to - wait for it - lazily load images as they scroll into view.

Images are probably the slowest part of my process, but I've got the muscle memory for it now that such that it hardly seems like an issue. 

Code samples are done using regular Markdown-isms (three single quotes before and after) with [Prism](https://prismjs.com/) used to render them. The only issue I have with code samples is that I use Liquid for my template engine and if I want to actually talk about Liquid, I have to escape the tags. I created a Visual Studio Code keyboard shortcut to make that easier for me. Vue.js uses similar tokens so I have to escape that as well, but again, it's easy.

For my top banner, I use an image from [Unsplash](https://unsplash.com/), a service that provides free, and beautiful, art. I try to always credit the artist and they make it pretty simple to do so. (Look at the bottom of this post for an example.)

Alright, so when I'm done, I commit my Markdown file to my GitHub repository: <https://github.com/cfjedimaster/raymondcamden2020> At this point, Netlify takes over. It notices whenever I commit to my repository and automatically fires off builds. These builds take time:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/03/ray1.jpg" alt="Build times" class="lazyload imgborder imgcenter">
</p>

Normally I just go do something else. When the build is done (and you can use `netlify watch` at the CLI to monitor), I then write a tweet about the post. I also do a "ICYMI" (In Case You Missed It) repeat tweet for about a week later. 

And that's it! If you've got any questions about this process, just let me know!

Photo by <a href="https://unsplash.com/@aaronburden?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Aaron Burden</a> on <a href="https://unsplash.com/s/photos/writing?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  