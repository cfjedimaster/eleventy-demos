---
layout: post
title: "Building an App with the StackOverflow API"
date: "2021-09-16T18:00:00"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/tags.jpg
permalink: /2021/09/16/building-an-app-with-the-stackoverflow-api.html
description: How I used the StackOverflow API to generate a multitag report
---

One of the first things I did when I joined my new [team at Adobe](https://www.adobe.io/apis/documentcloud/dcsdk/) was to look at how, if at all, we were making use of StackOverflow. We've got a very active [set of forums](https://community.adobe.com/t5/document-services-apis/ct-p/ct-Document-Cloud-SDK?page=1&sort=latest_replies&filter=all&tabid=discussions) but I know that most developers tend to use StackOverflow for all their support needs. At the time I joined, we didn't really have tags that were being used consistently, so myself and others figured out what tag names were going to use, updated some older questions to use the right tags, and even seeded a few questions ourselves. (This is OK by that way.)

One of the things that my teammates wanted to know was how well these tags were working, how many questions were being asked, how many were answered, and so forth. StackOverflow provides really good metrics for an individual tag. But I was curious if where was a way to aggregate that over multiple tags. Also, our marketing people don't use StackOverflow and wouldn't know where to look for stats. 

And plus - if I have the opportunity to try to learn a new API and build something, I'm going to leap at the opportunity. 

<p>
<img data-src="https://static.raymondcamden.com/images/2021/09/raisehand.gif" alt="Animated gif of person raising their hand excitedly" class="lazyload imgborder imgcenter">
</p>

I did what any good developer would do and did a quick google for "stackoverflow api" and ended up at the [Stack Exchange API](https://api.stackexchange.com/). As I expected, there's an API for pretty much every aspect of the site. Even better, you can do things without authentication or an API key. That being said, I absolutely recommend [registering an application](https://stackapps.com/apps/oauth/register) just to get a key. I worked on my demo over a few days and didn't hit the anonymous quota towards the end, but signing up was quick and painless (and free), and the key worked right away. 

For my initial report, I wanted to see how many questions had been asked, and how many were unanswered. I wanted a total number as well as a value for the past seven and thirty days. The API has multiple methods related to questions, but they did not let you pass a list of tags that could be used as an aggregate. By that I mean if you checked tags A and B, it would be an AND search where only questions tagged with both would work. I then found the [search](https://api.stackexchange.com/docs/search) API. In that method, the list of tags are considered an OR search. 

The URL ended up like so:

```
https://api.stackexchange.com/2.3/search?order=desc&sort=activity&site=stackoverflow&key=${KEY}&tagged=${tags}&filter=total
```

Where `KEY` is my application key and `tags` are my list of tags. The `filter=total` at the end is a feature that lets you get just the total for your query.

The response is super short and simple:

```json
{"total":19}
```

To handle date filters, I setup my function to allow for an optional age in days. If passed, I add this to the URL:

```js
if(ageInDays) {
	let now = new Date();
	now.setDate(now.getDate() - ageInDays);
	startFilter = `&fromdate=${Math.floor(now.getTime()/1000)}`;
}
```

Now for the fun part. To handle unanswered questions, I needed to switch to the [advanced search](https://api.stackexchange.com/docs/advanced-search) API. It was very similar with the main change being me using `accepted=false`. That doesn't mean that the question wasn't answered, just that an accepted answer isn't there. Unfortunately, I ran into a bug here. While the docs describe the `tagged` attribute the same as the search API, it treated the query like an AND. I raised this on stackapps: [Call to search/advanced is treating tagged as an AND search, not OR](https://stackapps.com/questions/9156/call-to-search-advanced-is-treating-tagged-as-an-and-search-not-or?noredirect=1). It turns out this is an eight year old bug and from what I can tell, the API isn't getting a lot of attention from the Corporate folks over at StackOverflow. That's a shame. So to handle this, I took the list of tags, split them, and ran multiple async fetch calls to grab them all. 

The net result of the function is a total for the number of questions and a total for unanswered ones as well. Here's that function:

```js
async function getAggregateData(tags, ageInDays) {
  let result = {};
  let startFilter='';

  if(ageInDays) {
	let now = new Date();
	now.setDate(now.getDate() - ageInDays);
	startFilter = `&fromdate=${Math.floor(now.getTime()/1000)}`;
  }
  
  // get total
  let resp = await fetch(`${url}&tagged=${tags}&filter=total${startFilter}`);
  let data = await resp.json();
  result.total = data.total;
  
  /*
  In my testing, despite the docs for search/advanced saying that tagged
  was OR, it acted like an an AND. So we need to do N calls for each
  */
  let tagArr = tags.split(';');
  requests = tagArr.map(async t => {
	let resp = await fetch(`${unansweredUrl}&tagged=${t}&filter=total${startFilter}`);
	return await resp.json();
  });
  result.unanswered = 0;
  let unAnsweredData = await Promise.all(requests);
  unAnsweredData.map(u => result.unanswered += u.total);
  return result;
}
```

This is probably yet another example of why I can't pass the Google interview test, but it works, so I'm happy with it. 

When I shared this data with my coworkers, they had two asks. One was to simply *see* the questions. I decided to write a quick function to simply return the last ten. The search API already returns questions, I was just turning that off with the filter. If I removed that filter I'd get the question data. But I looked more into [filters](https://api.stackexchange.com/docs/filters) and saw that they provide a cool system where you can define, on the fly, a subset of data you want. So if I just needed a few bits of the question, I could create, via the API itself, a filter specifying that. It's a bit wonky to use, but on the [search](https://api.stackexchange.com/docs/search) API page itself, I used their `Try It` tool, designed a filter, and copied the filter value out. Right now I just need the question's title, posted date, views, and links:

```js
/*
I'm a generic method to get the most recent questions.
*/
async function getQuestions(tags, total=10) {
	let resp = await fetch(`${url}&tagged=${tags}&sort=creation&pagesize=${total}&filter=${encodeURIComponent(Q_FILTER)}`);
	let data = await resp.json();
	return data.items;
}
```

The filter is a random ID value so I simply stored it up top (I ended up changing it once or twice, so that helped). I also made use of [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) to format the dates outside of this function.

All of this was wrapped in a super simple Vue.js application. I did get a bit fancy and made use of my post where I describe [making use of URL paramters in a Vue app](https://www.raymondcamden.com/2021/05/08/updating-and-supporting-url-parameters-with-vuejs) so I could simply give my teammates a URL with the tags already in it.

So one final bit. I mentioned that there were two requests of me. I already described how I handled the first. The second one was a way to get a complete view count for the tags. Right now there isn't one. In theory I could hit the API N times to paginate over all the questions and countr the views, and that would work for a while, but I was concerned about hitting the quota count. From what I could see on their [throttles](https://api.stackexchange.com/docs/throttle) docs, I'd probably be safe, especially since our tags are new, but it just felt wrong to download *all* the questions.

Turns out there's another really cool tool called the [StackExchange Data Explorer](https://data.stackexchange.com/). This is a *powerful* query interface that lets you write custom (and complex) SQL queries against their data. This data is *not* up to date, it's updated once a week, but for our purposes it's good enough. 

Here's the query I ended up writing. It's probably not the best, but it worked:

```sql
select sum(viewcount) as totalviews
from Posts
INNER JOIN PostTags ON PostTags.PostId = Posts.id
where posttypeid = 1
and posttags.tagid in (
  select tags.id
  from tags
  where tagname in ('adobe-embed-api', 'adobe-documentgeneration', 'adobe-pdfservices')
)
```

Unfortunately you can't use get this data via an API. But, each query you write gets a unique URL and you can share that: <https://data.stackexchange.com/stackoverflow/query/edit/1460991#resultSets>. Hit that URL, run the query, and you can see the tag. Feel free to change the SQL too, it will become its own fork.

You can see my incredibly simple Vue demo here:

<https://cfjedimaster.github.io/vue-demos/sotagreports/index.html>

And here's an example with tags in the URL:

<https://cfjedimaster.github.io/vue-demos/sotagreports/index.html?tags=adobe-embed-api%3Badobe-documentgeneration%3Badobe-pdfservices>

The full source, as much as it is, may be found here: <https://github.com/cfjedimaster/vue-demos/tree/master/sotagreports>

This is a pretty minimal report and I'd love to hear your feedback on what else could be added.

Photo by <a href="https://unsplash.com/@angelekamp?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Angèle Kamp</a> on <a href="https://unsplash.com/s/photos/tags?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  
