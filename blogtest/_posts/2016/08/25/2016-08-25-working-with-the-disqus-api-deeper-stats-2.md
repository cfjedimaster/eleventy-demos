---
layout: post
title: "Working with the Disqus API - Deeper Stats (2)"
date: "2016-08-25T10:04:00-07:00"
categories: [javascript]
tags: []
banner_image: /images/banners/disqus_api.jpg
permalink: /2016/08/25/working-with-the-disqus-api-deeper-stats-2
---

Welcome to (probably) my final blog post on working with the [Disqus API](https://disqus.com/api/docs/). It's been fun building my own tools for my comment data, but I've scratched this itch enough and will probably not work on it again. My final tool isn't perfect, but it works for me and provides the stats I wanted (that Disqus themselves did not provide) and as the code is up on Github, folks are free to take it and run. (But if you do, let me know!)

<!--more-->

The main focus of this version of the code was to turn what I did in the last post (<a href="https://www.raymondcamden.com/2016/08/19/working-with-the-disqus-api-deeper-stats/">Working with the Disqus API - Deeper Stats</a>) into a proper application. That version handled getting data and persisting it into IndexedDB. It ran a few analytics on that data and reported it to the console. What I wanted was a "proper" application. By that I mean good UI and some way of working with the user to let them know the current state of their data.

Turns out - that was a far bit more difficult than working with the API. I don't think I'm necessarily surprised by this, but the concept of "An Application" is much more deeper than "Hit an API and dump some stats." What I wanted was this:

* The first time you visit the site, prompt for a forum name and fetch the data.
* When you return, recognize that last time you used forum X, and you had data up to date so and so.
* Also, if you use another forum, remember specific details about that one as well. So I can come back and the app will know both the last one I used, as well as a list of all the forums it has data on.

That was the goal, and you'll see some code related to it all, but I scaled back a bit in terms of the third bullet point. Right now if you go between one forum and another, it won't remember the 'last sync' aspect of the first forum. Again, I leave this to folks who want to file a pull request. I'll be using my tool for my blog comments here so I'm not worried about going back and forth to other forums.

To handle this, I used localStorage to remember the name of the forum and the time of the last sync. When the application starts up, it looks for localStorage data and shows or hides a particular div based on that data. So on first hit, you see this:

![Initial View](https://static.raymondcamden.com/images/2016/08/vader1.jpg )

But when you return, the app can remind you of the last forum and provide you with a date of the last sync:

![Next View](https://static.raymondcamden.com/images/2016/08/vader2.jpg )

Nothing too special about that, and as I said, it works well with one forum but not multiple.

Another change was to provide feedback during sync. For my blog, the entire process takes about 10 minutes. Unfortunately I can't provide a comment count, but I can show status while it syncs:

![About half way there!](https://static.raymondcamden.com/images/2016/08/vader_slow.jpg )

Technically - I could do a comment count by using the mechanism I described in my [first blog post](https://www.raymondcamden.com/2016/08/18/working-with-the-disqus-api-comment-count/). In that example, I get all the threads and then count the comment size from there. Even on my blog that works rather fast as it just takes 57 or so network requests, but adding that to the mix seemed like a bit too much. There's one benefit it would provide that I'll describe in a bit.

Once everything is loaded, we can then go to the stats. What's cool is that after the sync, you can reload the app and as long as you're using the same forum, updating is much quicker. First, some general stats.

![General](https://static.raymondcamden.com/images/2016/08/vader3.jpg )

So this should all make sense, but obviously you can see one missing. Getting a "per day" average ended up being non trivial. In order for this to properly work, you would need to know the range of your site's existence. My blog launched in 2003, but I switched to Disqus a year or so ago. I imported old comments, but if no one commented on my blog in the first year, I'd need to somehow add that to my stats. Basically the "life" of the site is not something Disqus could know. In theory, I could add a "Settings" panel where I define a forum's site. (I could even go crazy and ask for Google Analytics information and mash that up with Disqus but oh my god no one's got time for that.)

Another option would be an "Average Per Thread" figure, but in this version of the code, I'm not fetching threads. I *do* fetch thread data for comments, but this will not include threads with no comments. So that goes back to what I said earlier about how possibly adding thread data would be a good improvement. 

Now to the first chart:

![By Year](https://static.raymondcamden.com/images/2016/08/vader4.jpg )

I'm using [Chart.js](http://www.chartjs.org/) for my charting in the project. I go back and forth between liking and disliking this solution. Honestly, I haven't found *any* charting engine for JS that made me completely happy. But for now, this works well enough. One issue though is that for sites with less history, this chart will be near worthless. I thought it might be cool to switch the chart dynamically to a "per month" chart if the 'age' of data was less than some threshold, like 36 months. I also thought that maybe a "per month" version would work fine even for my data. This is something I'd like to come back to later. For now though I like the report. I'm not terribly happy that my engagement is dropping, but it is very useful and clear to understand data.

Another consideration would be mapping my comment activity to the age of my content. Are people mostly commenting on new articles or old articles. I assume new, but I don't know. Again, this goes back to how I could provide 'meta info' on the site. I do know the URL of where a comment was posted, and for my blog, that includes date information. Now let's go to the next chart:

![By DOW](https://static.raymondcamden.com/images/2016/08/vader5.jpg )

No big surprise here - weekdays are busy - but I *was* surprised that it rose up to and including Friday. I always tend to think Friday posts have less traffic, but from what I see here, at least in terms of engagement, that isn't the case. And again, this doesn't necessarily mean people are commenting on stuff *posted* on Friday. As I said, there is real room for deeper analytics here if we integrate with Google Analtics. I could build that - I just don't have time. (Hey VCs, wanna fund this?

I haven't shared any code yet as this is mostly an update of the previous post, but here is how I handle getting the DOW stats. 

<pre><code class="language-javascript">
function getCommentsPerDOW() {
	var def = new $.Deferred();

	var trans = db.transaction([&#x27;posts&#x27;], &#x27;readonly&#x27;);
	var posts = trans.objectStore(&#x27;posts&#x27;);

	&#x2F;&#x2F;see lame msg in year stat
	var done = 0;
	var dow = [];

	for(let i=0;i&lt;7;i++) {
		let range = IDBKeyRange.only(i);
		
		posts.index(&#x27;dow&#x27;).count(range).onsuccess = function(e) {
			dow[i] = e.target.result;
			done++;
			if(done === 7) def.resolve(dow);
		};
		
	}
	return def;
}
</code></pre>

So a couple of things here. I'm mixing and matching ES6 code with older style code. That's bad, and I should clean it up, but I probably won't. Note the use of `let range` in the for loop. This handles the issue of `i` losing its value in the `onsuccess` call back. What isn't terribly slick is how I handle knowing when all 7 calls are done. I'm using a counter which seems sucky. IndexedDB isn't promised-based but if it was, I'd use that and do an `all()` call on the results to know when they were complete. There is a library that adds Promises to IDB, but I wanted to avoid making this even more complex.

Next up is thread stats:

![By Thread](https://static.raymondcamden.com/images/2016/08/vader6.jpg )

It's hard to tell in the screenshot, but those titles are links to the posts. For the most part, this data matched what I already knew. In terms of tech, PhoneGap rules this blog, with a ColdFusion post (ignoring the BlogCFC one) coming in sixth.

My final report is a sorted look of my commenters. Disqus has an avatar for folks, but not everyone chooses to use it.

![By Commenter](https://static.raymondcamden.com/images/2016/08/vader7a.jpg )

When I can, I provide detail about when they joined Disqus and link to their home page. There's a bit more information available, but I didn't think it was worthwhile.

I'm not going to provide a link to the online version of this demo as it's data store conflicts with the previous one. If you want to demo it, grab the code (and change the API key!), and give it a whirl!

https://github.com/cfjedimaster/disqus-analytics/tree/master/deep2