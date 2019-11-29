---
layout: post
title: "Parsing RSS Feeds in JavaScript - Options"
date: "2015-12-08T16:24:50+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2015/12/08/parsing-rss-feeds-in-javascript-options
guid: 7228
---

For a while now I've used the <a href="https://developers.google.com/feed/?hl=en">Google Feed API</a> to parse RSS feeds in JavaScript. It did a good job of converting various RSS flavors into a simple array of entries you could easily work with. Unfortunately, Google has deprecated the API and while it still worked the last time I used it, I would strongly recommend folks migrate their apps away from it as soon as possible. While this makes me sad, you have to move on.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/2000px-Sad_panda.svg_.png" alt="2000px-Sad_panda.svg" width="400" height="400" class="aligncenter size-full wp-image-7229" />

<!--more-->

So what kind of options do you have?

<h2>Parsing Manually</h2>

So remember that RSS is just XML, and XML is just a string, and string parsing is easy, right? Of course, there are 2 major flavors of RSS, and multiple versions of both flavors, but if you're just parsing one known RSS feed then you can write to that particular flavor and version. (More about the different versions can be found on <a href="https://en.wikipedia.org/wiki/RSS">Wikipedia</a>.) Unfortunately, if you try to simply XHR to a RSS feed you'll run into the lovely cross origin browser doohicky that prevents you from making requests to another server. Of course, if the RSS is on the same domain, that isn't a problem. And of course, if you are building something in Apache Cordova, then it isn't a problem either. (Just don't forget to update the CSP!) And finally - if you control the RSS, you could add a CORS header to it so modern browsers could use it. Unfortunately, if none of those apply, you're out of luck trying to do it completely client-side. (Well, until we get to the next options!) Let's pretend that none of the roadblocks apply to you and look at a simple example. (As a quick note, none of my sample code will actually render anything. It will just get crap, parse it, and log data. I'm assuming folks know how to manipulate the DOM. I've heard there's a <a href="http://www.jquery.com">good library</a> for that.) 

<pre><code class="language-javascript">$(document).ready(function() {
	//feed to parse
	var feed = "http://feeds.feedburner.com/raymondcamdensblog?format=xml";
	
	$.ajax(feed, {
		accepts:{
			xml:"application/rss+xml"
		},
		dataType:"xml",
		success:function(data) {
			//Credit: http://stackoverflow.com/questions/10943544/how-to-parse-an-rss-feed-using-javascript

			$(data).find("item").each(function () { // or "item" or whatever suits your feed
				var el = $(this);
				console.log("------------------------");
				console.log("title      : " + el.find("title").text());
				console.log("link       : " + el.find("link").text());
				console.log("description: " + el.find("description").text());
			});
	

		}	
	});
	
});</code></pre>

So all I'm doing here is using jQuery to request my RSS feed. I then use jQuery's built in XML parsing to iterate over the &lt;item&gt; blocks in my RSS feed. As you can see, I'm using sample code from a <a href="http://stackoverflow.com/questions/10943544/how-to-parse-an-rss-feed-using-javascript">StackOverflow answer</a> that I modified a tiny bit. Specifically the answer iterated over &lt;entry&gt; blocks, not &lt;item&gt;. Remember when I said there were different flavors of RSS? That's an example of the issue right there. If you must write code to handle both cases, you would need to look for &lt;item&gt; first and then &lt;entry&gt;. But that's basically it. If your curious, I tested this in Canary with --disable-web-security as a command line flag. 

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot14.png" alt="shot1" width="750" height="552" class="aligncenter size-full wp-image-7231" />

<h2>YQL</h2>

Remember <a href="https://developer.yahoo.com/yql/">YQL (Yahoo Query Language)</a>? The last time I blogged about it was way back in 2010 (<a href="http://www.raymondcamden.com/2010/01/19/proof-of-concept-911-viewer">Proof of Concept 911 Viewer</a>). As a gross simplification, YQL acts like a "query language" for the web. You can literally run SQL like content against URLs and get formatted data out of it. They provide a powerful testing console and wouldn't you know it, one of the examples is a RSS parser:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot21.png" alt="shot2" width="750" height="449" class="aligncenter size-full wp-image-7232" />

Just in case that screenshot is a bit too small, here is what the YQL statement looks like:

<code>select title from rss where url="http://rss.news.yahoo.com/rss/topstories"</code>

I've got one word for that. Bad ass! Like, kitten in armor bad ass!

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot3.jpg" alt="shot3" width="350" height="250" class="aligncenter size-full wp-image-7233" />

I tested with two different RSS flavors and YQL had no issue handling either. Note the REST query URL at the bottom. I copied that into a new file:

<pre><code class="language-javascript">$(document).ready(function() {
	
	var yql = "https://query.yahooapis.com/v1/public/yql?q=select{% raw %}%20title%{% endraw %}2Clink{% raw %}%2Cdescription%{% endraw %}20from{% raw %}%20rss%{% endraw %}20where{% raw %}%20url%{% endraw %}3D{% raw %}%22http%{% endraw %}3A{% raw %}%2F%{% endraw %}2Ffeeds.feedburner.com{% raw %}%2Fraymondcamdensblog%{% endraw %}3Fformat{% raw %}%3Dxml%{% endraw %}22&format=json&diagnostics=true&callback=";
	
	$.getJSON(yql, function(res) {
		console.log(res);	
	}, "jsonp");
	
});</code></pre>

And it worked like a charm. Note the use of JSON/P to sidestep needing CORS. And here is the result:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot4.png" alt="shot4" width="750" height="654" class="aligncenter size-full wp-image-7234" />

A big thank you to Addy Osmani from Google for reminding me that YQL was still around. Google, I forgive you for killing the Feed API now.

<h2>Feednami</h2>

Last but not least is a brand new service, <a href="https://feednami.com/">Feednami</a>, created just in time for the death of the Google Feeds API. To use it you simply add a new script to your code and then use feednami.load() to get your feed. Here is an example:

<pre><code class="language-javascript">
$(document).ready(function() {
	
	var url = 'http://feeds.feedburner.com/raymondcamdensblog?format=xml';
	
	feednami.load(url,function(result){
		if(result.error) {
			console.log(result.error);
		} else {
			var entries = result.feed.entries;
			for(var i = 0; i < entries.length; i++){
				var entry = entries[i];
				console.dir(entry);
			}
		}
	});
	
});</code></pre>

That's also pretty darn easy to use. Here is the result:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/12/shot5.png" alt="shot5" width="750" height="654" class="aligncenter size-full wp-image-7235" />

<h2>Summary</h2>

So - you've got options. Which one is best? Honestly I don't know. YQL requires the least amount of code from what I can see, but I kinda dig Feednami's look a bit more. If you've used any of these in production, drop me a comment below with your thoughts!