---
layout: post
title: "Upgrading Serverless Superman to IBM Composer"
date: "2017-10-20"
categories: [serverless]
tags: [openwhisk]
banner_image: /images/banners/superfsh.jpg
permalink: /2017/10/20/upgrading-serverless-superman-to-ibm-composer
---

When IBM Composer was released, my plan was to try to slowly introduce readers to it with various different tutorials. My [post](http://localhost:1313/2017/10/18/building-your-first-serverless-composition-with-ibm-cloud-functions/) earlier this week is an example. But I've been thinking a lot lately about a particular problem that Composer can fix for me, so I'm skipping ahead to a more complex topic for the post today. I guess this is a long winded way of saying - if you are still learning Composer this post may be a bit complex, but I'm definitely going to do more simpler posts later. 

The Superman Problem
===

Alright - so a few months ago I built one of my most complex applications on OpenWhisk, [Serverless Superman](https://www.raymondcamden.com/2017/05/19/building-the-serverless-superman/). While I encourage you to read the blog post for details, the idea was basically to find random tweets about serverless and tweet them out with the word "serverless" replaced with "Superman". (I can't believe I get paid to build stuff like this.)

The process was somewhat complex. Here is my attempt at building a flow chart to show how it worked. Note - I suck at flow charts. 

![Flow Chart](https://static.raymondcamden.com/images/2017/10/superfsh0.png)

The crucial part are the two branches there. If there are no tweets, the process needs to end. Also, sometimes I found tweets that were returned in the search but didn't actually include the word. Not quite sure what to think about that. I thought maybe it was in the hashtags but I didn't see it there either. So I've got a second thing to check as well before sending out the tweet.

All in all this works, but, you can't "exit" a sequence in OpenWhisk. You can only return an error. Now technically that isn't the case. I could use a combinator to try to get around this, but that felt over complex. I figured - who cares about the errors. I don't for sure.

But... it bothered me. Look at the error rate there:

![Shot](https://static.raymondcamden.com/images/2017/10/superfsh2.jpg)

I loaded up the details:

![Shot](https://static.raymondcamden.com/images/2017/10/superfsh3.jpg)

And began clicking. For almost every error, I saw what I expected - either "No tweets" or "No serverless mentions". Ie, not real errors. But then I found this:

![Shot](https://static.raymondcamden.com/images/2017/10/superfsh4.jpg)

That was totally unexpected and - as far as I know - not something that should have happened. The issue though is that so many of my errors are "noise" and not real errors. This is where switching to a Composer app can help.

The Composer Version
===

I know that Composer supports IF conditionals simple. I decided to rebuild the sequence as a Composer file. I'd take the opportunity to convert my "simple" actions into inline functions and then properly handle exiting when there are no tweets to create.

So as a reminder, my existing sequence consisted of custom "set up and massage" type actions as well as actions from my Twitter package. I've got a public Twitter package you can use to search and create tweets. I created a bound copy of the package with my app details so I can use it much easier. 

Let's look at the Composer file.

<pre><code class="language-javascript">composer.sequence(
	&#x2F;&#x2F; set up parameters for the twitter search
	args =&gt; {
		let now = new Date();
		let datestr = now.getFullYear() + &#x27;-&#x27;+(now.getMonth()+1)+&#x27;-&#x27;+now.getDate();

		return {
			term:&quot;serverless&quot;,
			since:datestr
		}

	},

	&#x2F;&#x2F; now ask twitter for the results
	&#x27;mytwitter&#x2F;getTweets&#x27;,

	&#x2F;&#x2F; twitter&#x27;s API is missing some stuff, so we filter more and massage
	args =&gt; {

		&#x2F;&#x2F; http:&#x2F;&#x2F;stackoverflow.com&#x2F;a&#x2F;7709819&#x2F;52160
		let diffInMinutes = function(d1,d2) {
			var diffMs = (d1 - d2);
			var diffDays = Math.floor(diffMs &#x2F; 86400000); &#x2F;&#x2F; days
			var diffHrs = Math.floor((diffMs % 86400000) &#x2F; 3600000); &#x2F;&#x2F; hours
			var diffMins = Math.round(((diffMs {% raw %}% 86400000) %{% endraw %} 3600000) &#x2F; 60000); &#x2F;&#x2F; minutes
			return diffMins;
		}

		&#x2F;&#x2F;if a tweet is older than this in minutes, kill it
		const TOO_OLD = 30;
		
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

	},

	&#x2F;&#x2F;now we select one, if we even got one
	args =&gt; {
		let newText = &#x27;&#x27;;

		if(args.tweets.length &gt;= 1) {

	        let chosen = args.tweets[ Math.floor(Math.random() * (args.tweets.length))];
	        if(chosen.text.toLowerCase().indexOf(&#x27;serverless&#x27;) !== -1) {
		        newText = chosen.text.replace(&#x2F;serverless&#x2F;ig, &quot;Superman&quot;);
			}
		}

		return {% raw %}{ status:newText }{% endraw %};
	},

	&#x2F;&#x2F;if we got something, tweet it
	composer.if(({% raw %}{status}{% endraw %})=&gt; status != &#x27;&#x27;, &#x27;mytwitter&#x2F;sendTweet&#x27;)
);
</code></pre>

Let's take it from the top.

The first thing I did was inline my "setup" function. All this does is prepare the data to be sent to my Twitter action.

Then I run `getTweets`. That's a simple action call since all the work is packaged up. (And again, you can totally use my code too!)

My next inline action is a bit more complex. It handles doing additional filtering that Twitter's API cannot. I kinda think it's a bit *too* complex. Obviously what you inline and what you keep as an external action is up to you, and I'm willing to bet folks will go back and forth between what they feel comfortable doing, but for this update, I wanted to move *everything* inline just to see how it feels. 

I'm ok with this block of code - but I definitely think folks may disagree.

The next action is another inline function - and yeah - you may ask - why not simply "combine" the two. Well again, I'm not saying it makes absolute sense, but in the previous version I had them as separate actions so I thought it made sense to keep them separate here too. The logic here handles picking the random tweet and updating the text.

Here too is where things begin to change. Previously that action returned an error if either of the two conditionals were false. In my case, I simply never set a value for newText.

That then lets the last part work very nicely - `composer.if`. If my status is not blank, run `sendTweet`. Otherwise do nothing.

So now the end result is either a tweet, or nothing. No errors. (Well, yes, I'll still have errors, but I'll have *better* errors now!) In case you're curious, check out how the Composer shell renders this:

![Shot](https://static.raymondcamden.com/images/2017/10/superfsh5.jpg)

Slick rick. Anyway, once this was done I literally just had to update the rule associated with my CRON-based trigger to point to the new app. And it worked: 

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">.<a href="https://twitter.com/thomasj?ref_src=twsrc{% raw %}%5Etfw">@thomasj</a> is presenting multi-provider Superman apps. You can still join us. <a href="https://t.co/vU64L0xat5">https://t.co/vU64L0xat5</a> <a href="https://t.co/AF3GLx551v">pic.twitter.com/AF3GLx551v</a></p>&mdash; Serverless Superman (@serverlesssuper) <a href="https://twitter.com/serverlesssuper/status/921420805900328966?ref_src=twsrc%{% endraw %}5Etfw">October 20, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Remember that there is currently a bug with `wsk` such that when you edit a rule, it disables it. Be sure to re-enable it right after the edit.

Any questions?