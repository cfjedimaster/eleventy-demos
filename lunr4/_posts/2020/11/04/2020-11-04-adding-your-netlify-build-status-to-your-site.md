---
layout: post
title: "Adding Your Netlify Build Status to Your Site"
date: "2020-11-04"
categories: ["serverless"]
tags: []
banner_image: /images/banners/build.jpg
permalink: /2020/11/04/adding-your-netlify-build-status-to-your-site
description: How to use Netlify's APIs to display build status information on your site
---

One of the cool little features Netlify has is the ability to add a "build status" graphic to your site. You can find this by logging on to your Netlify admin, going to your site settings, and scrolling to status badges:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/11/ntl1.jpg" alt="Netlify instructions for adding a status badge" class="lazyload imgborder imgcenter">
</p>

And here's a live example, right in my blog post:

[![Netlify Status](https://api.netlify.com/api/v1/badges/9727f051-52fd-4ae7-9128-a0812610ca69/deploy-status)](https://app.netlify.com/sites/raymondcamden/deploys)

This works well, but I was curious what it would take to have a more controlled way of displaying the build status. There's an API for returning build information: [listSiteDeploys](https://open-api.netlify.com/?_ga=2.224975322.1597224312.1604327763-452716213.1587404636#operation/listSiteDeploys). You can use this API with either a site ID or site domain, which means I can get a list of my deploys at this location:

	https://api.netlify.com/api/v1/sites/www.raymondcamden.com/deploys

This returns an array of deploy results with the most recent being first. Here's an example of how that result looks (taken from their docs):

```js
[
  {
    "id": "string",
    "site_id": "string",
    "user_id": "string",
    "build_id": "string",
    "state": "string",
    "name": "string",
    "url": "string",
    "ssl_url": "string",
    "admin_url": "string",
    "deploy_url": "string",
    "deploy_ssl_url": "string",
    "screenshot_url": "string",
    "review_id": 0,
    "draft": true,
    "required": [
      "string"
    ],
    "required_functions": [
      "string"
    ],
    "error_message": "string",
    "branch": "string",
    "commit_ref": "string",
    "commit_url": "string",
    "skipped": true,
    "created_at": "string",
    "updated_at": "string",
    "published_at": "string",
    "title": "string",
    "context": "string",
    "locked": true,
    "review_url": "string",
    "site_capabilities": {
      "large_media_enabled": true
    }
  }
]
```

So to get the current deploy status, you need logic to get the deploys and simply return the first item in the array. I build a serverless function called `deploy-status` that does this:

```js
const siteId = 'www.raymondcamden.com';
const token = process.env.NETLIFY_TOKEN;
const fetch = require('node-fetch');

const handler = async (event) => {
  try {

    let endpoint = `https://api.netlify.com/api/v1/sites/${siteId}/deploys`;
    let result = await fetch(endpoint, {
      headers: {
        'Authorization':`Bearer ${token}`
      }
    });
    
    let data = await result.json();
    // first entry is last deploy
    let lastDeploy = data[0];
    // it contains a lot more info then we need
    let deploy = {
      state: lastDeploy.state, 
      created_at: lastDeploy.created_at, 
      updated_at: lastDeploy.updated_at, 
      error_message: lastDeploy.error_message,
      published_at: lastDeploy.published_at,
      deploy_time: lastDeploy.deploy_time,
      screeenshot_url: lastDeploy.screeenshot_url
    };

    return {
      statusCode: 200,
      body: JSON.stringify(deploy),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
```

As you can see, I hit the endpoint and pass in my security token (you can get this from your Netlify profile page, I've set it up as an environment variable). I get the latest deploy, and then I made some decisions about what to return. I felt like there was some sensitive information in the status result as well as stuff I just didn't think I needed. Therefore I create a new variable of the "important" stuff from the status and return that. You can see this right now on my site if you go here:

<https://www.raymondcamden.com/.netlify/functions/deploy-status>

Here's an example result:

```js
{
  "state": "ready",
  "created_at": "2020-11-03T19:31:05.661Z",
  "updated_at": "2020-11-03T19:38:16.374Z",
  "error_message": null,
  "published_at": "2020-11-03T19:38:13.380Z",
  "deploy_time": 425
}
```

Cool! So at this point you can do just about anything. For me, I decided to add information about my build status to my [stats](/stats) page. I added two new fields to the data I display. First is the build status. If the result of the call is `ready`, then it means `published`. If my build is published, then I render the `published_at` result. You can get the complete source of my stats page (along with the rest of the site) on my [GitHub](https://github.com/cfjedimaster/raymondcamden2020) repo for the site, but here's the simple Vue.js code I'm using in my `create` method:

```js
// new work to show build status
let buildReq = await fetch('/.netlify/functions/deploy-status');
let buildData = await buildReq.json();
if(buildData.state === 'ready') {
	this.buildStatus = 'Published';
	this.buildTime = buildData.published_at;
	this.buildPublished = true;
} else this.buildStatus = buildData.state;
```

As I said, you can see this on my [stats](/stats) page if you're curious. I hope this little example is useful. Most of my Netlify API posts relate to analytics which are *not* officially supported, but this time everything I've shown is safe to use. Enjoy!