---
layout: post
title: "Google Analytics and RSS Report"
date: "2015-06-08T09:07:09+06:00"
categories: [development,javascript,jquery]
tags: []
banner_image: 
permalink: /2015/06/08/google-analytics-and-rss-report
guid: 6262
---

<strong>(As just an FYI, while working on this demo I discovered the <a href="https://developers.google.com/analytics/devguides/reporting/embed/v1/">Analytics Embed API</a>. It looks like a powerful way to create Google Analytics mashups and I plan on looking at it deeper in the next week or so. Note that the code I use here could be much simpler with the Embed API.)</strong>

This past fall I switched from a custom blog engine I had written to Wordpress. While in general I'm really happy with the move, there's one thing my old blog had that I really miss. Whenever I logged into the admin, I'd see my last five blog posts and how many views they had received so far. For me, this was a great way to gauge how my current articles were doing. I obviously checked my Google Analytics often as well, but the report of my <i>current</i> entries was a great way to see how my most recent articles were being received. 

<!--more-->



A year ago I worked on a <a href="http://www.raymondcamden.com/2014/01/24/Proof-of-Concept-Dashboard-for-Google-Analytics">Google Analytics dashboard</a> that made use of their client-side API. This dashboard simply gave me a birds-eye view of all my properties and how well they are doing. This demo gave me the basics of working with both authentication and the Analytics API, so I began working on a new mashup. The idea was simple:

<ul>
<li>Authenticate the user to Google.
<li>Let them select a property.
<li>Let them enter a RSS URL that matched the property.
<li>Use the RSS entries as queries against the Analytics API and report the stats.
</ul>

In order to make this work, I needed the <a href="https://developers.google.com/analytics/devguides/reporting/core/v3/">Core Reporting API</a> and the <a href="https://developers.google.com/feed/">Feed API</a>. The Feed API actually supports a method of searching for a RSS feed, but it oddly didn't return the RSS feed itself - just matched entries. Because of this my tool needs to ask you for the RSS URL. Before digging into the code, let me share some screen shots so you get an idea of how it looks.

First - the application recognizes if you've recently authenticated with Google. If you have not, it will prompt you to:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/shot1.png" alt="shot1" width="800" height="162" class="aligncenter size-full wp-image-6263 imgborder" />

Clicking that button pops open a new window where you'll begin the authentication/authorization process with Google. I've set up a project for this demo and specified what scopes my demo needs. This is what controls the list of requests seen here. 

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/shot2.png" alt="shot2" width="800" height="495" class="aligncenter size-full wp-image-6264 imgborder" />

After you've authenticated, the code then uses the Analytics API to fetch the web sites you have access to for that account:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/shot3.png" alt="shot3" width="800" height="334" class="aligncenter size-full wp-image-6265 imgborder" />

Notice how the RSS field is empty. I added code so that once you enter a value here it will remember it. Next time you load the tool and select your property, you won't need to fill in the values again.

Anyway, once you do enter the value, the Feed API takes over. It parses the RSS and gets your most recent entries.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/shot4.png" alt="shot4" width="800" height="684" class="aligncenter size-full wp-image-6266 imgborder" />

And then magically - the stats show up in the table:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/shot5.png" alt="shot5" width="800" height="455" class="aligncenter size-full wp-image-6267 imgborder" />

Ok, so how does it work? I won't go over the authentication part as I used the same code from my <a href="http://www.raymondcamden.com/2014/01/24/Proof-of-Concept-Dashboard-for-Google-Analytics">previous demo</a>. The analytics part was a bit different. I moved it into a module pattern and exposed two APIs - getProperties and getStatsForPropertyURL. getProperties returns a promise which makes using it somewhat simple:

<pre><code class="language-javascript">analyticsModule.getProperties().then(function(props) {
//boring DOM crap here
});

}</code></pre>

Behind that simple call though was some complex rejiggering of the previous demo. I make use of LocalStorage to cache values and the Analytics stuff is multi-step, so it took me a few iterations to get it right. Getting stats for a URL was pretty simple. Given you know the property ID and the URL path (you don't include the full URL), here is the call:

<pre><code class="language-javascript">function getStatsForPropertyURL(propId, url) {
	var adef = $.Deferred();
	
	gapi.client.analytics.data.ga.get({
	'ids': 'ga:' + propId,
	'start-date': '2005-01-01',
	'end-date': 'today',
	'metrics': 'ga:pageviews',
	'filters':'ga:pagePath=='+encodeURI(url),
	'dimensions1':'ga:date'
	}).execute(function(results) {
		console.dir(results);
		adef.resolve(results.totalsForAllResults["ga:pageviews"]);
	});
	
	return adef;
}</code></pre>

Note the use of 2005-01-01 as the start date. This is the earliest date that the API supports. 

So, want to check it out? Remember - you must have a Google Analytics account and the property you want to test must use a RSS feed. I tested in Chrome, Firefox, and Safari and it seemed to work well, but obviously you can let me know (via an issue or comment) how it works for you:

<a href="https://static.raymondcamden.com/rssanalytics/">https://static.raymondcamden.com/rssanalytics/</a>

Want to see all the code, or report an issue? I created a Github repo: <a href="https://github.com/cfjedimaster/Google-Analytics-RSS-Parsing">https://github.com/cfjedimaster/Google-Analytics-RSS-Parsing</a>