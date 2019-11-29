---
layout: post
title: "Building a Twitter bot to display random comic book covers"
date: "2016-02-22T10:42:00-07:00"
categories: [development,javascript]
tags: []
banner_image: /images/banners/comicbooks.jpg
permalink: /2016/02/22/building-a-twitter-bot-to-display-random-comic-book-covers
---

A bit over two years ago I played around with the (then) recently released [Marvel API](http://developer.marvel.com/) to build some [cool demos](http://www.raymondcamden.com/2014/02/02/Examples-of-the-Marvel-API/). The end result of that experiment was a simple web app that randomly displayed a Marvel comic book cover every minute: 
[http://marvel.raymondcamden.com/](http://marvel.raymondcamden.com/).

This weekend I was thinking about a few Twitter accounts I follow that just post random pictures. (I'll share a list of them at the end.) I like these accounts because they're easy to ignore, provide something simple and cool to my feed, and are just a random piece of coolness during the day. I thought it might be kind of fun to build a similar mechanism for comic books (well, Marvel comics, I need to see if DC has an API). 

In theory - all I needed to do was:

* Create a way to select a random cover (which was already done - by me)
* Create a way to Tweet (there's probably a npm library for that - yep - there is)
* Create a schedule (there's probably a npm library for that too - yep - there is)

It ended up being *very* quick to develop - maybe two hours total. Here is the complete source of the main script file. (Note, the entire thing is up on GitHub - the link will be at the bottom.

<pre><code class="language-javascript">
&#x2F;*eslint-env node*&#x2F;

var request = require(&#x27;request&#x27;);

var express = require(&#x27;express&#x27;);

var credentials = require(&#x27;.&#x2F;credentials.json&#x27;);

var Twitter = require(&#x27;twitter&#x27;);
var client = new Twitter(credentials.twitter);

var marvel = require(&#x27;.&#x2F;marvel&#x27;);
marvel.setCredentials(credentials.marvel.private_key, credentials.marvel.api_key);

&#x2F;&#x2F; cfenv provides access to your Cloud Foundry environment
&#x2F;&#x2F; for more info, see: https:&#x2F;&#x2F;www.npmjs.com&#x2F;package&#x2F;cfenv
var cfenv = require(&#x27;cfenv&#x27;);

var app = express();

app.use(express.static(__dirname + &#x27;&#x2F;public&#x27;));

&#x2F;&#x2F; get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

&#x2F;&#x2F; start server on the specified port and binding host
app.listen(appEnv.port, &#x27;0.0.0.0&#x27;, function() {

	&#x2F;&#x2F; print a message when the server starts listening
	console.log(&quot;server starting on &quot; + appEnv.url);
});

var MONTHS = [&#x27;January&#x27;, &#x27;February&#x27;, &#x27;March&#x27;, &#x27;April&#x27;, &#x27;May&#x27;, &#x27;June&#x27;, &#x27;July&#x27;, &#x27;August&#x27;, &#x27;September&#x27;, &#x27;October&#x27;, &#x27;November&#x27;, &#x27;December&#x27;];

function tweetRandomCover() {
	console.log(&#x27;First, we get a random cover.&#x27;);

	marvel.getCover(function(res) {
		console.log(&#x27;back from mavel&#x27;);
		console.dir(res);
		var tweet = res.title + &#x27; published &#x27;+(MONTHS[res.date.getMonth()])+&#x27; &#x27;+res.date.getFullYear() +&#x27;\n&#x27;+res.link;
		
		console.log(&#x27;Now going to fetch the image link.&#x27;);

		request.get({% raw %}{url:res.url,encoding:null}{% endraw %}, function(err, response, body) {
			if(!err &amp;&amp; response.statusCode === 200) {
				console.log(&#x27;Image copied to RAM&#x27;);

				client.post(&#x27;media&#x2F;upload&#x27;, {% raw %}{media: body}{% endraw %}, function(error, media, response) {

					if(error) {
						console.error(&#x27;Error from media&#x2F;upload: &#x27;+error);
						return;	
					}
					
					&#x2F;&#x2F; If successful, a media object will be returned.
					console.log(&#x27;Image uploaded to Twitter&#x27;);

					var status = {
						status: tweet,
						media_ids: media.media_id_string 
					}

					client.post(&#x27;statuses&#x2F;update&#x27;, status, function(error, tweet, response){
						if (!error) {
							console.log(&#x27;Tweeted ok&#x27;);
						}
					});

				});
						
			}
		});
	});	
}

app.get(&#x27;&#x2F;forceTweet&#x27;, function(req, res) {
	tweetRandomCover();
	res.end(&#x27;Done (not really)&#x27;);
});

var cron = require(&#x27;cron&#x27;);
var cronJob = cron.job(&#x27;0 6,12,18 * * *&#x27;, function() {
	console.log(&#x27;do the cover&#x27;);
	tweetRandomCover();	
	console.log(&#x27;cron job complete&#x27;);
});
cronJob.start();
</code></pre>

Let's break it down bit by bit, focusing on the important parts. To handle the Twitter API, I used the [twitter](https://www.npmjs.com/package/twitter) Node library. As you will see a bit later in the code, it is *incredibly* trivial to use, even when creating Tweets with media attached. 

The Marvel API is just a copy of the code I used before, although I've modified it a bit so I can pass in my credentials. 

The real meat of the code is in `tweetRandomCover`. We begin by asking the Marvel API for a random cover. If you read my [post from two years ago](http://www.raymondcamden.com/2014/02/02/Examples-of-the-Marvel-API/) you'll note that I have to fake that a bit. I essentially select a random month+year and grab everything I can from there - then select an item. 

Once I have the random issue, I use the [request](https://github.com/request/request) library to suck down the binary of the image into a variable. I've heard of this library quite a bit, but I've never actually used it. Big mistake on my part.

Finally - I have to create the tweet. Twitter requires you to upload the media first so it is a two step process. First the image is posted and then the actual Tweet is created. I've got a bit of "Callback Hell" going on here and if this app did *anything* else I'd abstract this logic out of the main script, but since this isn't a web app people will hit, I'm not going to worry about it.

The final aspect is scheduling - which you can see is done via [node-cron](https://github.com/ncb000gt/node-cron). Easy to use - it took me longer to figure out the right cron syntax than it did to implement the code. As you can see, I've selected a schedule that should post tweets three times a day which "feels" right for this kind of account. I may tweak that later.

You can find the complete code (although there's not much else) up on GitHub: [https://github.com/cfjedimaster/randomcomicbook](https://github.com/cfjedimaster/randomcomicbook). I'm hosting the app up on [IBM Bluemix](https://ibm.biz/IBM-Bluemix).

And of course, you can (and should!) follow the Twitter acount: [https://twitter.com/randomcomicbook](https://twitter.com/randomcomicbook)

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Incredible Hulk (1962) #146 published December 1971<a href="https://t.co/3VyfTGup9r">https://t.co/3VyfTGup9r</a> <a href="https://t.co/5jJFJHj58h">pic.twitter.com/5jJFJHj58h</a></p>&mdash; Random Comic Book (@randomcomicbook) <a href="https://twitter.com/randomcomicbook/status/701813244017528833">February 22, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

## PS...

So yeah - about those random Twitter accounts I follow for pictures? Here they are:

* [https://twitter.com/EmrgencyKittens](https://twitter.com/EmrgencyKittens)
* [https://twitter.com/iLove_Aviation](https://twitter.com/iLove_Aviation)
* [https://twitter.com/Aviation4_Life](https://twitter.com/Aviation4_Life)
* [https://twitter.com/ClassicStarWars](https://twitter.com/ClassicStarWars)

I used to follow some related to historical pictures, but they either turned to spam or shared pictures unrelated to history, which to me is a cardinal sin of these types of accounts. (Another example - news organizations that will RT their sports or entertainment accounts. I freaking hate that.)