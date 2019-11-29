---
layout: post
title: "IBM Watson OpenWhisk Actions"
date: "2017-10-24T07:58:00-07:00"
categories: [serverless]
tags: [openwhisk,watson]
banner_image: 
permalink: /2017/10/24/ibm-watson-openwhisk-actions
---

Many months ago I blogged about an OpenWhisk package I built for [IBM Watson Tone Analyzer](https://www.ibm.com/watson/developercloud/tone-analyzer.html). The code wasn't terribly complex since most of the work was done by the [npm package](https://www.npmjs.com/package/watson-developer-cloud), but I thought it might be helpful to others looking to use the API with OpenWhisk. I've done some updates to that action and have added a new service today, [Personality Insights](https://www.ibm.com/watson/services/personality-insights/). 

The new Personality Insights action can be found in my Watson package. You can bind your own copy by using the full path: `/rcamden@us.ibm.com_My Space/watson`. Inside the package you'll find a `tone` and `pi` action. Since each service requires unique credentials, I did something kinda cool (well, cool to me) to make it easier to set your credentials. 

Both actions support a `username` and `password` argument, but since they are unique, both actions also support an "override". So for example, the Tone wrapper lets you pass `tone.username` and `tone.password`. For Personality Insights, it supports `pi.username` and `pi.password`. This means when you bind my package, you can supply all four arguments as defaults and then not worry about them later. This makes using the actions even easier - both support a `text` argument to easily pass your input.

As I said, the code is trivial, but here's the new PI action:

<pre><code class="language-javascript">const PersonalityInsightsV3 = require(&#x27;watson-developer-cloud&#x2F;personality-insights&#x2F;v3&#x27;);

function main(args) {

	&#x2F;&#x2F;allow overrides
	if(args[&#x27;pi.username&#x27;]) args.username = args[&#x27;pi.username&#x27;];
	if(args[&#x27;pi.password&#x27;]) args.password = args[&#x27;pi.password&#x27;];

	let personality_insights = new PersonalityInsightsV3({
		username: args.username,
		password: args.password,
		version_date: &#x27;2016-10-19&#x27;
	});

	return new Promise( (resolve, reject) =&gt; {
			personality_insights.profile({
				text: args.text,
				consumption_preferences: true
			},
			function (err, response) {
				if (err) reject(err);
				else resolve(response);
			});
	});

}

exports.main = main;
</code></pre>

If you don't want to use my package, or you want to add to it or suggest a fix, you can find both in my main [Serverless Examples](https://github.com/cfjedimaster/Serverless-Examples) repo.