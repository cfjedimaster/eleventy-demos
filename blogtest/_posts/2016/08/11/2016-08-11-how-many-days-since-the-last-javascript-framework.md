---
layout: post
title: "How Many Days Since the Last JavaScript Framework?"
date: "2016-08-11T14:28:00-07:00"
categories: [javascript]
tags: []
banner_image: /images/banners/jsf.jpg
permalink: /2016/08/11/how-many-days-since-the-last-javascript-framework
---

Earlier today I mentioned discovering a new JavaScript framework that I liked on name alone - 
So earlier today I had this conversation with an old buddy of mine: [catberry](https://github.com/catberry/catberry). At which point an old friend of mine said:

<!--more-->

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">0 days since new JS framework. <a href="https://t.co/YHGMOWJa9q">https://t.co/YHGMOWJa9q</a></p>&mdash; Jesse Warden (@jesterxl) <a href="https://twitter.com/jesterxl/status/763761732150001664">August 11, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

This got me thinking - how easy would it be to build a tool that told you the number of days since the last JavaScript framework was released? 

I began by looking at the [GitHub API](https://developer.github.com/v3/search/#search-repositories) for searching repositories. It seemed perfect. We can:

* Filter by repositories that advertise their language as JavaScript
* Include a text filter for "framework" (obviously not perfect but what evs)

And then obviously just sort and find the most recent one. Unfortunately, this is where things break down. You can't sort by a project's created date, just its updated date (and a few other fields). 

I did some more digging, and discovered you could *filter* by the date a project was created. I then figured out you could use pseudo-code like this:

Start with today and look for projects with the text "framework" and language "JavaScript" and if any exist, then we have a 0-day situation.

Repeat 10 times and subtract one from the current date. When you find a match, you know the number of days.

Why 10? You can only do 10 anonymous API calls to GitHub per day. Plus, does anyone honestly think it will be more than 10 days since the last JS framework? Technically, we could 'step' back by two day increments letting us check a longer time period. We could also simply tell the user that they have to wait 60 seconds and then do 10 more hits. But for now - I just assumed there would *always* be a match in a ten day period. 

Here's the code (it integrates with the DOM too but I assume folks don't need to see that):

<pre><code class="language-javascript">
var $result;

$(document).ready(function() {
	$result = $('#result');

	console.log('lets do it!');
	var cachedResult = localStorage.getItem('dayssince');
	if(cachedResult) {
		var cache = JSON.parse(cachedResult);
		var now = new Date();
		var diff = now - (new Date(cache.timestamp));
		//credit: http://stackoverflow.com/a/7709819/52160
		var diffMins = Math.round(((diff {% raw %}% 86400000) %{% endraw %} 3600000) / 60000);
		console.log(diffMins+' minute old');
		if(diffMins &lt; 5) {
			renderResult(cache. value);
			return;
		}
	}

	doIt().then(function(res) {
		renderResult(res);
		localStorage.setItem('dayssince', JSON.stringify({
			value:res,
			timestamp:new Date()
		}));
	}).catch(function(e) {
		console.log('Error', e);
	});
});

function doIt() {
	var d = new $.Deferred();
	abuseGitAPI(d);
	return d;
}

function abuseGitAPI(promise,counter) {
	if(!counter) counter = -1;
	counter++;
	if(counter &gt; 10) promise.reject('Fail');
	var testDate = new Date();
	testDate.setDate(testDate.getDate()-counter);
	var dateStr = testDate.getFullYear() + '-'+pad((testDate.getMonth()+1)) + '-' + pad(testDate.getDate());
	var url = 'https://api.github.com/search/repositories?q=framework+language:javascript+created:%3E'+dateStr+'&amp;per_page=100';
	console.log(url);
	$.get(url).then(function(res) {
		if(res.total_count &gt;= 1) promise.resolve(counter);
		else abuseGitAPI(promise, counter);
	});
}

function pad(s) {
	if(s.toString().length === 1) return '0'+s;
	return s;
}

function renderResult(res) {
	console.log('result is '+res);
	$result.text(res);
}
</code></pre>

You'll notice a bit of caching as well done with LocalStorage. I decided on a five minute cache because the idea of a new JavaScript framework being released more than once per five minutes is pretty freaking frightening.

Want to see it? Check the demo (and my amazing CSS skills) here: 
https://static.raymondcamden.com/demos/2016/08/11/index.html