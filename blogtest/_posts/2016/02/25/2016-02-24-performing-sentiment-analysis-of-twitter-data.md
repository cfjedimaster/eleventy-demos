---
layout: post
title: "Performing sentiment analysis of Twitter data"
date: "2016-02-25"
categories: [javascript]
tags: [nodejs]
banner_image: 
permalink: /2016/02/25/performing-sentiment-analysis-of-twitter-data
---

One of the more interesting services available on [IBM Bluemix](https://ibm.biz/IBM-Bluemix) is [Insights for Twitter](https://console.ng.bluemix.net/catalog/services/insights-for-twitter). This service
provides a deep look at real-time Twitter data. The API provides a basic "search" feature but can also include some incredibly detailed filters. So for example, you can look at data from users who are (possibly) married and have kids. As part of the analysis, you can also get a sentiment value: positive, negative, neutral, and ambivalent. I thought it would be interesting to build a tool that let me compare the "general" sentiment for a search term compared to that of more focused segments of the audience. Obviously this isn't 100% accurate, but it provides an interesting look at how different types of people view/discuss the same topic.

<!--more-->

The API supports multiple filters:

* By language
* By location
* By country
* By the number of followers
* By the number of people the person follows
* By people with children
* By people who are married
* By verified users
* By people in a range of lists
* By people within a circular region around a long/lat.
* In a certain sentiment
* In a certain date range
* And more

For my demo, I decided to focus on a certain set of filters that would be most applicable to more terms. (I'm toying with the idea of building an "advanced form" later.) Given a term, I will return the sentiment for:

* The general dataset
* People with 5k+ followers
* Married people
* People with children
* Results over the last year (Jan1-Dec31 of 2015 as of the time I'm writing this blog post)

The [docs](https://console.ng.bluemix.net/docs/services/Twitter/index.html#twitter) explain how the API works including the query language. In general it is pretty simple, but the best news is that you can skip getting results and just use the `count` method instead. That means I can easily get sentiment analysis with 4 API calls (one for each sentiment). As an aside, I ended up not displaying all four sentiments in my charts, but the back end code still fetches them all. 

I'll include a link to the code base below, but here is a snippet showing how I fetch the general sentiment for a term.

<pre><code class="language-javascript">
sentiments.forEach(function(s) {
	var p = new Promise(function(fulfill, reject) {
		request.get(getURL()+&#x27;messages&#x2F;count?q=&#x27;+encodeURIComponent(term)+&#x27; AND sentiment:&#x27;+s, function(error, response, body) {
			
			if(error) console.error(error);
			fulfill({% raw %}{scope:&#x27;main&#x27;,sentiment:s,data:JSON.parse(body).search.results}{% endraw %});	
		});
	});
	promises.push(p);
});
</code></pre>

Here is the block that handles married (again, possibly married) people:

<pre><code class="language-javascript">
sentiments.forEach(function(s) {
	var p = new Promise(function(fulfill, reject) {
		request.get(getURL()+&#x27;messages&#x2F;count?q=&#x27;+encodeURIComponent(term)+&#x27; AND is:married AND sentiment:&#x27;+s, function(error, response, body) {
			
			if(error) console.error(error);				
			fulfill({% raw %}{scope:&#x27;married&#x27;,sentiment:s,data:JSON.parse(body).search.results}{% endraw %});	
		});
	});
	promises.push(p);
});	
</code></pre>

As you can see, I'm using promises to handle the fact that I'm firing a *bunch* of async processes. As I've got 5 charts and 4 sentiments, each query performs 20 different HTTP calls. Handling that isn't too hard:

<pre><code class="language-javascript">
Promise.all(promises).then(function(results) {

	console.log('deep query done');
	console.dir(results);
	
	var metaResult = {};
	results.forEach(function(r) {
		var append = '';
		if(r.scope !== 'main') {
			append = '_'+r.scope;
		}
		metaResult[r.sentiment+append] = r.data;
	});

	fulfill(metaResult);	
	
});
</code></pre>

The code in the forEach there is handling applying each HTTP result to a proper location in my main result object. Generally your array of results will match how they were applied to the array, but as I'm using 5 forEach statements for my reports, I can't know for sure the order they will be added to the array. Kind of complex, but that's all nicely hidden away in my library. Back in the main Node.js route that handles all of this, it is rather simple.

<pre><code class="language-javascript">
app.get('/analyze', function(req, res) {
	var term = req.query.term;
	if(!term) return res.end();

	twitterInsights.deepSentiment(term).then(function(result) {
		res.send(result);
	});
});
</code></pre>

So how about the front end? I decided to use Bootstrap to create a simple UI for the term searching. For my charts, I decided on [Highcharts](http://www.highcharts.com/). It is free for commercial use and I liked the animation of the charts. Here's a sample report.

![Screen shot](https://static.raymondcamden.com/images/2016/02/twitterinsights.png)

You can see all the code for this project on the GitHub repo I just set up: [https://github.com/cfjedimaster/twitterinsights](https://github.com/cfjedimaster/twitterinsights). 

And you can run the demo yourself here: [http://twitterwall.mybluemix.net/](http://twitterwall.mybluemix.net/). I had some good folks test this and they managed to crash it a few times, but hopefully I've covered up most of the issues. Let me know what you think. And remember, the sentiment analysis is *not* going to be perfect. I'm sure you can find examples that don't make sense. Be nice. :)