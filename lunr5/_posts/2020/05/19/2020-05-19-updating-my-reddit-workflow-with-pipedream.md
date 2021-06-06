---
layout: post
title: "Updating my Reddit Workflow with Pipedream"
date: "2020-05-19"
categories: ["serverless","javascript"]
tags: ["pipedream"]
banner_image: /images/banners/cat_newspaper.jpg
permalink: /2020/05/19/updating-my-reddit-workflow-with-pipedream
description: How I updated my Pipedream workflow based on my experience with the result.
---

This was originally just going to be a tweet, but then I realized I wanted a bit more space to talk about it and figured I'd write it up as a post. And since this is my blog and I can do what I want to, you get to enjoy this little nugget of information. 

Back almost exactly a month ago, I [blogged](https://www.raymondcamden.com/2020/04/20/building-a-reddit-workflow-with-pipedream) about using Pipedream to build a Reddit email report. The idea was that I wanted a daily email of posts from my subscribed subreddits for the past 24 hours of content. The implementation was a bit complex. I used one workflow to handle "get a days worth of content from subreddit" as a general "API" and another workflow connected to my authentication. It handles getting my subscriptions, hitting the API, and then generating the email. Here's an example of how that looked:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/04/reddit10.png" alt="Email report" class="lazyload imgborder imgcenter">
</p>

This worked well, but after a while of actually *getting* the email, I noticed some problems. The email takes all of the posts from all of my subscriptions and sorts them together. I thought this made sense to me, but I noticed it made it harder to actually read the content. Sometimes I don't care about a subreddit and mentally it just felt weird going from the movies subreddit to the Acadiana one. Also, some subreddits get a **huge** amount of traffic in a day. The email was hard to read and just too long.

So I decided to fix that. I didn't want to edit my original workflow because I wanted it to still be a reference for the older post. Luckily Pipedream makes that simple. I turned off the CRON schedule on the workflow and just used the copy command. 

Next, I edited the Node.js code step that combines and sorts my data. This:

```js
for(let i=0;i<result.length;i++) {
	this.posts = this.posts.concat(result[i].data.result);
}

this.posts.sort((a,b) => {
	if(a.created_utc < b.created_utc) return 1;
	if(a.created_utc >b.created_utc) return -1;
	return 0;
});
```

Became this:

```js
for(let i=0;i<result.length;i++) {
  this.posts = this.posts.concat(result[i].data.result.slice(0,10));
}
```

No more sorting together and I'm only getting the first ten entries from each subreddit. (Those posts should be date sorted already. Should be.)

Then I modified the step that formats the email. I added in code to notice when a new subreddit start and added HTML to make it more visibly separated. 

```js
let dotLeft = function(s, len) {
  if(s.length < len) return s;
  return s.substring(0, len)+'...';
};

let lastSub = '';

this.subject = `Daily Reddit Report`;
this.body = `
<h1>Daily New Posts for Your Reddit Subscriptions</h1>
<p/>
`;
steps.get_and_sort.posts.forEach(p => {
  // only show thumbnails when they aren't "self","default","nswf" - or more broadly, not a url
  if(p.thumbnail.indexOf('http') === -1) delete p.thumbnail;
  let text = '';
  if(p.is_self) text = dotLeft(p.selftext,200);
  if(p.subreddit !== lastSub) {
    this.body += `<hr/><h2>${p.subreddit}</h2>`;
    lastSub = p.subreddit;
  }
  this.body += `
<p>
${ p.thumbnail ? '<img src="'+p.thumbnail+'" align="left" style="margin-right:10px">':''}
<b>Title: ${p.title}</b><br/>
URL: <a href="${p.url}">${p.url}</a><br/>
Reddit URL: <a href="https://www.reddit.com${p.permalink}">https://www.reddit.com${p.permalink}</a><br/>
Author: ${p.author}<br/>
<br clear="left">
${text}
</p>  
  `
});
```

Basically - notice when the subreddit changes and add a horizontal rule and header. Also notice I modified my code on when to show images. This seems to work much better.

And that's it. My new workflow may be found here: <https://pipedream.com/@raymondcamden/daily-reddit-posts-3-p_PAC9DV/edit?e=1c8nZNETuFxToNCya2eVCafjVAu> I'm trying my best to make good use of the [Readme](https://pipedream.com/@raymondcamden/daily-reddit-posts-3-p_PAC9DV/readme) feature to document what I've done. 

