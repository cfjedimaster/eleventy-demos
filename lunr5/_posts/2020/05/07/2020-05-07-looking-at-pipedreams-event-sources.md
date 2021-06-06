---
layout: post
title: "Looking at Pipedream's Event Sources"
date: "2020-05-07"
categories: ["serverless"]
tags: ["javascript","pipedream"]
banner_image: /images/banners/water_source.jpg
permalink: /2020/05/07/looking-at-pipedreams-event-sources
description: Event Sources let you define custom workflow initiators for Pipedream
---

Before I begin, know that everything I'm discussing here is currently in beta form. It may, and will, change in the future so please keep that in mind if you are reading this in some post-Corona paradise where we can actually *do* things out in public. The feature I'm talking about today adds a really fascinating feature to [Pipedream](https://pipedream.com/) - Event Sources. 

Let me start off by explaining why this feature came about. Imagine you're building a workflow based on a RSS feed. RSS feeds contain a list of articles for a publication of some sort. Each item will contain a title, link, some content, and more properties. Let's say you want to send an email when a new item is added to the feed.

Right now you would build this like so:

<ul>
<li>Setup a CRON trigger. Your schedule would depend on the type of feed. For my blog a once a day schedule would be fine. For something like CNN, maybe once every five minutes.</li>

<li>Parse the RSS feed. There's a RSS action that does this for you:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/es1.png" alt="RSS parser" class="lazyload imgborder imgcenter">
</p>

By that way, it may not be obvious, but that action actually supports *multiple* feeds which is pretty bad ass.</li>

<li>Then take the items and email them. This is simple enough, but you've got a few problem. How do you know what's new? Luckily you don't have to worry about that, the RSS action Pipedream supplies uses the $checkpoint feature I <a href="https://www.raymondcamden.com/2020/04/04/using-state-in-pipedream-workflows">blogged</a> about last month to remember this for you. </li>
</ul>

Cool. So that's that. But this also assumes you're ok working with multiple items at once. In the case of "email me new items", that makes sense. You want one email with all the new items. The same applies to a Twitter search workflow. You want a packet of results. But what about a scenario where you want to process each item individually?

Well ok, you work in a loop. For every item do - whatever. Again, for simple workflows that would be enough. But for anything complex, you may have trouble. Pipedream workflows don't support a "loop this step N times" type logic. I know they are considering conditional steps, but I'm not sure about looping. 

One solution would be to build a second workflow that takes a singular item in as input. You then have a two workflow solution. The first one is responible for gathering the data and creating a list (with optional filtering involved) and then it calls out to the second workflow which handles unique items. I used an approach like this here: [Building a Reddit Workflow with Pipedream](https://www.raymondcamden.com/2020/04/20/building-a-reddit-workflow-with-pipedream)

So as I said, you have solutions, and that's good, but Event Sources really make this so much simpler. At a basic level, an event source is custom code you write to handle defining a custom workflow trigger event. By default, your workflows can be trigger by time (CRON), URL, email, or the REST API. Event Sources lets you define *anything* as a source for firing workflows.

Imagine you wanted workflow based on the full moon? Event sources would allow that. (Werewolves will love you.) A bit more realistically, what about a workflow that triggers on the first Monday of the month? That's not possible with CRON, but event sources would allow that as well.

Event sources consist of a schedule and your code. The schedule determines how often it runs. For something like the full moon or "first monday" example, once a day would make sense. The code is whatever your logic is. The "magic" part that makes it an event source then is that it simple emits data for every instance of an event. You can find out more at the [docs](https://docs.pipedream.com/event-sources/), but let's look at an example.

Imagine our RSS scenario. Given that we can parse RSS and know what's new, our RSS event source would then emit data for every item:

```js
items.forEach(item=>{
	this.$emit(item, {
    	id: this.itemKey(item),
    	summary: item.title,
        ts: item.pubdate && +new Date(item.pubdate), 
    })
})
```

Here's another snippet for an event source that fires on the first X of the month:

```js
const currentDay = new Date().getDay(); // In UTC

if (currentDay === parseInt(this.targetDayOfWeek)) {
	this.$emit({
		dayOfWeek: this.targetDayOfWeek,
	},{ summary: "First target day of the month" });
}
```

So how do you use it? When you create a new workflow you can now select from Event Sources as a source:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/es2.png" alt="List of sources" class="lazyload imgborder imgcenter">
</p>

In the screenshot above you'll see a number of items below SDK. Those are all *previous* event sources I've used. When you add a new event source, you configure it and name it, and it makes sense that you may want to use them again. 

If you click on Event Source, you then get a list of available sources. (Note that you can add a 100% customized one using the CLI. Also note that you can edit the code of an event source.) 

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/es3.png" alt="List of event sources" class="lazyload imgborder imgcenter">
</p>

Once you select it, you can then set up the parameters. Each event source will be different.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/es4a.png" alt="Configured source" class="lazyload imgborder imgcenter">
</p>

In this case I used Pipedream's blog's RSS feed. At the bottom (not shown on the screen shot above) is a Create Source button. After doing so, your event source is configured and ready to be used in your workflow:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/es9.png" alt="New configured ES" class="lazyload imgborder imgcenter">
</p>

Well almost. By default event sources are turned off. See the little toggle on the right. I believe they do this for cases where you may want to setup your workflow first before it starts firing off events. Just don't forget.

Event sources have their own administration panel at Pipedream. You can view them at <https://pipedream.com/sources/>.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/es5.png" alt="ES Editor" class="lazyload imgborder imgcenter">
</p>

For each event source you see a history of past events, logs, and configuration. You can also modify the code which is pretty cool. When I was playing around this feature earlier this week, I needed to slightly modify the RSS event source and it took all of two minutes.

This is an incredibly powerful addition to Pipedream. All of a sudden you have workflows based on any custom logic. Currently they've got event sources for Airtable, FaunaDB, Google Calendar, and more. If you go to the Event Sources "admin" page, <https://pipedream.com/sources> and click +, you can browse them. 

Also, Pipedream built a page specific for [RSS-based](https://rss.pipedream.com/) workflows that will give you some great examples. I've got a demo I've already built on this I'll be blogging about later this week.

As always, I'm curious to know if any of my readers are playing with this, so let me know in a comment below if you've checked this out yet.

<i>Header photo by <a href="https://unsplash.com/@tetrakiss?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Arseny Toguley</a> on Unsplash</i>