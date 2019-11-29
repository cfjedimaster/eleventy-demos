---
layout: post
title: "Scraping URLs from a Sitemap File"
date: "2016-07-16T08:01:00-07:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2016/07/16/scraping-urls-from-a-sitemap-file
---

Yesterday I [wrote](https://www.raymondcamden.com/2016/07/15/fighting-against-a-content-stealer-on-blogger/) about a person who is stealing my content (and others) for their blog. As part of my process to fight against this jerk I had to file a DCMA claim that includes the URLs of the offending content. In order to get all the URLs, I had to work with their site map, copy the content, and use XPath to get the URL values. I decided to whip up a quick tool that would automate the entire process.

The app is pretty simple. You enter a URL of a sitemap, hit the button, and stand back while it works:

<img src="https://static.raymondcamden.com/images/2016/07/sitemap1.jpg" class="imgborder">

The code is pretty simple. I use [Yahoo Query Language](https://developer.yahoo.com/yql/) to run an XPath on the sitemap. I can't just look for URLs though as a sitemap can contain a list of sitemaps instead of URLs. So for example, the asshat stealing my content has a sitemap that looks like this:

<pre><code class="language-markup">
&lt;?xml version='1.0' encoding='UTF-8'?&gt;
&lt;sitemapindex xmlns=&quot;http://www.sitemaps.org/schemas/sitemap/0.9&quot;&gt;
&lt;sitemap&gt;
&lt;loc&gt;http://mr-cordova.blogspot.com/sitemap.xml?page=1&lt;/loc&gt;
&lt;/sitemap&gt;
&lt;sitemap&gt;
&lt;loc&gt;http://mr-cordova.blogspot.com/sitemap.xml?page=2&lt;/loc&gt;
&lt;/sitemap&gt;
&lt;sitemap&gt;
&lt;loc&gt;http://mr-cordova.blogspot.com/sitemap.xml?page=3&lt;/loc&gt;
&lt;/sitemap&gt;
&lt;/sitemapindex&gt;
</code></pre>

So my code needs to see if this type of data exists in the sitemap first. Here's the entire code for how I parse the sitemap. There's a bit more code (feel free to view source at the demo) for DOM stuff, but this is the important part.

<pre><code class="language-javascript">
function parseSitemap() {
	var url = $siteMapURL.val();
	if($.trim(url) === '') return;
	$results.val('');
	$status.html('&lt;i&gt;Trying to parse the sitemap.&lt;/i&gt;');
	console.log('try to parse '+url);

	/*
	A sitemap may consist of a list of sitemaps. So step one is to see
	if that exists. We'll create an array for all the sitemaps we need to parse.
	For simple sitemaps w/o a list of others, the array will have one item.
	*/
	var sitemaps = [];

	var query = &quot;https://query.yahooapis.com/v1/public/yql?q=select{% raw %}%20*%{% endraw %}20from{% raw %}%20html%{% endraw %}20where{% raw %}%20url%{% endraw %}20{% raw %}%3D%{% endraw %}20'&quot; + url + &quot;'{% raw %}%20and%{% endraw %}20xpath{% raw %}%3D'%{% endraw %}2F%2Fsitemap'&amp;format=json&amp;diagnostics=true&amp;callback=&quot;;
	$.get(query).then(function(res) {
		if(res.query.diagnostics &amp;&amp; res.query.diagnostics.url[0][&quot;http-status-code&quot;] === &quot;404&quot;) {
			$status.html('&lt;b&gt;This URL appears to be invalid.&lt;/b&gt;');
			return;
		} else if(res.query.count &gt; 0) {
			for(var i=0;i&lt;res.query.count;i++) {
				sitemaps.push(res.query.results.sitemap[i].loc);
			}
		} else {
			sitemaps[0] = url;
		}
		console.log('sitemaps to handle is '+sitemaps);
		$status.html('&lt;i&gt;Gathering data for sitemaps URLs.&lt;/i&gt;');
		var promises = [];
		sitemaps.forEach(function(sitemap) {
			var def = $.Deferred();
			var query = &quot;https://query.yahooapis.com/v1/public/yql?q=select * from html where url = '&quot;+sitemap+&quot;' and xpath='//url/loc'&amp;format=json&amp;diagnostics=true&amp;callback=&quot;;
			$.get(query).then(function(res) { 
				def.resolve(res.query.results.loc);
			});
			promises.push(def);
		});
		$.when.apply($,promises).done(function() {
			console.log('totally done getting urls');
			var results = [];
			for(var i=0;i&lt;arguments.length;i++) {
				for(var x=0;x&lt;arguments[i].length;x++) {
					results.push(arguments[i][x]);
				}
			}
			console.log('found '+results.length + ' urls');
			$status.html('&lt;b&gt;Found '+results.length + ' URLs.&lt;/b&gt;');
			$results.val(results.join('\n'));
		});
	});
}
</code></pre>

As you can see, I end up using promises (jQuery-style) to handle the case where multiple sitemaps exist. For each unique sitemap "set", I run a YQL on it to fetch the URLs. At the end I have an array of URLs you can copy and paste. Yeah, the code is a bit crap, but it works well so far. 

You can run the demo yourself here: https://static.raymondcamden.com/demos/2016/07/index.html