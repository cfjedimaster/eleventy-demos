---
layout: post
title: "A Twitter Package for OpenWhisk"
date: "2017-03-15T14:41:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/03/15/a-twitter-package-for-openwhisk
---

I've been chewing on an idea for something I'd like to build with [OpenWhisk](https://developer.ibm.com/openwhisk/) and Alexa, and part of it involves Twitter integration. Since working with serverless means working with small, atomic functions, I decided to focus on the Twitter aspect first. I also thought it would be cool to start work on a Twitter package that could be used by other OpenWhisk users. I launched that package today, and while it is pretty small for now, I hope to expand on it over time.

I blogged about OpenWhisk packages a few weeks ago (["Using Packages in OpenWhisk"](https://www.raymondcamden.com/2017/01/31/using-packages-in-openwhisk)), but the basic idea is that they allow you to collect multiple actions into one 'bucket', share default arguments between them, and then share access to them to all users on the platform. (Which is optional by the way - working with packages does *not* mean you have to share them.) 

My Twitter package has a grand total of one action currently - getTweets. The name is - possibly - not entirely accurate. It's using the Search API and lets you pass either a "term" parameter or "account" parameter (or both). This lets you search for something, get tweets from an account, or both. Here is the code.

<pre><code class="language-javascript">
const Twitter = require(&#x27;twitter&#x27;);
const request = require(&#x27;request&#x27;);

&#x2F;&#x2F;possibly cache BT
let BEARER_TOKEN = &#x27;&#x27;;

&#x2F;&#x2F;credit: https:&#x2F;&#x2F;github.com&#x2F;desmondmorris&#x2F;node-twitter&#x2F;issues&#x2F;112
function getBearerToken(key,secret) {
	
	return new Promise( (resolve, reject) =&gt; {

		if(BEARER_TOKEN != &#x27;&#x27;) return resolve(BEARER_TOKEN);
		console.log(&#x27;getting BT from Twitter&#x27;);

		let enc_secret = new Buffer(key + &#x27;:&#x27; + secret).toString(&#x27;base64&#x27;);
		let options = {
			url: &#x27;https:&#x2F;&#x2F;api.twitter.com&#x2F;oauth2&#x2F;token&#x27;,
			headers: {% raw %}{&#x27;Authorization&#x27;: &#x27;Basic &#x27; + enc_secret, &#x27;Content-Type&#x27;: &#x27;application&#x2F;x-www-form-urlencoded;charset=UTF-8&#x27;}{% endraw %},
			body: &#x27;grant_type=client_credentials&#x27;
		};

		request.post(options, function(e, r, body) {
			if(e) return reject(e);
			let bod = JSON.parse(body);
			let bearer = bod.access_token;
			BEARER_TOKEN = bearer;
			resolve(bearer);
		});

	});

}

&#x2F;*
main purpose is to generate a search string
form of search:
args.account (to get by account)
args.term (raw term)

more to come maybe
*&#x2F;
function createSearchString(args) {

	let result = &#x27;&#x27;;
	if(args.term) result += &#x27; &#x27;+args.term;
	if(args.account) result += &#x27; from:&#x27; + args.account;
	return result;
}

function main(args) {

	return new Promise( (resolve, reject) =&gt; {

		getBearerToken(args.consumer_key, args.consumer_secret).then( (bearer_token) =&gt; {

			let client = new Twitter({
				consumer_key:args.consumer_key,
				consumer_secret:args.consumer_secret,
				bearer_token:bearer_token
			});

			let search = createSearchString(args);
			client.get(&#x27;search&#x2F;tweets&#x27;, {% raw %}{q:search}{% endraw %}, function(err, tweets, response) {
				if(err) return reject(err);
				resolve({% raw %}{tweets:tweets.statuses}{% endraw %});
			});
			
		});


	});

}

exports.main = main;
</code></pre>

In order to use this package, you must have your own Twitter app defined in their portal and get access to your consumer key and secret. I use the Twitter package from npm, do some munging on your search input, and then call the API. And that's it. 

Invoking it could look like this:

	wsk action invoke twitter/getTweets --param consumer_key mykey --param consumer_secret mysecret --param account raymondcamden -b -r

The result is an array or tweets. I won't show that as it's rather boring list of tweets. The CLI I used above only works for me - you would want to prefix it with my namespace, so in theory, this should work:

	wsk action invoke /rcamden@us.ibm.com_My Space/twitter/getTweets --param consumer_key mykey --param consumer_secret mysecret --param account raymondcamden -b -r

Of course, you can just use my code as a simple action too.  Finally, if you want to help me improve the action (or add new actions), I've set up a repo here: https://github.com/cfjedimaster/twitter-openwhisk