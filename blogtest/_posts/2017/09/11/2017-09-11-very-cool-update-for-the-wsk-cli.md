---
layout: post
title: "Very Cool Update for the OpenWhisk CLI"
date: "2017-09-11T08:56:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/09/11/very-cool-update-for-the-wsk-cli
---

I was a bit behind on updating my WSK cli (see details on how to do that [here](https://www.raymondcamden.com/2017/04/25/updating-your-openwhisk-cli)) and was *incredibly* happy to see an important update. It may not be critical for everyone, but it was certainly important to me.

First, you can browse commits to the CLI repo here - https://github.com/apache/incubator-openwhisk/commits/master/tools/cli - and I recommend checking it out as there are a few other things interesting there as well. 

The change I'm most interested in is [pull 2326](https://github.com/apache/incubator-openwhisk/pull/2326) - support for name sorting. Why is this a big deal? The default sort for `wsk action list` is by the last time the action was updated. To me, this is a bad default. Well, not bad, but not one I'd use by default. Instead, I'm often trying to find the name of an action. I'll know what the name is in general, but perhaps not precisely. 

Did I call it randomComicBook or randomComic? Did I call it getTweets or getLatestTweets? By supporting the ability to sort by name, this becomes a lot easier for me now. 

Compre this:

![Confusing](https://static.raymondcamden.com/images/2017/9/wskn1.jpg)

With this (using `wsk action list --name-sort`):

![Not confusing](https://static.raymondcamden.com/images/2017/9/wskn2.jpg)

This is nice enough that I'm going to make an alias like `wska` or some such so I can get to it quicker.