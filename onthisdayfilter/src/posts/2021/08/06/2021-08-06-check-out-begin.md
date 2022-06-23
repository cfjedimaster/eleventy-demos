---
layout: post
title: "Check out Begin"
date: "2021-08-06T18:00:00"
categories: ["development","serverless"]
tags: ["javascript","begin"]
banner_image: /images/banners/begin.jpg
permalink: /2021/08/06/check-out-begin.html
description: A quick look at the Begin Platform
---

In general, when I learn something new I like to share it here on my blog, and typically I wait till I have something of a decent handle on the topic. I have to be honest here and say that that isn't quite the case here. I'm still *very* early on my exploration of [Begin](https://begin.com/) and I wanted to share some initial thoughts.

So what is Begin? While you can (and should) check out the [home page](https://begin.com/), I'd like to give you my impression of it. Begin is a serverless platform that reminds me a bit of [Express](https://expressjs.com/). Back when I first learning Node, it was Express that really "clicked" for me mentally. It made the act of building a web application with Node much simpler by handling boilerplace code and letting me focus on what I was actually building. 

Begin feels like it took Express and made it even simpler, completely removing the need for a core JavaScript file handling routes and crap and instead using convention for much of the same things. 

I realize that's a bit vague so let me try to describe a real world example (taken from their [quick start](https://docs.begin.com/en/guides/quickstart)). A simple Begin application can consist of:

* A public folder that acts just like a static Express folder. Just put your CSS, images, etc in there.
* A src folder for server-side code. So you need to hit a remote API with a private key, manipulate the results, and return data? Just write a quick serverless function.

And... that's it. So in Express, I'd have one app.js file, I'd set up the static directory, I'd set up the route for my function. With Begin, I don't worry about any of that. 

Here's a real example of how this could look. First, in `public/index.html`, I could do:

```html
<html>
<head>
</head>

<body>
<div id="foo"></div>

<script src="index.js"></script>
</body>
</html>
```

And then in `public/index.js`, some simple code to update the div:

```js
document.addEventListener('DOMContentLoaded', init, false);
async function init() {
	let resp = await fetch('/foodata');
	let data = await resp.json();
	document.querySelector('#foo').innerHTML = data;
}
```

To set up my serverless function, I'd define the path in my `package.json`. Look at the `arc` section:

```json
{
  "name": "begin-app",
  "version": "0.0.0",
  "description": "A simple Begin app with the minimum necessary file structure",
  "scripts": {
    "start": "npx sandbox"
  },
  "devDependencies": {
    "@architect/sandbox": "^3.3"
  },
  "arc": {
    "app": "begin-app",
    "http": [
      [
        "get",
        "/foodata"
      ]
    ]
  },
  "dependencies": {
    "@architect/functions": "^4.0.0"
  }
}
```

And then - by convention - I'd make the following file: `src/http/get-foodata`:

```js
exports.handler = async function http(req) {

  return {
    headers: {
      'content-type': 'text/html; charset=utf8',
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
    },
    statusCode: 200,
    body: 'something here'
  }
}

```

Locally I can run `npm run start` and start testing right away. 

Ok, so how is this better than Netlify or Vercel? To be honest I'm not 100% sure it is. But you do get more fine grained control over setting up your routing. So for example, if you want to expose `POST /addcat` and *only* expose it that way, you can. In Netlify I'd have to write code in my function to check the request method and block non-POST code. 

Like Netlify, you can deploy [static sites generators](https://learn.begin.com/basic/frontend/ssg) like Eleventy and [single page applications](https://learn.begin.com/basic/frontend/spa) like Vue.js. (Here's a [guide](https://docs.begin.com/en/guides/vue) specific to Vue.) And with both you can then add your serverless code to support the application.

So at this point, you may not be convinced yet to give Begin a try. As I said, it feels like a simpler, easier to use version of Express, with more power to configure your applications behavior. But Begin has two really killer features that I think are incredibly useful. 

First is built in support for [scheduled functions](https://docs.begin.com/en/scheduled-functions/provisioning). In a Node application I'd add this via a CRON library and it wouldn't be *too* hard to do, but Begin makes it trivial. Netlify and Vercel (as far as I know) don't support this at all. You would need to use a third party service to schedule calls to serverless functions. 

The other really cool part is [Begin Data](https://docs.begin.com/en/data/begin-data/), which gives you easy access key-value database system. This is *super* useful for cases where you want a database and don't necessarily want to work with another system, like Fauna. To be clear, I like Fauna, and you can absolutely use it or any other database system via your functions, but having a built-in solution is hella useful.

Ok... so that's the good. There are some pretty rough aspects as well. (Before I continue, just note that everything I'm about to complain about I've shared directly with the folks at Begin as well.) The docs now are a bit hard to follow. The [quickstart](https://docs.begin.com/en/guides/quickstart) is good, but I quickly got confused after that. 

Next, Begin is built on (or with?) an open source project called [Architect](https://arc.codes/docs/en/guides/get-started/why-architect). I would find references in the Begin docs to things from Architect that just didn't make sense to me. The Begin docs feel like they fail to handle the case of a new developer coming in with zero knowledge of that part of the project. Keep in mind that as a developer relations person, I'm always looking at projects with an eye to what *other* developers will think, what they will struggle with, and so on, and I think that Begin needs to work real hard on the post-Quickstart experience and more clearly directing folks on when they need to look at Architect.

On the flip side of that, I had *stellar* support from their [Slack](https://join.slack.com/t/architecture-as-text/shared_invite/MjE2MzU4Nzg0NTY1LTE1MDA2NzgyMzYtODE2NzRkOGRmYw) channel. After getting support there I was able to play around a lot more and get things working. One more quick tip - your free Begin account only supports five apps. That feels a bit low, but if you want to look at more examples without provisioning and taking up one of those slots, you can find all of their demo projects here: <https://github.com/begin-examples>. 

So I hope this was helpful. As I said, I'm very new to this, but I'm finding it really interesting and will keep digging. I've got an application I'm working on now that makes use of our PDF Services and when it's done, I'll share that. If you've worked with Begin and have something running in production (even if just for fun), I'd love to hear about it.

Photo by <a href="https://unsplash.com/@dsmacinnes?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Danielle MacInnes</a> on <a href="https://unsplash.com/s/photos/begin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
