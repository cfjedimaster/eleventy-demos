---
layout: post
title: "Google Analytics and RSS Report - Version 2"
date: "2017-07-06T08:20:00-07:00"
categories: [javascript]
tags: [javascript]
banner_image: 
permalink: /2017/07/06/google-analytics-and-rss-report-version-2
---

Over two years ago I [blogged](https://www.raymondcamden.com/2015/06/08/google-analytics-and-rss-report/) about a demo I had built involving RSS and Google Analytics. The reason for that demo was simple. As an active blogger, I want to have an idea about how my recent content is doing. Google Analytics, however, doesn't have a way to recognize what my most recent content is. By combining a RSS feed and a Google Analytics API, I could create a mashup that reported exactly what I wanted - how my latest entries were doing.

In the time since I wrote that initial demo, a lot has changed. First off, the Google Feeds service I used was discontinued. Luckily there's multiple options around that (see my post, ["Parsing RSS Feeds in JavaScript - Options"](https://www.raymondcamden.com/2015/12/08/parsing-rss-feeds-in-javascript-options)).

The other change was to how I integrated with Google. There were multiple updates to the libraries I used - both in terms of authentication and working with Google Analytics. The [Reporting API](https://developers.google.com/analytics/devguides/reporting/core/v4/) is now at version 4, and while still pretty complex, it's pretty powerful as well. Google has a really good [JavaScript quick start](https://developers.google.com/analytics/devguides/reporting/core/v4/quickstart/web-js) that I used as a fresh start for the project. What I especially like is that they have very clear docs on the permissions you have to enable before using the code.

I'll be sharing my code, but note that I will not be sharing an online copy. My code will point the values you need to tweak in order to host this yourself. Before I share the code, a screen shot so you can see what I built:

![Screen shot](https://static.raymondcamden.com/images/2017/7/rss_ga.jpg)

As you can see, it's not much. Just a table with my latest entries as discovered via RSS and than a report on the page views for each. Ok, now the code. First, the HTML.

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
	&lt;meta charset=&quot;utf-8&quot;&gt;
	&lt;title&gt;RSS Reporting&lt;&#x2F;title&gt;
	&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1&quot;&gt;
	&lt;link rel=&quot;stylesheet&quot; href=&quot;https:&#x2F;&#x2F;maxcdn.bootstrapcdn.com&#x2F;bootstrap&#x2F;3.3.4&#x2F;css&#x2F;bootstrap.min.css&quot;&gt;
	&lt;meta name=&quot;google-signin-client_id&quot; content=&quot;REPLACE ME&quot;&gt;
	&lt;meta name=&quot;google-signin-scope&quot; content=&quot;https:&#x2F;&#x2F;www.googleapis.com&#x2F;auth&#x2F;analytics.readonly&quot;&gt;
&lt;&#x2F;head&gt;
&lt;body&gt;

&lt;div class=&quot;container&quot;&gt;

	&lt;h1&gt;RSS Reporting&lt;&#x2F;h1&gt;

	&lt;p class=&quot;g-signin2&quot; data-onsuccess=&quot;loadRSS&quot;&gt;&lt;&#x2F;p&gt;

    &lt;table class=&#x27;table table-striped table-bordered&#x27; id=&#x27;reportTable&#x27;&gt;
		&lt;thead&gt;
			&lt;tr&gt;&lt;th&gt;URL&lt;&#x2F;th&gt;&lt;th&gt;Page Views&lt;&#x2F;th&gt;&lt;&#x2F;tr&gt;
		&lt;&#x2F;thead&gt;
	&lt;tbody&gt;&lt;&#x2F;tbody&gt;
	&lt;&#x2F;table&gt;
&lt;&#x2F;div&gt;



&lt;script src=&quot;app.js&quot;&gt;&lt;&#x2F;script&gt;

&lt;!-- Load the JavaScript API client and Sign-in library. --&gt;
&lt;script src=&quot;https:&#x2F;&#x2F;code.jquery.com&#x2F;jquery-3.1.1.min.js&quot; integrity=&quot;sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=&quot; crossorigin=&quot;anonymous&quot;&gt;&lt;&#x2F;script&gt;
&lt;script src=&quot;https:&#x2F;&#x2F;apis.google.com&#x2F;js&#x2F;client:platform.js&quot;&gt;&lt;&#x2F;script&gt;

&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

For the most part, this is ripped from the demo. Note the meta tags which allow the authentication to work. You don't see that in the screen shot above as I've got code to hide the login button after a successful login. What's cool is - the entirety of the authentication is basically that one button and the meta tags. Google handles the entire process. I love how easy that is. Note that the client id metatag would need to change for your own version of this. Now the JavaScript:

<pre><code class="language-javascript">&#x2F;&#x2F; Replace with your view ID.
const VIEW_ID = &#x27;REPLACE ME&#x27;;
const RSS = &#x27;http:&#x2F;&#x2F;feeds.feedburner.com&#x2F;raymondcamdensblog.xml&#x27;;
const ROOT_URL = &#x27;https:&#x2F;&#x2F;www.raymondcamden.com&#x27;;

let $reportTable;

function loadRSS() {

	&#x2F;&#x2F;hide the google auth button
	$(&#x27;.g-signin2&#x27;).hide();

    var yql = &#x27;https:&#x2F;&#x2F;query.yahooapis.com&#x2F;v1&#x2F;public&#x2F;yql?q=select{% raw %}%20title%{% endraw %}2Clink{% raw %}%2Cdescription%{% endraw %}20from{% raw %}%20rss%{% endraw %}20where{% raw %}%20url%{% endraw %}3D&#x27; +
	&#x27;{% raw %}%22&#x27;+encodeURIComponent(RSS)+&#x27;%{% endraw %}22&amp;format=json&amp;diagnostics=true&amp;callback=&#x27;;

	$reportTable = $(&#x27;#reportTable tbody&#x27;);

    $.getJSON(yql, function(res) {
        rssItems = res.query.results.item;
		queryReports(rssItems);
    }, &quot;jsonp&quot;);
}

&#x2F;&#x2F; Query the API and print the results to the page.
function queryReports(items) {
	&#x2F;&#x2F;first, ensure no more than ten
	items = items.slice(0,10);

	let reports = [];
	let reports2 = [];

	items.forEach((item) =&gt; {

		let newRow = `
&lt;tr&gt;&lt;td&gt;&lt;a href=&quot;${% raw %}{item.link}{% endraw %}&quot; target=&quot;_new&quot;&gt;${% raw %}{item.title}{% endraw %}&lt;&#x2F;a&gt;&lt;&#x2F;td&gt;&lt;td&gt;&lt;&#x2F;td&gt;&lt;&#x2F;tr&gt;
		`;

		$reportTable.append(newRow);

		let link = item.link.replace(ROOT_URL,&#x27;&#x27;);
		let report = {
			viewId:VIEW_ID,
			dateRanges:[
				{% raw %}{startDate:&#x27;2005-01-01&#x27;, endDate:&#x27;today&#x27;}{% endraw %}
			], 
			metrics:[
				{% raw %}{expression:&#x27;ga:pageviews&#x27;}{% endraw %}
			],
			filtersExpression:&#x27;ga:pagePath=@&#x27;+link
		}
		if(reports.length &lt; 5) {
			reports.push(report);
		} else {
			reports2.push(report);
		}
	});

	let p1 = gapi.client.request({
		path: &#x27;&#x2F;v4&#x2F;reports:batchGet&#x27;,
		root: &#x27;https:&#x2F;&#x2F;analyticsreporting.googleapis.com&#x2F;&#x27;,
		method: &#x27;POST&#x27;,
		body: {
			reportRequests: reports
		}
	});

	let p2 = gapi.client.request({
			path: &#x27;&#x2F;v4&#x2F;reports:batchGet&#x27;,
			root: &#x27;https:&#x2F;&#x2F;analyticsreporting.googleapis.com&#x2F;&#x27;,
			method: &#x27;POST&#x27;,
			body: {
				reportRequests: reports2
			}
		});

	Promise.all([p1,p2]).then((results) =&gt; {
		console.log(&#x27;both done&#x27;);		

		let reports = results[0].result.reports;
		&#x2F;&#x2F;thank you SO: https:&#x2F;&#x2F;stackoverflow.com&#x2F;a&#x2F;9650855&#x2F;52160
		reports.push.apply(reports, results[1].result.reports);

		for(var i=0;i&lt;reports.length;i++) {
			let total = reports[i].data.totals[0].values[0];
    	    $(&quot;#reportTable tr:nth-child(&quot;+(i+1)+&quot;) td:nth-child(2)&quot;).text(total);
		}

	});
}
</code></pre>

So in general, the proces is - get the RSS and then ask Google to analyze each URL. I used Yahoo's [YQL](https://developer.yahoo.com/yql/) feature to parse the RSS. Once I have the entries, I then switch to Google's Reporting API. This is where things get a bit weird.

The JavaScript library has one method and one method only - batchGet. This method lets you run up to 5 reports each. So while the library has one method, the reports are where you specify what you want to search for. Since a RSS feed has - normally - ten entries - my code is hard coded to work with 2 sets of 5 links. I could make this a bit more generic, but I don't want to. (I'm allowed to say that, right?) The batchGet method returns a promise, so I can chain them together with an "all" call to wait for both to be done and then just update my table. 

And that's basically it. If this is helpful and you end up using the tool, please leave me a comment below.

Notes
===

I could have used my JSONFeed source instead of my RSS. See my [post](https://www.raymondcamden.com/2017/05/18/creating-a-json-feed-for-hugo/) from May about that. But I thought an RSS version may be more useful for other people since JSONFeed is still rather new.

Finally - damn - it's kind of depressing how low my page view counts are for my most recent content. My blog still gets very good traffic, a bit over 100K page views per month, but it's really kind of ego crushing to see how little traffic my latest content receives.