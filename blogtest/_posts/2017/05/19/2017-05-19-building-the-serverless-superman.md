---
layout: post
title: "Building the Serverless Superman"
date: "2017-05-19T14:30:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: /images/banners/serverless_superman.jpg
permalink: /2017/05/19/building-the-serverless-superman
---

So yes - I built something stupid again. Recently I discovered the awesomeness that is [@Big Data Batman](https://twitter.com/bigdatabatman). This is a twitter account that simply copies tweets with "Big Data" in them and replaces it with "Batman." It works as well as you may think - either lame or incredibly funny. (At least to me.) Here are a few choice samples.

<blockquote class="twitter-tweet" data-cards="hidden" data-lang="en"><p lang="en" dir="ltr">Open any business publication and you’ll probably find an article about Batman. <a href="https://t.co/RTPF0PIvNs">https://t.co/RTPF0PIvNs</a> <a href="https://t.co/PpsvDz2bFC">pic.twitter.com/PpsvDz2bFC</a></p>&mdash; Big Data Batman (@BigDataBatman) <a href="https://twitter.com/BigDataBatman/status/865645283522134019">May 19, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">IoT Guide: Difference between Batman and Internet of Things <a href="https://t.co/09S56zqWij">https://t.co/09S56zqWij</a></p>&mdash; Big Data Batman (@BigDataBatman) <a href="https://twitter.com/BigDataBatman/status/865642765102731264">May 19, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="ht" dir="ltr">Senior Developer – C#, .NET, IoT, Batman <a href="https://t.co/ulcL5zwotr">https://t.co/ulcL5zwotr</a> Job Essex</p>&mdash; Big Data Batman (@BigDataBatman) <a href="https://twitter.com/BigDataBatman/status/865616690796613632">May 19, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<p>
<i>That last one is a bit subtle.</i>
</p>

I thought it would be fun to build something similar for serverless, and obviously, I had to name it <a href="https://twitter.com/serverlesssuper">Serverless Superman</a>.

<p>
<img src="https://static.raymondcamden.com/images/2017/5/ss1.jpg" title="The man, the myth, the legend...">
</p>

Alright, so how did I build this? My basic idea was this:

<blockquote>
On a schedule, look for tweets about serverless from the last X minutes, X being the same as my schedule, find a random one, replace the word "serverless" with Superman, and tweet.
</blockquote>

As with everything complex I've done with OpenWhisk, my solution involved a sequence of actions. I began by plotting out my actions in text form.

	seq1:
		
		action1:
		set search: serverless
		since: today

		twitter/getTweets

		action3:
		remove RTs or older than X minutes

		action4:
		pick one and use Superman

		twitter/sendTweet

I named it "seq1" as I thought maybe I'd end up with multiple sequences, but one was enough. Let's break this down action by action.

Action 1: setupsearch
===

The purpose of this action was to serve as the input provider for the next one that will perform the Twitter search. Here is the code:

<pre><code class="language-javascript">/*
I basically set up the args to pass to twitter/search
*/
function main(args) {

	let now = new Date();
	let datestr = now.getFullYear() + '-'+(now.getMonth()+1)+'-'+now.getDate();

	let result = {
		term:"serverless",
		since:datestr
	}

	return result;

}
</code></pre>

The only real complex part here is `since`. The Twitter API lets you filter by date. Unfortunately you can't filter by time. That's going to be a problem later on but I'll address that in the third action. Notice I'm using two keys related to my Twitter account. I got these by logging into the developer portal with my Serverless Superman account. 

Action 2: twitter/getTweets
===

This is an action I built as part of a public package. You can find the complete source code here: https://github.com/cfjedimaster/twitter-openwhisk. I'm not going to share the code since I [blogged](https://www.raymondcamden.com/2017/03/15/a-twitter-package-for-openwhisk) on it a while back, but I did have to update the package action to support the "since" argument.

Action 3: filterresults
===

The purpose of this action is multifold. It's main role is to filter the Tweets, but I also flatten the data quite a bit as well. I filter out retweets, replies, and items older than X minutes, where X is 10. 

Finally I return an array of results where I just carry over the id, text, created_at, and hashtags value of the tweets.

<pre><code class="language-javascript">&#x2F;*
given an array of tweets, remove ones older than X minutes, and RTs, and replies
also, we remove a shit-ton of stuff from each tweet
*&#x2F;

&#x2F;&#x2F;if a tweet is older than this in minutes, kill it
const TOO_OLD = 10;

&#x2F;&#x2F; http:&#x2F;&#x2F;stackoverflow.com&#x2F;a&#x2F;7709819&#x2F;52160
function diffInMinutes(d1,d2) {
	var diffMs = (d1 - d2);
	var diffDays = Math.floor(diffMs &#x2F; 86400000); &#x2F;&#x2F; days
	var diffHrs = Math.floor((diffMs % 86400000) &#x2F; 3600000); &#x2F;&#x2F; hours
	var diffMins = Math.round(((diffMs {% raw %}% 86400000) %{% endraw %} 3600000) &#x2F; 60000); &#x2F;&#x2F; minutes
	return diffMins;
}

function main(args) {

	let now = new Date();

	let result = args.tweets.filter( (tweet) =&gt; {
		&#x2F;&#x2F;no replies
		if(tweet.in_reply_to_status_id) return false;
		&#x2F;&#x2F;no RTs
		if(tweet.retweeted_status) return false;

		&#x2F;&#x2F; http:&#x2F;&#x2F;stackoverflow.com&#x2F;a&#x2F;2766516&#x2F;52160
		let date = new Date(
    tweet.created_at.replace(&#x2F;^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$&#x2F;,
        &quot;$1 $2 $4 $3 UTC&quot;));

		let age = diffInMinutes(now, date);
		if(age &gt; TOO_OLD) return false;

		return true;
	});

	&#x2F;&#x2F;now map it
	result = result.map( (tweet) =&gt; {
		return {
			id:tweet.id,
			text:tweet.text,
			created_at:tweet.created_at,
			hashtags:tweet.entities.hashtags
		};
	});

	return {% raw %}{ tweets:result }{% endraw %};
}
</code></pre>

One thing that kind of bugs me is the `TOO_OLD` value. Right now I have to ensure it matches my cron job (more on that later) and if I forget then I'll have a issue with my data. It's not that too bad of an issue and so I just got over it.

Action 4: makeresult
===

Yeah, that's a pretty dumb name. The idea for this action is - given an input of tweets, pick one by random and replace the word "serverless". Here is where things get a bit wonky. Sometimes I found tweets where "serverless" wasn't in the text. When I looked online, I saw them in the hashtags. Ok, so I updated my code in action 3 to include the hashtags. This is where I then discovered that the Twitter API seemed to not include all the hashtags I could see in the Tweet. 

So... I shrugged my shoulders and got over it. As you can see, I wrote a note that it would be good to *not* give up and select another Tweet, but I thought maybe Serverless Superman could just STFU for a bit and wait. 

<pre><code class="language-javascript">&#x2F;*
so i have an array of tweets. i pick one by random and replace serverless w&#x2F; superman
*&#x2F;

function main(args) {

	return new Promise( (resolve, reject) =&gt; {

		if(args.tweets.length === 0) return reject(&quot;No tweets.&quot;);

		let chosen = args.tweets[ Math.floor(Math.random() * (args.tweets.length))];
		console.log(&#x27;i chose &#x27;+JSON.stringify(chosen));

		if(chosen.text.toLowerCase().indexOf(&#x27;serverless&#x27;) === -1) return reject(&quot;No serverless mention&quot;);

		&#x2F;&#x2F;todo - maybe loop to find another one if first item found didn&#x27;t have the keyword

		let newText = chosen.text.replace(&#x2F;serverless&#x2F;ig, &quot;Superman&quot;);
		console.log(&#x27;new text is: &#x27;+newText);

		&#x2F;*
		ok, so the next step it to tweet, for that, i need to pass:
		status
		*&#x2F;
		resolve({
			status:newText
		});

	});

}
</code></pre>

Note that if I don't have any Tweets or if I can't find the word "serverless", I reject the sequence. This is *not* the right thing to do. OpenWhisk does support conditional sequences but it's a bit... complex right now. There is an open issue to make it a bit simpler and when that happens, I'll consider updating the post then, but for now I dealt with it. It does mean, however, that my action is going to report errors when an error really didn't occur. 

Action 5: twitter/sendTweet
===

Finally - I send my Tweet. This is a new action in my Twitter package so I'll share the code here.

<pre><code class="language-javascript">
const Twitter = require(&#x27;twitter&#x27;);

&#x2F;*
I send a tweet. i need:

args.status (the text)

and that&#x27;s all I&#x27;m supported for now! Note, unlike getTweets
which can get by with less access, for this you need user auth
as documented here: https:&#x2F;&#x2F;www.npmjs.com&#x2F;package&#x2F;twitter
*&#x2F;

function main(args) {

	return new Promise( (resolve, reject) =&gt; {

		let client = new Twitter({
			consumer_key:args.consumer_key,
			consumer_secret:args.consumer_secret,
			access_token_key:args.access_token_key,
			access_token_secret:args.access_token_secret
		});

		client.post(&#x27;statuses&#x2F;update&#x27;, {% raw %}{status:args.status}{% endraw %}, function(err, tweet, response) {
			if(err) return reject(err);
			resolve({% raw %}{tweet:tweet}{% endraw %});
		});

	});

}

exports.main = main;
</code></pre>

Nothing real complex here, but note I'm only allowing for text based Tweets. The API supports a lot more than that. 

Finally, you may have noticed that my sendTweet action requires multiple authentication tokens. How did I pass them? I didn't. I simply used the OpenWhisk "bind" feature and made a copy of my package with all my tokens attached to it. Bam - done. 

Putting it Together
===

The final bits included actually setting up the scheduled task. The first part required making a CRON based Trigger. Here's the command I used for that:

	wsk trigger create serverless_superman_trigger --feed /whisk.system/alarms/alarm -p cron "*/10 * * * * *"

I used https://crontab.guru to help me build the cron value.

Then I made a rule that associated the trigger with the sequence I created of the actions above.

	wsk rule create serverless_superman_rule serverless_superman_trigger serverless_superman/dotweet

And honestly, that was it. I opened up the OpenWhisk dashboard on [Bluemix](https://console.ng.bluemix.net/) and kept watch of it and it just plain worked. (After some help from [Carlos](https://twitter.com/csantanapr) in Slack!) 

Here is an example:

<blockquote class="twitter-tweet" data-cards="hidden" data-lang="en"><p lang="en" dir="ltr">I just finished building a pretty groovy Superman, firebase-powered commerce app <a href="https://twitter.com/hashtag/proudamyself?src=hash">#proudamyself</a> <a href="https://t.co/TjxzSYM199">pic.twitter.com/TjxzSYM199</a></p>&mdash; Serverless Superman (@serverlesssuper) <a href="https://twitter.com/serverlesssuper/status/865658143241457665">May 19, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

And my current favorite:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Functions as a service: the rise of Superman architecture <a href="https://t.co/FaDEJrprN1">https://t.co/FaDEJrprN1</a></p>&mdash; Serverless Superman (@serverlesssuper) <a href="https://twitter.com/serverlesssuper/status/865649519530098689">May 19, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

You can find the code this demo (excluding the Twitter actions which have their own repo) here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/serverless_superman