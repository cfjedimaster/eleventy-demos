---
layout: post
title: "Integrating OpenWhisk with Your Node Application"
date: "2017-06-02T08:31:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/06/02/integrating-openwhisk-with-your-node-application
---

In most of my posts on OpenWhisk, I either show running the actions via the CLI, or demonstrate them with the anonymous REST API end point. However, there is another way of using actions as well. Every time you use the CLI, it is making authenticated REST calls on your behalf. You can find the documentation for that API here: [Using the OpenWhisk REST APIs](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_reference.html#openwhisk_ref_restapi)

While you make use of this via the CLI automatically, there may be times when you choose to use the authenticated APIs in your code as well. For example, imagine a simple Node application that performs a set of functions. It's possible you may migrate one, or more, of those functions into serverless.

Now - I know what you're thinking - why would we still use a Node server if we're moving to serverless? Like most transitions, not everything is done at once. You may have ten different things going on with your server and only some have migrated to serverless. Embracing serverless isn't about destroying every single server you have left, and there are some things that simply don't make sense in serverless. So I thought I'd build a simple Node app that demonstrated how this could look.

I began with a simple Node/Express app that consisted of three different routes. A home page, a cat listing, and a dog listing. Here is my main index.js:

<pre><code class="language-javascript">const express = require(&#x27;express&#x27;);
const app = express();

const dataService = require(&#x27;.&#x2F;dataService&#x27;);
app.use(express.static(&#x27;public&#x27;));

app.set(&#x27;port&#x27;, process.env.PORT || 3000);

&#x2F;&#x2F; 3 simple routes, &#x2F;index.html is served via static

app.get(&#x27;&#x2F;cats&#x27;, (req, res) =&gt; {
	&#x2F;*
	imagine calling a db to fetch a list of cats and then render it.
	*&#x2F;
	dataService.getCats().then((cats) =&gt; {
		console.log(cats);
		let result = &#x27;&lt;h2&gt;Cats&lt;&#x2F;h2&gt;&lt;ul&gt;&#x27;;
		cats.forEach((cat) =&gt; {
			result += &#x27;&lt;li&gt;&#x27;+cat+&#x27;&lt;&#x2F;li&gt;&#x27;;
		});
		result += &#x27;&lt;&#x2F;ul&gt;&#x27;;
		res.send(result);
	});
}); 

app.get(&#x27;&#x2F;dogs&#x27;, (req, res) =&gt; {
	&#x2F;*
	imagine calling a db to fetch a list of dogs and then render it.
	*&#x2F;
	dataService.getDogs().then((dogs) =&gt; {
		let result = &#x27;&lt;h2&gt;Dogs&lt;&#x2F;h2&gt;&lt;ul&gt;&#x27;;
		dogs.forEach((dog) =&gt; {
			result += &#x27;&lt;li&gt;&#x27;+dog+&#x27;&lt;&#x2F;li&gt;&#x27;;
		});
		result += &#x27;&lt;&#x2F;ul&gt;&#x27;;
		res.send(result);
	});
}); 

app.listen(app.get(&#x27;port&#x27;), () =&gt; {
	console.log(&#x27;Running on http:&#x2F;&#x2F;localhost:&#x27; + app.get(&#x27;port&#x27;));
});
</code></pre>

I won't share the home view (it's all in GitHub), but notice my `/cats` and `/dogs` routes both work with a dataService module to get their respective list of animals. Let's look at that.

<pre><code class="language-javascript">function getCats() {
	return new Promise((resolve, reject) =&gt; {
		let cats = ["Robin", "Cracker", "Luna", "Pig"];
		resolve(cats);
	});
}

function getDogs() {
	return new Promise((resolve) =&gt; {
		let dogs = ["Cayenne", "Panda Express", "Kimchee"];
		resolve(dogs);
	});
}

module.exports = {% raw %}{ getCats, getDogs }{% endraw %}
</code></pre>

I assume this is all pretty standard stuff, but let me know if not. In both cases, I'm faking an asynchronous response by using promises and static data. And just to be sure I'm not crazy, here is a screen shot of the only view that matters - the cats:

![Screen shot](https://static.raymondcamden.com/images/2017/6/now1.png)

Alright - so this is the core, initial application. It's static, but you could imagine that dataService module using Mongo or some other persistence system. Now let's see about migrating part of this to serverless.

For my demo, I'll focus on the Cats data since, well, that's obviously the most important one. I'll begin by creating a new action that handles this logic.

<pre><code class="language-javascript">function main(args) {
	let cats = [&quot;Miss Serverless&quot;,&quot;Robin&quot;, &quot;Cracker&quot;, &quot;Luna&quot;, &quot;Pig&quot;];

	return {% raw %}{ cats }{% endraw %};

}

exports.main = main;
</code></pre>

Note that I've modified the list of cats a bit just to make it obvious to me in the UI that I've switched to it. After saving this file, I used the `wsk` command line to deploy it to Bluemix:

	wsk action create safeToDelete/getcats getcats.js

And then obviously ran a quick test to ensure it worked:

	wsk action invoke safeToDelete/getcats -b -r

The result is what I expect:

<pre><code class="language-javascript">{
    "cats": [
        "Miss Serverless",
        "Robin",
        "Cracker",
        "Luna",
        "Pig"
    ]
}
</code></pre>

Woot. Ok, so how do I update my Node app to use it? As I said, there is a REST API, and I could just hit that by making a HTTP request. Instead, I'm going to use the [openwhisk npm](https://www.npmjs.com/package/openwhisk) module. It makes using OpenWhisk actions a heck of a lot easier. How easy? Here is my new dataService.js:

<pre><code class="language-javascript">const openwhisk = require('openwhisk');
const options = {
	apihost:'openwhisk.ng.bluemix.net',
	api_key:'super_secret_key_no_one_will_guess'
}
const ow = openwhisk(options);

function getCats() {
	return ow.actions.invoke({% raw %}{name:'safeToDelete/getcats',blocking:true,result:true}{% endraw %});
}

function getDogs() {
	return new Promise((resolve) => {
		let cats = ["Cayenne", "Panda Express", "Kimchee"];
		resolve(cats);
	});
}

module.exports = {% raw %}{ getCats, getDogs }{% endraw %}
</code></pre>

I begin by adding the openwhisk module to my code, specifying my options, and then creating a new `ow` object. Note that you can, and probably should, specify your credentials with environment variables. If you do, you can skip the entire `options` part and just go to town. 

Next - look at `getCats`. My index.js file was already expecting a promise, and the OpenWhisk library uses promises in everything it does. So I run my action and ask it to be blocking and get just the result. (This works exactly like the CLI.)

That's *almost* enough. Unfortunately, my initial code returned an array, and my OpenWhisk action returns a JavaScript object with the array in the `cats` property. I could just tweak index.js, but that feels wrong to me. Instead, I made this change:

<pre><code class="language-javascript">function getCats() {
	return new Promise((resolve, reject) =&gt; {
		ow.actions.invoke({% raw %}{name:&#x27;safeToDelete&#x2F;getcats&#x27;,blocking:true,result:true}{% endraw %}).then((result)=&gt;{
			resolve(result.cats);
		});
	});
}
</code></pre>

I simply wrap the OpenWhisk call with my own Promise, and when OpenWhisk is done, I resolve just the cats.

And that's it. Later if I migrate dogs to OpenWhisk as well, I could update that too. Or I may not. And that's the point. Moving to serverless can be done as much, or as little, as it makes sense for your project. Let me know if you have any questions, or comments, about this example. 

Full source code: https://github.com/cfjedimaster/Serverless-Examples/tree/master/nodeexample