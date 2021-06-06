---
layout: post
title: "Using Netlify's Build Process for Somewhat Static Data"
date: "2019-01-22"
categories: ["static sites"]
tags: ["javascript"]
banner_image: /images/banners/build.jpg
permalink: /2019/01/22/using-netlifys-build-process-for-somewhat-static-data
---

A few days ago I blogged about how I was using serverless functions at Netlify to build an API proxy for MailChimp (["Adding Serverless Functions to Your Netlify Static Site"](https://www.raymondcamden.com/2019/01/08/adding-serverless-functions-to-your-netlify-static-site)). This worked really well for me and I built a simple "one pager" for my web site making use of that function. But something really gnawed on me.

Even though it worked really well and was pretty fast, it seemed like overkill to load data that changes only twice a month. I wasn't worried about being charged for it - I was easily within MailChimp's free limit and easily within Netlify's free tier - but it still seemed like too much. It's then that I remembered that Netlify let's you specify a script to run when your site is built.

This is a feature I've used for a while now - but basically just to tell Jekyll to build my pages (and before that, Hugo, but let's not speak about Hugo). I didn't really think about the implications of how I could use this for more complex logic. Phil Hawksworth wrote up a good example of this (["Keeping a JAMStack Fresh with Recent Tweets"](https://www.hawksworx.com/blog/keeping-a-jamstack-site-feeling-fresh-with-recent-tweets/)) where he describes how he uses a build script to update data files used by his static site generator.

My one page site didn't need a static site generator, but I could still use a similar process. I began by creating a simple Node.js script that was nearly a copy of my serverless API wrapper:

```js
console.log('Running build script');

const axios = require('axios');
const fs = require('fs');

const apiRoot = 'https://us6.api.mailchimp.com/3.0/campaigns?list_id=d00ad8719a&fields=campaigns.long_archive_url,campaigns.send_time,campaigns.settings.title&status=sent';

axios({
	method:'get', 
	url:apiRoot,
	auth:{
		'username':'anythingreally',
		'password':process.env.MC_API
	}
}).then(res => {
	fs.writeFileSync('./static.json', JSON.stringify(res.data), 'UTF-8');

})
.catch(err => {
	console.log('Error getting stuff', err);
});
```

There's a couple things I want to point out here. First, my `console.log` messages will show up in the Netlify build web page which makes it nice for debugging. Second, note how I use `process.env.MC_API`. This is the environment variable I built to store my MailChimp API. I built it for the serverless function but it's available here as well.

Finally - I simply hit the remote API and write out the content to my site as static.json. The last bit was to update my Vue.js app to hit `/static.json` instead of the serverless API. You can see this in action in the completely amazing and awesome site I built for the music newsletter I'm running with Brian:

<https://codabreaker.rocks>

I was almost done. The next thing I did was update my build script command I've set in `netlify.toml`:

```text
[build]
	Functions = "lambda"
	Command = "npm run build"
```

And this is the relevant line in my `package.json`:

```js
"scripts": {
	"start:lambda": "netlify-lambda serve functions",
	"build:lambda": "netlify-lambda build functions",
	"build":"netlify-lambda build functions; node build.js"
},
```

Yes, I'm still using serverless functions "in general" on the site, but mainly now as a testbed for experimentation. As the site is just a "one pager" I don't mind using it for other tricks as well. 

Ok, so I'm almost done. The very last step was to configure MailChimp to trigger a build on Netlify. In my "Deploy Settings" for my Netlify site, I went to "Build hooks" and created a new one. This creates a unique URL that can trigger a build on a POST call:

<img src="https://static.raymondcamden.com/images/2019/01/nf22.jpg" alt="Shot from Netlify Build Hook page" class="imgborder imgcenter">

Then I added it as a hook to MailChimp:

<img src="https://static.raymondcamden.com/images/2019/01/nf23.jpg" alt="Shot from MailChimp" class="imgborder imgcenter">

And that's it! Now when we post the next newsletter, MailChimp will POST to Netlify, Netlify will create a new build, run my simple script, update the JSON, and that's it.

And yes... you can absolutely make the case that using Vue and Ajax for this is *also* overkill. Instead of writing out to `static.json`, I could read in `index.html`, look for some kind of token, and replace it with HTML. Then the page would be really, *really* static. As always, there's multiple ways to skin the cat here.

Let me know what you think about this approach, and don't forget to check out my [awesome design skills](https://codabreaker.rocks).

<i>Header photo by <a href="https://unsplash.com/photos/ymf4_9Y9S_A?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Randy Fath</a> on Unsplash</i>