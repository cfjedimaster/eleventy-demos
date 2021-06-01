---
layout: post
title: "Building a Reddit Workflow with Pipedream"
date: "2020-04-20"
categories: ["serverless"]
tags: ["javascript","pipedream"]
banner_image: /images/banners/cat_newspaper.jpg
permalink: /2020/04/20/building-a-reddit-workflow-with-pipedream
description: Pipedream workflows for working with Reddit
---

Almost four years ago I [blogged](https://www.raymondcamden.com/2016/07/05/new-poc-dailyreddit) about a demo I built using [Reddit's](https://www.reddit.com/) API. The demo was a multi-user application that made use of Mongo for persistence and Passport.js for user authentication. You would login, select subreddit's to subscribe to, and then once a day it would email you the new posts from that subreddit.  This was built in a "traditional" Node.js style with a server running full time to process requests. I thought it would be fun to build this again (although slightly different) using [Pipedream's](https://pipedream.com) support for working with the Reddit API. I built two different versions of a simple workflow I'd like to share below.

So before I begin, how does Pipedream support Reddit? Currently Pipedream doesn't have a "service explorer" or a way to see what pre-built actions are available. What I've been doing is going to a test workflow I use for, well, testing, and click to add a new action. I then browse what's available. If you know what you want, you can click the name of the app to filter. Apps will be at the end of the list of actions:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/reddit1.png" alt="Action/app display" class="lazyload imgborder imgcenter">
</p>

After you click it, the actions are then filtered to items within it. In the case of Reddit, this is quite a bit:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/reddit2.png" alt="List of actions" class="lazyload imgborder imgcenter">
</p>

You can type to filter even more. For my case I knew I wanted to get new posts so typing "new" was enough:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/reddit3.png" alt="New" class="lazyload imgborder imgcenter">
</p>

Finally, once you select the action, note that the you probably still need to know about the API itself. Sometimes the properties are obvious, but sometimes they aren't. So in the example above, I knew what Subreddit meant but wasn't sure about the value of "after":

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/reddit4.png" alt="Property examples" class="lazyload imgborder imgcenter">
<p>

So in that case, I simply used the [Reddit API documentation](https://www.reddit.com/dev/api/). 

Alright, so with that out of the way, let me talk about what I built.

### Reddit Demo Version One

For my first workflow, I attempted to recreate my Node POC in a simpler manner. When you add an application to your Pipedream workflow and authenticate it, it's tied to your account, so instead of trying to build something multi-user with Mongo and all that, I settled on a simpler idea.

* Get the new posts from one subreddit.
* Email them to me.

My [workflow](https://pipedream.com/@raymondcamden/daily-reddit-posts-p_dDCYOd/edit) ended up with the following steps:

* A CRON trigger set to run once a day.
* A Node.js trigger to specify the subreddit name:
  
```js
async (event, steps) => {
	this.reddit = 'Acadiana';
})
```

* Next, I used the "get new" Reddit action. While this supports an "after" filter, that relies on the ID of a post. There is no way to apply a date filter. I figured I'd fix that later. All I specified here then was the subreddit:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/reddit5.png" alt="Configured step" class="lazyload imgborder imgcenter">
</p>

* As I said above, there's no way (that I know of) to filter to today via the API. So I added a Node.js step to filter to posts no more than 24 hours old.

```js
async (event, steps) => {
	/*
	Date.now is ms, for reddit posts, created_utc is seconds, so convert our value to seconds
	*/
	const now = Date.now()/1000;
	// and 24 hours in seconds then is 24 * 60 * 60
	const maxtime = 24 * 60 * 60;
	this.currentPosts = steps.get_new.$return_value.data.children.filter(p => {
		let diff = now - p.data.created_utc;
		return diff < maxtime;
	}).map(p => {
		return p.data;
	});
	console.log('i now have '+this.currentPosts.length+' posts');
})
```

Let me just say I'm very proud of my `filter` and `map` usage there. Almost Google tech interview quality I'd say. ;)

* The next step handles creating my value to be used in email. I used some of the logic from my [old post](https://www.raymondcamden.com/2016/07/05/new-poc-dailyreddit) in terms of handling things like recognizing when there's a proper thumbnail.

```js
async (event, steps) => {

	let dotLeft = function(s, len) {
	if(s.length < len) return s;
	return s.substring(0, len)+'...';
	};

	this.subject = `Daily Reddit Report for ${steps.constants.reddit}`;
	this.body = `
	<h2>Daily New Posts for ${steps.constants.reddit}</h2>
	<p/>
	`;
	steps.filter_to_today.currentPosts.forEach(p => {
		// only show thumbnails when they aren't "self","default","nswf"
		if(p.thumbnail === 'self' || p.thumbnail === 'default' || p.thumbnail === 'nsfw') delete p.thumbnail;
		let text = '';
		if(p.is_self) text = dotLeft(p.selftext,200);
		this.body += `
		<p>
		${ p.thumbnail ? '<img src="'+p.thumbnail+'" align="left" style="margin-right:10px">':''}
		<b>Title: ${p.title}</b><br/>
		URL: <a href="${p.url}">${p.url}</a><br/>
		Author: ${p.author}<br/>
		<br clear="left">
		${text}
		</p>  
		`
	});

}
```

Be sure to make note of that epic ternary operator in there. I'm a 10X developer, 9X minimum.

* And then finally, I added the email step. By default, Pipedream's email step requires the text of an email but makes the HTML property optional. To keep things easier, I supplied my HTML value for both, which is *not* what you would want to do. Since I know I can read HTML email, I figured that was ok.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/reddit6.png" alt="Email step" class="lazyload imgborder imgcenter">
</p>

And that was it. Now I've got a daily report for my favorite subreddit (it's for my local area) that shows up in my inbox once a day.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/reddit7.png" alt="Email example" class="lazyload imgborder imgcenter">
</p>

You can view (and copy!) the complete workflow here: <https://pipedream.com/@raymondcamden/daily-reddit-posts-p_dDCYOd/edit>

### Reddit Demo Version Two

The first iteration was nice, but a bit limited. For the second version I decided to kick it up a notch. I wanted a version where the email contained new posts from ally of my subscribed subreddits. Luckily Pipedream makes that part trivial as they have an action for that already. All I needed to do was put it together. But that raised a new issue. I knew I could take my first workflow and turn it into an API. Pass in a subreddit name and return the posts as JSON instead of emailing them. 

But Pipedream doesn't support the idea of "loop over this array and execute a step for each" - at least not yet. Given that I knew I'd have a workflow as an API, I decided to use two workflows. One for the API, and one to handle making HTTP requests to that endpoint and "collect" the results.

Let's start with the API. I began with a HTTP trigger which gave me a URL to hit. I then added the same "get new" Reddit action and tied the subreddit name to the query string:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/reddit8.png" alt="Reddit step" class="lazyload imgborder imgcenter">
</p>

Note that after I had tested my URL with a query string value (`subreddit`), the editor was smart enough to suggest it when I added the step. It even (although it's not in this screen shot) showed a sample value. This was freaking cool and super helpful. 

My next step was the "filter and return" step and used this code:

```js
async (event, steps) => {
	/*
	Date.now is ms, for reddit posts, created_utc is seconds, so convert our value to seconds
	*/
	const now = Date.now()/1000;
	// and 24 hours in seconds then is 24 * 60 * 60
	const maxtime = 24 * 60 * 60;
	let result = steps.get_new.$return_value.data.children.filter(p => {
	let diff = now - p.data.created_utc;
	return diff < maxtime;
	}).map(p => {
	return p.data;
	});

	$respond({
		status: 200,
		body: { result }, // This can be any string, object, or Buffer
	});

}
```

And that's it. Now if I hit `myurl?subreddit=Acadiana` I get a JSON dump of new posts for that subreddit. I'd share a dump but it's rather large. You can view/copy this workflow here: <https://pipedream.com/@raymondcamden/daily-reddit-api-p_WxCkrw/edit>

So that's the API. To build my "real" workflow, the one handling gathering and emailing data, I built a new CRON-based workflow. For my second step, I used the "get my subscribed subreddits" action. I only needed to supply "subscriber" as an argument:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/reddit9.png" alt="My subs actin" class="lazyload imgborder imgcenter">
</p>

The next step is a Node one. This handles taking the results from the previous step and making the asynchronous calls to my API:

```js
async (event, steps) => {

	const axios = require("axios");

	// simplify things a bit
	let mysubs = steps.get_subreddits_mine_where.$return_value.data.children.map(s => {
	return s.data;
	})

	// title, displayName
	let promises = [];
	mysubs.forEach(sub => {
		let url = 'https://engtbib844m2yqb.m.pipedream.net?subreddit='+sub.display_name;
		promises.push(axios({method:'get', url}));
	});

	let result = await Promise.all(promises);
	// global post array we can sort in a bit
	this.posts = [];

	for(let i=0;i<result.length;i++) {
		this.posts = this.posts.concat(result[i].data.result);
	}

	this.posts.sort((a,b) => {
		if(a.created_utc < b.created_utc) return 1;
		if(a.created_utc >b.created_utc) return -1;
		return 0;
	});

	console.log('total posts', this.posts.length);
}
```

Note I also sort the posts by date. I think some people may prefer their "report" grouped by subreddit. I kind of liked the posts mixed up. The next step handled creating the email. I'm going to skip sharing the code because you can see it when I share the workflow and the only real change was to include the name of the subreddit. The final step was just the email action. And that's that. 

From my initial workflow to this one, it took me maybe one hour total. I loved that I had that flexibility and could basically just drop in steps like LEGO pieces. Here's a screen shot of the email:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/reddit10.png" alt="Final email" class="lazyload imgborder imgcenter">
</p>

You can view/copy my workflow here: <https://pipedream.com/@raymondcamden/daily-reddit-posts-2-p_ZJC9x9/edit>

I hope these examples were helpful, and keep in mind I'm still a new Pipedream user so (most likely) there's nicer ways of doing what I demonstrated. Leave me a comment below if you've got any questions!