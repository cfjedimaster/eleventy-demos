---
layout: post
title: "Adding a SMS Alert for Netlify Builds with RingCentral"
date: "2020-02-22"
categories: ["static sites","javascript"]
tags: []
banner_image: /images/banners/oldpayphone.jpg
permalink: /2020/02/22/adding-a-sms-alert-for-netlify-builds-with-ringcentral
description: A look at RingCentral's SMS feature and Netlify deploy events.
---

I'm currently sitting in the Atlanta airport waiting to fly home from one of my favorite conferences, [DevNexus](https://devnexus.com/). While there, my buddy [Todd Sharp](https://recursive.codes/) introduced me to [RingCentral](https://developers.ringcentral.com/). RingCentral is a telecom API provider that reminds me a lot of Nexmo and Twilio. I've enjoyed working with both of those companies APIs so this morning I spent some time playing with RingCentral as well. 

They have a great developer onboarding experience. I was able to setup an account in a minute or so. I then looked at one of their first walkthoughs, [SMS JavaScript Quick Start](https://developers.ringcentral.com/guide/messaging/quick-start/node) and was happy to see it worked right out of the box. Here's what their sample SMS sending code looks like:

```js
const SDK = require('@ringcentral/sdk').SDK

RECIPIENT = '<ENTER PHONE NUMBER>'

RINGCENTRAL_CLIENTID = '<ENTER CLIENT ID>'
RINGCENTRAL_CLIENTSECRET = '<ENTER CLIENT SECRET>'
RINGCENTRAL_SERVER = 'https://platform.devtest.ringcentral.com'

RINGCENTRAL_USERNAME = '<YOUR ACCOUNT PHONE NUMBER>'
RINGCENTRAL_PASSWORD = '<YOUR ACCOUNT PASSWORD>'
RINGCENTRAL_EXTENSION = '<YOUR EXTENSION, PROBABLY "101">'

var rcsdk = new SDK({
    server: RINGCENTRAL_SERVER,
    clientId: RINGCENTRAL_CLIENTID,
    clientSecret: RINGCENTRAL_CLIENTSECRET
});
var platform = rcsdk.platform();
platform.login({
    username: RINGCENTRAL_USERNAME,
    password: RINGCENTRAL_PASSWORD,
    extension: RINGCENTRAL_EXTENSION
    })
    .then(function(resp) {
        send_sms()
    });

function send_sms(){
  platform.post('/restapi/v1.0/account/~/extension/~/sms', {
       from: {'phoneNumber': RINGCENTRAL_USERNAME},
       to: [{'phoneNumber': RECIPIENT}],
       text: 'Hello World from JavaScript'
     })
     .then(function (resp) {
        console.log("SMS sent. Message status: " + resp.json().messageStatus)
     });
}
```

My only complaint was that the lack of semicolons in the beginning made me twitch a bit. I would also like to see an async/await version of it (which you'll see in a second ;). Once I confirmed it worked, I then figured out a simple demo I'd build.

One of the cooler features of Netlify is the ability to run events on [triggered events](https://docs.netlify.com/functions/trigger-on-events/#available-triggers). One of those events is `deploy-succeeded` which lets you do something after a build is done. All you need to do is name a function `deploy-succeeded.js` and it will be executed automatically.

Unfortunately, and I love you Netlify, honest, they still do not document, completely, the information sent to these events. In my case it wasn't necessarily important. I just wanted to know the build succeeded. I had to do some console.logs, copying and pasting, and formatting to get to the information. Again, Netlify, I love you, but take the 5 minutes to add this information to the docs. 

<img src="https://static.raymondcamden.com/images/2020/02/lackofdocs.jpg" alt="Vader talking about the lack of docs" class="imgborder imgcenter">

That being said, I was able to find two values in the payload I thought would be useful, `published_at` and `deploy_time`, which reports the time in it took to make the build in seconds. I thought it would be cool to integrate RingCentral's SMS support and use these two values. Here's the function I built.

```js
const SDK = require('@ringcentral/sdk').SDK;

RECIPIENT = process.env.SMS_RECIP;

RINGCENTRAL_CLIENTID = process.env.RINGCENTRAL_CLIENTID;
RINGCENTRAL_CLIENTSECRET = process.env.RINGCENTRAL_CLIENTSECRET;
RINGCENTRAL_SERVER = process.env.RINGCENTRAL_SERVER;

RINGCENTRAL_USERNAME = process.env.RINGCENTRAL_USERNAME;
RINGCENTRAL_PASSWORD = process.env.RINGCENTRAL_PASSWORD;
RINGCENTRAL_EXTENSION = process.env.RINGCENTRAL_EXTENSION;

var rcsdk = new SDK({
    server: RINGCENTRAL_SERVER,
    clientId: RINGCENTRAL_CLIENTID,
    clientSecret: RINGCENTRAL_CLIENTSECRET
});
var platform = rcsdk.platform();

exports.handler = async (event, context) => {
  try {

    console.log('deploy succeeded run!');
    let pubData = JSON.parse(event.body).payload;

    // get the time
    let buildTime = pubData.published_at;
    //in seconds;
    let buildDuration = pubData.deploy_time;

    console.log(`BUILT at ${buildTime} in ${buildDuration} seconds`);
    await sendSMS(buildTime, buildDuration);

    return {
      statusCode: 200,
      body: ''
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}

async function sendSMS(time,duration) {

	await platform.login({
		username: RINGCENTRAL_USERNAME,
		password: RINGCENTRAL_PASSWORD,
		extension: RINGCENTRAL_EXTENSION
		});
	let resp = await platform.post('/restapi/v1.0/account/~/extension/~/sms', {
		from: {'phoneNumber': RINGCENTRAL_USERNAME},
		to: [{'phoneNumber': RECIPIENT}],
		text: `Site built at ${time} and took ${duration} seconds.`
  });
	
  let data = await resp.json();
  return data;

}
```

The top portion of my code is a block of statements simply copying environment variables into a simpler variable scope. Netlify lets you specify secrets in environment variables. Since my site was tied to GitHub, it would not have made sense to check in code with secrets. (Not that I've ever done that. Honest.) 

My main handler code parses the event information sent in and grabs the values I care about. (And again, there's a lot more. I'd like to share my payload but I'm not sure if there's anything sensitive in there, and also, Netlify should document it!) I then call `sendSMS`. This is roughly the same logic as their sample code, but rewritten with hipster await awesomeness. 

With that written (well, code like this), I committed and triggered a build. I then discovered that if you have a bug in your handler, the entire build fails. That's a *good* thing in my opinion. But it's not documented. (Are you sensing a theme here?) I fixed my bug and voila:

<img src="https://static.raymondcamden.com/images/2020/02/sms.png" alt="Example text messages" class="imgborder imgcenter">

Note that the first few messages were me testing, and the watermark goes away from "real" accounts. Let me know what you think. I'm going to be playing with RingCentral for a while so expect more posts!

<i>Header photo by <a href="https://unsplash.com/@myke_simon?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Myke Simon</a> on Unsplash</i>