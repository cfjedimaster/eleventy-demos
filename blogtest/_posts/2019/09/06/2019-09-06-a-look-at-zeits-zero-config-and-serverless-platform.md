---
layout: post
title: "A Look at Zeit's Zero Config and Serverless Platform"
date: "2019-09-06"
categories: ["development","static sites","serverless"]
tags: []
banner_image: /images/banners/zero.jpg
permalink: /2019/09/06/a-look-at-zeits-zero-config-and-serverless-platform
description: 
---

For a while now my go to service for hosting static sites "for fun" has been [Surge](https://surge.sh/). While I host my blog on 
[Netlify](https://www.netlify.com/) and absolutely consider it the "gold standard" for static sites, I try to reserve my usage
there for "real" sites, i.e. not things I'm playing around with or temporary examples. I had heard of [Zeit](https://zeit.co/) of course and knew of their cool command line deployment, but outside of a few Node.js demos, I hadn't really thought of it. 

Over the past few weeks I've had a chance to dig deeper and have to say I'm incredibly impressed by Zeit, specifically their new zero config and serverless features. I've pretty much decided it will be my new default place for quick ad hoc demos. Let me expand on that and why I'm excited about the service.

### What is Zero Config?

Zero Config (at least in terms of Zeit) simply means you can upload your code in a commonly known format and Zeit knows how to handle it. Want an example? Imagine I scaffold a new Vue application: `vue create zeroconfig1`

<img src="https://static.raymondcamden.com/images/2019/09/z1.png" alt="CLI output" class="imgborder imgcenter">

And then `cd` into the directory and type `now`:

<img src="https://static.raymondcamden.com/images/2019/09/z2.png" alt="now upload" class="imgborder imgcenter">

And... that's it. Zeit's platform knew how to handle the Vue application, both in terms of how to build it and then how to serve the final result. I did nothing. No config. No special JSON file. Nothing. Obviously this isn't just for Vue but supports, according to them, " any framework or tool you can think of." 

And yes, the URL in the screen shot above is up and live at <https://zeroconfig1.raymondcamden.now.sh/>. It isn't that exciting but it took longer to scaffold the application then deploy it. <strong>That's freaking cool.</strong>

### How about that Serverless?

Serverless is also zero config too. You add an `api` folder and then drop in either a TypeScript file, JavaScript file, Go, or Python, and that's it. Given `/api/cats.js`, you can hit it via the url `/api/cats`. If you need to install NPM modules, the platform auto parses your `package-lock.json` file and will install what it needs to. It all works *incredibly* easy. Consider the simplest example of building a proxy to an API that doesn't support CORS. 

```js
const fetch = require('node-fetch');

module.exports = async (req, res) => {

    const app_id = 'xxxx';
    const app_code = 'yyyy';

    let response = await fetch(`https://weather.api.here.com//weather/1.0/report.json?app_id=${app_id}&app_code=${app_code}&product=observation&name=Lafayette,LA`)
    let data = await response.json();
    res.json(data.observations);

}
```

I'm making use of HERE's [Weather API](https://developer.here.com/documentation/weather/topics/overview.html) to make a hard coded request to the forecast for Lafayette, LA. (You don't need to look at the results. It's hot. It's always hot.) 

To test, I can use the command line to run a local server: `now dev`. This fires up a local server and I can then hit my API at `http://localhost:3000/api/weather`. I can then edit, debug, etc, all locally and quickly fine tune the serverless function. I can then deploy with `now` and... again. I'm done.

You can see this API here: <https://zeroconfig1.raymondcamden.now.sh/api/weather> I hope you can see how great this would be for a Vue (or other frontend framework) app that needs a few back end APIs to support it.

All in all it's rather painless. I did have a bit of trouble working with secrets. Zeit does support, and document, working with [secrets](https://zeit.co/docs/v2/serverless-functions/env-and-secrets/). You can specify secrets via the CLI with a simple call: `now secrets add somename somevalue`. However, that isn't enough, and the zero config thing breaks down a bit here. 

In order for your serverless function to get access to secrets, or other environment values, you must create a `now.json` file that looks like this:

```js
{
  "env": {
    "VARIABLE_NAME": "@variable-name"
  }
}
```

In this example, `VARIABLE_NAME` is the name your code will use, not as a global, but for example, `process.env.VARIABLE_NAME`. The `@variable-name` is the name of the secret or environment variable.

Now - stick with me a bit because this tripped me up. I used uppercase secret values in a test and found that my secrets weren't working. Why? The CLI lowercases secret names. I don't know why, and I feel like it's a bug, but if you make a secret named FOO it will be called foo. So my `now.json` file looks like this:

```js
{
  "env": {
    "FOO": "@foo"
  }
}
```

Honestly this is my only real complaint. I can't imagine why I'd define a secret I *wouldn't* want to use and it would be nice if you could skip `now.json` if you were fine with all the secrets just being available. But it's a minor nit I can live with.

If you remember, a few weeks ago I [blogged](https://www.raymondcamden.com/2019/07/01/random-pictures-of-beauty) about a Twitter bot I wrote to post pictures from the National Park Service. I built this on Azure Functions, and while I like their service, they do not have a 100% free tier. I got my first bill this month (a bit over a dollar) and used this as an excuse to migrate from Azure to Zeit. Ignoring the issue I ran into with case above, the "process" was about five minutes. Zeit doesn't support scheduled tasks so I just made use of [EasyCron](https://www.easycron.com/user), a free service that can hit URLs on schedules.

### Price Details

For folks curious, you can checkout the [pricing information](https://zeit.co/account/plan) for what's supported at what tier. Currently they only have Free and Unlimited. For serverless, you're limited to 5000 a day which seems to be more than enough for testing, demos, and the such. The paid plan starts at $0.99 so if you do need to start shelling out money, you're starting at a pretty good place. 

As always, if you're using this, drop me a comment below. I love to hear about real world uses.

<i>Header photo by <a href="https://unsplash.com/@cbarbalis?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Chris Barbalis</a> on Unsplash</i>

