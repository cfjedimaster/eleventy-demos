---
layout: post
title: "Adding Serverless Functions to Your Netlify Static Site"
date: "2019-01-08"
categories: ["serverless","static sites"]
tags: ["javascript"]
banner_image: /images/banners/static.jpg
permalink: /2019/01/08/adding-serverless-functions-to-your-netlify-static-site
---

Over the past week or so I've been playing around with the (kinda) new serverless feature at [Netlify](https://www.netlify.com/), built-in [Lambda Functions](https://www.netlify.com/docs/functions/) support. One of the reasons I got into serverless was because of how well it works with static web sites, and I was pretty curious to see how Netlify's integration worked. It took me a while to get things going, but I have to say, this is yet another damn impressive addition to the Netlify portfolio. I've long said that they are the "gold standard" for static web site hosting and this just proves again that they are completely nailing it. I did struggle a bit getting things going so what follows is a simple introduction with a focus on the things that confused me. 

## Prerequisites

In terms of what you need to know before getting started, there really isn't much necessary. Yes, this feature is built on Amazon's Lambda Serverless platform, but you don't need to really know anything about that to build stuff. I've only barely touched Lambda because of how complex it is. It's on my list of things to pick up this year, but my lack of knowledge didn't hamper me from using it with Netlify.

That being said, some previous serverless experience will be helpful, especially in terms of knowing what makes sense. What does make sense here? Given that you're using (or considering using) Netlify to host a static site, there may be cases where you still need something dynamic. In my case, I needed to make a call to an API that required a key I couldn't use in client-side JavaScript. My only functionality was to call that API, shape the result a bit, and return a set of data. 

I could have done that on *any* serverless platform, but having it in the same project as the rest of my static site was incredibly appealing. It just felt better to have everything in one place. I'm not saying that will always make sense, but it certainly did for my project.

## Your First Function

To begin, you'll want a folder to store all of your code. As of right now, Netlify supports JavaScript and Go. You can name your folder anything you want and put it anywhere in your directory tree, but note that you files can not be put in subdirectories under the directory you select. So if you decide on `/funcs` as the location of your serverless functions, you **can not** create subdirectories for different groups of functions. (It's lame, but if you end up with a lot you could simply use file names, like dao.get.js and rss.generate.js.) 

Your JavaScript code must follow this format:

```js
exports.handler = function(event, context, callback) {
    // your server-side functionality
}
```

The `event` object contains information about the request whereas `context` seems to be more related to Netlify specific information, like integration with their authentication support. I didn't use either in my testing so I can't really comment on it. The `callback` argument is how you return information to the caller and follows a pretty standard form of: `callback(error, result)`. The `result` value will be a simple JavaScript object like so:

```js
{ 
	statusCode: 200,
	body: 'I must be a string'
}
```

A few things to note here. First, `statusCode` seems to be optional, *except* when testing locally (more on that coming soon). So I'd just include it.

Next, `body` must be a string. From what I read on the Lambda docs, `body` can be anything that can be passed to `JSON.stringify`, which to me means it's automatically turning non-simple results into JSON. Maybe I'm wrong, but for Netlify you absolutely have to use JSON.stringify yourself. Here is a full example:

```js
exports.handler = function(event, context, callback) {
	
	let data = {
		name:'ray',
		foo:[1,2,4,6],
		time:Date.now()
	};
	
	console.log('data is '+JSON.stringify(data));

	callback(null, {
		statusCode:200,
		body:JSON.stringify(data)
	});

}
```

### Deploying and Testing

Now that you have your file, you deploy it to Netlify like any other static site. For me, I had a site tied to a GitHub repository so all I had to do was commit the code. In your Netlify settings, you want to go into your **Site Settings** and then select the "Functions" tab. Under "Deploy settings" you must set the functions directory. This tells Netlify where to find your functions.

So far so good, but how do you actually *call* your functions? This is where I hit my first brick wall. This is documented, but it didn't feel very clear to me.

No matter what you set for your functions folder, the URL will be: `yoursite/.netlify/functions/foo` where `foo` is the name of your JavaScript file minus the `.js` extension. 

Once you've done all this, if you hit the **Functions** tab for your site, you can see a list of all your deployed functions:

<img src="https://static.raymondcamden.com/images/2019/01/nf1.jpg" alt="List of Netlify Functions" class="imgborder imgcenter">

Clicking on one particular function gets you a real time log. It's usable but it would be nice to have a searchable filter.

<img src="https://static.raymondcamden.com/images/2019/01/nf2.jpg" alt="List of Netlify Functions" class="imgborder imgcenter">

And that's it... for simple stuff! 

## Testing Async Functions

This was another thing that I struggled with. I wish the main docs had clarified this or shown a quick example. It may be a "known" thing for Lambda, but as I said, a quick example would have saved me some time. In order to work with an async function, you are allowed to return Promises. So for example:

```js
exports.handler = async (event, context, callback) => {
	
	return new Promise((resolve, reject) => {

		setTimeout(() => {
			resolve({
				statusCode:200,
				body:"promises1111"
			});
		}, 2000);

	});

};
```

So that works fine, but the whole reason I wanted to do an async function was to build an API wrapper. For that I wanted to use `request-promise` from NPM or some other library, and that's where I ran into my most difficult time with the docs.

### Using NPM Modules (and Local Testing)

Ok, so what follows is going to be a bit rough. I really couldn't figure out how to use NPM modules so I decided to try to test locally. Netlify has a CLI you can use (`netlify-lambda`) but it isn't documented well at all. Scratch that - it is - but - it needs something. :) If I worked there I'd rewrite that section to make it a bit more clear. It wasn't until I read this post by Travis Horn, ["Netlify Lambda Functions from Scratch"](https://travishorn.com/netlify-lambda-functions-from-scratch-1186f61c659e), that I was able to figure out exactly how local testing (and by proxy, NPM) worked.

Ok, so first off, you need to install the CLI *locally* into your folder. Yes, the docs say this, but I installed it globally.

Secondly, you need *two* folders. The first folder is your source folder and can be the same you used previously. The second folder is for the "built" version of your functions. To test locally, you must use a `netlify.toml` file which is a way to specify settings in - a file (ok, dumb to state) versus specifying in the Netlify admin. Here's an example:

```text
[build]
	Functions = "lambda"
```

Note that I'm specifying the *build* folder, not the source folder. So how do you build? As I said, you need to install the `netlify-lambda` command locally. Then I followed Horn's advice and added two scripts to my `package.json` file:

```
  "scripts": {
    "start:lambda": "netlify-lambda serve func",
    "build:lambda": "netlify-lambda build func"
  },
```

Then I updated `netlify.toml` to include the build command:

```text
[build]
	Functions = "lambda"
	Command = "npm run build:lambda"
```

We're almost done. The Netlify docs say you can start your local server to test by using `netlify-lambda serve func` (or `npm run start:lambda`) where the last argument is the source directory. **However** this did not work for me until I ran the build command first. **However** (again) it seems like you only need to build one time. After that, running serve will setup the server and notice changes to file. **However** (last time, honest), I believe you need to run the build again if you make a *new* function. In theory that's pretty rare and you'll spend you time working on one function alone.

I'm going to write this whole thing again just to be sure it's clear.

* You need to run the build command the prior to your initial test, and after you make any new files.
* After that, you run the serve command and you can test locally.

Ok, so how do you then use a NPM module? You `npm install` and that's it. It's added to your local `package.json` for your site and - yeah it just worked. In theory you do not have to test locally. I think as long as you specify how to build your code, update your package.json with your depedencies, then you're ok committing to GitHub and testing on Netlify's servers, but local testing is rather quick.

Hopefully this made sense - now let's consider a real example.

## Building a MailChimp Wrapper

A few weeks ago my buddy Brian Rinaldi and I launched a music newsletter called [CodaBreaker](https://twitter.com/codabreaker). This is run via MailChimp and turns out they have an API. Brian suggested using the API to build a custom list of previous issues so we can host a static page at a nicer URL than what we have now - <https://us6.campaign-archive.com/home/?u=231f8aff82a1f82e4d6ab23d8&id=d00ad8719a>. The [MailChimp docs](https://developer.mailchimp.com/) are nicely done and their API, at least for reading data, was *incredibly* simple. Here is the API wrapper I built to get a list of past issues.

```js
const axios = require('axios');

const apiRoot = 'https://us6.api.mailchimp.com/3.0/campaigns?list_id=d00ad8719a&fields=campaigns.long_archive_url,campaigns.send_time,campaigns.settings.title&status=sent';

exports.handler = (event, context, callback) => {
	axios({
		method:'get', 
		url:apiRoot,
		auth:{
			'username':'anythingreally',
			'password':process.env.MC_API
		}
	}).then(res => {
		callback(null, {
			statusCode: 200,
			body: JSON.stringify(res.data)
		});
	})
	.catch(err => {
		callback(err);
	});

};
```

Basically I hit the `/campaigns` end point, filter to a particular list and filter the result keys down to the URL, date sent, and title. That's literally it. The only other interesting bit is the use of `process.env.MC_API` there. Netlify Functions have access to environment settings you specify in your site settings. I did that via the web site of course and not the `netlify.toml` file. I wish it were more complex. That's it though. You can run this yourself here: <https://elated-mayer-56be7c.netlify.com/.netlify/functions/getIssues>. 

Now all I need to do is build a one page HTML front end, slap some Vue.js on it (everything is better with Vue), and the 'marketing site' for Coda Breaker will be done. As I said above, I love that my HTML and my serverless function will all be nice and contained within one GitHub repo and I can easily push up to Netlify when done. (I did get a domain for the new site but I haven't got around to deployint it yet.)

## Final Thoughts

Minus some doc issues (and lack of understanding on my part), this is perfect. This is awesome. This is yet another reason to use Netlify for your static sites! As I explore more and think of more integrations (perhaps with something on my blog itself) I'll share. I'd love to hear from my readers though how they are using it. Drop me a comment below with some examples!

<i>Header photo by <a href="https://unsplash.com/photos/jh2KTqHLMjE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jeremy Thomas</a> on Unsplash</i>
