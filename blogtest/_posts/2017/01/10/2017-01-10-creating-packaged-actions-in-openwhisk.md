---
layout: post
title: "Creating Zipped Actions in OpenWhisk"
date: "2017-01-10T13:12:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/01/10/creating-packaged-actions-in-openwhisk
---

As I continue my journey of learning serverless and [OpenWhisk](https://developer.ibm.com/openwhisk/), today I'm going to talk about
another way to deploy your code - zipped actions. So what do we mean by zipped actions?

Previously I demonstrated creating actions based on single files. So action Cat was based on the file cat.js. You can also 
create actions as a [sequence](https://www.raymondcamden.com/2017/01/06/an-example-of-an-openwhisk-sequence) of other actions. 
[Zipped actions](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_actions.html#openwhisk_js_packaged_action) are
basically JavaScript files packed up as a npm module. Why would you want to do this?

First - OpenWhisk provides a set of npm modules you can require in your code. And while that last is nice, you may want something *not* on that list. By
creating your own package of code, you can include that in your action. Secondly, you may just want to split your code into multiple files. The procedure
isn't too terribly difficult. 

Let's assume a simple action:

<pre><code class="language-javascript">
function main() {
	return {% raw %}{ message: "Hello World"}{% endraw %}
}
</code></pre>

First, I add a package.json to the folder. (It will make things easier if your code for this particular action is in it's own folder.) 

<pre><code class="language-javascript">
{
  "name": "something",
  "version": "1.0.0",
  "main": "main.js",
  "dependencies" : {
  }
}
</code></pre>

The name doesn't matter (although you'll probably want to pick something that is sensible for your action), but main should point to the JS file of your action, 
the entry point to this action as a whole.

Next, modify your action to export the main function:

<pre><code class="language-javascript">
function main() {
	return {% raw %}{ message: "Hello World"}{% endraw %}
}

exports.main = main;
</code></pre>

Now you'll want to zip your files. Be very, very, very careful at this step. Do not zip the folder, but the files in the folder. I used Windows' built in "Send to Compressed folder" feature
on the folder itself, and that created a zip where the first entry was the folder. You want to zip the files, not the folder.

Finally, you send this to OpenWhisk like so:

	wsk action create packageAction --kind nodejs:6 action.zip

After that, you can run it like any normal action. Note that unzipping your code means it will take a bit longer to run your action if it's cold (a fancy 
way of saying, "hasn't been run lately"), but if your sure your action's going to be pretty active, then you should be fine.

Now let's consider a real example. In the past, I've used a npm package called [FeedParser](https://www.npmjs.com/package/feedparser) as a way to parse
RSS feeds in Node.js. I thought it would be cool to build an action that would let me specify a RSS URL and get a JSON parsing of the data returned. I began with my 
package.json:

<pre><code class="language-javascript">
{
  "name": "rsstojson",
  "version": "1.0.0",
  "main": "main.js",
  "dependencies" : {
    "feedparser" : "*",
	"request":"*"
  }
}
</code></pre>

I then ran:

	npm install

To get all those dependencies installed. Next, I wrote my action:

<pre><code class="language-javascript">
var FeedParser = require('feedparser');
var request = require('request');

function main(args) {

	return new Promise(function(resolve, reject) {

		var fp = new FeedParser();
		
		request.get(args.url).pipe(fp);

		var items = [];
		var meta;

		fp.on('readable', function() {
			var stream = this;
			var item;

			while(item = stream.read()) {
				if(!meta) meta = item.meta;
				delete item.meta;
				items.push(item);
			}
		});

		fp.on('end', function() {
			resolve({% raw %}{items:items, meta:meta}{% endraw %});
		});

	});

}

exports.main = main;
</code></pre>

All I do is take in a URL argument, suck it down via the Request package, and then pipe it over to FeedParser. I noticed that FeedParser would create a 'meta'
object for every feed item. This meta object includes the metadata about the feed itself. I thought this was useful, but didn't like it being duplicated
on every feed item. So I take it out of the first item and delete it from every item added to the array of results. I can then return the list of
RSS entries and the metadata as well.

And that's it! The output is pretty verbose so I won't share a screen shot, but I've included a video about this topic below.

<iframe width="560" height="315" src="https://www.youtube.com/embed/CrnQu9tUTFM" frameborder="0" allowfullscreen></iframe>