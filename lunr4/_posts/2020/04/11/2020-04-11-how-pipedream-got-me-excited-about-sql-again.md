---
layout: post
title: "How Pipedream Got Me Excited About SQL Again"
date: "2020-04-11"
categories: ["serverless"]
tags: ["javascript","pipedream"]
banner_image: /images/banners/pipes3.jpg
permalink: /2020/04/11/how-pipedream-got-me-excited-about-sql-again
description: A look at Pipedream's SQL Service
---

So, I know how I'm *supposed* to learn something. You go the docs. You start at the beginning. You read to the end. Done. Except... I just don't work that way. I'll definitely go through an introduction and at least attempt to go through the docs one by one, but typically I want to try stuff as soon as I learn. That means leaving the docs, playing with what I learned, and then returning, hopefully, to keep learning. This means I'll sometimes miss interesting things. So for example, I was playing with something on [Pipedream](https://pipedream.com/) when I noticed this in the top navigation:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/sql1.png" alt="Top level nav, highlighting SQL" class="lazyload imgborder imgcenter">
</p>

SQL? People still use that? 

I'm only kidding of course. I spent many, many years working with SQL when I was primarily doing backend work with ColdFusion. I didn't mind it, but I didn't necessarily miss it either when I started using more NoSQL type solutions like Mongo and IndexedDB. The thing I liked best about object-store type databases is that they made object insertion and updating so much easier. I *hated* writing INSERT and UPDATE statements in SQL.

On the other hand, I absolutely *loved* the power of a SELECT statement. While I know I can do powerful queries in Mongo and IndexedDB, I really appreciated how "expressive" SQL could be. 

So with that in mind, I clicked on the SQL tab and discovered that Pipedream had a [SQL service](https://docs.pipedream.com/destinations/sql/#adding-a-sql-destination) baked into the product. The docs do a great job of explaining how it works, but I thought I'd point out some highlights. 

First off - every account has a database they can use to store information. Data is account wide which means one workflow has access to another workflow's data so when naming your tables you want to ensure they are unique. 

Secondly, their services gets rid of the thing I disliked the most about SQL, writing those insert statements. I still remember the first time I stored data in Mongo. I had an object. I stored it. I was done. I freaking loved that. Pipedream's SQL service (which uses a product called [Preso](https://prestodb.io/) let's you do the same thing. You take some data:

```js
{
	name: "Fluffy",
	breed: "smelly cat",
	age: 5,
	gender: "female"
}
```

And you just store it. Done. There are details, of course, on how [data is mapped](https://docs.pipedream.com/destinations/sql/#what-happens-when-you-send-data-to-a-sql-destination) and you should check the docs especially if you are trying to store data values, but in general it "just works" and makes it simple to use.

Speaking of using it, and I'm going to show an example in a second, you can either write Node code to store information or use the SQL destination to handle it for you. The below is a screen shot I "borrowed" from the official docs:

<img data-src="https://static.raymondcamden.com/images/2020/04/sql2.png" alt="Example of SQL destination" class="lazyload imgborder imgcenter">

Before I get into an example, there's two final details that are important. First, this is not meant to be a permanent data storage solution. The [data retention](https://docs.pipedream.com/destinations/sql/#data-retention) docs say that currently your data is only stored for 30 days. That may be a deal breaker but don't forget you've got like an infinite number of other data storage systems you can use. Secondly, you do not yet have "workflow access" to the data. What I mean by that is you can run SQL queries against your data on the site (I'll be showing an example later in this post), but your workflows can't use code to access the data. This is a [known issue](https://github.com/PipedreamHQ/roadmap/issues/3) and hopefully something added soon. 

Alright, so how about a simple example, and while we're at it, I can show you another cool Pipedream feature. When you create a new account, one of the workflows you have automatically is "Global Error Workflow". This is the default error support you have for your account. Notice I said "error support", not "error handler", as it doesn't change how your workflows report errors, but rather handles processing the error after the naughty workflow has screwed up. I say "by default" because all new workflows have a setting for it:

<img data-src="https://static.raymondcamden.com/images/2020/04/sql3.png" alt="Settings showing error handler support" class="lazyload imgborder imgcenter">

And because the Global Error Workflow is, itself, a workflow, you can click in there and check out the code. The workflow has the following steps:

* A trigger bound to error events. You can't do much with this.
* A "filter and format" step that looks at the error and workflow ID and uses logic to only inform you of unique errors per workflow per 24 hours. Yes, you can modify this. Maybe you want to be notified of every error. 
* Finally, an email destination. 
  
So as I said, you can modify this event as you see fit, and I thought it would be cool to store my errors in the database. I wanted my code to run *before* the filter so I added a Node.js step after the trigger. I used some of the same code from the format step:

```js
async (event, steps) => {
	const dateFormat = require('dateformat')

	const { code, msg, ts } = event.error;
	const { id, workflow_id } = event.original_context;

	let payload = {
		workflow_id, 
		time: event.original_context.ts,
		code, 
		msg
	};

	$send.sql({
		table:"errors",
		payload  
	});
}
```

The workflow has access to an error object as well as context about the workflow that fired it. (At the time I wrote this, you only have access to the ID of the workflow, not the name. There's an open issue to get access to that too.) I decided that I would log the workflow id, the time, the error code, and the message. I create a simple object called `payload` and then sent it to the SQL system with `$send.sql`. And that's it. I love how simple that is.

Alright, now that I'm storing data, how do I use it? Well my original plan was to build a workflow that would return the data for me and I'd potentially build a dashboard. Unfortunately you can't do that yet. But you can run queries. Here's how that SQL tab looks on the Pipedream site.

<img data-src="https://static.raymondcamden.com/images/2020/04/sql4.png" alt="SQL panel" class="lazyload imgborder imgcenter">

They've got a simple editor for you to write SQL in, but it's got nice autocomplete like the code editors do. You can also expand tables on the left hand side to see what columns you have:

<img data-src="https://static.raymondcamden.com/images/2020/04/sql5.png" alt="Table properties" class="lazyload imgborder imgcenter">

Notice that my date is being stored as a string. Dates are *definitely* supported so I could make that better, but for now I'm going to wait until I get code access to data. Here's the result of a quick query:

<img data-src="https://static.raymondcamden.com/images/2020/04/sql6.png" alt="SQL result" class="lazyload imgborder imgcenter">

The little downward arrow on the upper right there let's you download your results in CSV. One more quick note about data - your data will not show up for a full minute. This is [documented](https://docs.pipedream.com/destinations/sql/#what-happens-when-you-send-data-to-a-sql-destination) but if you are doing quick testing, don't forget. 

Let me know if you've got any questions below, and while I'm not a huge Slack person, consider [joining their Slack](https://pipedream.com/community) as the company is really responsive there!

<i>Header photo by <a href="https://unsplash.com/@quinten149?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Quinten de Graaf</a> on Unsplash</i>