---
layout: post
title: "Sending SMS Messages for Form Data with RingCentral and Netlify"
date: "2020-02-25"
categories: ["static sites","javascript"]
tags: []
banner_image: /images/banners/oldpayphone.jpg
permalink: /2020/02/25/sending-sms-messages-for-form-data-with-ringcentral-and-netlify
description: Using RingCentral's SMS API for form contents
---

A few days ago I blogged about using [RingCentral's APIs](https://developers.ringcentral.com/) to send a SMS message when your Netlify-based site builds (["Adding a SMS Alert for Netlify Builds with RingCentral"](https://www.raymondcamden.com/2020/02/22/adding-a-sms-alert-for-netlify-builds-with-ringcentral)). I thought I'd follow it up with a related example - sending a SMS with form data. To be clear, this post isn't too much different from the previous one, but I thought it was an interesting enough example to share.

Last year I [blogged](https://www.raymondcamden.com/2019/01/15/customized-form-handling-on-netlify-with-serverless-functions) about using Netlify serverless functions for form submissions. In that post I detail the data sent to the serverless payload (since, ahem, Netlify still doesn't document this). Based on that, here's the code I used to take the form submission and send it as a SMS:

```js
const SDK = require('@ringcentral/sdk').SDK;

// used for sms
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

  let payload = JSON.parse(event.body).payload;
  let name = payload.data.name;
  let email = payload.data.email;
  let comments = payload.data.comments;

  console.log(`name, ${name}, email, ${email}, comments, ${comments}`);

  const text = `
A form was sent by ${name} (email address of ${email}), with these comments: 
${comments}`;
  await sendSMS(text);

}

async function sendSMS(text) {

  await platform.login({
    username: RINGCENTRAL_USERNAME,
    password: RINGCENTRAL_PASSWORD,
    extension: RINGCENTRAL_EXTENSION
  });

  let resp = await platform.post('/restapi/v1.0/account/~/extension/~/sms', {
    from: {'phoneNumber': RINGCENTRAL_USERNAME},
    to: [{'phoneNumber': RECIPIENT}],
    text: text
  });
	
  let data = await resp.json();
  return data;
}
```

Basically - I create a formatted string and pass it to a function to handle sending the SMS. The result is much like my previous example:

<img src="https://static.raymondcamden.com/images/2020/02/nsms.png" alt="Screen shot of text sent by RingCentral" class="imgborder imgcenter">

As a reminder, that text watermark in front would *not* be there in a production-released RingCentral application. 