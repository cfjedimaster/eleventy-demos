---
layout: post
title: "Calling Multiple Serverless Actions and Retaining Values with IBM Composer"
date: "2017-10-25T10:01:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/10/25/calling-multiple-serverless-actions-and-retaining-values-with-ibm-composer
---

Forgive the incredibly long title, but I wasn't quite happy with the shorter versions. As I've mentioned before, [IBM Composer](https://github.com/ibm-functions/composer/tree/master/docs) supports multiple different "compositions", or "logic doohickies" (I work for IBM Marketing, honest), as a way to add conditional logic and branching to a serverless application. In this post, I'm going to share an example of the ["Retain"](https://github.com/ibm-functions/composer/blob/master/docs/COMPOSER.md#composerretaintask-flag) composition.

Before I start though, I want to give a shout out to [Olivier Tardieu](http://researcher.ibm.com/researcher/view.php?person=us-tardieu). He basically wrote the composition for me and helped me wrap my head around the topic. Thanks Olivier!

Ok, so what does Retain do? The docs explain it like so:

<blockquote>
composer.retain(task[, flag]) runs task on the input parameter object producing an object with two fields params and result such that params is the input parameter object of the composition and result is the output parameter object of task.
</blockquote>

For the most part that should be self-explanatory, but you may not know why you need this. Imagine the following sequence:

* Grab a keyword from a persistence system.
* Search twitter for that keyword.
* Email the results, *and* the keyword, to a user.

The crucial bit is in the last part. The keyword was used as input to the second part of the sequence. But if the Twitter action doesn't return the input that was sent to it, then how would you use it later in the sequence?

Retain basically says - run this crap and at the end, combine the result (`result`) with the input (`params`). 

For my demo, I had a somewhat more complex situation. I wanted to call two Watson services - in fact the two I [blogged](https://www.raymondcamden.com/2017/10/24/ibm-watson-openwhisk-actions/) about yesterday, Watson [Tone Analyzer](https://www.ibm.com/watson/developercloud/tone-analyzer.html) and Watson [Personality Insights](https://www.ibm.com/watson/services/personality-insights/). For both services I'd use the same textual input. So how would I do that?

One solution would be to enable a web action for both. I could then call both URLs in client-side code and simply use Promises to wait for them to both to complete. (If you don't know promises yet and want to see an example of that, just ask in the comments below!) 

While that would work, it would mean two different network calls.

I could use a "traditional" OpenWhisk sequence, but right away I run into the issue of loosing results. I don't even care about the input, but if my sequence is:

* run tone analyzer
* run personality insights

Then the second step's input is the output of the first one. That totally won't work. Luckily a composition using retain lets us do that. Here's the complete solution (with the assumption of course that the actions were already written):

<pre><code class="language-javascript">composer.sequence(
	composer.retain('watson/tone'), 
	composer.retain(
		composer.sequence(p => p.params, 'watson/pi')
	),
	p => ({% raw %}{pi:p.result, tone:p.params.result}{% endraw %})
);
</code></pre>

That's a bit complex, but essentially I've got a call to watson/tone where I'm sure to preserve the input. Then a call to watson/pi where I first take the result of the previous action and pass in p.params as the input. The previous action in this case was the retain call and it stored input in p.params.

Finally I combine into a new result with keyed names so it's easier to tell the tone analyzer result from the personality insights result.

Yeah, that's a mouthful, and to be honest, I couldn't have written this myself. It does make sense (mostly ;) to me now and it does work. I won't share the output as it's huge, but once I created it, it was a simple matter of using the `fsh` CLI to invoke the app. 

In case it helps, here's the visualization of the app:

![App preview](https://static.raymondcamden.com/images/2017/10/fshretain.png)

You can see the source code and sample output up on GitHub: https://github.com/cfjedimaster/Serverless-Examples/tree/master/retain