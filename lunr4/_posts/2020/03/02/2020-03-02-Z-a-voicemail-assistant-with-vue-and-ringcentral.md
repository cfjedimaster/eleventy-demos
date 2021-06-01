---
layout: post
title: "A Voicemail Assistant with Vue and RingCentral"
date: "2020-03-02T19:00:00.000Z" 
categories: ["javascript"]
tags: []
banner_image: /images/banners/oldpayphone.jpg
permalink: /2020/03/02/a-voicemail-assistant-with-vue-and-ringcentral
description: 
---

I've been playing with the [RingCentral](https://developers.ringcentral.com/) APIs the past week or so and today I've got another one to share. When you sign up with RingCentral, you get access to a full phone system. By that I mean the ability to manage phone numbers assigned to users, work with forwarding, set greetings, and access voicemail. There's an admin portal UI to manage this along with APIs that provide the same power as well.

One of the cooler things you can do is access the call log for a user. This gives you insight into incoming and outgoing phone calls. For my demo I wanted to write an app that would report on incoming calls and look for voicemails. For calls with voicemails, I wanted the ability to play the audio via the browser. Here's the UI of what I came up with:

<img src="https://static.raymondcamden.com/images/2020/03/rc1.png" alt="Table of calls" class="imgborder imgcenter">

For each call (incoming call remember), I report on the time, duration, caller, and the 'result', which in this case is always voicemail. In a real application you would have calls that our picked up at times of course. Clicking the "Play" button retrieves the audio of the call and plays it in the browser.

The application was built with Vue.js on the front end and using Netlify serverless functions on the back end. I'll share a little secret. Even though I used Netlify, I never actually deployed this live. I did everything local with `netlify dev` in order to simply prototype my demo and explore the APIs. 

My application consists of three main parts - the front end HTML, the front end JavaScript, and the back end serverless functions. Let's cover the front end first. Here's the HTML, which primarily just handles displaying that lovely table.

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Call Log Demo</title>
	<style>
	[v-cloak] {display: none}

	body {
		font-family: Verdana, Geneva, Tahoma, sans-serif;
	}

	table {
		width: 80%;
		border-collapse: collapse;
		border: 3px solid #000000;
	}

	tbody tr:nth-child(odd) {
		background-color: #d0d0d0;
	}

	td {
		border: 3px solid #000000;
		padding: 5px;
	}
	</style>
</head>
<body>

<div id="app" v-cloak>

	<table>
		<thead>
			<tr>
				<th>Time</th>
				<th>Duration</th>
				<th>To</th>
				<th>From</th>
				<th>Result</th>
			</tr>
		</thead>
		<tbody v-if="calls">
			<tr v-for="call in calls">
				<td>{% raw %}{{call.startTime | dtFormat }}{% endraw %}</td>
				<td>{% raw %}{{call.duration}}{% endraw %}s</td>
				<td>{% raw %}{{call.to.name}}{% endraw %}</td>
				<td>{% raw %}{{call.from.phoneNumber}}{% endraw %}<br/>{% raw %}{{call.from.location}}{% endraw %}</td>
				<td>
					{% raw %}{{call.result}}{% endraw %}
					<span v-if="call.hasRecording">
						<button @click="playRecording(call.recordingId)">Play</button>
					</span>
				</td>
			</tr>
		</tbody>
	</table>
</div>


<script src="https://unpkg.com/vue"></script>
<script src="app.js"></script>

</body>
</html>
```

As you can see, I'm iterating over a `calls` variable. The API I'm using returns more information than you see used above, but I wanted to keep it simple. Now let's look at the JavaScript:

```js
Vue.filter('dtFormat', d => {
	d = new Date(d);
	if(Intl) {
		return new Intl.DateTimeFormat().format(d) + ' ' + new Intl.DateTimeFormat(navigator.language, {hour:'numeric',minute:'2-digit'}).format(d);
	} else {
		return d;
	}
})

const app = new Vue({
	el:'#app',
	data: {
		calls:[],
		audio:null
	},
	async created() {
		this.calls = await loadCalls();
	},
	methods: {
		async playRecording(u) {
			let data = await fetch('./.netlify/functions/getMessage?id='+u);
			let response = await data.text();
			if(this.audio) {
				this.audio.pause();
				this.audio.currentTime = 0;
			}
			this.audio = new Audio(response);
			this.audio.play();
		}
	}
});

async function loadCalls() {
	let data = await fetch('./.netlify/functions/callLog');
	let response = await data.json();
	// make it easier for our template to know if there is a recording
	response.records.forEach(r => {
		r.hasRecording = false;
		if (r.result === 'Voicemail' && r.message) {
			r.recordingId = r.message.id;
			r.hasRecording = true;
		}
	});
	return response.records;
}
```

As a Vue app it's pretty simple. My data consists of `calls` and an audio object used to play voicemails. On `created`, I call off to `loadCalls` which hits my server side function to work with the RingCentral API. When I get the result, I do a bit of checking to see if I have a voicemail and if so, float up the id value a bit higher. This makes my HTML a bit simpler. 

When we do have voicemails, I've got another method that calls the server side function to ask for the URL of the audio bits itself. I've talked about these server side functions a bit now so let's take a look.

The first one gets the log of calls. This is *really* nicely [documented](https://developers.ringcentral.com/api-reference/Call-Log/readUserCallLog) along with some great testing utilities built right in the browser. I did a lot of testing right there before copying stuff over to my code. For this API there were three arguments I tweaked. I used the detailed view, set it to incoming calls only, and set the `dateFrom` to January 1, 2020. That date was totally arbitrary and I'd typically *not* use a hard coded value. Here's the serverless function.

```js
const fetch = require('node-fetch');

const SDK = require('@ringcentral/sdk').SDK;

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
const platform = rcsdk.platform();

exports.handler = async function(event, context) {

  await rcLogin();
  let callLog = await rcCallLog();
  console.log(callLog);

    return {
      headers: {
        "Content-Type":"application/json"
      },
      statusCode: 200,
      body: JSON.stringify(callLog)
    }

}

async function rcLogin() {
  return platform.login({
    username: RINGCENTRAL_USERNAME,
    password: RINGCENTRAL_PASSWORD,
    extension: RINGCENTRAL_EXTENSION
  });
}

async function rcCallLog() {

  let resp = await platform.get('/restapi/v1.0/account/~/extension/~/call-log', {
    view: 'Detailed',
    direction: 'Inbound',
    dateFrom:'2020-01-1'
  });
  return resp.json();

}
```

The beginning of this function handles setting my credentials. The handler logs into the platform and then performs the HTTP call to the API. I'm using their npm package (`@ringcentral/sdk`) which makes the code pretty minimal. I return the entire dataset and as I said, there's more to it then I show on the page. As I said, their [docs](https://developers.ringcentral.com/api-reference/Call-Log/readUserCallLog) are pretty darn verbose and will help you.

The last part of this is how I handle the voicemail recordings. This function was a carbon copy of the previous one in terms of setup. I mainly just changed the API call and how I return data:

```js
const fetch = require('node-fetch');

const SDK = require('@ringcentral/sdk').SDK;

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
const platform = rcsdk.platform();

exports.handler = async function(event, context) {
  let id = event.queryStringParameters.id;

  await rcLogin();
  let msg = await rcGetMessage(id);
  let uri = msg.attachments[0].uri;
  let authData = await platform.auth().data();
  let url = uri + '?access_token='+authData.access_token;

    return {
      statusCode: 200,
      body: url
    }

}

async function rcLogin() {
  return platform.login({
    username: RINGCENTRAL_USERNAME,
    password: RINGCENTRAL_PASSWORD,
    extension: RINGCENTRAL_EXTENSION
  });
}

async function rcGetMessage(id) {
  console.log('get id '+id);
  let resp = await platform.get('/restapi/v1.0/account/~/extension/~/message-store/'+id);
  return resp.json();

}
```

I use their [GetMessage](https://developers.ringcentral.com/api-reference/Message-Store/readMessage) API call. But once I have the result, I can look at the attachment URL and create a new URL that includes the current access_token. This is probably a bad idea, but it lets me return a URL the browser can just "play".

And that's it! Let me know what you think. This little demo isn't in a GitHub repo but I'm definitely willing to share.