---
layout: post
title: "Enabling CORS for an OpenWhisk Web Action"
date: "2017-04-18T08:45:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/04/18/enabling-cors-for-an-openwhisk-web-action
---

Here's a quick tip for you. If you are building an OpenWhisk action you plan on exposing as a [web action](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_webactions.html#openwhisk_webactions), most likely you'll want to look into enabling CORS so you can call your code from JavaScript on the front-end. Since Web Actions can return both a result and headers, this is trivial to do. Here is a simple example.

<pre><code class="language-javascript">function main(args) {

    if(!args.name) args.name = 'Nameless';
	let result = {
		string:'Hello '+args.name
	}

	return {
		headers: { 
			'Access-Control-Allow-Origin':'*',
			'Content-Type':'application/json'
		}, 
		statusCode:200,
		body: new Buffer(JSON.stringify(result)).toString('base64')
	}

}
</code></pre>

There's two things to make note of here. First, obviously, is the `Access-Control-Allow-Origin` header. I'm using `*` which means it can be called from anywhere, but I could lock that down if I chose. 

Finally, when you return your data you have to base64 encode it. So the body key handles doing all of that after I've created my `result` value as I like. 

The end result then is a simple endpoint I can hit from some client-side code:

<pre><code class="language-javascript">
$.getJSON('https://openwhisk.ng.bluemix.net/api/v1/web/rcamden@us.ibm.com_My%20Space/corstest/corstest.http?name=ray')
.then(function(res) {
	console.log(res);
});
</code></pre>

I also think it would be valid to build this as a sequence. So you could have webFoo being the action, comprised of a sequence of foo + webify (or some such) where foo represents the real business logic and webify handles the 'complex' output required to return the result. 

Thank you to [@akrabat](https://akrabat.com/) on the [OpenWhisk Slack](http://openwhisk-team.slack.com) for helping me figure this out!