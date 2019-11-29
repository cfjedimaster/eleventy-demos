---
layout: post
title: "Adding Referrer Protection to Webtasks"
date: "2018-03-19"
categories: [serverless]
tags: [webtask]
banner_image: /images/banners/gate.jpg
permalink: /2018/03/16/adding-referrer-protection-to-webtasks
---

A few months ago I [wrote up](https://www.raymondcamden.com/2017/12/11/adding-referrer-protection-to-openwhisk-actions/) my experience of adding referrer style protection to an OpenWhisk action. Basically - checking the referer header to see if it is valid before executing a particular serverless action. I was thinking about that post and how I'd implement it with [Auth0 Extend](https://auth0.com/extend/) and [webtasks](https://webtask.io/) and came up with a solution that helped me learn even more about the platform.

Webtasks, and by extension, Auth0 Extend, have a feature called middleware. Unfortunately, this is *not* documented currently, but I plan on fixing that very soon. Middleware works just like it does in Express apps, but if you aren't aware of the feature, you can think of it like pipe. By specifying middleware for a particular serverless action, you're saying that the middleware should run first. What you do there is up to you. You can use it like I plan to below, a security check, or you can use it to load up and prepare some data for use later.  I first discovered this feature (because again, we have to document it!) via a great post by my coworker: [Securing Webtasks Part 2: Using Middleware](https://auth0.com/blog/securing-webtasks-part-2-using-middleware/). I definitely recommend reading that post (and [part one](https://auth0.com/blog/securing-webtasks-part-1-shared-secret-authorization/)) for a much deeper look at webtasks and security. My post is fairly lightweight as I'm just doing one simple check.

Alright, so how do we use middleware? You create a function that returns the logic of your middleware. Basically - a factory type function. (Functions that return functions always throw me a bit when I read them.) Bobby's post has a great minimal example of what this looks like:

```js
module.exports = function() {
  return function middleware(request, response, next) {
    // logic to be executed before the webtask
    next(); //call the next middleware
  }
}
```

The logic you employ here obviously will depend on whatever your middleware needs to do. Security-based ones would probably abort a request. Transformative ones would modify request values. You'll see my example in a moment.

So this part is simple. The part that isn't terribly simple is that you have to put your function up in a place where the source is available. So what do I mean by that? When I create a normal webtask and pass code to it, I'm giving a URL in response. But that URL *executes* the code. What you want is a URL that reveals the code itself. So for example, you could put the code up on a GitHub Gist if you want. For me, I'm using a method Bobby did - a webtask that spits out the code using ES6 template strings. Here's my logic:

```js
const source = `'use strict';
const allowedRef = ['rhetorical-collar.surge.sh'];

function createMiddleware() {

	return function middleware(req, res, next) {
		let referrer = req.webtaskContext.headers['referer'];
		console.log('referrer is '+referrer);

		allowedRef.forEach(ref => {
			if(referrer.indexOf(ref) >= 0) return next();
		});

  		const error = new Error('invalid referer');
        error.statusCode = 401;
        next(error);
  }
}

module.exports = createMiddleware;
`;

module.exports = function(ctx, req, res) {
	console.log('factory running');
	res.writeHead(200, {% raw %}{'content-type': 'application/javascript'}{% endraw %});
	res.end(source);
};
```

This would then be pushed up to webtask.io using a regular `wt` call like so: `wt create check.js`. To be clear, the actual middleware is *not* the portion at the end. That's basically saying "take this string and output it with the right content type". The logic is in the code on top. You can see this for yourself here: https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.run.webtask.io/check

Oh, and the logic is virtually the same as my previous demo. I've got a set of hard coded valid referrers that I can iterate over. I fetch the header via `req.webtaqskContext.headers` and check it. If I get a match, I immediately run `next()` to have the process carry on. If I get to the end, I return an error by calling `next(error)`. If you've done this in Express then this shouldn't be new to you.

So the final bit involves setting up a task to use the middleware. I took an existing basic "hello world" task and recreated it like so:

	wt create hello.js --name securetest1 --middleware https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.run.webtask.io/check

If you're curious, the `--name` part there just gives a name to the webtask. By default it uses the filename minus the extension, but I already had `hello` up there so I wanted something new. The endpoint created is here:

https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.run.webtask.io/securetest1

But of course, you should get an error hitting it. To test, I built a quick HTML file that literally just had this block of JavaScript:

```js
document.addEventListener('DOMContentLoaded', init, false);
function init() {
	console.log('do fetch');
	fetch('https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.run.webtask.io/securetest1')
	.then(res => res.json())
	.then(res => {
		console.log('result is '+JSON.stringify(res));
	})
	.catch(e => {
		console.error(e);
	});
}
```

I then plopped this up on surge and it ended up here: http://rhetorical-collar.surge.sh/test.html. If you go there with an open devtools, you'll see the endpoint executing successfully. 

Again - this is just a little peek. Read [Bobby's post](https://auth0.com/blog/securing-webtasks-part-2-using-middleware/) for a deeper look, but I enjoyed rebuilding this check under webtask as it gave me a chance to learn about a feature I missed. 

<i>Header photo by <a href="https://unsplash.com/photos/Axxllwv-vEM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Markus Voetter</a> on Unsplash</i>