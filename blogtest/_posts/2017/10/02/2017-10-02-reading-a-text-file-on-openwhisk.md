---
layout: post
title: "Reading a Text File on OpenWhisk"
date: "2017-10-02T08:32:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/10/02/reading-a-text-file-on-openwhisk
---

Many months ago I wrote a quick post on OpenWhisk, serverless, and persistence ([Serverless and Persistence](https://www.raymondcamden.com/2017/02/09/serverless-and-persistence/)). In that article I mentioned that while your serverless actions are stateless and you should not *rely* on the file system, you do have access to it and can make use of it. It isn't something I'd recommend normally and it should be considered a - if not red flag - at least yellow for "are you sure" before deploying, but there are cases where it might make sense.

This weekend I worked on an action that needed to use a four thousand line text file as a data source. I could have fired up a database or Reddis instance, but that seemed like overkill. I knew that I could easily write code to read the file and then store it in the action's variables scope. That way if the action was run while OpenWhisk had it warm, it wouldn't need to hit the file system again.

I ran into some issues though and thankfully (once again), [Rodric Rabbah](https://ibm.biz/rrabbah) at IBM helped me out. Let's look at a quick example and I'll describe what's necessary to make it work.

First, the action:

<pre><code class="language-javascript">const fs = require('fs');

let contents;

function main(args) {

	if(!contents) {
		console.log('Read from the file system');
		contents = fs.readFileSync(__dirname + '/test.txt','UTF-8');
	}

	return {% raw %}{ contents:contents }{% endraw %};

}

exports.main = main;
</code></pre>

This is incredibly simple, but the two parts to make note of are:

* In order to read a file in the same directory as the action, you can *not* just use `./file` but must use `__dirname`. This is what Rodric helped me out with.
* Secondly - you definitely want to cache to read as I'm doing here. I added a console message just to make sure it worked correctly.

Ok, so that's the code, but you have to do a bit more. In order to ship 2+ files with your action, you have to use a zipped action. That makes you also have to make a package.json. I made a quick one with `npm init`, just be sure it picks up your entry point matching your file name. In my case it was `testtext.js` and this is what the package.json looked like:

<pre><code class="language-javascript">{
  &quot;name&quot;: &quot;texttest&quot;,
  &quot;version&quot;: &quot;1.0.0&quot;,
  &quot;description&quot;: &quot;&quot;,
  &quot;main&quot;: &quot;texttest.js&quot;,
  &quot;scripts&quot;: {
    &quot;test&quot;: &quot;echo \&quot;Error: no test specified\&quot; &amp;&amp; exit 1&quot;
  },
  &quot;author&quot;: &quot;Raymond Camden &lt;raymondcamden@gmail.com&gt; (https:&#x2F;&#x2F;www.raymondcamden.com)&quot;,
  &quot;license&quot;: &quot;ISC&quot;
}
</code></pre>

You then zip up the JavaScript file, the text file, and the package.json and deploy that. I use a script to make it easier:

<pre><code class="language-javascript">#!/bin/bash
zip -rq temp.zip texttest.js test.txt package.json
wsk action update safeToDelete/texttest --kind nodejs:6 temp.zip
rm temp.zip
</code></pre>

And that's pretty much it. When I couldn't figure this out over the weekend, I went into Chrome DevTools, pasted the entire 4k line file into it, and converted it into a JSON file I could `require()` in instead. 

Anyway - just to complete the post, here is a screen shot of it working and a very important, very wise quote:

![Yoda](https://static.raymondcamden.com/images/2017/10/owtext2.jpg)