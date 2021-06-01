---
layout: post
title: "Enhancing Your Netlify Build Notifications"
date: "2020-05-29"
categories: ["serverless","static sites"]
tags: []
banner_image: /images/banners/mail.jpg
permalink: /2020/05/29/enhancing-your-netlify-build-notifications
description: Using Netlify event triggers to send detailed mail on build notifications
---

One of the features Netlify supports is sending an email to you on various events. One of them is a successful build. Here's what it looks like:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/netlify1.png" alt="" class="lazyload imgborder imgcenter">
</p>

Short and sweet. But I really want a bit more information about the build, specifically how long it took. Netlify is quick, but my site is rather large. Every now and then I screw things up and one of the ways I can quickly tell is by seeing how long a build took. All of this information is available and I can go to the Netlify site to get those details, but it would be nice if my email simply passed that along. 

Luckily, Netlify supports [triggers](https://docs.netlify.com/functions/trigger-on-events/#available-triggers) that let you fire off calls to serverless functions based on various events. Right now the details of the information sent isn't documented, so my initial work was just setting up a function (properly named, Netlify uses the name to associate it with the event) and using console.log to look at the payload. While kinda spelled out in the text, but not made clear, this data will be in your `event.body` value passed to the function and will be a JSON string. To look at the payload, I used this:

```js
let pubData = JSON.parse(event.body).payload;
console.log(pubData);
```

There's no way to retrieve logs from functions via the CLI so I used the Function tab in my Netlify site to view the output. It's hard to read so I literally copied it to my browser console, re-parsed it (it was in string form in the log of course), copied to my clipboard, and pasted it into my editor. Here's what payload looks like. There are a few values I think may be sensitive so I've replaced them with the name of my favorite character from My Little Pony.

```js
"payload": {
	"id": "juniper montage",
	"site_id": "9727f051-52fd-4ae7-9128-a0812610ca69",
	"build_id": "5ed1214aa9b8d70007a87964",
	"state": "ready",
	"name": "raymondcamden",
	"url": "https://www.raymondcamden.com",
	"ssl_url": "https://www.raymondcamden.com",
	"admin_url": "https://app.netlify.com/sites/raymondcamden",
	"deploy_url": "http://master--raymondcamden.netlify.app",
	"deploy_ssl_url": "https://master--raymondcamden.netlify.app",
	"created_at": "2020-05-29T14:50:50.922Z",
	"updated_at": "2020-05-29T14:56:14.401Z",
	"user_id": "juniper montage",
	"error_message": null,
	"required": [],
	"required_functions": [],
	"commit_ref": "b10e3145baf01f900cd3376257102ee89c5a1c3e",
	"review_id": null,
	"branch": "master",
	"commit_url": "https://github.com/cfjedimaster/raymondcamden2020/commit/b10e3145baf01f900cd3376257102ee89c5a1c3e",
	"skipped": null,
	"locked": null,
	"log_access_attributes": {
		"type": "firebase",
		"url": "https://juniper montage",
		"endpoint": "https://netlify-builds3.firebaseio.com",
		"path": "/builds/juniper montage/log",
		"token": "juniper montage"
	},
	"title": "testing func3",
	"review_url": null,
	"published_at": "2020-05-29T14:56:14.166Z",
	"context": "production",
	"deploy_time": 319,
	"available_functions": [
		{
		"n": "deploy-succeeded",
		"d": "09b55bccc9cbe877bd6bc34eee1dc6f5bc75f332b531edca34e636cff2557e76",
		"id": "d80076a174194017b771fccf6e9aebefbcf1265780b86010282d6d3e38bcca75",
		"a": "998805804580",
		"c": "2020-05-29T14:52:59.641Z",
		"r": "nodejs12.x",
		"s": 563
		}
	],
	"summary": {
		"status": "ready",
		"messages": [
		{
			"type": "info",
			"title": "2 new files uploaded",
			"description": "2 assets changed.",
			"details": null
		},
		{
			"type": "info",
			"title": "89 redirect rules processed",
			"description": "All redirect rules deployed without errors.",
			"details": ""
		},
		{
			"type": "info",
			"title": "No header rules processed",
			"description": "This deploy did not include any header rules. [Learn more about headers](https://www.netlify.com/docs/headers-and-basic-auth/).",
			"details": ""
		},
		{
			"type": "info",
			"title": "All linked resources are secure",
			"description": "Congratulations! No insecure mixed content found in your files.",
			"details": null
		}
		]
	},
	"screenshot_url": null,
	"site_capabilities": {
		"title": "Netlify Team Premium",
		"asset_acceleration": true,
		"form_processing": true,
		"cdn_propagation": "partial",
		"build_gc_exchange": "buildbot-global-gc",
		"build_node_pool": "buildbot-global",
		"domain_aliases": true,
		"secure_site": true,
		"prerendering": true,
		"proxying": true,
		"ssl": "custom",
		"rate_cents": 0,
		"yearly_rate_cents": 0,
		"ipv6_domain": "global.netlify.com",
		"branch_deploy": true,
		"managed_dns": true,
		"geo_ip": true,
		"split_testing": true,
		"role_access_control": true,
		"cdn_fanout": "global.netlify.com",
		"account_audit": true,
		"site_global_access_controls": true,
		"id": "nf_team_business",
		"cdn_tier": "custom",
		"analytics": {
		"pageviews": {
			"unlimited": true,
			"unit": "pageviews"
		}
		},
		"forms": {
		"submissions": {
			"unlimited": true,
			"unit": "submissions"
		},
		"storage": {
			"unlimited": true,
			"unit": "bytes"
		},
		"use_functions": true
		},
		"functions": {
		"invocations": {
			"unlimited": true,
			"unit": "requests"
		},
		"runtime": {
			"unlimited": true,
			"unit": "seconds"
		}
		}
	},
	"committer": "cfjedimaster",
	"skipped_log": null,
	"manual_deploy": false,
	"file_tracking_optimization": true,
	"plugin_state": "success"
}
```

That's a lot of data, but I can see what I need, published_at and deploy_time. I also think the summary messages are useful too. With that in mind, I built this relatively simple function to email me those details:

```js
const SG_KEY = process.env.SENDGRID;

const helper = require('sendgrid').mail;

exports.handler = async (event, context) => {
  try {

    console.log('deploy succeeded run!');
    let pubData = JSON.parse(event.body).payload;
    let body = `
Deploy Succeeded for ${pubData.name} (${pubData.url})

Build Title: ${pubData.title}
Finished:    ${pubData.published_at}
Duration:    ${toMinutes(pubData.deploy_time)}
    `;

    if(pubData.summary && pubData.summary.messages) {
      body += `
Messages:`;
      pubData.summary.messages.forEach(msg => {
        body += `

[${msg.type}] ${msg.title}
${msg.description}`;
      });
    }

    await sendEmail(body, 'Netlify Build Succeeded', 'raymondcamden@gmail.com', 'raymondcamden@gmail.com');

  } catch (err) {
    console.log('error handler for function ran', err.toString());
    return { statusCode: 500, body: err.toString() }
  }
}

function toMinutes(s) {
	if(s < 60) return `${s} seconds`;
	let minutes = (s - (s % 60)) / 60;
	return `${minutes}m ${s%60}s`;
}

async function sendEmail(body, subject, from, to) {
  let mailContent = new helper.Content('text/plain', body);
  let from_email = new helper.Email(from);
  let to_email = new helper.Email(to);
  let mail = new helper.Mail(from_email, subject, to_email, mailContent);
  let sg = require('sendgrid')(SG_KEY);

  let request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  return new Promise((resolve, reject) => {
    sg.API(request, function(error, response) {
      resolve(true);
      if(error) {
        console.log(JSON.stringify(error.response));
        reject(error.response.body);
      }
    });
  });
}
```

I start off creating a `body` string that includes the bits I care about. I wrote a `toMinutes` function that pretty much mimics how Netlify itself renders build durations. I then pass this off to SendGrid to handle the mail. One thing I wish Netlify has that [Pipedream](https://pipedream.com) does is a simple way to "mail the owner". Ie I would love to do:

```js
$mail(body);
```

And it would simply send it to the email address on file for the current site. And here's an example of the result:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/netlify2.png" alt="Email sample" class="lazyload imgborder imgcenter">
</p>

By the way, "Build Title" is driven by the Git commit message and will be "null" in a manual build. I could support that in my email so it looks nicer, but I'm fine with "null".  You can find the code for the function, and the rest of my site, up on GitHub: <https://github.com/cfjedimaster/raymondcamden2020>.
