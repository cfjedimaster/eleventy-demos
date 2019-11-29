---
layout: post
title: "Handling SMS with OpenWhisk, IBM Watson and Twilio - an Update"
date: "2017-07-07T09:49:00-07:00"
categories: [serverless]
tags: [openwhisk,watson]
banner_image: 
permalink: /2017/07/07/handling-sms-with-openwhisk-ibm-watson-and-twilio-an-update
---

Last week I [blogged](https://www.raymondcamden.com/2017/06/29/handling-sms-with-openwhisk-ibm-watson-and-twilio/) about a sample application I built using OpenWhisk, Twilio, and IBM Watson. The idea was - I could send a picture to a SMS number set up with Twilio, Twilio would send the data to OpenWhisk, OpenWhisk would get the picture and send it to Watson for identification, and finally the result would be sent back to the user. This morning a coworker pointed out a few issues and I found a way for the code to be much simpler. Normally I'd just update the post, but I thought a followup would be better.

First off - the code for the action that listens for a POST from Twilio had this line:

<pre><code class="language-javascript"> var client = new twilio(args.accountSid, args.authToken);
</code></pre>

I totally forgot to say that those two values come from Twilio and should be set as default parameters for your OpenWhisk action. Like so:

<code>wsk action update smsidentify/gotMessage --param accountSid X --param authToken Y</code>

Where <code>X</code> and <code>Y</code> are the two values. You could hard code them too I suppose, but it's better to have them as parameters.

As someone who tries his best to teach well, I look out for stuff like this - when the writer makes assumptions - and I try my best to not do that myself. Sorry!

The next issue was a bit more subtle. I had noticed an error in the Twilio logs in regards to the response type. Here is an example:

![Error](https://static.raymondcamden.com/images/2017/7/sms_ow_10.jpg)

However, since the error didn't seem to break the app, I forgot about it. I should not have done so. Turns out, you need to return an XML response in reply to the HTTP POST Twilio sends to your action. My original code in sendResults.js looked like so:

<pre><code class="language-javascript">client.messages.create({
	body: message,
    to: args.from,  
    from: args.to
})
.then((message) => {
	resolve({% raw %}{result:1}{% endraw %});
})
</code></pre>

Basically - use the Twilio library to message back and just return 1 since I don't really care about what I return. However, this is what caused the problem - I wasn't doing a proper XML response. I initially tried to find out how, "How do I send an empty XML back to just make Twilio happy" when I discovered something else - I can actually send my result in the XML! Not only does this make it easier to send the result, but it solves other issues as well. 

In the original post, I talked about how the "identify" action had to "carry over" the phone numbers that the first action received. This was so that the third and final action could properly "call back". But now that I'm simply returning XML, that's no longer an issue! 

So my corrections involved the following. I edited identify.js to remove the "carry over additional args" hack. (You can see the source [here](https://github.com/cfjedimaster/Serverless-Examples/blob/master/smsidentify/identify.js)). Then, I edited sendResults.js to be much more simpler:

<pre><code class="language-javascript">function main(args) {
	return new Promise((resolve, reject) =&gt; {

		&#x2F;*
		ok, so if #1 doesn&#x27;t tie with #2, return &quot;1 or maybe a 2&quot;
		if it ties, return &quot;1 or 2&quot;
		*&#x2F;
		let message = &#x27;&#x27;;
		if(args.tags[0].score !== args.tags[1].score) {
			message = `I think this is a ${% raw %}{args.tags[0].class}{% endraw %}. But it may be a ${% raw %}{args.tags[1].class}{% endraw %}.`;
		} else {
			message = `I think this is a ${% raw %}{args.tags[0].class}{% endraw %} or a ${% raw %}{args.tags[1].class}{% endraw %}.`;
		}
		console.log(&#x27;Message to send via SMS: &#x27;+message);

		resolve({
			headers:{
				&#x27;Content-Type&#x27;:&#x27;text&#x2F;xml&#x27;
			},
			body:&#x27;&lt;Response&gt;&lt;Message&gt;&#x27;+message+&#x27;&lt;&#x2F;Message&gt;&lt;&#x2F;Response&gt;&#x27;
		});

	});
}
</code></pre>

Finally, and this is critical - I edited the Web Hook URL configuration in Twilio to remove ".json" from the end and change it to ".http". This tells OpenWhisk that I'm going to be defining my own response type with headers and the like. (As much as XML is kinda meh, I think I'd like it if OpenWhisk Web Actions supported .xml in the URL. I'm going to file a request for that.)

All in all, I'm really happy that this bug helped flesh out (a bit) my knowledge of the Twilio API. As a reminder, all three actions can be found on GitHub here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/smsidentify.