---
layout: post
title: "An Early Look at Netlify Scheduled Functions"
date: "2022-02-04T18:00:00"
categories: ["jamstack","serverless"]
tags: []
banner_image: /images/banners/watch.jpg
permalink: /2022/02/04/an-early-look-at-netlify-scheduled-functions.html
description: An example of using the (still in beta!) Netlify Scheduled functions feature.
---

Earlier this week Netlify [announced](https://www.netlify.com/blog/quirrel-joins-netlify-and-scheduled-functions-launches-in-beta) their acquisition of Quirrel and (more importantly to me), the beta release of scheduled functions. As the name implies, this is the ability to write Netlify serverless functions that run on a particular schedule. It's currently [documented](https://github.com/netlify/labs/blob/main/features/scheduled-functions/documentation/README.md) over on their Labs repository, and it's certainly possible it will change before it's official release, I thought I'd build a quick example of this to see how it worked.

I began by creating a new web site. Here it is. All of it.

```html
<h1>Hello World</h1>
```

But check out that Lighthouse score...

<p>
<img data-src="https://static.raymondcamden.com/images/2022/02/ns1.jpg" alt="100 Lighthouse score like a G6" class="lazyload imgborder imgcenter">
</p>

I then went ahead and created a GitHub repository, added my code to it, and made a new Netlify site that tied to it. Back in my command line, I used the CLI to generate a new function (`ntl functions:create rebuild`), and copied the code from the [docs](https://github.com/netlify/labs/blob/main/features/scheduled-functions/documentation/README.md). 

```js
const { schedule } = require('@netlify/functions');

const handler = async function(event, context) {
    console.log("Received event:", event);

    return {
        statusCode: 200,
    };
};

module.exports.handler = schedule("@hourly", handler);
```

I started my site (`ntl dev`), and then used the CLI to hit the function (`ntl functions:invoke rebuild`) and took a look at the event object. (One thing Netlify has not done a great job of is fully documenting the event structure passed to various Netlify functions tied to events.) Here's how it looked:

```js
 {
  path: '/.netlify/functions/rebuild',
  httpMethod: 'POST',
  queryStringParameters: {},
  multiValueQueryStringParameters: {},
  headers: {
    'x-forwarded-for': '::ffff:127.0.0.1',
    host: 'localhost:8888',
    connection: 'close',
    'accept-encoding': 'gzip,deflate',
    'content-length': '2',
    accept: '*/*',
    'content-type': 'text/plain;charset=UTF-8',
    'user-agent': 'Netlify Clockwork',
    'client-ip': '127.0.0.1',
    'X-NF-Event': 'schedule'
  },
  multiValueHeaders: {
    'x-forwarded-for': [ '::ffff:127.0.0.1' ],
    host: [ 'localhost:8888' ],
    connection: [ 'close' ],
    'accept-encoding': [ 'gzip,deflate' ],
    'content-length': [ '2' ],
    accept: [ '*/*' ],
    'content-type': [ 'text/plain;charset=UTF-8' ],
    'user-agent': [ 'Netlify Clockwork' ],
    'client-ip': [ '127.0.0.1' ]
  },
  body: '{"next_run":"2022-02-05T00:00:00.000Z"}',
  isBase64Encoded: false,
  rawUrl: 'http://localhost:8888/.netlify/functions/rebuild',
  rawQuery: ''
}
```

Most of this probably isn't useful (although I like that user-agent), but the body is really helpful. If we grab the body and parse it...

```js
let body = JSON.parse(event.body);
console.log(body);
```

We can more clearly see what it's showing:

```js
{ next_run: '2022-02-04T20:00:00.000Z' }
```

Nice! Your function knows when it will run again. I can see that being useful. 

So - one of the first things I immediately thought of was using this feature as a way to schedule rebuilds. This is actually listed in the announcement blog about one of the possible use cases. 

To enable this,  you need to go into your "Build hooks" section of your site's "Build &amp; deploy" settings. There you can add a new hook:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/02/ns2.jpg" alt="Form to add a new build hook" class="lazyload imgborder imgcenter">
</p>

Once you add it, you get a secret URL:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/02/ns3.jpg" alt="Build hook with part of the URL obscured..." class="lazyload imgborder imgcenter">
</p>

In order to trigger a build, you need to make a POST request. So I modified my scheduled function like so:

```js
const { schedule } = require('@netlify/functions');
const fetch = require('node-fetch');

const REBUILD_URL = process.env.rebuildurl;

const handler = async function(event, context) {

    await fetch(REBUILD_URL, { method: 'POST'});

    return {
        statusCode: 200,
    };
};

module.exports.handler = schedule("@daily", handler);
```

First, note that I'm getting my rebuild URL via an environment variable. I simply copied the URL from the build hooks section and added it as a new environment setting. 

Next, I do my POST.

And that's it. I also changed my schedule to `@daily` so it rebuilds once a day. I tested again via the CLI (`ntl functions:invoke rebuild`) and had the "Deploys" part of my Netlify site up. I could see it firing!

<p>
<img data-src="https://static.raymondcamden.com/images/2022/02/ns4.jpg" alt="Success build of the site based on the scheduled task." class="lazyload imgborder imgcenter">
</p>

And that's it. I'm *really* happy with how easy Netlify made this, especially with them supporting the "simpler" shortcut aliases for CRON. There isn't anything more to the code than what I've shown here, but you can peruse the repo if you would like: <https://github.com/cfjedimaster/netlify_scheduled_functions_test>. I'd also love to know how you plan on using this, so reach out with your ideas!

Photo by <a href="https://unsplash.com/@sonjalangford?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Sonja Langford</a> on <a href="https://unsplash.com/s/photos/schedule?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  