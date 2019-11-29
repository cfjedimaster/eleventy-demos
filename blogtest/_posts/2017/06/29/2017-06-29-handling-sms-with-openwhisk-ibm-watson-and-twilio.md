---
layout: post
title: "Handling SMS with OpenWhisk, IBM Watson, and Twilio"
date: "2017-06-29T09:03:00-07:00"
categories: [serverless]
tags: [openwhisk,watson]
banner_image: /images/banners/ow_sms.jpg
permalink: /2017/06/29/handling-sms-with-openwhisk-ibm-watson-and-twilio
---

<strong>I have made some important corrections to this guide - please see my followup here: https://www.raymondcamden.com/2017/07/07/handling-sms-with-openwhisk-ibm-watson-and-twilio-an-update</strong>

Earlier this week I got a chance to play a bit with Twilio's API (<a href="https://www.raymondcamden.com/2017/06/27/an-openwhisk-monitoralert-poc/">An OpenWhisk Monitor/Alert POC</a>) and I have to admit I was *shocked* at how easy it was to use. It got me thinking about what else I could do with it (as an excuse to learn of course) and I whipped up a pretty cool demo I'd like to share.

The idea is simple: Take a picture with your phone, text it to a phone number, and then let Watson's [Visual Recognition](https://www.ibm.com/watson/developercloud/visual-recognition.html) service try to determine what it is. Finally, respond with a description based on that data. Here is a sample from a picture of one of my cats:

<img title="The cat" src="https://static.raymondcamden.com/images/2017/6/sms_cat2.jpg" class="imgborder">

And another test with a <strike>doll</strike>action figure:

<img title="Stormtrooper" src="https://static.raymondcamden.com/images/2017/6/sms_stormtrooper.jpg" class="imgborder">

All in all, the results are kind of hit or miss, mainly because of how I tried to "Plain English" the results, but pretty impressive (I think) for approximately one hour of work. So how was this built?

I had already signed up for [Twilio](https://www.twilio.com/) earlier this week for my last test, and as part of that work I had provisioned a number. As you can tell in the screenshots above, I haven't yet left the trial account but I was able to do everything I needed to without paying a dime. (My phone number will cost me one dollar a month, but I'll probably let it expire as I'm only "playing" now.) While I had a number provisioned, the only thing I had to do was setup the web hook. This lets me say, "When you get a SMS, run this code." I did that in the phone number configuration screen:

<img title="Config" src="https://static.raymondcamden.com/images/2017/6/sms_1.jpg" class="imgborder">

You can't see the full URL there, but it's the "Web Action" url for the sequence I'm about to show you. As I've said before, OpenWhisk still doesn't make this quite easy to get, but once you figure it out, you're good to go. In my case, it is:

https://openwhisk.ng.bluemix.net/api/v1/web/rcamden@us.ibm.com_My%20Space/smsidentify/handleSMS.json

So what's the code behind this? I built this with three actions:

* The first action is responsible for looking at the SMS message sent by the user. If they didn't send a picture, respond with help text. Otherwise respond with a "we're working on it" message.
* The second action is responsible for looking at the image by using the Watson Visual Recognition service.
* The final action takes the results from Watson, tries to make a simple English sentence from it, and sends it to the user.

Here's the first action:

<pre><code class="language-javascript">const twilio = require(&#x27;twilio&#x27;);

function main(args) {

    var client = new twilio(args.accountSid, args.authToken);

	&#x2F;*
	2 results.
	if they sent a picture, we pass the picture on as a result so it gets sent to the next action. 
	if they sent 2+, we ignore them.

	if they didn&#x27;t send a picture, we do a text back saying we need a picture
	*&#x2F;

	const badBody = `To use this service, send me an image. Thanks and have a nice day, human!`;
	const goodBody = `I got your picture. I&#x27;m working on identifying it now!`;

	return new Promise( (resolve, reject) =&gt; {

		if(Number(args.NumMedia) === 0) {
			console.log(&#x27;no media, tell the user whatup&#x27;);
			client.messages.create({
				body: badBody,
				to: args.From,  
				from: args.To
			})
			.then((message) =&gt; {
				resolve({% raw %}{error:&#x27;No image to identify&#x27;}{% endraw %});
			})
			.catch(err =&gt; {
				console.log(err);
				reject({% raw %}{error:err}{% endraw %});
			});
			
		} else {
			console.log(&#x27;resolving image url of &#x27;+args.MediaUrl0);
			client.messages.create({
				body: goodBody,
				to: args.From,  
				from: args.To
			})
			.then((message) =&gt; {
				resolve({% raw %}{imageUrl:args.MediaUrl0, from:args.From, to:args.To}{% endraw %});
			})
			.catch(err =&gt; {
				console.log(err);
				reject({% raw %}{error:err}{% endraw %});
			});		
		}

	});

}
</code></pre>

For the most part, the Twilio npm package makes this trivial. When it pings my webhook, it passes a lot of data. The parts I care about are:

* From (who sent it)
* To (technically this is already known to me, I've got one number, but I should make this dynamic)
* NumMedia - a value representing the number of images sent in the message.

Using that last value, I simply see if they sent me just plain text, and if so, I respond with help text. If they sent me an image, I pass that, along with the From/To, to the next action.

Next is my identify logic. It works well, but it bugs me a bit. Let me share the code and then I'll explain what bothered me.

<pre><code class="language-javascript">&#x2F;*
Responsible for sending an image up to Watson and returning the tags.
*&#x2F;

const VisualRecognitionV3 = require(&#x27;watson-developer-cloud&#x2F;visual-recognition&#x2F;v3&#x27;);

function main(args) {

	&#x2F;*
	I&#x27;m part of a flow where I *need* imageUrl, and I&#x27;m going to carry over everything else
	I was sent, BUT that, so I can return tags + original stuff.
	*&#x2F;
	let result = {};
	for(key in args) {
		if(key !== &#x27;imageUrl&#x27;) result[key] = args[key];
	}

	let visual_recognition = new VisualRecognitionV3({
		api_key: args.api_key,
		version_date: &#x27;2016-05-20&#x27;
	});

	var params = {
    	url: args.imageUrl
    };
	
	return new Promise((resolve, reject) =&gt; {
		console.log(&#x27;Entered identify, looking for &#x27;+args.imageUrl);
		visual_recognition.classify(params, (err, res) =&gt; {
			if (err) { 
				reject({% raw %}{error:err}{% endraw %});
			} else {
				&#x2F;&#x2F;array of tags
				let tags = res.images[0].classifiers[0].classes;
				console.log(&#x27;got these tags&#x27;, tags);
				&#x2F;*
				ok, given that we have N tags, each has a class (label) and score. Let&#x27;s sort by score first
				*&#x2F;
				tags = tags.sort((one,two) =&gt; {
					if(one.score &gt; two.score) return -1;
					if(one.score === two.score) return 0;
					return 1;
				});
				result.tags = tags;
				console.log(&#x27;leaving with &#x27;+JSON.stringify(result));
				resolve(result);
			}

		});

	});

}
</code></pre>

So, the Watson npm package makes identification easy. But I ran into a problem with the OpenWhisk version. OpenWhisk has a *slightly* older version of the package. That meant the sample code didn't work exactly as I would like, specifically there wasn't a constant for `version_date` in the package. It was easy to fix, but kinda threw me a bit. 

The next problem I had was more a philosophical one then anything else. I wrote this action first. Outside of that issue I just described, it was simple and worked well. But when I put this action inside a greater sequence, I realized I couldn't leave it "pure". What I mean is this...

My first action has information about the SMS message that I need my *last* action to know, specifically, who to send the message to and from what phone number. In order for action 3 to have this, I have to pass it to action 2, and action 2 has to pass it on as well. I felt like I had ... I don't know, "sully" my pure action a bit by having it handle stuff that wasn't it's responsibility. Unfortunately, there really isn't a clean way of doing this. I mean, I could store data in a Cloudant record and clean it up when done, but that felt *way* over-engineered. In the end, I grimaced, and got over it. 

Now for the final action:

<pre><code class="language-javascript">const twilio = require(&#x27;twilio&#x27;);

function main(args) {
	return new Promise((resolve, reject) =&gt; {

	    var client = new twilio(args.accountSid, args.authToken);
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
        client.messages.create({
            body: message,
            to: args.from,  
            from: args.to
        })
        .then((message) =&gt; {
            resolve({% raw %}{result:1}{% endraw %});
        })
        .catch(err =&gt; {
            console.log(err);
            reject({% raw %}{error:err}{% endraw %});
        });

	});
}
</code></pre>

As you can see, the main thing I do is try to create a plain English version of the results. This not very intelligent. For example, I don't use "an" instead of "a" when the tag begins with a vowel. I could also make it a bit random so it seems more human. But in the end, it worked ok.

All in all, everything worked very well. I did see some lag at times with Twilio. For example, I had 3 test messages show up a few hours late. I'm not sure why and I guess I could investigate more on why. That's probably the cell network more than anything else. 

I can say that the dashboard Twilio has for messages is hella good as well. It provided a wealth of data and helped me test.

<img title="Dashboard" src="https://static.raymondcamden.com/images/2017/6/sms_2.jpg" class="imgborder">

In the screenshot above you only see incoming messages but you can change the dropdown to outgoing as well. As I said, working with Twilio is really, really freaking easy. I definitely recommend it if you have any voice/sms/etc type needs. If you want the full code to my actions above, you can get it on my repo here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/smsidentify