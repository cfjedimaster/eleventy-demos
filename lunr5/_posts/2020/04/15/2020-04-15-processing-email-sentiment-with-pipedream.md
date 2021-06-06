---
layout: post
title: "Processing Email Sentiment with Pipedream"
date: "2020-04-15"
categories: ["serverless"]
tags: ["javascript","pipedream"]
banner_image: /images/banners/angrycat.jpg
permalink: /2020/04/15/processing-email-sentiment-with-pipedream
description: A sentiment analysis workflow example with Pipedream
---

Ok, a quick spoiler. Today's [Pipedream](https://pipedream.com) post isn't really that interesting by itself, 
but I wanted a way to highlight a couple of cool features while working on an example that I hope folks will enjoy. I've done blog posts in the past about text sentiment analysis. I.e., what is a person talking about and what moods/emotions/etc are being used. In the past I've used IBM's Watson APIs for this and I've also used Microsoft's. Both have pretty darn cool APIs, but I thought I'd try something else, the npm [Sentiment](https://www.npmjs.com/package/sentiment) module.

This is an entirely opensource, Node-based text analysis tool that looks at input and looks specifically for positive and negative words. It supports multiple languages as well as the ability to customize what's positive or negative. 

Before I show using it, how did I find it? A day or so ago I noticed the "Explore" link in the top navigation of the Pipedream site. That brings you to <https://pipedream.com/explore>.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/es1.png" alt="" class="lazyload imgborder imgcenter">
</p>

This page has a bunch of shared workflows that you can look at it, including one named [Real-Time Sentiment Analysis](https://pipedream.com/@pravin/p_zACkav/readme). Once you open up a workflow, you can click the big green COPY button to put a copy in your account and play around with it.

So that's how I found the Sentiment package. Cool. I decided to build a demo based on customer service email processing. Imagine for a moment you've set up a "support@yourcompany.tld" email address. You may want to flag especially angry emails so that someone responds to them quicker. I built a demo of this workflow like so.

First, I added an email trigger. This gives you a unique email address that will be checked often. When it gets new email, it will start the workflow.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/es2.png" alt="Example email trigger" class="lazyload imgborder imgcenter">
</p>

I next built a step that would serve to set up my constant values. I learned this technique from the Pipedream folks. It's not required - remember you can do everything in one step if you want - but I like this breakdown. In this case I've got one constant, the highest level I'll ignore. I.e., everything below this level is considered too angry. The Sentiment package returns a value from -5 to 5 based on how negative or positive it is.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/es3.png" alt="Constants step" class="lazyload imgborder imgcenter">
</p>

Next I built a step to do the analysis. This is a Node.js step with just a few lines of code:

```js
async (event, steps) => {
	const Sentiment = require('sentiment');
	const sentiment = new Sentiment();
	this.sentiment = sentiment.analyze(steps.trigger.event.text);
}
```

Basically it just runs the analysis and exports it by saying it to the `this` scope. 

My next step does two things. It does a quick check to see if the sentiment is above our threshold, and if not, if formats text for mailing.

```js
async (event, steps) => {
	if(steps.analyze_text.sentiment.comparative > steps.constants.THRESHOLD) $end('Not unhappy enough.');

	let from = '';
	if(steps.trigger.event.from && steps.trigger.event.from[0]) {
	from = steps.trigger.event.from[0].address;
	if(steps.trigger.event.from[0].name) from += ` (${steps.trigger.event.from[0].name})`;
	}

	let subject = 'No subject';
	if(steps.trigger.event.subject) subject = steps.trigger.event.subject;

	this.subject = 'Angry Email Report!';
	this.body = `
	Angry Email Report

	Sent from: ${from}
	Subject: ${subject}
	Message Body: 
	${steps.trigger.event.text}
	`
}
```

The only thing probably interesting there is I do a bit of inspection of the from values in the email and try to display it a bit nicer. I also check for a subject. If it's blank I use a default. 

The last step is to have it email me. I configure it with the values I used earlier:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/es4.png" alt="Email config step" class="lazyload imgborder imgcenter">
</p>

That just leaves testing! I sent a few angry emails (trust me, I've got some pent up quarantine rage going on) and watched as the workflow executed and processed my emails. Here's an example:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/es5.png" alt="Sample email report" class="lazyload imgborder imgcenter">
</p>

Of course, for my initial testing, I did something a bit quicker than writing email, and you should definitely make note of it. Workflows have a "Send Test Event" button and on the right is a blue pencil icon:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/es6.png" alt="" class="lazyload imgborder imgcenter">
</p>

If you click the pencil, you can edit the test event data. I did this to modify the content of the test:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/es7.png" alt="Editing test events" class="lazyload imgborder imgcenter">
</p>

This is a very cool feature. Do note though that for this particular trigger, the "shape" of the event data doesn't quite match what you get when you send a real email. A [bug](https://github.com/PipedreamHQ/roadmap/issues/424) has already been opened for this and it may be fixed by the time you read this post.

I hope this post showed you a few new things about Pipedream and if you want to fork my workflow, you can find it here: <https://pipedream.com/@raymondcamden/email-sentiment-warning-p_ZJC9vo/edit>

<i>Header photo by <a href="https://unsplash.com/@musicfox?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">MusicFox Fx</a> on Unsplash</i>