---
layout: post
title: "Talking to your Bot on OpenWhisk"
date: "2017-01-26T09:45:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: /images/banners/owbot.jpg
permalink: /2017/01/26/talking-to-your-bot-on-openwhisk
---

As I continue my look into serverless with [OpenWhisk](https://developer.ibm.com/openwhisk/), today I thought
I'd build a quick demo around an *incredibly* cool bot service I discovered a while ago called 
[Pandorabots](http://www.pandorabots.com/). I first played with their service last summer, and I thought it was
cool as hell, but I never got around to actually writing up my experience with it. My original exploration of it
was via ColdFusion, but I thought this would be a great example of something I could build even easier (and a heck of a lot quicker)
in OpenWhisk.

Pandorabots provides what it calls ["AIaaS"](https://developer.pandorabots.com/), "AI as a Service". Basically what this boils 
down to is the ability to process natural language input and handle responding intelligently based on rules you create. Their actual service
is pretty simple. You've got APIs to upload scripts for your bots and APIs to 'speak' to your bot, the real complexity comes in at the 
AI level. 

There is *no way* I can adequately explain the full power of their bot service, so instead I'll give you some high level points
to describe what you can do.

* So the simplest, and most direct feature, is to simply say, "If I say hi, respond with Hello!". That's basic string matching and it's not too exiting. But their
service goes beyond this of course.
* You can define various aliases, so I can map hello, bonjour, etc. to the same response.
* It has built in spelling corrections and other fixes, so it will recognize "isn't" as "is not" for example. 
* It can automatically handle multiple sentences, parsing each one and creating a response to everything sent to it.
* It supports both a default ("I have no freaking idea what you said") response as well as the ability to respond randomly. (So if I said hi, it could respond with hello or some other greeting.)
* It can do basic pattern matching, so given I said, "I like cookies", I can train my bot to recognize "I like SOMETHING" and it will correctly pick up "cookies" as the thing I like.
* The bot can have variables with predefined values. So I can define a variable, botname, that defines the name of the bot, but the bot can also remember your name if you tell it and refer to that variable later.
* You can define arrays (called sets) and maps to train your bot to associate words or terms together in one unit.
* And this truly cool - it supports context. What that means is you can recognize that a response is based on a previous question. The examples the docs give is that if I say the word coffee, the bot could respond with "Do you like coffee?". If I say just "yes", my bot can recognize that we're still talking about coffee.

As I said - the logic of your bot can get *really* complex. Pandorabots provides a ["playground"](https://playground.pandorabots.com) if you want to try it out. 
I also suggest looking at the [Quick Start](https://playground.pandorabots.com/en/quickstart/) and then checking out the [tutorial](https://playground.pandorabots.com/en/tutorial/). Unfortunately the 
tutorial is a large slide deck, not a proper 'document', but it's pretty verbose and has lots of great examples. If your curious how the logic scripts look, here
is one sample:

<pre><code class="language-markup">
&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot; ?&gt;
&lt;aiml version=&quot;2.0&quot;&gt;

&lt;category&gt;
&lt;pattern&gt;HI&lt;&#x2F;pattern&gt;
&lt;template&gt;Hello world!&lt;&#x2F;template&gt;
&lt;&#x2F;category&gt;

&lt;&#x2F;aiml&gt;
</code></pre>

Yep, XML-based, but there's nothing wrong with that, right?

So as I said, the AI portion is pretty darn complex, but the API side is incredibly trivial. You can manage your bots via a REST
interface, but since they have a [CLI](https://medium.com/pandorabots-blog/introducing-the-pandorabots-cli-215ed9d637af#.k89f2at61) too, I'd probably just use
that during initial testing. The CLI lets you chat with your bot too and is great for configuring the logic. The API I'll use in this demo is the
[Talk](https://developer.pandorabots.com/docs#!/pandorabots_api_swagger_1_3/talkBot) endpoint. It lets you have a conversation with a bot you've setup. I've
used a sample robot they provide on GitHub called [Rosie](https://github.com/pandorabots/rosie). It's got a deep set of conversation files so I don't have to worry
about writing that myself. I named my [Allura](http://voltron.wikia.com/wiki/Princess_Allura_(DotU)) though. (Bonus points if you get the reference without clicking the link.)

The Talk endpoint simply has me hitting: <code>https://aiaas.pandorabots.com/talk/APP_ID/BOTNAME?user_key=USER_KEY&input=INPUT</code>. You can also append
a <code>sessionid</code> value that represents a talk 'session'. When you send data to the bot, it returns a sessionid value automatically, but you need to pick that
up and send it back. 

Let's start with a simple OpenWhisk action.

<pre><code class="language-javascript">
var request = require(&#x27;request&#x27;);

var bot = &#x27;allura&#x27;
var appid = &#x27;myappid&#x27;;
var userkey = &#x27;mykey&#x27;;

function main(args) {

    return new Promise(function(resolve, reject) {

        let url = `https:&#x2F;&#x2F;aiaas.pandorabots.com&#x2F;talk&#x2F;${% raw %}{appid}{% endraw %}&#x2F;${% raw %}{bot}{% endraw %}&#x2F;?user_key=${% raw %}{userkey}{% endraw %}`;
        
		url += &#x27;&amp;input=&#x27;+encodeURIComponent(args.input);
		if(args.session) url += &#x27;&amp;sessionid=&#x27;+encodeURIComponent(args.session);

		console.log(&#x27;url&#x27;, url);

        request.post(url, function(error, response, body) {
            if(error) return reject(error);
			resolve({% raw %}{result:JSON.parse(body)}{% endraw %});
        });

    });
}

exports.main = main;
</code></pre>

I said it was simple, right? All I do is pass my various keys, the input, and a session value if it was passed in. Here's an example of me running
the action locally:

![Initial Conversation](https://static.raymondcamden.com/images/2017/1/bot1.png)

The next step then is to add a REST interface to this action:

![API THIS DARN THING!](https://static.raymondcamden.com/images/2017/1/bot2.png)

And I'm good to go! First, let's try talking to it with no input:

![No input](https://static.raymondcamden.com/images/2017/1/bot3.png)

Woot! It works. Than let's try something sassy, like, "My milkshake is better than yours":

![WTF](https://static.raymondcamden.com/images/2017/1/bot4.png)

What the you know what. I wasn't expecting that. Remember, I used a default bot that had logic already. Apparently it recognized the input. So yeah, let's follow up with this:

![Response](https://static.raymondcamden.com/images/2017/1/bot5.png)

I think I love this bot. Honestly.

And that's it! Of course I could build the front end, and I will if people ask, but Pandorabots only has a free tier for ten days, so I'm taking down the REST endpoint
now and setting a calendar reminder to close down my account. &lt;rant&gt;Which, btw, I think kinda sucks. I mean I totally understand charging for a service, especially a cool service
like this, but I hate that I can't simply 'fall back' to a restricted account. I've got to actually close my account which means if I want to play with this
more in a month's time, I've got to sign up. Again. And close my account. Again.&lt;/rant&gt;