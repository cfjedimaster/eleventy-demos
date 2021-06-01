---
layout: post
title: "Finding (and Fixing) Your Slow ColdFusion Pages with FusionReactor"
date: "2019-03-25"
categories: ["coldfusion"]
tags: []
banner_image: /images/banners/fusionreactor2.png
permalink: /2019/03/25/finding-and-fixing-your-slow-coldfusion-pages-with-fusionreactor
description: Using FusionReactor to find (and fix) slow ColdFusion pages.
---

In my [last article](https://www.raymondcamden.com/2019/03/19/getting-started-with-fusionreactor-for-coldfusion-devs) I described how I wanted to help introduce [FusionReactor](https://www.fusion-reactor.com/) to ColdFusion developers with a special focus on helping solve practical problems and navigating terminology that may not be terrible familiar if you haven't used Java before. In that first article I focused on using the FusionReactor portal to find and diagnose pages that were throwing errors. In this follow up I'm going to highlight another great use of FusionReactor - finding slow pages.

Slow pages can be difficult to find. A page that runs fast on your local server could run much slower in production. A page with a complex set of inputs, like an advanced search field with numerous filters, can only run slow when a particular unique set of choices are made. Sometimes your code can be absolutely perfect, but an external factor is the culprit. Perhaps you're integrating with a database that you have no control over, or maybe you're using a third party API that has performance issues of it's own. 

In this article I'm going to highlight multiple examples of slow pages and how FusionReactor can help you find, and hopefully fix, each of them! Ready?

## Finding Your Slow Requests

Before we begin writing some horribly slow code (I'm a pro at this!), let's look at where FusionReactor displays these requests. In your left hand menu, under Requests, select Slow Requests:

![Slow Request](https://static.raymondcamden.com/images/2019/03/slow1.png)

You'll notice the display is split between currently running slow requests and requests that have already finished but were considered slow. Which begs the question - what's "slow"? 

Under Requests, go to Settings, and then select WebRequest History. Here you will find multiple settings you can configure including what the threshold is for something being considered slow. In my FusionReactor 8 instance this was set to 8 seconds.

![Slow Request settings](https://static.raymondcamden.com/images/2019/03/slow2.png)

To me this is a bit high and I'd consider switching it to a lower number. Performance is an *incredibly* important topic for web sites and while most of the discussion concerns what happens on the client side (rendering of JavaScript, styles, and so forth), the browser can't even render anything until you actually return the HTML. While there's a lot of resources out there on how fast a page should load, the general consensus should be two seconds. If your ColdFusion page is taking more than that to return a result to the browser, than you have already failed. (Because remember, the browser still has to *work* with your result to render it!) 

And just to be re-iterate, this is important even if your ColdFusion page isn't returning markup. If you are using ColdFusion to power a client-side application with JSON data, then you still need to ensure you're returning a speedy response. 

So yes, this is very, *very* important stuff. I'd go ahead and change that number from 8 down to 1 or 2. See what works best for you.

Another view of your slow requests is the Longest Requests view, also found under the Requests menu:

![Longest Requests](https://static.raymondcamden.com/images/2019/03/slow1a.png)

This is a sorted view of requests with the slowest being displayed first. This is *not* filtered by the Slow Request threshold but covers everything. Also note it includes non-ColdFusion files as well! 

## Bring the Slow

Let's start off by demonstrating two slow pages. One is always going to be slow and one uses an external resource that will *also* always slow. Here's the first one:

```markup
<h1>Slow Testing</h1>

Go to sleep...<br/>
<cfflush>
<cfset sleep(30000)>
And done.
```

It simply uses the `sleep` function to pause the execution for 30 seconds. If you've never seen `cfflush` before, it tells the ColdFusion server to send out existing output to the browser. As a user, you would see the initial HTML, the browser continue to load, and then the rest of the results. 

This will definitely cause a slow request to be logged. Unfortunately, unlike the error conditions we saw in the previous article, it's a bit more difficult to diagnose. Let's see why. First, here's the details page for this particular request.

![Slow Request Detail](https://static.raymondcamden.com/images/2019/03/slow3.png)

There's a few things to note here. First, the slow time is nice, bold, and red. You can't miss that and that's a good thing. Now make note of JDBC. Don't know what that means? JDBC is the acronym for Java Database Connectivity. Basically this is how ColdFusion speaks to databases. I started ColdFusion development way back in 96 or so, before ColdFusion ran on Java, but even back then the biggest culprit for slow requests was issues at the database layer. We aren't doing any database requests on this page but nine times out of ten you want to turn your focus here. Every single one of those metrics is crucial and can be a flag for an underlying issue. 

As a real example of this, I was working with a client and discovered they had about 1000+ database queries being run in a request. How did this happen? They had queries in an Application.cfm file, queries in a header file, queries in a file loaded by a header file, and so on and so on. 90% of these queries were the exact same query run multiple times. They weren't stupid - they just didn't realize everything going on in one particular request. This can happen as a web application grows larger and more complex, and is yet another reason to consider a tool like FusionReactor!

Alright, but this template isn't slow because of a query. What do you do next? Click on the Profiler tab next. (And note, back in the main list of slow requests, every slow request has a direct link to this particular view.)

![Slow Request Detail - Profiler](https://static.raymondcamden.com/images/2019/03/slow4.png)

So in this case, you can't really get to a particular line of your template or ColdFusion method. But even if you've never used Java before, seeing 100% correlated to `java.lang.Thread.sleep` should give you a clue as to which particular tag was the issue. 

Let's consider another example, this time the ColdFusion template is using a third party API built on a serverless platform:

```markup
<h1>Slow Testing 2</h1>

Call API...<br/>
<cfflush>

<cfhttp url="https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.sandbox.auth0-extend.com/slow">
<cfdump var="#cfhttp#">
```

In this case, the serverless function I'm hitting is using `setTimeout` to delay the response for 3001 milliseconds. This page is going to be slow, but it's something out of ColdFusion's hands. (But to be clear, this is still something you could address. Can you cache the result? Can you fire it via a scheduled task and store the result locally? You've got options!) So how is this reported in the profile?

![Slow Request Detail - Profiler and HTTP issue](https://static.raymondcamden.com/images/2019/03/slow5.png)

In this example, you can see two things that stand out - first `Http.java` and then `Dump.cfc`. The later clearly refers to the `cfdump` tag which typically wouldn't be run in production. But `Http.java` should definitely be enough of a clue to tell you where the issue is. Of course, you may run into an issue if you have multiple HTTP calls in your ColdFusion page. In that case you'll need to do further testing to see if you can determine the culprit. The important thing to note though is how FusionReactor got you nearly 100% of the way there!

### What Next?

In this article I simply introduced the Slow Request views in FusionReactor and used it to find a few problem scripts that should be fixed. In my next article I'm going to turn my attention to database specific issues and show you how FusionReactor helps there. As always, leave me a comment below if you have any questions!
