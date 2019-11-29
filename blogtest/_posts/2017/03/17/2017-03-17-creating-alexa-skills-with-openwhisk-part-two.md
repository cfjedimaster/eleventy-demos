---
layout: post
title: "Creating Alexa Skills with OpenWhisk - Part Two"
date: "2017-03-17T09:53:00-07:00"
categories: [serverless]
tags: [openwhisk,alexa]
banner_image: /images/banners/alexaow2.jpg
permalink: /2017/03/17/creating-alexa-skills-with-openwhisk-part-two
---

This is my followup to [last week's post](https://www.raymondcamden.com/2017/03/09/an-introduction-to-creating-alexa-skills-with-openwhisk) on building Alexa skills with [OpenWhisk](https://developer.ibm.com/openwhisk/). What I'm describing today represents some *very* recent changes and I would warn people that this post may change in the future. The focus of this post involves what you need to do to get your Alexa skill verified. I'm still in the process of doing that myself, but my holdup now isn't related to technical issues so I feel safe in sharing this update. Again though - take with a grain of salt and I'll try to ensure I clearly mark any updates post release.

Whew. Sorry about all that - I just like to make sure people know this is still a bit of a moving target. ;)

In my first post on building an Alexa skill, I talked a bit about the verification process your skill has to adhere to in order to be released publicly by Amazon. Jordan Kaspar did a great job of writing this up in [his blog post](https://jordankasper.com/building-an-amazon-alexa-skill-with-node-js/) and since I stole it for mine already, I'll steal it again:

* Check the SignatureCertChainUrl header for validity.
* Retrieve the certificate file from the SignatureCertChainUrl header URL.
* Check the certificate file for validity (PEM-encoded X.509).
* Extract the public key from certificate file.
* Decode the encrypted Signature header (it's base64 encoded).
* Use the public key to decrypt the signature and retrieve a hash.
* Compare the hash in the signature to a SHA-1 hash of entire raw request body.
* Check the timestamp of request and reject it if older than 150 seconds.

Yes - that is a bit batshit crazy. Luckily though there is a simple library you can use, [alexa-verifier](https://github.com/mreinstein/alexa-verifier). Jordan makes use of this in his post as part of an Express middleware, but obviously our OpenWhisk action is a bit different. 

The verifier function requires three things:

* A header called signaturecertchainurl
* A header called signature
* The raw body of the post

The last bit is the crucial bit. When using a web action, a JSON body is automatically parsed and available to your action as arguments. However, Amazon requires the original string as part of the verification process.

As of the most recent release (and yes, the OpenWhisk folks need to help broadcast cool changes like I'm about to describe, we're working on it :), you can now ask OpenWhisk to *not* parse the body and simply make it available to you.

This is [documented](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_webactions.html#openwhisk_webactions) now but it basically comes down to a few steps:

* Add a new annotation to your action: <code>raw-http true</code>
* Access the body via <code>args.__ow_body</code>. It's base64 so you'll need to convert it.

And here comes the super, super, super important thing. When you use this feature, you no longer have access to the arguments from the body as arguments to the function itself. Ok, let me rephrase that with a super small demo:

<pre><code class="language-javascript">function main(args) {
  return {% raw %}{name:args.name}{% endraw %};
}
</code></pre>

Given that action, if I POST a JSON string that included a name, it would be available as used above. But if I switch to raw-http mode (my term, not theirs), then args.name would *not* exist, unless I have a default parameter for the action with that name.

Yeah, a bit confusing. Personally I don't use default parameters very much, but if you do, and if you use this feature, than you're going to have to be aware of this to ensure you get the right value.

Here's a new version of the function above that would get name from the raw body:

<pre><code class="language-javascript">function main(args) {
  let body = new Buffer(args.__ow_body,'base64').toString('ascii');
  let data = JSON.parse(body);
  return {% raw %}{name:data.name}{% endraw %};
}
</code></pre>

Ok, so hopefully you're still with me. ;) Now let's look at the updated action:

<pre><code class="language-javascript">let alexaVerifier = require(&#x27;alexa-verifier&#x27;);

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
 
function randomName() {
	var initialParts = [&quot;Fluffy&quot;,&quot;Scruffy&quot;,&quot;King&quot;,&quot;Queen&quot;,&quot;Emperor&quot;,&quot;Lord&quot;,&quot;Hairy&quot;,&quot;Smelly&quot;,&quot;Most Exalted Knight&quot;,&quot;Crazy&quot;,&quot;Silly&quot;,&quot;Dumb&quot;,&quot;Brave&quot;,&quot;Sir&quot;,&quot;Fatty&quot;];
	var lastParts = [&quot;Sam&quot;,&quot;Smoe&quot;,&quot;Elvira&quot;,&quot;Jacob&quot;,&quot;Lynn&quot;,&quot;Fufflepants the III&quot;,&quot;Squarehead&quot;,&quot;Redshirt&quot;,&quot;Titan&quot;,&quot;Kitten Zombie&quot;,&quot;Dumpster Fire&quot;,&quot;Butterfly Wings&quot;,&quot;Unicorn Rider&quot;];
	return initialParts[getRandomInt(0, initialParts.length-1)] + &#x27; &#x27; + lastParts[getRandomInt(0, lastParts.length-1)]
};

function main(args) {

	return new Promise(function(resolve, reject) {

		let signaturechainurl = args.__ow_headers.signaturecertchainurl;
		let signature =  args.__ow_headers.signature;
		let body = new Buffer(args.__ow_body,&#x27;base64&#x27;).toString(&#x27;ascii&#x27;);
		let request = JSON.parse(body).request;

		alexaVerifier(signaturechainurl, signature, body, function(err) {
			console.log(&#x27;in verifier cb&#x27;);
			if(err) {
				console.log(&#x27;err? &#x27;+JSON.stringify(err));
				reject(err);
			} else {
				let intent = request.intent;

				let text = &#x27;Your random cat is &#x27;;


				if(intent.name === &#x27;randomName&#x27;) {
					text += randomName();
				} else if(intent.name === &#x27;nameWithPrefix&#x27;) {
					let prefix = request.intent.slots.prefix.value;
					text += prefix +&#x27; &#x27;+ randomName();
				}

				var response = {
				&quot;version&quot;: &quot;1.0&quot;,
				&quot;response&quot; :{
					&quot;shouldEndSession&quot;: true,
					&quot;outputSpeech&quot;: {
						&quot;type&quot;: &quot;PlainText&quot;,
						&quot;text&quot;: text
						}
					}
				}

				resolve(response);

			}
		});

	});

}

exports.main = main;
</code></pre>

I'll skip over the bits that didn't change from before and focus on the updates. First, I require in the alexa-verifier package. I needed to add a package.json for my action and switch to a zipped file for updates. To make that easier I wrote a simple bat file that zips and updates in one call. (If anyone wants to see that, just ask.)

Going down, you can see I fetch the headers as well as the raw body. I convert it to ascii, JSON parse it, and then grab the request value. 

Then, I run my required values through <code>alexaVerifier</code>, and here it just plain works. That's really all there is to it. (As an aside, I had some questions for the maintainer of that project and they were *very* quick to reply and try to help!)

The final changes were to how I worked with the data Alexa sent me. Previously I was used the args object, but as I described above, I needed to change my code to get this from the parsed body.

And that's it! As I said above, my skill isn't yet verified, but I believe I'm close. There is *one* possible thing that I think I may need to add, and if I'm right, I'll post a follow up. But for now, I hope this is helpful!