---
layout: post
title: "New IBM Composer Feature - Additional Action Logging"
date: "2017-12-12"
categories: [serverless]
tags: [openwhisk,javascript]
banner_image: 
permalink: /2017/12/12/new-ibm-composer-feature-additional-action-logging
---

A pretty cool update landed in [IBM Composer](https://github.com/ibm-functions/composer/tree/master/docs) today, and I want to thank IBM engineer [Kerry Chang](http://researcher.watson.ibm.com/researcher/view.php?person=ibm-Kerry.Chang) for letting me know about it. When visualizing compositions, Composer will return information about the output of your actions, but do not provide that level of output for *inine* functions. Now typically these are very small bits of logic and you probably aren't too concerned about their output, but it can be something you miss if you're having trouble chasing down a bug. Another thing you don't get is the input to the composition. Now you can get both.

First, be sure you update your `fsh` command line:

	npm install -g @ibm-functions/shell

If you then run `fsh app create`, you'll see information about three new flags you can pass:

![fsh](https://static.raymondcamden.com/images/2017/12/fshl1.jpg)

You can now request logging for your initial input (`--log-input`), output of inline actions (`--log-inline`), or enable both at once: `--log-all`. Note that `-l` is not a valid shorthand and will be removed from the CLI help shortly.

Also note that the same parameters exist for `fsh app update` as well. 

Ok, so let's test this. I made a somewhat silly composition of 3 steps. The first was an action that returned a random name. It also allows for an optional title.

<pre><code class="language-javascript">function main(args) {
	let name = &#x27;&#x27;;

	if(args.title) name = args.title + &#x27; &#x27;;

	if(Math.random() &lt; 0.5) {
		name += &#x27;Ray&#x27;;
	} else {
		name += &#x27;Jay&#x27;;
	}

	return {% raw %}{ name:name }{% endraw %};
}
</code></pre>

The second action is an inline action. I'll show that in a bit. The third action returns the "cost" of a string. This is just based on the length of the string.

<pre><code class="language-javascript">function main(args) {
	&#x2F;&#x2F; I return the &#x27;cost&#x27; of a string
	let cost = 0;

	if(args.input) {
		cost = args.input.length * 1000;
	}

	return {% raw %}{ cost:cost }{% endraw %};

}
</code></pre>

Alright, so let's put this together in a composition:

<pre><code class="language-javascript">composer.sequence(
	&#x27;safeToDelete&#x2F;newname&#x27;,
	args =&gt; ({% raw %}{input: args.name.toUpperCase()}{% endraw %}),
	&#x27;safeToDelete&#x2F;stringcost&#x27;
);
</code></pre>

You can see the inline function simply takes the output from the first action and uppercases it. To test this, I created the composition like so:

	fsh app create fshlogtest app.js --log-all

I then ran it:

	fsh app invoke fshlogtest --param title Lordy

which gave me a result of 9000. Not that it matters, we just want to see the logging. I fired that up with:

	fsh session get --last

The first change you'll see is in Trace. It has additional items for the new logging events. In theory you can just ignore these, but don't be surprised when you see them:

![fsh2](https://static.raymondcamden.com/images/2017/12/fshl2.jpg)

I switched to Session Flow and then confirmed the new items now show up. Here is the input:

![Input](https://static.raymondcamden.com/images/2017/12/fshl3.jpg)

and the inline action output:

![Output](https://static.raymondcamden.com/images/2017/12/fshl4.jpg)

Hmm - I could probably make those graphics a bit easier to read. Let me know if you have trouble with em! Anyway, to disable this feature, simply update the composition and do *not* pass in the flag. This will remove the additional logging, and as the CLI says, there is a small performance penalty for adding this.

p.s. Don't forget there is an [OpenWhisk slack](http://slack.openwhisk.org/) and you can join the #composer channel there if you want to talk about IBM Composer.