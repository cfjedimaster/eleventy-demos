---
layout: post
title: "Working with RingCentral Webhooks"
date: "2020-02-26"
categories: ["static sites","javascript"]
tags: []
banner_image: /images/banners/keys.jpg
permalink: /2020/02/26/working-with-ringcentral-webhooks
description: A look at how to setup and use RingCentral webhooks
---

As you know, I've been playing around with [RingCentral](https://developers.ringcentral.com/) lately. While working on another idea (for another post of course), I ran into some difficulty getting their webhook support working. While everything *is* documented, it didn't quite make sense to me and I had to get it working myself before I actually believed it worked. So with that in mind, here's how I got webhooks with RingCentral working.

### Stuff to Know First

First off, take a look at the docs for [Webhooks](https://developers.ringcentral.com/guide/notifications/manual/webhooks) on their platform. In some platforms, you simply specify a URL to hit for a webhook and you're good to go. RingCentral requires you to register a webhook via an API call. 

In order to use webhooks, your application has to enable that permission (this is under your app, Settings, OAuth Settings):

<img src="https://static.raymondcamden.com/images/2020/02/wh1.png" alt="Screen shot of the UI to add permissions" class="imgborder imgcenter">

Next, note that your webhook must be up and running before you register it. That's not necessarily a bad thing, but it was kind of surprising. In most cases a platform just assumes your URL will work and leaves it it up to you.

When registering your webhook, RingCentral is going to pass a header, `validation-token`, and if it exists, your webhook has to echo it back in a header and end the request.

To register a webhook, you tell RingCentral what events you care about. Getting that list was a bit difficult. If I read the docs right, the event is basically the same as the API related to that event. My code was working with voicemails, so I used this value: `/restapi/v1.0/account/~/extension/~/voicemail`. 

Now for the last bit, and this is the part I really don't like. When you register a webhook, it isn't permanent. No, it expires after a time. If you want, you can actually specify that you want the service to hit your webhook when it expires. And I guess you... just re-enable it again? Honestly I don't quite get this part. Maybe it's a security setting, but honestly it feels like a lot of burden on the developer. It's already difficult to setup the webhook compared to other services which just let you type in a URL, and this feels like pouring salt in the wound a bit. Now, there may be a *very* good reason for this setup. 

Ok, good news! So I was about to post to a forum thread where I asked why this was necessary (<https://forums.developers.ringcentral.com/questions/9774/purpose-of-webhook-expiration.html>), and it turns out the API to register a webhook supports an `expiresIn` value that can be set to as high as 20 years. As [Phong Vu](https://forums.developers.ringcentral.com/users/16525/phong1426275020.html) explains, instead of trying to listen for a callback saying the webhook expired, if you know the exact time it will expire, you could just schedule the re-register yourself.

So this is good! I still think RingCentral should support a "never expire" option, but I can deal with twenty years.

### The Code

What follows is "Get it Working" code. You should not consider this production ready unless your production system is run by these fine people: 

<img src="https://static.raymondcamden.com/images/2020/02/fraggles.jpg" alt="Fraggle Rock FTW!" class="imgborder imgcenter">

My code consists of two parts. First, I wrote a simple Node server with Express to handle my webhook. RingCentral has a [Node example](https://developers.ringcentral.com/guide/notifications/quick-start/webhook/node) as well but I wanted to use Express because, well, I always use Express when I do server stuff. That being said, I realized today I had not used Express in ages. Serverless has made me a bit lazy. So again, do not consider this code to best practice. Here's my webhook which handles the validation and then just logs the incoming request.

```js
//import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// define the Express app
const app = express();

// enhance your app security with Helmet
app.use(helmet());

// use bodyParser to parse application/json content-type
app.use(bodyParser.json());

// enable all CORS requests
app.use(cors());

// log HTTP requests
app.use(morgan('combined'));

// start the server
app.listen(8081, () => {
	console.log('listening on port 8081');
});

app.post('/webhook', (req,res) => {
	let vt = req.headers['validation-token'];
	if(vt) { 
		res.set('Validation-Token', vt);
		res.end();
	}
	console.log(JSON.stringify(req.body,null,'\t'));  
	res.send('ok');
});
```

The part you care about is at the end. You can see the validation support and then after that I simply dump the incoming data to the terminal. It's a pretty big object, but it's nicely documented here: <https://developers.ringcentral.com/api-reference/Voicemail-Message-Event> That's for Voicemails, but in the navigation you can see they define all the different event types.

I ran this and then used ngrok to create an externally facing proxy to my laptop. I've blogged about [ngrok](https://ngrok.com/) before and if you haven't checked it out, definitely do so. It's incredibly helpful for cases like this.

Now for the script I used to create the webhook. Here's the script I used:

```js
const SDK = require('@ringcentral/sdk').SDK

RECIPIENT = '3374128987'

RINGCENTRAL_CLIENTID = 'secret'
RINGCENTRAL_CLIENTSECRET = 'secret'
RINGCENTRAL_SERVER = 'https://platform.devtest.ringcentral.com'

RINGCENTRAL_USERNAME = 'so secret'
RINGCENTRAL_PASSWORD = 'super secret'
RINGCENTRAL_EXTENSION = '101'

var rcsdk = new SDK({
    server: RINGCENTRAL_SERVER,
    clientId: RINGCENTRAL_CLIENTID,
    clientSecret: RINGCENTRAL_CLIENTSECRET
});
var platform = rcsdk.platform();

(async function() {

	await platform.login({
		username: RINGCENTRAL_USERNAME,
		password: RINGCENTRAL_PASSWORD,
		extension: RINGCENTRAL_EXTENSION
	});

	let response = await rcsdk.send({
		method:'POST',
		url:'/restapi/v1.0/subscription', 
		body:{
			eventFilters:[
				'/restapi/v1.0/account/~/extension/~/voicemail'
			],
			deliveryMode: {
				'transportType':'WebHook',
				'address':'http://c45955bf.ngrok.io/webhook'
			}
		}

	});

	console.log(await response.json());	
	
})();
```

The important bits are the call to the subscription endpoint. You can see me specifying my filter for voicemail and the URL I got via ngrok. As I said above, I now know I can specify expiresIn in my call (here's the [full API doc](https://developers.ringcentral.com/api-reference/Subscriptions/createSubscription) for creating subscriptions) so I'd modify the above to specify the max value,  630720000. 

Ok, after all of that... it worked. I called the number RingCentral has assigned my user, left a voice mail, and saw my webhook get called in about five to ten seconds! I hope this helps. As I said, I found this to be very difficult to get working, but honestly it probably only took me an hour or so and now that I've got it working, I think I could do it again easily enough. Let me know if any of this doesn't make sense!

<i>Header photo by <a href="https://unsplash.com/@chunlea?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Chunlea Ju</a> on Unsplash</i>