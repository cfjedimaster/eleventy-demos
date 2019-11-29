---
layout: post
title: "Creating an unread count for a static site"
date: "2016-02-18T14:23:00-07:00"
categories: [development]
tags: []
banner_image: 
permalink: /2016/02/18/creating-an-unread-count-for-a-static-site
---

Lately I've noticed some sites will include a little "unread" icon for their blog, showing you how many new articles they have since your last visit. As an example, here is how the [Apache Cordova](http://cordova.apache.org) displays it in their header:

<!--more-->

![Unread blog entries](https://static.raymondcamden.com/images/2016/02/blogoneunread.png)

I've seen this on a few other sites (like [Ionic](http://www.ionicframework.com)) and I assume it is a simple plugin, but I thought it would be kind of fun to build a prototype of this myself. What follows is a simple example of the feature that can be used for static sites. There's probably many different ways to add this feature (and I'll discuss some options at the end) and I'd love to hear from my readers how they've accomplished this if they have it on their site. As a reminder, everything I share here is free for you to make use of on your own site. All I ask is that you show your appreciation with a quick visit to my [Amazon Wishlist](http://www.amazon.com/gp/registry/wishlist/2TCL1D08EZEYE/ref=cm_wl_rlist_go_v?) if you can.

Ok - so before we get into the code, let's discuss how we can handle this. When comes to the site, we can see if they've been to the site before. There are a variety of ways to persist data on the client, but the simplest is localStorage. 

Given that a user first hit the site on February 1, 2016, we can then ask the blog for a list of articles. Luckily there's a simple way to do that - RSS. By parsing the blog's RSS feed, we can iterate over every entry and see when it was published. If it was published after February 1, we can increment a counter of unread articles. 

So far so good, but then we have a few questions. What if the user has never been to the site before? Should we show an unread count of 10? (10 being the "typical" number of items in an RSS feed.) In my opinion, no. It feels a bit pushy.

How and when do we update the value? In theory you could update the date value immediately. I may choose to go the blog or not, but since you've already told me that the site has X unread articles, there isn't necessarily a need to *keep* telling me that. Or - I could only update the date when you visit the blog (either the home page or any particular entry). 

To keep things a bit simpler, we'll say that when you visit the blog home page, we'll automatically update the "last visited" value so you no longer see an unread count. Alright, let's write some code!

<pre><code class="language-javascript">
$(document).ready(function() {
	
	if(!onBlog()) {
		getUnReadCount();	
	}
	
});
</code></pre>

For our first iteration, we've got a bit of simple code that says - well - you can probably read that out loud and figure out exactly what we're doing. If we aren't on the blog, get the unread count. Now let's flesh out those methods.

First - `onBlog`:

<pre><code class="language-javascript">
function onBlog() {
	return window.location.pathname.indexOf("blog") &gt;= 0;
}
</code></pre>

A bit lame, but all we do here is see if 'blog' exists in the current path. Obviously your site could use 'news' for the path so you may need to modify that logic to match your particular site.

Now let's look at `getUnReadCount`:

<pre><code class="language-javascript">
function getUnReadCount(cb) { 

	&#x2F;&#x2F;have we been here?
	var lastvisit = localStorage[&#x27;lastVisit&#x27;];
	if(!lastvisit) return cb(0);
		
	&#x2F;&#x2F;ok, get the RSS
	var yql = &quot;https:&#x2F;&#x2F;query.yahooapis.com&#x2F;v1&#x2F;public&#x2F;yql?q=select{% raw %}%20*from%{% endraw %}20rss{% raw %}%20where%{% endraw %}20url{% raw %}%3D%{% endraw %}22http{% raw %}%3A%{% endraw %}2F{% raw %}%2Ffeeds.feedburner.com%{% endraw %}2Fraymondcamdensblog{% raw %}%3Fformat%{% endraw %}3Dxml%22&amp;format=json&amp;diagnostics=true&amp;callback=&quot;;
    
	var unread = 0;
    $.getJSON(yql, function(res) {
		var items = res.query.results.item;
        console.log(items); 
		items.forEach(function(item) {
			var articleDate = new Date(item.pubDate).getTime();
			if(articleDate &gt; lastvisit) unread++;
		});
		cb(unread);
    }, &quot;jsonp&quot;);
    	
}
</code></pre>

So notice that we're now expecting an argument to the function that will be a callback to fire when we're done with our work. If the user has never been to the site, we shortcircuit out by returning 0. 

We then hit the RSS feed for our site. I talked about [parsing RSS](http://www.raymondcamden.com/2015/12/08/parsing-rss-feeds-in-javascript-options/) on my blog a few months ago and at the time I mentioned YQL as an excellent replacement for the Google Feed API. In our case, we get the items from the RSS feed in a nice array we can loop over. 

Note the array iterator. For each article get the time in milliseconds and compare it to our `lastvisit` value. We increment every time the article is newer. Now is probably a good time to go back and show the complete code.

<pre><code class="language-javascript">
$(document).ready(function() {
	
	if(!onBlog()) {
		getUnReadCount(function(count) {
			console.log(&#x27;result is &#x27;+count);
			if(count &gt; 0) {
				$(&#x27;.badge&#x27;).text(count);
			}
		});	
	} else {
		localStorage[&#x27;lastVisit&#x27;] = new Date().getTime();	
	}	
});

function onBlog() {
	return window.location.pathname.indexOf(&quot;blog&quot;) &gt;= 0;
}

function getUnReadCount(cb) { 

	&#x2F;&#x2F;have we been here?
	var lastvisit = localStorage[&#x27;lastVisit&#x27;];
	if(!lastvisit) return cb(0);
		
	&#x2F;&#x2F;ok, get the RSS
	var yql = &quot;https:&#x2F;&#x2F;query.yahooapis.com&#x2F;v1&#x2F;public&#x2F;yql?q=select{% raw %}%20*from%{% endraw %}20rss{% raw %}%20where%{% endraw %}20url{% raw %}%3D%{% endraw %}22http{% raw %}%3A%{% endraw %}2F{% raw %}%2Ffeeds.feedburner.com%{% endraw %}2Fraymondcamdensblog{% raw %}%3Fformat%{% endraw %}3Dxml%22&amp;format=json&amp;diagnostics=true&amp;callback=&quot;;
    
	var unread = 0;
    $.getJSON(yql, function(res) {
		var items = res.query.results.item;
		items.forEach(function(item) {
			var articleDate = new Date(item.pubDate).getTime();
			if(articleDate &gt; lastvisit) unread++;
		});
		cb(unread);
    }, &quot;jsonp&quot;);
    	
}
</code></pre>

You can see now that we're handling the display update as well as storing your last visit when you are on the blog. The DOM selector is just running against a super simple Bootstrap template I whipped up just for this example.

Here is a screen shot of in action:

![Blog updated](https://static.raymondcamden.com/images/2016/02/blogup1.png)

I went ahead and put up the demo here: [https://static.raymondcamden.com/demos/2016/02/18/test.html](https://static.raymondcamden.com/demos/2016/02/18/test.html) But obviously it will be a bit weird since the RSS is on my site, not the demo and, but, you can get the complete HTML templates from there if you want.

## Alternatives

Right off the bat, I can think of one quick way to simplify this a bit. Don't forget that most static 
site generators let you have dynamic files of all sorts - not just HTML. Imagine if my JavaScript code was dynamic as well. I could dynamically generate an array of the last ten date values. Then my code could skip going to YQL. Heck, it wouldn't even need to be async anymore. It would add a tiny bit of weight to the download of the file, but the network speed optimization should make up for that I think. 

You could replace the use of localStorage with a cookie and - in general - get slightly more support - but that seems like overkill to me. (However, I *would* consider adding a simple localStorage check in my code before doing any of the checks.)

What do you think?