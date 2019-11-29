---
layout: post
title: "Netlify Analytics - An Initial Look"
date: "2019-07-12"
categories: ["development"]
tags: []
banner_image: /images/banners/stats2.jpg
permalink: /2019/07/12/netlify-analytics-an-initial-look
description: What does the new Netlify Analytics feature give you?
---

A few days ago (wow, just two, really?) Netlify announced a brand new feature for their platform, [Analytics](https://www.netlify.com/products/analytics/). As you can imagine, this is a feature focused on giving you analytics about your site with the main benefit of being able to skip using a client-side library like Google Analytics. 

I've been a Google Analytics user for over ten years now, and while I like the product, it isn't always the easiest to use. I put that blame on me not taking the time to learn the product more, but I always wished it had a more... friendly or simper interface. In fact, I've done *multiple* blog posts here on extracting data from GA and rendering simpler views. 

So when I heard the announcement I was incredibly excited. I've liked pretty much every Netlify feature I've used so far and assumed this would rock as well. Unfortunately, this is not a free service. Now, I say "unfortunately" but to be fair, Netlify gives you a *crap* ton of really good free features. I deployed a serverless function to a test site last week. For free. And I'll take free tier serverless over analytics any day. That being said, I do still wish they had a free tier. I'd love to use this feature to track smaller "toy" sites, and I just don't see me doing that for sites that may get less than a few hundred page views, if that. 

The price is definitely reasonable - nine dollars. That price is for sites with less than 250K page views per month so it should cover most folks. For sites with more than that it's... well I don't know. The [pricing page](https://www.netlify.com/pricing/#analytics) says "custom" so it's probably determined on a case by case basis.

This is rather important to me as Google Analytics reported that my average page views per month was less than 100K per month. I used to hover around 130K but my traffic has been slowly trending down the last year or so. 

So imagine my surprise when I enabled Analytics (more on that in a second) and saw numbers *significantly* higher than that. In fact, right now I apparently have right under 300K page views per month! I expected that my traffic was a bit higher than GA reported due to folks blocking GA and other reasons but holy crap!

That being said, while I absolutely love the Analytics feature and had planned on disabling GA and gladly paying nine dollars for it, I've got an email out to support now to see if my price will remain the same despite being a bit over the first tier limit. 

Alright, so what do you get?

When you enable Analytics (which for me required enter my credit card), you immediately get stats. Every stat is marked with a message saying it is incomplete, and as you reload you can see the data get more and more complete. I would estimate that it took about thirty minutes for that process to complete.

Right now the data is only for one month. I'm not sure what will happen a few months down the line. I'd like the ability to specify a custom date range, or see "last month" versus "last year", but for now it's the past thirty days and that's it. The stats are absolutely near real time. I'm writing this blog post at 2:28PM CST and I have data for 1 PM. So not up to the minute, but I'm fine with that. The "real time" GA report is pretty neat, especially when you're getting slammed because of something cool you've written, but I've had that happen maybe three times over the lifetime of my blog. (For example, my [blog entry](https://www.raymondcamden.com/2008/07/11/So-far-iPhone-20-is-DOA) on an iOS update back in 2008 got 971 comments.) 

Right now you get seven reports. The first is a top level summary:

<img src="https://static.raymondcamden.com/images/2019/07/anal1.png" alt="Top level stats for my site" class="imgborder imgcenter">

Next up is a line graph of pageviews:

<img src="https://static.raymondcamden.com/images/2019/07/anal2.png" alt="Line graph showing pageviews per hour" class="imgborder imgcenter">

And then an hourly chart of unique visitors:

<img src="https://static.raymondcamden.com/images/2019/07/anal3.png" alt="Line graph of unique visitors" class="imgborder imgcenter">

Next up is a list of your top pages. This was *very* interesting to me. One of the things I had noticed was the my current content wasn't nearly as popular (stat wise) as my older content. I was happy to see three entries in my top ten from this year. I'd still like to my more of my recent content, but it's better than I thought.

<img src="https://static.raymondcamden.com/images/2019/07/anal4.png" alt="Top ten requested pages." class="imgborder imgcenter">

Note that my top four entries are related to Vue.js. (Woot woot!) Next up is the 404 report:

<img src="https://static.raymondcamden.com/images/2019/07/anal5.png" alt="Missing pages report." class="imgborder imgcenter">

I've already corrected a few of these. Then there's a source report. I was really surprised by the amount from dzone.

<img src="https://static.raymondcamden.com/images/2019/07/anal6.png" alt="Source report" class="imgborder imgcenter">

And then finally, a bandwidth report:

<img src="https://static.raymondcamden.com/images/2019/07/anal7.png" alt="" class="imgborder imgcenter">

You'll notice the lines seem a bit off on that. It goes from 750MB to 1GB to 2GB and the scale seems wrong. That's a minor issue I suppose. 

Anyway, that's it for now. As I said, I think this is a damn good service and makes my stats much easier to deal with than Google Analytics. The price is... fair. Absolutely fair. But I won't be using it on toy/demo sites unless they had a free tier. (I may consider creating a "demo" site with multiple demos under it though.) Obviously this is all brand new and it's only been two days, but I'm sold enough to kill off Google Analytics once I confirm my bill.

<i>Header photo by <a href="https://unsplash.com/@srd844?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Stephen Dawson</a> on Unsplash</i>