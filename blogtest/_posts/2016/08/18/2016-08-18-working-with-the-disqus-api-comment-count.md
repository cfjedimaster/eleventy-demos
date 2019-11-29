---
layout: post
title: "Working with the Disqus API - Comment Count"
date: "2016-08-18T09:59:00-07:00"
categories: [javascript]
tags: []
banner_image: /images/banners/disqus_api.jpg
permalink: /2016/08/18/working-with-the-disqus-api-comment-count
---

I've been a happy [Disqus](https://disqus.com/) user for a while now, but I noticed this week that the stats provided by the service are pretty poor. For example, you can't even determine the *total* number of comments for your web site. That seems... a bit crazy. It isn't necessarily some crazy stat like, "How many Europeans create comments on the weekend." You can see how many comments you got this week:

<!--more-->

<img src="https://static.raymondcamden.com/images/2016/08/disqus1.jpg" alt="Shot" class="imgborder">

When you go deeper though, you can't get an aggregate anymore of your comments. All you can get is a day by day (or month by month) break down which is limited to one year. Here is the most I can see from my site:

<img src="https://static.raymondcamden.com/images/2016/08/disqus2.png" alt="Shot" class="imgborder">

So obviously I could add those numbers up in my head, but one year of stats isn't nearly complete for my blog. Maybe Disqus offers more stats for paying customers (and to be clear, I'd *totally* understand that), but I can't find any links/details about that if it exists.

So screw it - let's use the [API](https://disqus.com/api/docs/) and build our own tools! I've set up a new repo where I'm going to start building my own stats. The API is rather simple and you get a somewhat generous usage allowance (1000 hits per hour) out of the box. Also, you don't have to use OAuth for the types of operations I need, and that makes it even easier to use.

For my first demo, I focused on what started this off - just figuring out how many damn comments my site has gotten. Not surprisingly, there is no direct API for this. There is an API to get [details](https://disqus.com/api/docs/forums/details/) for a forum, but that information isn't provided. 

The best I could come up with was the API to get [lists](https://disqus.com/api/docs/threads/list/) of threads. They do a great job of supporting [pagination](https://disqus.com/api/docs/cursors/) in all their APIs, so my code simply needs to paginate over all the threads and then do math. Let's take a look.

First, the front end view, which is rather simple.

<pre><code class="language-markup">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

		&lt;h2&gt;Comment Count&lt;&#x2F;h2&gt;
		
		&lt;input type=&quot;text&quot; id=&quot;forum&quot; placeholder=&quot;Forum name&quot;&gt;
		&lt;input type=&quot;button&quot; id=&quot;startCount&quot; value=&quot;Get Comment Count&quot;&gt;

		&lt;div id=&quot;results&quot;&gt;&lt;&#x2F;div&gt;

		&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;https:&#x2F;&#x2F;code.jquery.com&#x2F;jquery-3.0.0.min.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;app.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

I assume nothing here is weird, but let me know otherwise. The fun part is the code:

<pre><code class="language-javascript">
var $forum, $startCount, $results;
var key = &#x27;XrkXWYcSYFsQC74AMA9J37tNXuWbw0PwRl2DZSx3LHfu3pMJMio8Gts9qUAMBAV5&#x27;;

$(document).ready(function() {

	$forum = $(&#x27;#forum&#x27;);
	$startCount = $(&#x27;#startCount&#x27;);	
	$results = $(&#x27;#results&#x27;);
	$startCount.on(&#x27;click&#x27;, doCount);
});

function doCount() {
	var forum = $forum.val();
	if($.trim(forum) === &#x27;&#x27;) return;
	console.log(&#x27;search for &#x27;+forum);
	$startCount.attr(&#x27;disabled&#x27;,&#x27;disabled&#x27;);
	$results.html(&#x27;&lt;p&gt;&lt;i&gt;Working on getting your stuff.&lt;&#x2F;i&gt;&lt;&#x2F;p&gt;&#x27;);

	doProcess(function(data) {
		console.log(&#x27;back from doProcess&#x27;);
		console.dir(data);
		var total = data.reduce(function(a,b) {
			return a + b.posts;
		},0);

		console.log(&#x27;we had &#x27;+data.length +&#x27; threads&#x27;);
		console.log(&#x27;total comments = &#x27;+total);
		var avg = (total&#x2F;data.length).toPrecision(3);
		$startCount.removeAttr(&#x27;disabled&#x27;);
		$results.html
			(&#x27;&lt;p&gt;Total number of threads: &#x27;+data.length+&#x27;&lt;br&#x2F;&gt;Total number of comments: &#x27;+total+&#x27;&lt;br&#x2F;&gt;Average # of comments per thread: &#x27;+avg+&#x27;&lt;&#x2F;p&gt;&#x27;
		);
	}, forum);
}

function doProcess(cb, forum, cursor, threads) {
	console.log(&#x27;running doProcess&#x27;);
	var url = &#x27;https:&#x2F;&#x2F;disqus.com&#x2F;api&#x2F;3.0&#x2F;forums&#x2F;listThreads.json?forum=&#x27;+encodeURIComponent(forum)+&#x27;&amp;api_key=&#x27;+key+&#x27;&amp;limit=100&#x27;;
	if(cursor) url += &#x27;&amp;cursor=&#x27;+cursor;
	if(!threads) threads = [];
	$.get(url).then(function(res) {
		res.response.forEach(function(t) {
			threads.push(t);
		});

		if(res.cursor &amp;&amp; res.cursor.hasNext) {
			doProcess(cb, forum, res.cursor.next, threads);
		} else {
			cb(threads);
		}
	},&#x27;json&#x27;);
}
</code></pre>

The bulk of the work is in the `doCount` and `doProcess` calls. `doCount` is responsible for validating your input and firing off the call to `doProcess`. When done, it simply does some math and reports. (See my notes at the end for how I could go further with this.)

`doProcess` is a recursive function that gathers all the threads. It uses the Disqus pagination support to go over all the threads and create a large array of threads. The thread data contains a post count which `doCount` uses to create the report.

Here is the result for my own blog:

<img src="https://static.raymondcamden.com/images/2016/08/disqus3.jpg" alt="Shot" class="imgborder">

You can find the complete source code for this here - and note - I'm going to be adding more demos soon (again, see notes below): https://github.com/cfjedimaster/disqus-analytics/tree/master/commentcount

You can run the demo here - but note that I'm using my public API key. Most likely it will not work for you. If you want to use my tools, download the source, create your own key (at Disqus of course), and go to town. 

https://cfjedimaster.github.io/disqus-analytics/commentcount/

Ok, now for some notes!

* You may be curious about 'threads' - threads are simply unique locations for your Disqus embeds. So for a blog, it would be every site visited. That's an important thing to note. If you visit a new bog entry, Disqus will create a 'thread' for it even if no comments exist yet.
* I like that I can see an average number of comments. What I really want to know though is how those comments appear over time. I'm curious both about my traffic per month/year, as well as my traffic in terms of the age of my content. What I mean by that is - let's say my comment traffic is pretty much consistent. What may not be consistent is that people are commenting on older blog posts versus new. Technically Disqus can't help with that. A thread is created when someone visits the blog post. So I may have a very old blog post that no one visited. When someone visits it today, the thread is new, but the content is old. Since my content has date information in the URL, I can use that to perform analytics based on my content. This all comes down to one question - is my content more engaging now than it was ten years ago?
* Maybe I'm wrong about Disqus and I just didn't find the right link for deeper stats, or the upsell to a paid account for more stats. Cool! Tell me where I'm wrong and I'll be fine with that. I had fun writing the code and that's all that matters. :)