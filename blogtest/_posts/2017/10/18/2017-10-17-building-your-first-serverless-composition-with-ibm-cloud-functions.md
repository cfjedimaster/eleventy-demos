---
layout: post
title: "Building Your First Serverless Composition with IBM Cloud Functions"
date: "2017-10-18"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/10/18/building-your-first-serverless-composition-with-ibm-cloud-functions
---

A few days ago I [blogged](https://www.raymondcamden.com/2017/10/09/serverless-composition-with-ibm-cloud-functions/) about the new Composer functionality for IBM Cloud Functions and OpenWhisk. This is a *incredibly* cool release and I'm going to try my best to demonstrate it over the next few weeks. In today's post I'm going to focus on what the process is like. By that I mean, how do I go from idea to actually using it and testing it. This won't be terribly different from the [docs](https://github.com/ibm-functions/composer/tree/master/docs), but I figure it may still be helpful for folks to get an idea of how I'm using it. (And of course, I expect my usage to change over time.) Note that the code I'll be using for this post will be trivial to the max because I want to focus more on the process than the actual demo. Alright, with that out of the way, let's start.

The Demo
===

As I said, the demo is pretty trivial, but let's cover it anyway so we have context for what's being built. The demo will convert a random Ferangi [Rule of Acquisition](http://memory-alpha.wikia.com/wiki/Rules_of_Acquisition) into [pig latin](https://en.wikipedia.org/wiki/Pig_Latin). So the logic is:

* Select a random rule
* Take the text and convert it to pig latin.

Building a Serverless Application - Old Way
===

I'll start off by describing what the process would be prior to the introduction of Composer. To be clear, "old way" isn't meant to be disparaging in anyway. OpenWhisk has always let me build really cool shit and Composer just makes it even better. 

First, I'll build the "select a random rule" action. Here is the code listing with the embedded *very* long list of rules removed. (You can see the full source code on GitHub - I'll share that link at the end.)

<pre><code class="language-javascript">function main(args) {
	/*
	This is a very, very long string. Not a good idea.

	Source: http://www.ferengirules.com
	*/
	let rules = ["1. Once you have their money, never give it back.", 
	"2. You can't cheat an honest customer, but it never hurts to try.", 
	"3. Never spend more for an acquisition than you have to.", 
	"4. Sex and profit are the two things that never last long enough.", 
	"5. If you can't break a contract, bend it.", 
	"6. Never let family stand in the way of opportunity."]

	let chosen = rules[Math.floor(Math.random() * rules.length)];

	return {
		rule:chosen
	};

}
</code></pre>

I created this as an action called safeToDelete/rule. (As a reminder, I use a package called "safeToDelete" to store actions I build for blog posts and the such that do *not* need to stay alive.) 

	wsk action create safeToDelete/rule rules.js

I then tested to ensure it worked:

	wsk action invoke safeToDelete/rule -b -r

And the result is:

<pre><code class="language-javascript">{
"rule": "72. Never let the competition know, what you're thinking."
}     
</code></pre>

Next I created a Pig Latin rule, based on [this repo](https://github.com/montanaflynn/piglatin) from GitHub user montanaflynn:

<pre><code class="language-javascript"> // source: https://github.com/montanaflynn/piglatin
 function piglatin(text) {
  var words = text.split(/\W+/)
  var piggish = ""
  for (var i = 0; i &lt; words.length; i++) {
    var word = words[i]
    var firstLetter = word.charAt(0)
    if (word.length &gt; 2) {
      piggish = piggish + word.substring(1) + firstLetter + "ay "
    } else {
      piggish = piggish + word + " "
    }
  }
  return piggish.toLowerCase().trim();
}

function main(args) {
	let result = piglatin(args.input);
	return {% raw %}{ result:result}{% endraw %};
}
</code></pre>

I then pushed it up:

	wsk action create safeToDelete/pig pig.js

And tested:

	 wsk action invoke safeToDelete/pig -b -r -p input "My name is Ray"

With this result:

<pre><code class="language-javascript">{
    "result": "my amenay is ayray"
}
</code></pre>

Alrighty. So to make the sequence, I have a problem. The output of the rule action is a variable named `rule`. The input for pig requires a parameter called `input`. In order to create a sequence, I'll need a "joiner" action. Here's the one I built:

<pre><code class="language-javascript">function main(args) {

	//remove 1.
	let text = args.rule.replace(/[0-9]+\. /,'');

	return {
		input:text
	}

}
</code></pre>

Note that actually this does two things. It maps the input as well as modifying the text to remove the number in front of the rule. I pushed this to OpenWhisk like so:

	wsk action create safeToDelete/pigrule pigrule.js

Alright, so the final step is to create the sequence:

	 wsk action create --sequence safeToDelete/ruleToPig safeToDelete/rule,safeToDelete/pigrule,safeToDelete/pig --web true

That's a long command but not too bad. Typically I'd make a shell/bat script so I could automate updating each individual rule and the sequence all in one quick call. I'll grab the URL like so:

	 wsk action get safeToDelete/ruleToPig --url

Which gives me: https://openwhisk.ng.bluemix.net/api/v1/web/rcamden{% raw %}%40us.ibm.com_My%{% endraw %}20Space/safeToDelete/ruleToPig

To test that, just add .json to the end. You can see that [here](https://openwhisk.ng.bluemix.net/api/v1/web/rcamden{% raw %}%40us.ibm.com_My%{% endraw %}20Space/safeToDelete/ruleToPig.json).

And finally, a sample result:

<pre><code class="language-javascript">{
result: "evernay ivegay wayaay orfay reefay hatway ancay be oldsay"
}
</code></pre>

I'll be honest, that's plain unreadable, but who cares. Let's move on.

Building a Serverless Application - With Composer
===

Alright, so I'm assuming you've followed the [install instructions](https://github.com/ibm-functions/composer/tree/master/docs#installing-the-shell) already and can safely run `fsh` in your terminal. 

The first thing you'll run into is that Composer uses slightly different terminology. Instead of sequences, you'll create an app. To be fair, it isn't a 100% one to one correlation, but I think for now it's ok to mentally map the two.

Next - you'll define your app in code, in a file. (You can use the graphical shell too but I don't.) So to start, I'll make a new file called - pigruleapp.js. 

This file will contain the instructions that make up my composition. Here's what I started with:

<pre><code class="language-javascript">composer.sequence(
	'safeToDelete/rule',
	'safeToDelete/pigrule',
	'safeToDelete/pig'
);
</code></pre>

Notice I don't define composer. I don't have to as the system will handle that for me. All I do is define my logic. In this case, I'm using the `sequence` feature of composer and defining what to run. Essentially I've defined the exact same sequence I used before. (I'm going to make that better in a moment.) 

To create the app, I'll use:

	fsh app create ruleToPigFsh ./pigruleapp.js

If I have to make any edits, I'd use `fsp app update` instead. Next I'll test it with:

	fsh app invoke ruleToPigFsh

And - it works as expected:

<pre><code class="language-javascript">
{
  result: "evernay etlay a emalefay in lothescay loudcay ouryay ensesay of rofitpay"
}
</code></pre>

Alright, but let's kick it up a notch. First, I can visualize my app like so:

	fsh app preview pigruleapp.js

Which gives me this:

![Screen shot](https://static.raymondcamden.com/images/2017/10/fsh1.jpg)

You can ignore the "not yet deployed" message on top. Basically the shell is letting you know you are viewing a local file and not a deployed app instance. So yes it *is* technically deployed. Anyway, what's not visible in the screen shot is that you can mouse over the blue boxes to get details. So for example, mousing over `rule` shows me `action | safeToDelete\rule`. You can also double click an item to see the source code. This is handy in case you forget:

![Screen shot](https://static.raymondcamden.com/images/2017/10/fsh2.jpg)

The JSON view is simply how Composer converts your code into JSON format. Here's what it did with my code:

<pre><code class="language-javascript">{
    "Entry": "action_0",
    "States": {
        "action_0": {
            "Type": "Task",
            "Action": "safeToDelete/rule",
            "Next": "action_1"
        },
        "action_1": {
            "Type": "Task",
            "Action": "safeToDelete/pigrule",
            "Next": "action_2"
        },
        "action_2": {
            "Type": "Task",
            "Action": "safeToDelete/pig"
        }
    },
    "Exit": "action_2"
}
</code></pre>

And the Code view is simply my file. 

Another change that may confuse you are sessions. Instead of an activation, invoking a Composer app creates a session. So you can use `fsh session list` to see your recent tests. Or my favorite, grab the last one with: `fsh session get --last`. 

![Screen shot](https://static.raymondcamden.com/images/2017/10/fsh3.jpg)

I freaking *love* this view. Do note though that the time for this test (21.5 seconds) was a fluke. There's still some performance tuning going on so this is absolutely *not* what you would expect normally. The details here are awesome and so easily readable. Here's the trace:

![Screen shot](https://static.raymondcamden.com/images/2017/10/fsh4.jpg)

I love how I can see the timings of every step. I'll remind you again - the totals here are a fluke, not the norm, but you can really see how handy this would be to identify the "pain points" of your applications. 

The raw tab looks a lot like an activation report:

<pre><code class="language-javascript">{
    "duration": 21525,
    "name": "ruleToPigFsh",
    "subject": "rcamden@us.ibm.com",
    "activationId": "0f941893b60a4331941893b60a633167",
    "publish": false,
    "annotations": [{
            "key": "limits",
            "value": {
                "timeout": 60000,
                "memory": 256,
                "logs": 10
            }
        },
        {
            "key": "path",
            "value": "rcamden@us.ibm.com_My Space/ruleToPigFsh"
        }
    ],
    "version": "0.0.65",
    "response": {
        "result": {
            "result": "aithfay ovesmay ountainsmay of nventoryiay"
        },
        "success": true,
        "status": "success"
    },
    "end": 1508339185192,
    "logs": [
        "0f941893b60a4331941893b60a633167",
        "b44c2a1e9f4842408c2a1e9f48924084",
        "fbd917d800ab4be69917d800ab6be6b8",
        "0210c42b372242a090c42b372262a018",
        "4ccd2c65559e410a8d2c65559e410a40",
        "8504691d89f04df084691d89f0bdf072",
        "42f3b1096f9d40edb3b1096f9da0ed53"
    ],
    "start": 1508339163667,
    "namespace": "rcamden@us.ibm.com_My Space",
    "originalActivationId": "42f3b1096f9d40edb3b1096f9da0ed53",
    "prettyType": "session"
}
</code></pre>

Session Flow is where things get even more interesting. It's basically the same flow chart as you saw in the preview above, but check out what you get on mouse over: 

![Screen shot](https://static.raymondcamden.com/images/2017/10/fsh5.jpg)

In case it is a bit hard to read, you are seeing the output of the action. So this gives you the ability to trace the flow of data and help debug where things could have gone wrong. Also note you can click the green bubble for a more clear result. For example, if I clicked the green "rule" box I can see the output from the first item in the sequence:

![Screen shot](https://static.raymondcamden.com/images/2017/10/fsh6.jpg)

It's a bit hard to demonstrate in still pictures, but the thing is - I can really dig into my invocation and see how things worked. This was all possible before, of course, but was definitely much more manual. 

I love this. No, really, I love this *a lot*. 

![Not a screen shot](https://static.raymondcamden.com/images/2017/10/fsh7.jpg)

Make It Better!
===

Let's really improve things though by getting rid of that simple "joiner" action. This is the new app I built (called pigruleapp2.js):

<pre><code class="language-javascript">composer.sequence(
	'safeToDelete/rule',
	args => ({% raw %}{input: args.rule.replace(/[0-9]+\. /,'')}{% endraw %}),
	'safeToDelete/pig'
);
</code></pre>

All I've done is replace that middle action with an inline function. I then pushed it up like so:

	fsh app create ruleToPigFsh2 pigruleapp2.js

When invoked, it runs the exact same, but now my setup is one action smaller, which is a good thing in my opinion. 

In case your curious, this is how the preview changes:

![Screen shot](https://static.raymondcamden.com/images/2017/10/fsh8.jpg)

One last note. The CLI currently does not tell you how to get the URL for your app. That's been logged as an issue. You can do so with the `webbify` command:

	fsh webbify ruleToPigFsh2

Which spits out the URL: https://openwhisk.ng.bluemix.net/api/v1/web/rcamden@us.ibm.com_My%20Space/default/ruleToPigFsh2.json

And you can click that link to test it yourself. 

Wrap Up
===

So I hope this made sense, and if not, just leave me a comment below. I'll remind folks that the `fsh` CLI does *not* currently work in WSL (Windows Subsystem for Linux) so if you are Windows, switch to Powershell when using it. You can find the source code used for this demo here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/fshruledemo