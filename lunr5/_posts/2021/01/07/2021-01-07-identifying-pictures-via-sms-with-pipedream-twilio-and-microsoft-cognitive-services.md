---
layout: post
title: "Identifying Pictures via SMS with Pipedream, Twilio, and Microsoft Cognitive Services"
date: "2021-01-07"
categories: ["serverless"]
tags: ["pipedream"]
banner_image: /images/banners/pictures.jpg
permalink: /2021/01/07/identifying-pictures-via-sms-with-pipedream-twilio-and-microsoft-cognitive-services
description: How I built an image recognition service using Pipedream and Twilio
---

Nearly three and a half years ago I wrote a blog post on using IBM OpenWhisk (sigh, I wish I could still recommend it), [Twilio](https://www.twilio.com/) and IBM Watson: [Handling SMS with OpenWhisk, IBM Watson, and Twilio](https://www.raymondcamden.com/2017/06/29/handling-sms-with-openwhisk-ibm-watson-and-twilio/). In the past, I described how I built a serverless function in OpenWhisk that was used as a webhook for Twilio. I'd send a text to a number and Twilio would fire off the request to my function. I looked for an attached picture, uploaded it to IBM Watson's image recognition service, and reported back to the user what was identified in the picture. 

For some reason, that particular blog post (and the [followup](https://www.raymondcamden.com/2017/07/07/handling-sms-with-openwhisk-ibm-watson-and-twilio-an-update/)) has been getting an incredible amount of traffic lately on my blog. (If you're curious, they have gotten over thirty thousand pageviews in the past moth.) Looking at those stats, I thought it might be time to revisit the topic and see if I could build it quicker in [Pipedream](https://pipedream.com/). Turns out the answer was yes. In fact, I'd say I had the entire thing rebuil in about thirty minutes of work, and ten of that was me trying to fix a bug that was completely stupid on my part (using GET instead of POST) for my request. So, how did I build it?

First, I ensured that I had a phone number set up with Twilio. Twilio has an excellent free tier and as part of that, you can create phone numbers that can be used for testing. I'd suggest doing that *first* (well, if you want to replicate what I did). I already had an account with them, but numbers I had used in the past were deprovisioned at some point. It took all of about two seconds to create a new one.

With that in place, on Pipedream I created a new Twilio event source. They have one specifically for incoming SMS:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/sms1.jpg" alt="Twilio SMS Event Source" class="lazyload imgborder imgcenter">
</p>

In this process you will enter your Twilio keys, and as soon as it's authenticated, the Pipedream UI will be able to fetch your available phone numbers and let you select it. Honestly I was really impressed with how easy that was. Once created, I could test it immediately by sending a text to the number:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/sms2.jpg" alt="Testing SMS events" class="lazyload imgborder imgcenter">
</p>

Ok, so with that source working well, I created a new workflow. The workflow would fire every time a SMS message was received. I then needed to do the following:

* See if a picture was attached.
* If so, send it to my identification service.
* Send the results to the user.
* Or if they didn't send a picture, tell them that.

For my identification service, I decided to use Microsoft's [Computer Vision](https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/) API. Unlike the times I've used it in the past, it looks like they have a proper free tier now. In the past it was a time limited free preview, but now it's actually *free* free, which is cool. After I got my keys for that service, I then wrote my first action step in my workflow:

```js
async (event, steps) => {

	if(steps.trigger.event.MediaUrl0) {
		const fetch = require('node-fetch');

		let img = steps.trigger.event.MediaUrl0;
		console.log('going to process image: ',img);

		let info = {
			url:img
		};
		
		let resp = await fetch(`${process.env.MS_COG_EP}/vision/v3.1/analyze?visualFeatures=Categories,Description`,{
			method:'POST',
			headers:{
			'Content-Type':'application/json',
			'Accept':'application/json',
			'Ocp-Apim-Subscription-Key': process.env.MS_COG_KEY
			},
			body:JSON.stringify(info)
		});
		let data = await resp.json();
		this.text = `

		I parsed your image and found: ${data.description.captions[0].text}

		Here's other things I noted: ${data.description.tags.join(', ')}
		`;
	
	} else {
		this.text = `
		To use this service, please text a picture to me.
		`
	}
}
```

Let's break this down. The first thing I do is look for the presense of an attached image. How did I know it was `event.MediaUrl0`? I looked at the event source events which lets you dig in the data. You can also do this in the workflow itself by using the test feature. It lets you pick from multiple previous events. 

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/sms3.jpg" alt="Looking at the event data" class="lazyload imgborder imgcenter">
</p>

Ok, back to the code. THe value I look for (`MediaUrl0`), is a URL pointing to the image. You can open that in your browser to test. I noticed that when I used Microsoft's online tester for the API, it didn't like the fact that Twilio's URLs didn't end in ".jpg" or some other image file type. But the API itself was totally fine with it.

In the result data (and note, I could do better error handling here, like, *any* error handling), I take both the descriptive text of the image as well as the list of tags. I specify this as the `text` value that will be exported from the step. 

The last part of the code handles telling the user they need to send an image if they want to use the service. 

So with that done, I need to send the text back. Guess what? Pipedream has a Twilio SMS sending action built. I literally added it and specified values for To, From, and Body. I didn't write one more line of code:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/sms4.jpg" alt="" class="lazyload imgborder imgcenter">
</p>

And that's literally it! I know I'm a complete fan boy when it comes to Pipedream, but I was blown away how much simpler this version was. I feel confident saying that 90% of my time was gathering keys, fighting my darn GET vs POST issue, and basically non-Pipedream stuff. So does it work? Yes! Here's some fun examples.

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/sms5.jpg" alt="Picture of a glass of water" class="lazyload imgborder imgcenter">
</p>

And another...

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/sms6.jpg" alt="Picture of a toy" class="lazyload imgborder imgcenter">
</p>

And another...

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/sms7.jpg" alt="Glass of wine" class="lazyload imgborder imgcenter">
</p>

Who else had wine last night? And finally, my son being my son:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/sms8.jpg" alt="" class="lazyload imgborder imgcenter">
</p>

Want to try this out yourself? View and copy the workflow URL: <https://pipedream.com/@raymondcamden/identify-picture-p_mkCkL5o>

<span>Photo by <a href="https://unsplash.com/@anniespratt?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Annie Spratt</a> on <a href="https://unsplash.com/s/photos/pictures?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>