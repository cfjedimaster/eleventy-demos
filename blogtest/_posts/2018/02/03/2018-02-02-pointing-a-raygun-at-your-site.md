---
layout: post
title: "Pointing a Raygun at Your Site"
date: "2018-02-03"
categories: [development]
tags: [javascript]
banner_image: /images/banners/mitchel-boot-70005.jpg
permalink: /2018/02/03/pointing-a-raygun-at-your-site
---

For a while now I've been talking about web site error reporting tools. Basically - services that will monitor your site for client-side errors that users get when trying to browse your site. You can read a review of some of these services I did for Telerik in my article here: [
Web
A Review of JavaScript Error Monitoring Services
](https://developer.telerik.com/featured/review-javascript-error-monitoring-services/). That article is pretty old now and obviously the space has expanded since then. A month or so ago I was approached by the folks at [Raygun](https://raygun.com/) asking if I'd like to take a look at their service. I did, and was pretty impressed. Before I get into it though I want to give a big thank you to Nick Harley from the Raygun team. With the holidays and some person stuff, I kept getting busy and putting off this blog post. I bugged him multiple times for extensions to my free trial and he never complained once. Thank you, Nick!

<img src="https://static.raymondcamden.com/images/2018/2/rg1.jpg" title="Raygun.com" class="imgborder">

Right away, one of the things you'll discover with Raygun is that it isn't just a "error monitor" service, but it also does a really good job of giving you feedback on your performance as well. Website performance is becoming more and more important lately, especially with the advent of PWAs. There are multiple different tools out there to help you diagnose and track performance issues, so having something tied in with your error handling is pretty compelling. I'll show examples of both of these with Raygun so you can get an idea of how it works. On top of error tracking and performance, they also do pretty cool user monitoring and tracking (including real time reports) and have features that tie into your deployments. Why? To help figure out if something got better or worse based on a new release of your site.

So before we go into some screen shots (all based on reports from this blog), you will want to take a look at their [pricing information](https://raygun.com/pricing). 

<img src="https://static.raymondcamden.com/images/2018/2/rg2.jpg" title="Pricing" class="imgborder">

That is a bit high for a one person blog like raymondcamden.com, but also note that it covers the entire platform of features. If you just want the error reporting (crash reporting), the low end price is a really reasonable - 19 dollars at the time I wrote this. 

The Dashboard
===

<img src="https://static.raymondcamden.com/images/2018/2/rg3.jpg" title="Dashboard" class="imgborder">

This is the main dashboard. It's clean and direct and really highlights the important data points. On the top bar two things stick out right away. First, my performance is poor (which was surprising!) and that for the most part, my site is error free. Seeing that 99% of people are not getting errors is great. 

As a quick aside, the entire site renders really freaking well on mobile too, which is great if you need to look at an error report from your mobile device.

<img src="https://static.raymondcamden.com/images/2018/2/rg3a.jpg" title="Dashboard (Mobile)" class="imgborder">

Crash Reporting
===

Let's look at the bug reporting:

<img src="https://static.raymondcamden.com/images/2018/2/rg4.jpg" title="Crash Reporting" class="imgborder">

You've got a chart showing you reports over time as well as multiple ways to filter your errors down to find particular items. Individual reports are very nicely designed too:

<img src="https://static.raymondcamden.com/images/2018/2/rg5.jpg" title="Crash Reporting" class="imgborder">

I love the comment feature at the bottom. Even in a one person team, I could see using that to add notes about a bug. Like - maybe I don't have time to dig into it now, but I've got some ideas as to what the issue could be. I could use the comments as a way to jot down some notes until I get a chance to return to it.

In this particular report (and I realize it is probably too hard to read in the screen shot above), the error is coming from a Chrome extension, so while it's on my site, it isn't necessarily my issue. Raygun supports blocking errors from being reported again. There is also an "Inbound Filters" feature where I could add a block on any message containing `chrome-extension://` if I wanted. 

There's a nice report system for designing custom reports and the ability to export your errors into a zip file for your own processing. Speaking of processing, there are also a crap ton of integration features too:

<img src="https://static.raymondcamden.com/images/2018/2/rg6.jpg" title="Crash Reporting" class="imgborder">

Finally, I'll share a screen shot of a typical email report. While this is a standard feature of such services, I just share yet another example of how much attention was given to design. Make note of the quick actions links on the bottom.

<img src="https://static.raymondcamden.com/images/2018/2/rg7.jpg" title="Crash Reporting" class="imgborder">

Real Time Monitoring
===

Now let's look at the real time reporting. There is a wide array of data here covering performance, browser and platforms, and location. Here's an example of it reporting on browser usage.

<img src="https://static.raymondcamden.com/images/2018/2/rg8.jpg" title="Real Time" class="imgborder">

But the important report is the performance tab:

<img src="https://static.raymondcamden.com/images/2018/2/rg10.jpg" title="Real Time" class="imgborder">

Frankly, this is disappointing. I honestly thought my site was performing well. I went into one of the pages to get some details. In one report, I saw a breakdown like so:

* DNS: 3%
* Latency: 6%
* SSL: 0%
* Server: 7%
* Transfer: 1%
* Render: 22%
* Children: 60%

Children? I wasn't sure what that was but it concerned me. I checked the [performance docs](https://raygun.com/docs/pulse/performance) and it defined children as "Time for asynchronous assets to process - this refers to all requests loaded by the page up until onLoad (includes scripts, stylesheets, images and XHR requests)". I spent some time digging here and found some stuff right away that I had not noticed.

First - I was loading my avatar picture twice. Why? The responsive design layout had it twice in the DOM. That wouldn't be a problem if I was using the same URL, but I had updated the avatar URL and missed the other location. Sigh.

I also noticed that all of my Amazon S3 images were taking a good second each to load. That seems high. I'm using Cloudfront in front of S3 but why isn't it faster? Is that expected? I don't know but I need to dig.

Finally, I also saw a lot of XHR requests. I only do one intentionally, but all of my external services, included Raygun, are also doing them too. Disqus seems to be a particular abuser. I can't really drop Disqus though as I do like the comment platform.

Wrap Up
===

All in all, this is a really good service. Keep in mind I only covered a portion of it and there is quite a bit more. It does seem to bit pricey, but honestly, it feels appropriately priced for what is provided, and the design by itself makes it a pleasure to use. As always, I'd like to hear from my readers if they have any experience with Raygun, good or bad. Just leave me a comment below. Now I'm off to fix that double avatar issue!

<i>Header Photo by <a href="https://unsplash.com/photos/hOf9BaYUN88?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Mitchel Boot</a> on Unsplash</i>