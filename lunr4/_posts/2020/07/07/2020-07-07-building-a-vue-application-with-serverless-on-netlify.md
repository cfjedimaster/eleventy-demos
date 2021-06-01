---
layout: post
title: "Building a Vue Application with Serverless on Netlify"
date: "2020-07-07"
categories: ["javascript","serverless"]
tags: ["vuejs"]
banner_image: /images/banners/sunset.jpg
permalink: /2020/07/07/building-a-vue-application-with-serverless-on-netlify
description: A quick example of deploying a Vue application with serverless to the Netlify platform
---

This is something that is - surely - documented in a thousand other blog posts, but it's not something I've tried yet
with Netlify so I thought I'd give it a go. It was this or watch another episode of "Unsolved Mysteries" on Netflix and obviously I chose this instead. I'm glad I did because it worked surprisingly well with no real hiccups. I just needed to 
"see" it myself at least once to be sure it worked. 

Alright, so as the title says, how would you deploy a Vue.js application to Netlify while also making use of their serverless platform? Here's how I did it.

First, I made the Vue application:

```
vue create vue-netlify-demo -b
```

If you've not seen the `-b` option before, it means "bare" and generates a much smaller Vue application with less boilerplate text. (In my opinion it could be even more bare, but I'll take what I can get.) I didn't change any options because I wasn't worried about testing Vuex or the router.

I then fired up the application with `npm run serve` and confirmed it worked. 

<p>
<img data-src="https://static.raymondcamden.com/images/2020/07/vn1.jpg" alt="Vue bare app" class="lazyload imgborder imgcenter">
</p>

Next, I started using the `netlify dev` command. This enables you to test local applications as if they were running on the Netlify platform. I noticed that `netlify dev` ran `npm run serve`, but I don't remember that being documented. It was the first script defined in my package.json file and so maybe that's why it fired, but I went with a more specific command: `netlify dev -c "npm run serve"`. The `-c` flag specifies the command for the CLI to run.

I noticed that the output that was much more verbose when running via `netlify dev`. When you use `npm run serve`, there's a lot of webpack related messages that gets output to one line, constantly being overwritten. It's a lot of noise so I'm fine with that. But when running via `netlify dev`, they all get output to the screen. This is fine, but you may miss the message stating that the server is up and running:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/07/vn2.jpg" alt="Netlify dev message hidden amongst log messages" class="lazyload imgborder imgcenter">
</p>

Once I saw this message and opened my browser to localhost:8888 I didn't worry about it again. Cool, now let's go serverless.

First, I added a `netlify.toml` file to my project to specify my functions folder:

```
[build]
	functions = ".functions"
```

I then used the CLI to scaffold a hello-world function: `netlify functions:create`. This laid down this file in `.functions/hello-world/hello-world.js`:

```js
// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context) => {
  try {
    const subject = event.queryStringParameters.name || 'World'
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello ${subject}` }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
```

The Netlify Dev environment supports testing serverless functions locally so I modified my little one page Vue application like so:

```html
<template>
  <div id="app">
    <h1>Welcome to Your Vue.js App</h1>
    <p>
	{% raw %}Message from severless function: {{ msg }}{% endraw %}
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg:''
    }
  },
  async created() {
    let resp = await fetch('/.netlify/functions/hello-world?name=ray');
    this.msg = (await resp.json()).message;
  }
}
</script>
```

All I've done here is fire off a call to the function (the `.netlify/functions` path is how you "address" serverless functions on Netlify) and displayed the result. Here's how it looks:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/07/vn3.jpg" alt="Vue application calling the function" class="lazyload imgborder imgcenter">
</p>

Beautiful, right? Now to get it live. First, I made a new repo for it: <https://github.com/cfjedimaster/vue-netlify-demo>. Then I made a Netlify site tied to the GitHub repo. I specified `npm run build` to generate the Vue production version of the app and entered `dest` for the folder to use as the site source.

And that was it. You can see it running here: <https://vue-netlify-demo.netlify.app/>. And don't forget I linked to the repo right above.

So all in all - no surprises - it just plain worked - which is exactly what I want!

<span>Photo by <a href="https://unsplash.com/@jplenio?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Johannes Plenio</a> on <a href="https://unsplash.com/s/photos/view?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>