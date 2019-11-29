---
layout: post
title: "Serverless Composition with IBM Cloud Functions"
date: "2017-10-09T13:44:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/10/09/serverless-composition-with-ibm-cloud-functions
---

Today IBM [announced](https://ibm.biz/serverless-research) a very important update to IBM Cloud Functions and OpenWhisk. This is a pretty huge update and is incredibly important for folks doing serverless with OpenWhisk on the IBM Cloud platform. I'm going to do my best to explain what these updates are and why I'm excited about them. As I said, this is a big update. So today I just want to give you my take on things and later on, I've got a set of examples to share that may help make things easier to understand. 

First and foremost - I want to be clear that this new feature is for IBM Cloud Functions, ie, OpenWhisk on IBM's platform. That's where I do all of my testing and playing around, but OpenWhisk has always been something you can run completely on your own. It's open source. It's free. You don't have to be involved with IBM at all. Obviously I think there's benefit to running it on our platform, and today's announcement is one example of that. 

There are two new things announced today, but let's begin with the important one - <strong>compositions</strong>. Composer is a new way to construct serverless applications with multiple steps and complex logic. Previously, developers could chain together actions in sequences. (See my posts on the subject [here](https://www.raymondcamden.com/2017/01/06/an-example-of-an-openwhisk-sequence/) and [here](https://www.raymondcamden.com/2017/04/07/from-actions-to-sequences-to-services/)). This worked well but had certain restrictions. For example, if you connected action A and action B, you had to ensure that the output of A matched the expected input of B. One simple way of doing that was creating a "joiner" action that literally just changed one set of data to another. That was simple to do, but did leave you with actions that were maybe just one or two lines of code.

Another issue you ran into were cases where data had to wrap "around" an action. Imagine a sequence of A, B, and C. A outputs a few values that B doesn't care about. How do you get that output to C without adding code to B? OpenWhisk has a package of combinators that helps with that (see this [post](https://www.raymondcamden.com/2017/08/05/working-with-the-forwarder-action-in-openwhisk/)) but they were (at least imo) a bit complex to use.

Composer provides a solution to both these problems. It allows you to define, programatically, both the flow of your serverless application as well as some of the logic. So for example, I don't need to write a short action just to map data from one action to another. I can define it in the composer. I can also do multiple different types of branching logic as well data "lifting" around actions all within my composition. 

Another cool use of this is simply "leaving" a sequence of actions early. When I built [Serverless Superman](https://www.raymondcamden.com/2017/05/19/building-the-serverless-superman/), one of the issues I ran into was that there wasn't a nice way to simply exit the sequence when I didn't have a tweet to publish. So I ended up exiting with an error. Now when I examine my stats, this particular sequence has a high, but invalid, rate of errors. 

I have to admit - your first few attempts with this will be a bit difficult at first. At least for me, it took me a few tries to wrap my head around how things work. But the more I use it, the more I love it. As I've begun to build more complex applications, Composer is *exactly* the tool I want to use. 

So what does it look like? Consider a simple sequence of two actions. The first, simply capitalizes text:

<pre><code class="language-javascript">function main(args) {	
	return {% raw %}{output:args.input.toUpperCase()}{% endraw %};
}
</code></pre>

The next action reverses text:

<pre><code class="language-javascript">function main(args) {
	return {% raw %}{output:args.input.split('').reverse().join('')}{% endraw %};
}
</code></pre>

If I wanted to join these two in a sequence, I'd have to map the result of the first one (output) to a new name, input, like so:

<pre><code class="language-javascript">function main(args) {
	return {% raw %}{ input:args.output}{% endraw %};
}
</code></pre>

That's not the end of the world, and it's easy to do, but let's consider this:

<pre><code class="language-javascript">composer.sequence(
	'fsh1/reverse',
	args =&gt; ({% raw %}{input: args.output}{% endraw %}),
	'fsh1/cap'
);
</code></pre>

This is a Composer script. You will use a new tool (more on that in a moment) to push this to IBM and create a new application. The `sequence` command works like a regular OpenWhisk sequence and can have any number of items inside. But notice the second one. That's a simple inline function that handles mapping output to input. No more "joiner" sequence!

The `composer` object has multiple methods supporting different types of logic. Here is a simple example of an "If" condition.

<pre><code class="language-javascript">composer.sequence(
	'fsh1/random',
	composer.if(({% raw %}{chosen}{% endraw %})=&gt; chosen &gt; 5, 'fsh1/decorateResult')
);
</code></pre>

In the composition above, the first action returns a random number, and the second part of the sequence, the IF, will only run when the output is over 5. 

You can read more about the different types of compositions at the [docs](https://github.com/ibm-functions/composer/tree/master/docs) and they have multiple examples as well. (And again, I plan on sharing some examples over the next few weeks.) 

Now I want to discuss the other part of the update, and this also is pretty freaking cool, even if you're just doing simple actions. In order to use Composer, you have to install a new CLI. Now - I have to say right away. That ticked me off. Like - seriously - why would I want to use two CLIs to work with OpenWhisk? I was wrong. Yes, it was something new to learn, but damn, *damn* is this new tool helpful.

The new tool is fsh, or as the docs say, "the functions programming shell for the IBM Cloud". But yeah, let's just call it fsh. This isn't new technically, it was released before, but today it was updated in a pretty signifcant way. 

The boring part is that the CLI will let you deploy your compositions and run them. Boring, but it works. The cool part is that fsh also provides a graphical shell. Now - again - when I first saw this I didn't like it either. (Have I ever told you that I'm prone to rushed, snapped judgments?) But the more I dug into the more I really, really dug it.

Now first off - be aware that the graphical shell is *not* supported in WSL (Windows Subsystem for Linux). That's a bummer and a known bug (no need to report it), so for now you'll need to use Powershell or cmd.exe if you are on Windows. Also note that you will need to install the Bluemix CLI (bx) if you haven't done that already.

<strong>Quick note that you may have some issues with the bx command line and login. If you do - just ask. If you don't - then don't worry about it. ;)</strong>

So what does the shell provide? First, it can graphically map your compositions.

![Shot](https://static.raymondcamden.com/images/2017/10/composer1.png)

Ok, that's cool, and it can handle more complex compositions are well. This can be real handy while your mapping out complex logic. 

But... outside of compositions, the graphical shell has some kick ass reporting of your OpenWhisk stuff in general. So for example, here is the table report.

![Shot](https://static.raymondcamden.com/images/2017/10/composer2a.png)

It may be a bit hard to read, but that red line there with the high error count? That's my Serverless Superman one. I'm going to fix that with compositions (and I'll blog that process!). Clicking into it gives me more details:

![Shot](https://static.raymondcamden.com/images/2017/10/composer3.png)

And clicking yet again, on an error for example, shows me information about the failure:

![Shot](https://static.raymondcamden.com/images/2017/10/composer4.png)

I cannot tell you how happy this makes me. I mean - this was all possible before via the CLI - but the ease of use of this tool in finding stuff like this is awesome.

And there's more - you can easily view past executions and even trace the output from each part of the composition. Really - I can't describe how useful this tool has been and it's still being expanded. As I said above, even if none of the fancy "Composer" aspects seem useful to you - you need to get the fsh tool installed just for the help in regular debugging.

So - check it out today at https://github.com/ibm-functions/composer and let me know what you think!