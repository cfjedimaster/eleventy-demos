---
layout: post
title: "Using the MailChimp API with Netlify Serverless Functions"
date: "2019-05-29"
categories: ["serverless","static sites"]
tags: ["javascript"]
banner_image: /images/banners/dimsum.jpg
permalink: /2019/05/29/using-the-mailchimp-api-with-netlify-serverless-functions
description: A look at Netlify serverless functions to work with the MailChimp API
---

I first wrote about Netlify's new Functions feature way back in January of this year (["Adding Serverless Functions to Your Netlify Static Site:](https://www.raymondcamden.com/2019/01/08/adding-serverless-functions-to-your-netlify-static-site)). Since that time, Netlify has had multiple updates to their platform with the most important (imo) being [Netlify Dev](https://www.netlify.com/products/dev/). I'm probably being a bit dramatic, but Netlify Dev is an absolute game changer for me when it comes to their platform. I'll explain how but first let me start off by describing what I wanted to build.

In that earlier blog post, I described how I used a serverless function to get a list of issues for the [CodaBreaker](https://codabreaker.rocks) newsletter I run with my buddy Brian. I actually ended up removing that function and using a build script instead, but I was able to reuse 99% of my code so it was still a good learning experience. 

I wanted to add a new serverless function that would handle adding subscribers to the newsletter and keep them on the site. MailChimp's signup form wasn't bad, but if I could do it all on my side, why not? MailChimp's APIs support this quite easily, and not only that, support adding an email address and not caring if they already existed or not. You just do a `PUT` request to `https://us6.api.mailchimp.com/3.0/lists/LISTID/members/` where `LISTID` is the ID of your list. 

One of the frustrations I had with the first function I created was the build process. I would write my code, commit to GitHub, quickly ask Netlify to rebuild (it would automatically, but I was impatient), test, curse, and repeat the process. 

Netlify Dev changes all of that. It allows you to run the Netlify platform, completely, on your local machine. On the simpler side, it lets you do things like test the redirects feature locally. I use that heavily as I've got a crap ton of content and have migrated my blog multiple times. On the more complex side, it makes testing functions a heck of a lot easier. 

I began by using the CLI to scaffold the function:

	netlify functions:create

This prompts you to select from one of like 100 or so functions (ok, not 100, it is a lot and I think they may want to trim it a bit) but I just chose a simple hello-world template. Once done, I started coding, and damnit, it just plain worked. If you follow me on Twitter you know I ran into some hiccups, but they were all my fault. The only issue I came across that I couldn't correct was that the environment variable I had set in the Netlify dashboard for the site wasn't transferred down to the code. (You can track this issue at my [forum post](https://community.netlify.com/t/should-netlify-dev-functions-have-access-to-env-variables/1171)). I whipped up the following bit of code. It isn't the best code, but it's mine and I love it.

```js
const axios = require('axios');
var crypto = require('crypto');

const apiRoot = 'https://us6.api.mailchimp.com/3.0/lists/d00ad8719a/members/';


exports.handler = async (event, context) => {
  try {
    const email = event.queryStringParameters.email;
    if(!email) {
      return { 
        statusCode: 500, 
        body: 'email query paramter required' 
      };
    }

    // https://gist.github.com/kitek/1579117
    let emailhash = crypto.createHash('md5').update(email).digest("hex");

    return axios({
      method: 'put',
      url: apiRoot + emailhash,
      data:{
        email_address:email,
        status:'subscribed'
      },
      auth: {
        'username': 'anythingreally',
        'password': process.env.MC_API
      }
    }).then(res => {
      return {
        statusCode:200, 
        body: JSON.stringify(res.data)
      }
    })
    .catch(err => {
      console.log('returning from here', err.response.data.detail);
      return { statusCode: 500, body: JSON.stringify(err.response.data) };
    });

  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }

};
```

I then wrote up some simple Vue code to hit against my function (the endpoint is at `/.netlify/functions/newsletter-signup`) and that was it, you can see it live on the site now: <https://codabreaker.rocks/>

So when I started this blog post, I imagined it being a bit more detailed. To be honest, it just worked. It was simple. (Again, ignoring issues that were mostly my own fault.) I'm truly shocked and how well this platform is working!

<i>Header photo by <a href="https://unsplash.com/photos/D-vDQMTfAAU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Charles PH</a> on Unsplash</i>