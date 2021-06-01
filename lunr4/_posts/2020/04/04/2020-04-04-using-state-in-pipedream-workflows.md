---
layout: post
title: "Using State in Pipedream Workflows"
date: "2020-04-04"
categories: ["serverless"]
tags: ["javascript","pipedream"]
banner_image: /images/banners/pipes2.jpg
permalink: /2020/04/04/using-state-in-pipedream-workflows
description: Using checkpoint in Pipedream to remember values
---

I've been playing a lot with [Pipedream](https://pipedream.com/) lately and have been enjoying the heck out of it. If you didn't see it, my [last post](https://www.raymondcamden.com/2020/04/02/building-a-twitter-bot-in-pipedream) described how to build a simple Twitter bot using the platform. Today I want to demonstrate something else with Pipedream, a feature that is pretty simple but incredibly useful - [managing state](https://docs.pipedream.com/workflows/steps/code/#managing-state). 

Many times when working with serverless functions, it would be convenient to store information. Perhaps a simple cache or even just the time the function last run. There's a huge variety of data storage systems out there with easy to use APIs, but if your needs are *really* small, then they may seem like overkill.

One of my favorite features of Webtask (sigh, RIP Webtask) was that it supported a state system that let you read and write to a JavaScript object that persisted for your function. Obviously it doesn't replace something like MongoDB but for remembering a few values it was incredibly useful. 

Pipedream has a similar feature, but done a lot better I think. Pipedream supports a variable called `$checkpoint`. This value will persist for your workflow. It can contain anything, either a simple value (maybe you want to store only one thing) or a full JavaScript object. Anything that can be serialized can be stored. Even better, while $checkpoint is global to the entire workflow (and is most likely the option you'll use), you can even have *per step* state if you use `$this.checkpoint`. 

When I first [blogged](https://www.raymondcamden.com/2020/03/28/a-look-at-pipedream) about Pipedream, I described a simple workflow that did a Twitter search, formatted the results, and emailed them to me. One issue with the workflow is that it would (possibly) keep sending the same results over and over again. The Twitter API supports returning results after a previous tweet so this should be easy to fix, and with the `$checkpoint` variable, it's easy to implement. (See my note at the bottom.) 

Before I describe how I did it, here's a quick refresher of how the workflow looked. In this case I'm using the nicer workflow [Dylan Sather](https://twitter.com/DylanSather) of Pipedream had setup. It was a bit more complex, and reusable than the simpler version I did. Anyway, here are the steps:

1) The first part of the workflow is a CRON trigger set to run every hour. 
2) The next part is a Node.js script that specifies a few constants.

```js
async (event, steps) => {
	// this.property exports values for use in future steps. We call these "step exports":
	// https://docs.pipedream.com/workflows/steps/#step-exports.
	this.searchTerm = "convert pdf"
}
```
3) The third step is the search Twitter action. All I had to do there is connect my account and tell it to use the result from the previous step.
4) The next step handled formatted the result into a string.
   
```js
async (event, steps) => {

	// Format a message that contains the text of tweets returned by our search,
	// which we'll send via email below.

	// We reference step exports from previous steps here, e.g. steps.search_twitter.$return_value
	this.message = `New ${steps.CONSTANTS.searchTerm} tweets:

	${steps.search_twitter.$return_value.statuses.map(status => {
	return `New tweet from ${status.user.screen_name}: ${status.full_text}`
	}).join("\n\n")}

}
```

5) The final step then emailed the result of that step to me.

So that's the workflow as it stands out - every hour (or whatever schedule, or manually if testing), search for a string, format the results, an email it. Now let's enhance it with state!

First, I modified the step that defined my search string:

```js
async (event, steps) => {

	// this.property exports values for use in future steps. We call these "step exports":
	// https://docs.pipedream.com/workflows/steps/#step-exports.
	this.searchTerm = "@raymondcamden";

	if($checkpoint && $checkpoint.lastId) {
		this.since_id = $checkpoint.lastId;
	}
}
```

My modification (ignoring the search term) is to check for $checkpoint and see if I have a `lastId` key. If so, I export `this.since_id`. Remember that values you write to the `this` scope are exported. They act like step output.

I then modified the Twitter search action to add the `since_id` param.

<img data-src="https://static.raymondcamden.com/images/2020/04/pds1.png" alt="Action UI" class="lazyload imgborder imgcenter">

The next modification was to store a value I could use next time for step ID. I did this in the same step I format the tweets. Note, I could have done a separate step for this. Pipedream's "step" metaphor makes it easy to break things down as much as you want. Much like how you typically write a JavaScript function to do one thing only, you could apply the same to Pipedream too. I'm being lazy though and just keeping it simple.

```js
async (event, steps) => {
	// Format a message that contains the text of tweets returned by our search,
	// which we'll send via email below.

	if(steps.search_twitter.$return_value.statuses.length === 0 ) {
		$end("Ending due to no statuses");
	}

	// We reference step exports from previous steps here, e.g. steps.search_twitter.$return_value
	this.message = `New ${steps.CONSTANTS.searchTerm} tweets:

	${steps.search_twitter.$return_value.statuses.map(status => {
	return `New tweet from ${status.user.screen_name}: ${status.full_text}`
	}).join("\n\n")}
	`;

	//remember last tweet
	let lastId = steps.search_twitter.$return_value.statuses[0].id;
	$checkpoint = {
		lastId:lastId
	};
}
```

There's two mods here. One is to see if we have any tweets at all. We may not. If so, I use the cool `$end` feature to immediately end execution. When this is used, it's rendered nice in the UI too:

<img data-src="https://static.raymondcamden.com/images/2020/04/pds2.png" alt="Showing how $end is rendered" class="lazyload imgborder imgcenter">

Finally, I need to store the ID of the last tweet (first in the array). Notice that I'm using an object for my value. I did that for two reasons. One, I didn't realize Pipedream let you store *just* a value. Secondly, I decided I may enhance this workflow in the future and store more values. That's me pretending I'm forward thinking and smart (spoiler, I'm not). 

And that's it. If you want to see the full workflow, and copy it to your own account, just hop over here: <https://pipedream.com/@raymondcamden/email-me-new-tweets-improved-p_LQCOlq/>. Thanks again to the folks at Pipedream for answering about 200 emails I sent in the last 48 hours on this and other topics!

p.s. Ok, way up top I mentioned I had a note about the Twitter API. While the API is generally easy to use, I had trouble getting this exact logic right. I think I did, but I'm not 100% sure. That's not really a Pipedream concern, but I just wanted to be honest about my own uncertainty!

<i>Header photo by <a href="https://unsplash.com/@martinadams?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Martin Adams</a> on Unsplash</i>