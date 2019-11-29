---
layout: post
title: "Summer Plans - Looking at Azure Functions"
date: "2018-07-02"
categories: ["serverless"]
tags: ["azure"]
banner_image: /images/banners/summer_plans.jpg
permalink: /2018/07/02/summer-plans-looking-at-azure-functions
---

I'm going to make two mistakes in this post. Well, mistake may be too strong a word. In general, I try to refrain from making "plans" as I almost always start off by promising to do more than I end up accomplishing. The second mistake is laying out a plan right before I go on vacation. I've already been somewhat slow here due to personal reasons, but I was thinking about this today and I thought it would be good to lay out some plans while giving myself a good amount of time (hey, "summer" could also mean Australian time too, right?) to get it done.

When it comes to serverless, I started off spending my time with [Apache OpenWhisk](http://openwhisk.apache.org/) and [IBM Cloud Functions](https://www.ibm.com/cloud/functions). Now that I'm at Auth0, my primary focus is on serverless extensibility with [Extend](https://goextend.io/), powered by [Webtask.io](https://webtask.io/). I'm putting those blog posts up on our Extend blog: https://goextend.io/blog. 

So over here on this dusty old blog, I thought I'd spend time looking at [Azure Functions](https://azure.microsoft.com/en-us/services/functions/), Microsoft's serverless platform. I've only got some basic history with Azure as a platform as a whole and I have already played with Azure Functions a bit, but I thought I'd take a more systematic look at the platform. My questions/interests/etc. revolve around the following aspects:

* Getting started, specifically new accounts and how quickly you go from signing up to a "hello world" serverless function. I'm also curious what Microsoft/Azure demands up front in terms of signing up. I've got a few accounts already and one with access to stuff via friends at the company, but I'm going to use a new account for this testing. One thing IBM did *kinda* right, after a while, is allow you to sign up without a credit card. You had to provide one after thirty days, but you could at least get started without one. I'd *love* it if more cloud providers would make this a norm, and heck, simply toggle a setting of "If anything I do is going to cost money, turn everything off". 
* How easily can I use my own editor and a CLI. I'm already using an [editor](https://code.visualstudio.com/) that has tooling for Azure Functions but I really want to experience it "bare". Webtask has an *incredible* online editor (ok, I'm biased), but in general I'm curious how the "I have my own tools" approach will work. 
* One thing IBM Cloud Functions did well is supporting other IBM Cloud services. I mean, at the end of the day, a service has a URL, username, password, and probably a Node library, but a platform *can* do a bit more to make easier to use services within it's own platform. So my question is - does Azure make it easier to use their own services within Functions.
* How well does Azure Functions support non-HTTP executions. I know I focus mainly on building HTTP endpoints for client-side applications (and this is something Webtask also does *incredibly* well with the standard caveat of me being biased), but I'd like to see how easy it is to connect an Azure Function to some other source, either time based or related.
* Looking into reporting. Basically - how many times has my function run. What's the average execution time? Is one function creating a significant amount of errors? Can you pro-actively report that to me? 

Some concrete things I'd like to build to give me some "exercises" to accomplish:

* Rebuilding [Serverless Superman](https://twitter.com/serverlesssuper/) - a CRON based Twitter search and posting parody thing I built. (Which looks to be dead so I'll have to get that back soon.)
* Rebuilding [Random Comic Book](https://twitter.com/randomcomicbook) which thankfully *isn't* dead. 
* Building a simple form processor. Here is my [post](https://www.raymondcamden.com/2018/03/02/buidling-a-serverless-form-handler-with-webtask) on doing it with Webtask.
* Building an image processor hahah no just kidding that's been done like ten thousand times. 

So yeah - that's the idea. As I said, I'm giving myself plenty of time to work on this and as I *always* say, I'm open to suggestions so please feel free to give me some initial feedback below. 

<i>Header photo by <a href="https://unsplash.com/photos/SUFS6CPjB5Q?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Max Boettinger</a> on Unsplash</i>