---
layout: post
title: "Enabling CORS for an OpenWhisk Action"
date: "2017-05-09T10:54:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/05/09/enabling-cors-for-an-openwhisk-action
---

A few weeks ago I blogged about how to [enable CORS for OpenWhisk Web Actions](https://www.raymondcamden.com/2017/04/18/enabling-cors-for-an-openwhisk-web-action). In case you aren't aware, CORS is the standard way to allow client-side web applications to access your APIs. (JSON/P, an older method, still works, but CORS is really what you should use.) If you read the post, then you know it isn't too difficult at all, but I wanted to share another way of doing that's even easier.

Fairly recently, we released new API management support for OpenWhisk actions. This is a huge feature set and something I want to talk a lot more about, but right now I'm between trips so it may be a few weeks before I cover it here. The *incredibly* simplistic summary of this feature is that it allows you to expose your OpenWhisk actions in a managed API. You can lock down who has access while also adding rate limiting. You also get basic stats about usage to help you track your API traffic. If you want a quick overview, watch this video.

<iframe width="560" height="315" src="https://www.youtube.com/embed/eRpodAfmkg4?rel=0" frameborder="0" allowfullscreen></iframe>

While the OpenWhisk management console has tools to help you manage your APIs, you can also use the CLI to do some of the same actions. One of the cooler things you can do is point to an action and simply say, "OpenWhisk, give me an API and tailor it for GET requests returning JSON." Alright, you don't actually *say* that, but let's check it out. 

First, here is my action. It is a simplified version of the code I used in the previous demo, but this one is not returning headers and the like - just raw data.

<pre><code class="language-javascript">
function main(args) {

    if(!args.name) args.name = 'Nameless';
	let result = {
		string:'Hello '+args.name
	}

	return {
		result:result
	}

}
</code></pre>

First I push this up as `corstest2` like so:

`wsk action update corstest/corstest2 corstest2.js --web true`

Notice I'm enabling web action support, but my code isn't bothering to return the proper headers and body, it's still rather simple. Now I enable an API:

`wsk api create /corstest /test2 get corstest/corstest2 --response-type json`

This is pretty similar to the older `api-experimental` CLI examples you will see on my blog, but that has been deprecated now in favor of the new management system. The first argument, `corstest`, sets up a base path while the second, `test2`, is the path for this particular action. I tell it the method (`get`) and the action (`corstest/corstest2`) and finally the response type we want, `json`. And literally - that's it. The CLI spits out the URL (which I took a screen shot of but it was kind of ridiculous long) but here is what it looks like (spaces added for wrapping):

https://<span></span>service.us.apiconnect.ibmcloud.com/gws/apigateway/api/37871051d18d0b2115da90f2924
58913e22e5d182c8a965fadcfbf6b5fcc96c6/corstest/test2

Once I had that, I updated my client-side demo to use that URL. 

<pre><code class="language-javascript">
$(document).ready(function() {

	$.getJSON('https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/37871051d18d0b2115da90f292458913e22e5d182c8a965fadcfbf6b5fcc96c6/corstest/test2?name=ray')
	.then(function(res) {
		console.log(res);
	});
});
</code></pre>

Not really that interesting, but super simple. If you want to run this demo, you can do so here:

https://cfjedimaster.github.io/Serverless-Examples/corsdemo/test2.html

Be sure to open your console though as I don't spit out anything in the DOM.

Anyway - as I said, there is a lot more to this particular feature than what I'm showing here, but I thought it was a cool update to the problem of enabling CORS support.