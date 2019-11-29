---
layout: post
title: "Facebook Chatbots with OpenWhisk"
date: "2017-10-09T05:52:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/10/09/facebook-chatbots-with-openwhisk
---

This weekend I decided to take a quick look at running Facebook Chatbot, aka [Facebook Messenger Platform](https://developers.facebook.com/docs/messenger-platform/), on the OpenWhisk platform. In general, it worked just fine and 90% of the issues I had were me not reading the docs correctly and making code screw ups. But I can say that I've got it working successfully now and it isn't difficult at all.

![Look - it works!](https://static.raymondcamden.com/images/2017/10/fbcb1a.jpg)

In this blog post I'm going to explain what you would need to do to get a Facebook Chatbot running on OpenWhisk. I will *not* cover the entire process of creating a bot. For that, you want to read Facebook's [Getting Started](https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start) guide which covers the things you need to setup and discusses the Node code. The code I'm going to share is a modified version of their Node code. It isn't very clean, but it should be enough to get you started if you want to use OpenWhisk for your bot.

The first thing you'll need to do is create a new OpenWhisk action. You are welcome to use my code to start off with, just remember what I said - it is a bit messy. When you create your action, you must use the web action flag so that Facebook can hit it. Given an action name of fbbot, you would enable web action support like so:

	wsk action update fbbot --web true

Now you need the URL. You can get that like so:

	wsk action get fbbot --url

When you follow Facebook's guide, this is the URL you use for the webhook. Do *not* add JSON to the end! I always do that as I'm used to building JSON-responding services, but Facebook requires a non-JSON response for verification. Just use the URL as is.

Now for the code. I'm going to share the whole thing at the end, but first I want to share a few bits and pieces. Facebook will either send you a GET or POST request. The GET is always used for verification. You can handle this like so:

<pre><code class="language-javascript">	if(args["__ow_method"] === "get") {
		let challenge = args["hub.challenge"];
		let token = args["hub.verify_token"];

		if(token === 'test_token') {
			return {% raw %}{ body:challenge }{% endraw %};
		} else {
			//todo: return an error condition
		}
	} else if(args.__ow_method === "post") {

</code></pre>

Notice I sniff for the HTTP method first, get the values out of the args, and then check to ensure the token is correct. "test_token" was set on the Facebook side and should probably be a bit more secure. As the comment clearly says, I should add an error result there.

The next part of the code will handle responding back to the message. For the most part I followed Facebook's Node sample, but I modified things a bit. Facebook doesn't really how you respond to its HTTP call to your server. Your response means nothing essentially. Instead your code makes its own HTTP request to Facebook's API to respond.

However - if you follow Facebook's lead and "respond early" while the response HTTP call is about to go out, that will not work on OpenWhisk. When OpenWhisk things you're done, it's going to shut down your serverless code. Therefore, the code I used basically waits till everything is done before creating a response.

Since Facebook can, and will, batch responses, that meant using `Promise.all` as a way of listening for all the possible calls to finish. So here is the entire code snippet. Once again, please remember this leaves a lot of polish out.

<pre><code class="language-javascript">const rp = require(&#x27;request-promise&#x27;);
const PAGE_ACCESS_TOKEN = &#x27;CHANGE ME TO YOUR TOKEN&#x27;;

function main(args) {
	console.log(&#x27;fbbot ow activated&#x27;);

	if(args[&quot;__ow_method&quot;] === &quot;get&quot;) {
		let challenge = args[&quot;hub.challenge&quot;];
		let token = args[&quot;hub.verify_token&quot;];

		if(token === &#x27;test_token&#x27;) {
			return {% raw %}{ body:challenge }{% endraw %};
		} else {
			&#x2F;&#x2F;todo: return an error condition
		}
	} else if(args.__ow_method === &quot;post&quot;) {
		console.log(&#x27;post call&#x27;);

		&#x2F;&#x2F;ensure it&#x27;s a page, todo: return an error?
		if(!args.object === &quot;page&quot;) return;

		return new Promise((resolve, reject) =&gt; {

			let promises = [];
			args.entry.forEach((entry) =&gt; {
				&#x2F;&#x2F;process each entry
				entry.messaging.forEach((event) =&gt; {
					if(event.message) promises.push(process(event));
				});

			});

			Promise.all(promises).then(() =&gt; {
				resolve({% raw %}{result:1}{% endraw %});
			})
			.catch((e) =&gt; {
				console.log(&#x27;error in all call&#x27;);
				console.log(&#x27;message=&#x27;+e.message);
				console.log(&#x27;error=&#x27;+JSON.stringify(e.error));
				reject({% raw %}{error:e.error}{% endraw %});
			});

		});

	}

}

function process(msg) {
	let senderID = msg.sender.id;
	let recipientID = msg.recipient.id;
	let timeOfMessage = msg.timestamp;
	let message = msg.message;

	console.log(`Received message for user ${% raw %}{senderID}{% endraw %} and page ${% raw %}{recipientID}{% endraw %} at ${% raw %}{timeOfMessage}{% endraw %} with message:`);
	console.log(JSON.stringify(message));

	let messageID = message.mid;
	let messageText = message.text;
	&#x2F;&#x2F;todo: attachments

	var messageData = {
		recipient: {
			id: senderID
		},
		message: {
			text: &#x27;You sent: &#x27;+messageText
		}
	};

	return callSendApi(messageData);
}

function callSendApi(messageData) {
	let options = {
			uri: &#x27;https:&#x2F;&#x2F;graph.facebook.com&#x2F;v2.6&#x2F;me&#x2F;messages&#x27;,
			qs: {% raw %}{ access_token: PAGE_ACCESS_TOKEN }{% endraw %},
			method: &#x27;POST&#x27;,
			json: messageData
	}
	return rp(options);
}
</code></pre>

The `process` function is where I did the logic of "You sent:" in response to your message. A real bot would do a bit more work obviously. `callSendApi` is basically just the API call to Facebook. I've modified it to use request-promise since I have to know when it's done. 

In theory you can test this on the page I set up for it, [BotTest1](https://www.facebook.com/BotTest1-407023806380442/), but I'm not promising to keep that site up for long. Now that I've got this done, I'm going to look into integrating it with Watson for more advanced demos.

Let me know if you have any questions!