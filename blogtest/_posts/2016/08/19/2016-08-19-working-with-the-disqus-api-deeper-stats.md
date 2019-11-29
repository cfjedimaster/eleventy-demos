---
layout: post
title: "Working with the Disqus API - Deeper Stats"
date: "2016-08-19T14:49:00-07:00"
categories: [javascript]
tags: []
banner_image: /images/banners/disqus_api.jpg
permalink: /2016/08/19/working-with-the-disqus-api-deeper-stats
---

Yesterday I [blogged](https://www.raymondcamden.com/2016/08/18/working-with-the-disqus-api-comment-count/) about my first attempts at writing a client-side Disqus API client to provide better stats than the Disqus site itself. While yesterday's demo was more a proof of concept, today I'm attempting something a bit deeper - the beginning of a real power tool.

<!--more-->

This first iteration is somewhat ugly, but will serve as the basis for the pretty, client-friendly version I'll work on next. The idea behind the tool is to create a complete (ish) copy of your Disqus data locally on your client. For that I decided to use IndexedDB. Eventually my code will handle fetching only new comments, but for now it sucks down everything. Even with the 1000 request per hour limit Disqus imposes, I can suck down the entirety of comments for this blog (over 60K). It takes a while, but it's a one time hit, and again, going forward (in the next version at least), it will be a heck of a lot quicker as it only needs to get the latest comments. Let me start by showing the front end and then we'll dive into the code. To be clear, the 'front end' is really just a few buttons and a heck of a lot of console logging.

On startup, you need to give it the name of your forum. 

<img src="https://static.raymondcamden.com/images/2016/08/disqus_fri_1.jpg" class="imgborder">

The setup button is responsible for creating the IndexedDB database for your forum. I could have used one db for all my testing, but... I don't know. It just felt right to create one bucket of data per forum. Obviously I may revisit that.

After entering a value and clicking "Setup", the next two buttons are activated. `Get Data` begins the data fetching process. I hit Disqus for 100 posts per request and just paginate like crazy. For my blog, it does about one request per second and needs 610 or so requests to finish. That's like super slow, but again, will be a one time import. On the next version I'll provide good feedback. I may even use the techniques in my [last post](https://www.raymondcamden.com/2016/08/18/working-with-the-disqus-api-comment-count/) to get a comment count via thread listings first so I can create a status bar. For me that's going to add about 60 seconds to the process though and it may not be worth while. Again, the UX here is squishy - I'll need feedback.

`Display Data` is where I start actually running reports. Right now all these reports are dumped to the console. My reports currently consist of:

* Comment Count (to be clear, this is the same stat as yesterday, just fetched a different way)
* The number of unique commenters
* The first and last comment 
* Number of comments from 2003 to 2016. Yes, I hard coded it, but obviously this would be based on the previous values. 
* The threads with the most comments. (I actually sort them all, but I just print the top ten.)
* The top ten authors by the number of comments. I'm thinking of adding a setting that lets you enter your own name so it can be ignored.

And here is how this looks. First, the 'by year' stats, comment range, and unique number of commenters.

<img src="https://static.raymondcamden.com/images/2016/08/comments.jpg" class="imgborder">

And here are the top commenters:

<img src="https://static.raymondcamden.com/images/2016/08/authors.jpg" class="imgborder">

And the threads with the most comments:

<img src="https://static.raymondcamden.com/images/2016/08/threads.jpg" class="imgborder">

Ok, I know you're overly impressed by the UI, but let's take a look at the code. 

<pre><code class="language-javascript">
function setupData() {
	forum = $forum.val();
	if($.trim(forum) === &#x27;&#x27;) return;
	console.log(&#x27;work with &#x27;+forum);
	$setupData.attr(&#x27;disabled&#x27;,&#x27;disabled&#x27;);

	initDb(function() {
		$results.html(&#x27;&lt;p&gt;&lt;i&gt;Db setup.&lt;&#x2F;i&gt;&lt;&#x2F;p&gt;&#x27;);
		$startData.removeAttr(&#x27;disabled&#x27;);
		$displayData.removeAttr(&#x27;disabled&#x27;);
	},forum);

}

function initDb(cb,forum) {
	&#x2F;*
	Begin by creating an IDB name based on forum. This lets us have one db per forum
	*&#x2F;
	var dbName = &#x27;disqus_&#x27;+forum;
	var req = window.indexedDB.open(dbName, 1);

	req.onupgradeneeded = function(event) {
		console.log(&#x27;initial db setup&#x27;);
		var theDb = event.target.result;

		&#x2F;&#x2F;create a store for posts
		var postOS = theDb.createObjectStore(&quot;posts&quot;, {% raw %}{ keyPath:&quot;id&quot; }{% endraw %});
		postOS.createIndex(&quot;created&quot;, &quot;created&quot;, {% raw %}{ unique: false}{% endraw %});
		postOS.createIndex(&quot;authorName&quot;, &quot;author.name&quot;, {% raw %}{ unique: false}{% endraw %});
		postOS.createIndex(&quot;thread&quot;, &quot;thread.id&quot;, {% raw %}{ unique: false}{% endraw %});
		
	}

	req.onsuccess = function(event) {
		db = event.target.result;
		console.log(&#x27;We made the db.&#x27;);
		cb();
	}

	req.onerror = function(e) {
		console.log(&#x27;Error setting up IDB db&#x27;);
		console.dir(e);
	}

	
}
</code></pre>

First is a utility handler for the setup button. It just does a bit of DOM crap, and then I have the code to setup my database. As I said, I'm using one db per forum and I may revisit that. This is boilerplate IDB crap. The only things of interest are the indexes. I want to be able to sort/filter by date, author, and unique threads, so I have to create an index for each.

Now let's look at the seeding portion. Again, later this will do things like remembering where it left off and handling hitting the API limits, for now though it just sucks data. First - get the data.

<pre><code class="language-javascript">
function doPosts(cb, forum, cursor, posts) {
	var url = &#x27;https:&#x2F;&#x2F;disqus.com&#x2F;api&#x2F;3.0&#x2F;posts&#x2F;list.json?forum=&#x27;+encodeURIComponent(forum)+&#x27;&amp;api_key=&#x27;+key+&#x27;&amp;limit=100&amp;order=asc&amp;related=thread&#x27;;
	if(cursor) url += &#x27;&amp;cursor=&#x27;+cursor;
	if(!posts) posts = [];
	console.log(&#x27;Fetching posts.&#x27;);
	$.get(url).then(function(res) {
		res.response.forEach(function(t) {
			posts.push(t);
		});

		if(res.cursor &amp;&amp; res.cursor.hasNext) {
			doPosts(cb, forum, res.cursor.next, posts);
		} else {
			cb(posts);
		}
	},&#x27;json&#x27;);
}
</code></pre>

Next, enter it into the db. Note I'm using `put` which will handle inserting or replacing, but really I'm just inserting once.

<pre><code class="language-javascript">
function seedData(cb) {

	doPosts(function(posts) {
		console.log(&#x27;I get &#x27;+posts.length+&#x27; posts.&#x27;);

		&#x2F;&#x2F;open up the trans
		var trans = db.transaction([&#x27;posts&#x27;], &#x27;readwrite&#x27;);
		var store = trans.objectStore(&#x27;posts&#x27;);

		posts.forEach(function(p) {
			p.created = (new Date(p.createdAt)).getTime();
			var req = store.put(p);
			req.onerror = function(e) {
				console.log(&#x27;add error&#x27;, e);
			};
		});

		trans.oncomplete = function(e) {
			console.log(&#x27;objects inserted&#x27;);
			cb();
		}

		trans.onerror = function(e) {
			console.log(&#x27;Error in transaction&#x27;, e);
		}

	},forum);

}
</code></pre>

The only thing really interesting there is I create a new data value based on the epoch time. If you don't, the date value of `createdAt` gets inserted as a string you can't sort on.

Ok, now let's look at the stats. This is all in 3 or so *really* ugly functions, so I'm going to share a snippet at a time. Keep in mind I wrote this quick, and it's kinda crappy, but it's the first iteration.

First - the number of comments:

<pre><code class="language-javascript">
/*
number of posts
*/
posts.count().onsuccess = function(e) {
	var count = e.target.result;
	console.log(count + ' total posts');
}
</code></pre>

Yeah, not too complex - just a `count` call on the objectStore. Lets kick it up a notch!

<pre><code class="language-javascript">
&#x2F;*
unique authors
*&#x2F;
var authors = [];
posts.index(&#x27;authorName&#x27;).openCursor(null,&#x27;nextunique&#x27;).onsuccess = function(e) {
	var cursor = e.target.result;
	if(cursor) {
		&#x2F;&#x2F;console.log(&#x27;item&#x27;, cursor.value.id, cursor.value.author.name);
		authors.push(cursor.value.author);
		cursor.continue();
	} else {
		console.log(authors.length + &#x27; total authors&#x27;);
		doAuthorStats(authors);
	}
}
</code></pre>

This gives me both a count on authors and passes off an array of author objects I can then perform analysis on:

<pre><code class="language-javascript">
function doAuthorStats(authors) {
	console.log(&#x27;doAuthorStats&#x27;);

	&#x2F;&#x2F;lame setup to handle knowing when we&#x27;re done with the count, since its async and we don&#x27;t have promises
	var totalAuthor = authors.length;
	var authorInfo = [];

	authors.forEach(function(author) {

		var trans = db.transaction([&#x27;posts&#x27;], &#x27;readonly&#x27;);
		var posts = trans.objectStore(&#x27;posts&#x27;);

		var range = IDBKeyRange.only(author.name);

		posts.index(&#x27;authorName&#x27;).count(range).onsuccess = function(e) {
			&#x2F;&#x2F;console.log(&#x27;result for &#x27;+author.name+&#x27; &#x27;+e.target.result);
			authorInfo.push({% raw %}{author:author, count:e.target.result}{% endraw %});
			if(authorInfo.length === totalAuthor) doComplete();
		};

	});

	var doComplete = function() {
		authorInfo.sort(function(a,b) {
			if(a.count &gt; b.count) return -1;
			if(a.count &lt; b.count) return 1;
			return 0;
		});
		for(var i=0;i&lt;10;i++) {
			console.log(authorInfo[i].author.name + &#x27; with &#x27;+authorInfo[i].count + &#x27; comments.&#x27;);
		}
	}

}
</code></pre>

For dates, it was a bit weird. I knew I could sort by date, so I used a cursor and fetched one object. I then opened a new cursor, reversed, and did the same. This feels wrong.

<pre><code class="language-javascript">
var first, last;
posts.index(&#x27;created&#x27;).openCursor(null).onsuccess = function(e) {
	var cursor = e.target.result;
	if(cursor) {
		var d = new Date(cursor.value.created);
		&#x2F;&#x2F;console.log(&#x27;first &#x27;+d);
&#x2F;&#x2F;			cursor.continue();
		first = d;
		posts.index(&#x27;created&#x27;).openCursor(null,&#x27;prev&#x27;).onsuccess = function(e) {
			var cursor = e.target.result;
			if(cursor) {
				var d = new Date(cursor.value.created);
				last = d;
				console.log(&#x27;comments from &#x27;+first+&#x27; to &#x27;+last);
				&#x2F;&#x2F;console.log(&#x27;last &#x27;+d);
	&#x2F;&#x2F;			cursor.continue();
			} else {
			}

		}

	} else {
	}

}
</code></pre>

And here is my "per year" code (and again, I hard coded the values):

<pre><code class="language-javascript">
var years = [];
for(var i = 2003; i&lt;=2016; i++) {
	years.push(i);
}

years.forEach(function(year) {
	&#x2F;&#x2F;test 2016
	var yearBegin = new Date(year,1,1).getTime();
	var yearEnd = new Date(year,11,31,23,59,59).getTime();
	var range = IDBKeyRange.bound(yearBegin, yearEnd);
	posts.index(&#x27;created&#x27;).count(range).onsuccess = function(e) {
		console.log(&#x27;Year &#x27;+year +&#x27; had &#x27;+e.target.result+ &#x27; comments&#x27;);
	};
});
</code></pre>

This displays well, but I kinda worry that due to the async nature, it's possible one year will come in after another, or vice versa, whatever, you get the idea. I'll probably have to use an object to store results, sort the keys, and then work on the data.

Finally, here's the top threads report.

<pre><code class="language-javascript">
/*
unique threads, but only w/ posts
*/
var threads = [];
posts.index('thread').openCursor(null,'nextunique').onsuccess = function(e) {
	var cursor = e.target.result;
	if(cursor) {
		//console.log('item', cursor.value.id, cursor.value.author.name);
		threads.push(cursor.value.thread);
		cursor.continue();
	} else {
		console.log(threads.length + ' total threads');
		doThreadStats(threads);
	}
}
</code></pre>

How does this work? I get each unique thread index, get the actual thread object, and then store the thread data. I then sort.

<pre><code class="language-javascript">
function doThreadStats(threads) {
	console.log(&#x27;doThreadStats&#x27;);

	threads.sort(function(a,b) {
		if(a.posts &gt; b.posts) return -1;
		if(a.posts &lt; b.posts) return 1;
		return 0;
	});
	for(var i=0;i&lt;10;i++) {
		console.log(threads[i].title + &#x27; (&#x27;+threads[i].link+&#x27;) with &#x27;+threads[i].posts + &#x27; comments.&#x27;);
	}

}
</code></pre>

You can run the demo here, but remember, this is using my API key which I abused the *hell* out of. Assume it won't work. And open your dev tools. Your dev tools are open, right?

https://cfjedimaster.github.io/disqus-analytics/deep1/

The full source code for this version may be found here: https://github.com/cfjedimaster/disqus-analytics/tree/master/deep1

Ok... so next is to package this baby up into something a bit prettier. Oh, and 3D animated charts with cats of course. 

<img src="https://static.raymondcamden.com/images/2016/08/cat_3d.jpg">