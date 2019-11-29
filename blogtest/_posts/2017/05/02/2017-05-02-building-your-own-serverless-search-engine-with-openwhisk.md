---
layout: post
title: "Building Your Own Serverless Search Engine with OpenWhisk"
date: "2017-05-02T13:43:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: /images/banners/owsearchengine.jpg
permalink: /2017/05/02/building-your-own-serverless-search-engine-with-openwhisk
---

This is a demo I've been working on for some time. It isn't necessarily that complex (or cool), but it's just taken me a while to get the parts together. As you know, I'm a huge proponent of static site generators. My own site is run on one and I recently released released a [book](https://www.amazon.com/gp/product/B06XHGH789/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B06XHGH789&linkCode=as2&tag=raymondcamd06-20&linkId=f23f73d89dfe77d76a37e967d7e28cd0) on the topic with Brian Rinaldi. 

One of the things I cover in the book is how to "bring dynamic back" to a static site. That includes things like forms, comments, and search. In the book I recommend Google's [Custom Search Engine](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjkmq-f79HTAhWpqlQKHVnVAHQQFggnMAA&url=https{% raw %}%3A%{% endraw %}2F{% raw %}%2Fwww.google.com%{% endraw %}2Fcse%2F&usg=AFQjCNHTH5NB954ogLfeyb8R1JR8jrXkkQ&sig2=QlCMl_UMI_Cdf2lE3AjKUA) feature. It's what I use for [search](https://www.raymondcamden.com/search.html) here and it works well. 

But I got to thinking - how difficult would it be to set up a similar system with [OpenWhisk](https://developer.ibm.com/openwhisk/)? All I would need is two parts:

* A way to index my content.
* A way to search my content via an API.

Turns out, there's a pretty cool service that does this already - [Tapir](http://www.tapirgo.com/). Tapir lets you specify a site and it will begin indexing it for your automatically. You then simply use an API end point in your code to perform searches. This is a cool service, but I can't recommend it. While it still "runs", the folks behind it no longer support it so it's not something I'd suggest. But it serves as a good basis for what I'd like to build in OpenWhisk, so that's how I got started!

Indexing
===

To handle indexing, I needed a few components. First, I needed a way to parse RSS entries. That's easy enough. I built an action for this a few months ago. You can see it here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/rss. Here's the code:

<pre><code class="language-javascript">const request = require(&#x27;request&#x27;);
const parseString = require(&#x27;xml2js&#x27;).parseString;

function main(args) {

	return new Promise((resolve, reject) =&gt; {

		if(!args.rssurl) {
			reject({% raw %}{error:&quot;Argument rssurl not passed.&quot;}{% endraw %});
		}

		request.get(args.rssurl, function(error, response, body) {
			if(error) return reject(error);

			parseString(body, {% raw %}{explicitArray:false}{% endraw %}, function(err, result) {
				if(err) return reject(err);
                resolve({% raw %}{entries:result.rss.channel.item}{% endraw %});
			});

		});

	});
}

exports.main = main;
</code></pre>

Pretty trivial. I'm using `xml2js` to handle the parsing and then filtering down the result to just the items. Done. 

The next thing I needed was a way to work with ElasticSearch. [IBM Bluemix](https://www.ibm.com/cloud-computing/bluemix/) lets you provision a new instance in seconds, so I did that. Once I had it provisioned, I made use of a package I created to work with ElasticSearch. You can find the code here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/elasticsearch

It's also shared on OpenWhisk itself so you can bind your own copy at "/rcamden@us.ibm.com_My Space/elasticsearch". The package has actions for adding items to your ElasticSearch instance, performing bulk operations, and doing searches. Obviously ElasticSearch supports more, but I built only what I needed. For my usage, I decided to use the bulk operation. I figured I'd take the RSS items and insert them all at once.

To make this work, I made a new action to sit between them. I touched on this in my [previous post](https://www.raymondcamden.com/2017/05/01/sequences-as-inputoutput-providers) about using sequences as a way to massage input/output for actions. In that post I was focused on input/output, but obviously a sequence can be created between two "pure" actions and one in the middle that massages the data from one to the other. In my case, the action was called `flattenRSSEntriesForSearch`. Here's the code.

<pre><code class="language-javascript">function main(args) {

	&#x2F;*
	create a new array of:
		url
		description
		pubDate
		title
	*&#x2F;
	let entries = args.entries.map( (entry) =&gt; {
		return {
			url:entry.link,
			body:entry.description,
			published:entry.pubDate,
			title:entry.title
		};
	});

	&#x2F;*
	ok, now we need to prep it for the bulk action
	PREPARE THE BULK!!!

	ex: 
	{% raw %}{ index:  { _index: &#x27;myindex&#x27;, _type: &#x27;mytype&#x27;, _id: 1 }{% endraw %} },
     &#x2F;&#x2F; the document to index
    {% raw %}{ title: &#x27;foo&#x27; }{% endraw %},
	*&#x2F;
	let bulk = [];

	entries.forEach( (e) =&gt; {
		let action = {% raw %}{&quot;index&quot;:{&quot;_type&quot;:&quot;entry&quot;, &quot;_id&quot;:e.url}}{% endraw %};
		let document = e;
		bulk.push(action);
		bulk.push(document);
	});

	return {
		body:bulk,
		index:&#x27;blogcontent&#x27;
	}

}

exports.main = main;
</code></pre>

For the most part, this is just "convert one array to another", and frankly, I just read the docs on bulk inserts and followed their direction. One cool thing about this setup is that ElasticSearch is smart enough to take my input and update existing items I already created. Notice I'm using the URL as the ID. Since URLs are unique, they work great as a primary key for my ElasticSearch data. 

So I took my RSS action, my 'joiner' action above, and my bulk action, and made a sequence called rssToES. Here's how I'd call it from the command line:

`wsk action invoke -b -r rssToES --param rssurl http://feeds.feedburner.com/raymondcamden`

Then all I needed to do was make a trigger to call this once a day. Bam. Done. (Ok, I lie. I didn't bother making the scheduled task because I'd probably forget about it and it's just a demo so there's no need for it, but I could. Honestly.)

Search
===

Ok, so how do we handle search? First, we need to support a search string, obviously. ElasticSearch has a hella-long list of ways to search, but they also support a simple "just give me a damn string" style search which is what I'll use now. It's supported by the search action of my package, so that's good to go. But - that's not what I want to expose to the web. 

So once again, I rely on the technique in the [last post](https://www.raymondcamden.com/2017/05/01/sequences-as-inputoutput-providers) of using a sequence to massage my data. First, I created an "input" action called `rssSearchEntry`:

<pre><code class="language-javascript">let index = 'blogcontent';
let type = 'entry';

function main(args) {

    //args.q required - the search

    return {
        index:index,
        type:type,
        q:args.q
    }

}
</code></pre>

My ElasticSearch search action needs the search term as well as the index and type. I set index and type to hard coded values and then just pass on the search string. Search isn't too exciting but you can check out the code in the repo [here](https://github.com/cfjedimaster/Serverless-Examples/blob/master/elasticsearch/search.js).

Once the search action is done, I've got a result that includes metadata as well as matched documents. So I built a third action, `rssSearchExit`, to massage that into a simple array.

<pre><code class="language-javascript">&#x2F;&#x2F; I remove metadata from ES I don&#x27;t care about
function main(args) {

   &#x2F;&#x2F;credit for regex: http:&#x2F;&#x2F;stackoverflow.com&#x2F;a&#x2F;822464&#x2F;52160
   let result = args.hits.hits.map((entry) =&gt; {
    return {
        url:entry._id,
        title:entry._source.title,
        published:entry._source.published,
        context:entry._source.body.replace(&#x2F;&lt;(?:.|\n)*?&gt;&#x2F;gm, &#x27;&#x27;).substr(0,250),
        score:entry._score
    }  
   });
 
    return {
        headers:{
            &#x27;Access-Control-Allow-Origin&#x27;:&#x27;*&#x27;,
            &#x27;Content-Type&#x27;:&#x27;application&#x2F;json&#x27;
        },
        statusCode:200,
        body:new Buffer(JSON.stringify(result)).toString(&#x27;base64&#x27;)
    };

}
</code></pre>

Note that I also replace the body of the match, which includes the full HTML of the blog entry, with a shorter 'context' value that has HTML removed. This seemed like a good idea to me, but obviously you could leave that up to the client-side code if you wanted. 

The last part of the action simply enables CORS and returns my result. 

So with those actions done, I made a new sequence that simply wrapped the three together and enabled web action support. Woot!

The Front End
===

Almost done with our Google Replacement. I'll be taking phone calls from Silicon Valley investors soon, I can just feel it! I whipped up a simple HTML form for the search:

<pre><code class="language-javascript">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

		&lt;h1&gt;Search&lt;&#x2F;h1&gt;
		&lt;p&gt;
		&lt;input type=&quot;search&quot; id=&quot;search&quot;&gt; &lt;input type=&quot;button&quot; id=&quot;searchBtn&quot; value=&quot;Search!&quot;&gt;
		&lt;&#x2F;p&gt;

		&lt;div id=&quot;results&quot;&gt;&lt;&#x2F;div&gt;

		&lt;script src=&quot;app.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

Basically a search box, button, and empty DIV for the results. Now for the JavaScript. Before I share this code, note that I'm using some ES6 stuff here and that is *completely* arbitrary. It is *not* a requirement for working with OpenWhisk APIs. I just did it because I like the shiny.

<pre><code class="language-javascript">document.addEventListener(&#x27;DOMContentLoaded&#x27;, init, false);

let $search, $searchBtn, $results;
let searchAPI = &#x27;https:&#x2F;&#x2F;openwhisk.ng.bluemix.net&#x2F;api&#x2F;v1&#x2F;web&#x2F;rcamden@us.ibm.com_My%20Space&#x2F;default&#x2F;rssSearch.http?q=&#x27;;

function init() {
	console.log(&#x27;ready to listen to your every need...&#x27;);
	$search = document.querySelector(&#x27;#search&#x27;);
	$searchBtn = document.querySelector(&#x27;#searchBtn&#x27;);
	$results = document.querySelector(&#x27;#results&#x27;);

	$searchBtn.addEventListener(&#x27;click&#x27;, doSearch, false);
}

function doSearch() {
	&#x2F;&#x2F;clear results always
	$results.innerHTML = &#x27;&#x27;;

	let value = $search.value.trim();
	if(value === &#x27;&#x27;) return;
	fetch(searchAPI + encodeURIComponent(value)).then( (resp) =&gt; {
		resp.json().then((results) =&gt; {
			console.log(results);
			if(!results.length) {
				$results.innerHTML = &#x27;&lt;p&gt;Sorry, I found nothing for that.&lt;&#x2F;p&gt;&#x27;;
				return;
			}

			let result = &#x27;&lt;ul&gt;&#x27;;
			results.forEach((entry) =&gt; {
				result += `
&lt;li&gt;&lt;a href=&quot;${% raw %}{entry.url}{% endraw %}&quot;&gt;${% raw %}{entry.title}{% endraw %}&lt;&#x2F;a&gt;&lt;br&#x2F;&gt;
${% raw %}{entry.context}{% endraw %}&lt;&#x2F;li&gt;
				`;
			});
			result += &#x27;&lt;&#x2F;ul&gt;&#x27;;
			$results.innerHTML = result;
		});
	});
}
</code></pre>

Alright, so outside of the fancy ES6 stuff, this should be like every other AJAX-search engine built in the past decade. I've pointed to my endpoint (see `searchAPI`) and just do an AJAX call to get my results. And yeah... that's it. Want to see it live? (Keep in mind I am *not* actually updating my content in ElasticSearch via a schedule, so it's only got about 10 blog entries in it. I'd search for 'openwhisk'.)

https://cfjedimaster.github.io/Serverless-Examples/rss_search/frontend/

Wrap Up
===

So, I think this process is actually pretty cool. I've got complete control over how my content is indexed and I've got complete control over the search API. I also have more control over how it gets embedded in a static site. If I wanted to, I could go even further. Tapi provided end points to add older content (ie stuff not in your RSS feed currently) as well as to allow for updates and deletes. OpenWhisk isn't free, but I'm only going to be charged when indexing runs and when someone searches. Thoughts?