---
layout: post
title: "Working with OpenWhisk Triggers"
date: "2017-02-02T15:03:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: /images/banners/openwhisk_triggers.jpg
permalink: /2017/02/02/working-with-openwhisk-triggers
---

Today I'm covering one of the last major features of OpenWhisk, Triggers. To be clear, there is a lot more
to OpenWhisk than I've covered on my blog, but in terms of "usage features", this is one of the last ones
I've needed to tackle. This was also the feature that was the most difficult to wrap my head around. It isn't
that the docs are bad ([Creating Triggers and Rules](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_triggers_rules.html)), it's just
that I struggled to understand how all the parts come together. I finally got things working today (with a lot of help!) and I thought
I'd share my thoughts, and a demo, but please remember I'm new at this!

Before I begin, I want to thank folks in the [OpenWhisk Slack](https://openwhisk-team.slack.com) (sign up here: http://slack.openwhisk.org) for helping me out, especially fellow IBMer
Justin Berstler.

Ok, so what in the heck is a trigger? A trigger is an event of some sort. 

So far so good.

In OpenWhisk, triggers have a name, and that's it - no code or anything else is associated with them. You create
a trigger like so:

<pre><code class="language-javascript">wsk trigger create ANameHere
</code></pre>

Once you have that, you can then list triggers:

<pre><code class="language-javascript">wsk trigger list
</code></pre>

And manually fire a trigger:

<pre><code class="language-javascript">wsk trigger fire ANameHere
</code></pre>

Like actions, triggers can contain parameters, and you pass them just like you would to an action:

<pre><code class="language-javascript">wsk trigger fire ANameHere --param somename somevalue
</code></pre>

By themselves, triggers do nothing. To actually have a trigger have some meaning in life, you associate them with an action. You do that by defining a rule. A rule
creates a one to one association between a trigger and an action.

<pre><code class="language-javascript">wsk rule create NameOfRule NameOfTrigger NameOfAction
</code></pre>

You can list them too of course. This is where things get interesting. While a rule is just a one to one association, you can have as many 
rules as you want, all using one trigger. 

Cool, right? So this is where I began to get a bit fuzzy. The OpenWhisk folks created some Triggers you can use with Bluemix and GitHub. 
You can read more about them in [their docs](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_catalog.html). But I was more interested in
something the trigger docs allude to but don't actually show working - listening for new tweets. 

The docs use an imagined trigger called newTweet and of course, I actually wanted to see if one could be built. This is how I got it working. (And again, I thank the folks in the
Slack channel!) 

First, I needed a way to know when a new tweet was created. Turns out, [IFTTT](https://ifttt.com) has a recipe for that. Unfortunately, 
you can only use it to email when a new tweet is created by a user. Then I was pointed to their new Maker service. This lets you do a variety of things
based on an particular recipe, including making a HTTP call. 

This is when I was told that you can trigger any URL via a REST API. This is documented [here](https://github.com/openwhisk/openwhisk/blob/master/docs/reference.md#rest-api) and it's
something I had not noticed before. The general URL to run a trigger is to send a POST to:

<pre><code class="language-javascript">https://{% raw %}{BASE URL}{% endraw %}/api/v1/namespaces/{% raw %}{namespace}{% endraw %}/triggers/{% raw %}{triggerName}{% endraw %}
</code></pre>

<code>{% raw %}{BASE_URL}{% endraw %}</code> should be <code>openwhisk.ng.bluemix.net</code> and 
<code>{% raw %}{namespace}{% endraw %}</code> can be <code>\_</code> to use your default
space. Authentication is tricky. You do <strong>not</strong> use your Bluemix login. Rather you use the authentication credentials
created when you first started using the OpenWhisk CLI. 

If you go to your user directory and open the <code>.wskprops</code> file, you'll see an <code>AUTH</code> setting
that includes your username and password. You can also get it easier by doing <code>wsk property get</code>. Here is an example of that:

![My auth - hidden...](https://static.raymondcamden.com/images/2017/2/owt1.png)

Ok, so I made a trigger called newTweet, which means I could then execute that trigger by going here with a POST:

https://secret:password@openwhisk.ng.bluemix.net/api/v1/namespaces/_/triggers/newTweet

Here is how my IFTTT recipe looks - I had to break it up in a couple of screen shots because their UI
is pretty tall. 

![Part one](https://static.raymondcamden.com/images/2017/2/owt2.png)

The first portion is simply the text description of the recipe and the user (me) to monitor.

![Part two](https://static.raymondcamden.com/images/2017/2/owt3.png)

This is the Maker part - it's basically my URL. 

![Part three](https://static.raymondcamden.com/images/2017/2/owt4.png)

This part is crucial. First, you need to make a POST to your trigger and you need to use the right content type. The actual
data needs to be a JSON packet and you can see there I've defined a key called tweet and included the text. I can put more data
in there, like the time the tweet was created, and since this recipe runs once an hour or so, that may be crucial to add. For now though I kept it at that.

Let's pause a bit and define what we've done.

* I made a trigger called newTweet. Literally that's all I did, it's just a name. 
* Because triggers have a URL, I know how to activate via the web.
* I used IFTTT to say, "When @raymondcamden tweets, hit this URL."
* OpenWhisk will take the data and for now, do nothing with it. Remember, a trigger by itself is like a poor little kitty without a home. 

At this point I started testing. You can retrieve activation info via the CLI, but I used the UI (something I'll be
covering in more detail next week) to see when/if my trigger fired. To test, I tweeted, and then forced my recipe to 
run in IFTTT. I then refreshed the OpenWhisk monitor, and BOOM! There it was:

![omg omg omg](https://static.raymondcamden.com/images/2017/2/owt5.png)

I cannot describe how excited I was by this. Seriously - I was. 

So to make this actually *do* something, I needed a rule to connect this to an action. A few days back
I [blogged](https://www.raymondcamden.com/2017/01/25/building-a-form-handler-service-in-openwhisk) an example of
using SendGrid with OpenWhisk. I made a new action that would simply email me the tweet data:

<pre><code class="language-javascript">
&#x2F;&#x2F;SendGrid API Key
var SG_KEY = &#x27;nobodyreadsmyfunnykeyjokes&#x27;;

var helper = require(&#x27;sendgrid&#x27;).mail;

function main(args) {

	let from_email = new helper.Email(&#x27;raymondcamden@gmail.com&#x27;);
	let to_email = new helper.Email(&#x27;raymondcamden@gmail.com&#x27;);

	let subject = &#x27;New Tweet&#x27;;

	let date = new Date();
	let content = `
New Tweet from @raymondcamden at ${% raw %}{date}{% endraw %}
--------------------------------

${% raw %}{args.tweet}{% endraw %}
`;


	let mailContent = new helper.Content(&#x27;text&#x2F;plain&#x27;, content);
	let mail = new helper.Mail(from_email, subject, to_email, mailContent);
	let sg = require(&#x27;sendgrid&#x27;)(SG_KEY);

	return new Promise( (resolve, reject) =&gt; {

		var request = sg.emptyRequest({
			method: &#x27;POST&#x27;,
			path: &#x27;&#x2F;v3&#x2F;mail&#x2F;send&#x27;,
			body: mail.toJSON()
		});
		
		sg.API(request, function(error, response) {
			if(error) {
				console.log(error.response.body);
				reject({% raw %}{error:error.message}{% endraw %}) 
			} else {
				console.log(response.statusCode);
				console.log(response.body);
				console.log(response.headers);
				resolve({% raw %}{result:&#x27;Ok&#x27;}{% endraw %});
			}
		});

	});

}

exports.main = main;
</code></pre>

That's not too exciting, but you get the idea. I called this action <code>mailfortweet</code>.
I then made the rule: <code>wsk rule create newTweetRule newTweet mailfortweet</code>. This then associated the trigger with my mail action. Did it work?

![HELL YEAH IT WORKED](https://static.raymondcamden.com/images/2017/2/owt6.png )

Heck yeah it worked!

So as I said in the beginning - I'm only now coming to an understanding of how this stuff works. Also, to be clear, 
if I really only planned to have ONE thing happen on a new tweet, I could have just used the REST API for my action. 
But what's nice is that we've got multiple ways of doing things in OpenWhisk supporting multiple different
use cases, and options are always good!