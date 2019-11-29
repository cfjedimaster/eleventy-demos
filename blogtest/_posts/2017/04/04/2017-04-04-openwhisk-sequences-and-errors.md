---
layout: post
title: "OpenWhisk Sequences and Errors"
date: "2017-04-04T09:54:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/04/04/openwhisk-sequences-and-errors
---

<strong>As always, try to read the entire post before leaving. I edited the end to add a cool update!</strong>

I first blogged about [OpenWhisk sequences](https://www.raymondcamden.com/2017/01/06/an-example-of-an-openwhisk-sequence) a few months ago, but if you didn't read that post, you can think of them as a general way of connecting multiple different actions together to form a new, grouped action. As an example, and this is something I'm actually working on, I may have an action that gets the latest tweets from an account as well as an action that performs tone analysis. I can then combine the two into one sequence that returns the tone for a Twitter account. (Technically I may need a third action in the middle to 'massage' the data between them.) This morning I was a bit curious about how errors are handled in sequences. I had my assumptions, but I wanted to test them out to be sure. Here is what I found.

I began by creating three simple actions, alpha, beta, and gamma. Here is the source for all three:

<pre><code class="language-javascript">//Alpha
function main(args) {
	return {% raw %}{result:1}{% endraw %};
}

//beta
function main(args) {
	if(!args.result) args.result=0; 
	return {% raw %}{result:args.result+1}{% endraw %};
}

//gamma
function main(args) {
	if(!args.result) args.result=0; 
	return {% raw %}{result:args.result+1}{% endraw %};
}
</code></pre>

I called my sequence, testSequence1, because I'm a very creative individual. I then ran it to be sure I got the right result, 3. Cool. 

Alright, so first, I broke beta:

<pre><code class="language-javascript">function main(args) {
	if(!args.result) args.result=0; 
	doBad();
	return {% raw %}{result:args.result+1}{% endraw %};
}
</code></pre>

When run, I got an error I pretty much expected:

![Error](https://static.raymondcamden.com/images/2017/4/ows1.png)

Cool. So next I converted Beta to use promises:

<pre><code class="language-javascript">function main(args) {

	return new Promise( (resolve, reject) =&gt; {
		if(!args.result) args.result=0; 
		//doBad();
		resolve({% raw %}{result:args.result+1}{% endraw %});
	});
}
</code></pre>

I didn't include an error this time, I just made sure it worked as expected, and it did. Cool. So first I added back in my `doBad` call:

<pre><code class="language-javascript">function main(args) {

	return new Promise( (resolve, reject) =&gt; {
		if(!args.result) args.result=0; 
		doBad();
		//resolve({% raw %}{result:args.result+1}{% endraw %});
	});
}
</code></pre>

The result was a bit less helpful:

![Error?](https://static.raymondcamden.com/images/2017/4/ows2.png)

While not helpful, it is kind of expected. If you work with promises and don't look for an error, they tend to get swollowed up. (I believe Chrome recently adding support for noticing unhandled exceptions, but again, I think that was a recent change.)

I then switched to this version:

<pre><code class="language-javascript">function main(args) {

	return new Promise( (resolve, reject) =&gt; {
		if(!args.result) args.result=0; 
		//doBad();
		//resolve({% raw %}{result:args.result+1}{% endraw %});
		reject(new Error("Because the sky is blue."));
	});
}
</code></pre>

And the result was the exact same. I had thought the more formal `reject` would have - possibly - be handled better, but it was not.

But - the good news - is that in every case where I tested my error, the metadata did correctly return a false result for the success key. While the verbosity/reason of the error was lost in the promise, the fact that an error was thrown was still something that could be recorded. 

All in all - this really speaks to using good testing, and properly handling code that can throw exceptions. This falls into the "obvious" category, but as easy as OpenWhisk and serverless is in general, it is absolutely not a blank check to skip best practices when it comes to handling potential errors.

<strong>Edit:</strong> Once again, my good buddy [Carlos Santana](https://twitter.com/csantanapr) comes to the rescue with a good fix. If you reject a plain JavaScript object, and not an Error object, you get a better handled result. Here is an updated beta.js:

<pre><code class="language-javascript">function main(args) {

	return new Promise( (resolve, reject) =&gt; {
		if(!args.result) args.result=0; 
		//doBad();
		//resolve({% raw %}{result:args.result+1}{% endraw %});
		let e = new Error("Because the sky is blue.");
		reject({
			name:e.name,
			message: e.message,
			stack:e.stack
		});
	});
}
</code></pre>

And here is the result:

![Better error](https://static.raymondcamden.com/images/2017/4/ows3.png)

Nice! The use of "error like" keys is arbitrary of course. I modified the reject to include `howBlue:"very"` and it was available in the result. It probably makes sense to follow a pattern like Carlos used above, just remember you can include additional stuff if you want as well.