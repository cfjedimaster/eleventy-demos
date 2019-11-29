---
layout: post
title: "Using a Generic CORS Enabler in OpenWhisk"
date: "2017-06-12T14:44:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/06/12/using-a-generic-cors-enabler-in-openwhisk
---

Today's post (well, the code and the idea, the writing, warts and all, are all me) comes from a coworker, [Stephen Fink](http://researcher.watson.ibm.com/researcher/view.php?person=us-sjfink). Stephen and I were chatting in Slack about generic utilities, and the idea for a "simply CORS enable an action" utility came up. 

As a reminder, there's two ways to expose your OpenWhisk code as anonymous API - either via a web action or via Bluemix Native API Management (BNAME). The later is a bit complex so a web action is where I tend to go to for simple demos, but there's one catch with it. Typically you have to modify your action in order to use in a client-side application. 

Specifically you need to return the CORS header as well as base64 your JSON. Once again - sequences really help out with this. By building a generic "CORS Enabler" action, you can then use sequences to quickly expose actions. Let's look at a simple example. 

I'll begin with the action - `isGoodCat`. Here's the code.

<pre><code class="language-javascript">function main(args) {
	if(true) {
		return {
			goodcat:true
		};
	} else {
		//still good
		return {
			goodcat:true
		};
	}
}
</code></pre>

As you can see, the action simply returns whether or not a cat is good. This code is perfect and does not need cats. It is the most right program created. Ever.

Now let's look at the generic CORS enabler Stephen wrote:

<pre><code class="language-javascript">/*
Written by Stephen J. Fink (http://researcher.watson.ibm.com/researcher/view.php?person=us-sjfink)
*/

/**
 * This action simply echos it's input set an Allow-Origin CORS policy
 */
function main(params) {
    var domain = params.domain ? params.domain : '*';
    return {
        headers: {
                     'Access-Control-Allow-Origin':domain,
                     'Content-Type':'application/json'
                 },
        statusCode:200,
        body: new Buffer(JSON.stringify(params)).toString('base64')
    }
}
</code></pre>

There's nothing out of the ordinary here. This action will basically just echo what it was given, but note it outputs the CORS header and handles the buffer crap. (Yes, I called it crap. I hope we can get rid of this little hack soon!) The only real logic it applies if it sees a `domain` parameter it will use that to lock down the CORS header a bit.

So given you've deployed this to OpenWhisk as `corsenabler`, to "expose" our cat API, all we do is this:

	wsk action create --sequence isGoodCatAPI isGoodCat,enablecors --web true

And that's it - you're done. You can see mine here (although there's no promise it will be up forever): https://openwhisk.ng.bluemix.net/api/v1/web/rcamden@us.ibm.com_My%20Space/default/isGoodCatAPI

And here is a sample output:

![Sample Output](https://static.raymondcamden.com/images/2017/6/corsenabler2.jpg)