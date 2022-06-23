---
layout: post
title: "Running Netlify Dev and Eleventy Two or More Times At Once"
date: "2021-12-10T18:00:00"
categories: ["jamstack"]
tags: ["eleventy"]
banner_image: /images/banners/port_cranes.jpg
permalink: /2021/12/10/running-netlify-dev-and-eleventy-two-or-more-times.html
description: A tip for folks using Netlify Dev and Eleventy
---

Ok, so this falls into the category of something probably few people will run into, but since I did, I've got to blog it. If only to save myself when I inevitably forget six months from now. Also, all credit for this solution comes from Netlify support engineer [Hrishikesh Kokate](Hrishikesh Kokate). Alright, so what's the issue?

I use [Eleventy](https://www.11ty.dev/) for this blog and host on [Netlify](https://www.netlify.com/). Netlify's [CLI](https://docs.netlify.com/cli/get-started/) has a great feature that lets you mimic the Netlify production experience in your local environment. You go into your project and run `netlify dev` and you're - usually - good to go. Obviously, you sometimes need to configure things a bit. So, for example, this is how I run this blog locally:

	netlify dev -c "eleventy --serve --quiet"

The `-c` command tells Netlify's CLI what command to use to run my static site generator. This will run Eleventy and then fire up Netlify's local development server as well. The end result is actually two servers running. You can see that in the screenshot below:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/12/ntl.jpg" alt="Terminal output from starting up Netlify dev and Eleventy" class="lazyload imgborder imgcenter">
</p>

As I said, I run my blog on Eleventy, and I also build a bunch of dumb demos with Eleventy, so I write a lot of [silly blog posts](https://www.raymondcamden.com/tags/eleventy) on it as well. Seriously, I probably need to stop at some point. Anyway, sometimes I need to run my blog locally while I write a post *and* run an instance of Eleventy for a demo. 

This past week, I just so happened to try to run my blog *and* an Eleventy demo that needed to run via `netlify dev` as well. I was concerned about the ports. The Netlify CLI will automatically recognize when its normal port is taken and simply select a new one. I wasn't sure what Eleventy would do. To be safe, in my second demo, I did this:

	netlify dev -p 9999 -c "npx eleventy --serve --port 9998"

Basically, use a unique port for both parts of the second demo. While nothing looked amiss in the terminal output, when my second site opened up, it was showing the content for my blog. I could manually go to port 9998 and see the second Eleventy site, but I needed the "context" of Netlify Dev as I was using its Functions feature. 

So I posted on the [forums](https://answers.netlify.com/t/two-instances-of-ntl-dev/48287) and this is where Hrishikesh saved the day. To get it working right, edit the `[dev]` block of the netlify.toml file:

```
[dev]
  framework = "#custom"
  targetPort = 9998
```

Honestly, I'm not 100% sure why this worked, but it did. One quick note - I wanted to stop using `-c` at the command line in the second instance as I was now using netlify.toml to specify stuff, so I modified it like so:

```
[dev]
  command = "eleventy --serve"
  framework = "#custom"
  targetPort = 9_998
```

Anyway, as I said, this will probably impact two of you, one is me in six months (hi me, you rock, no matter how much weight you lost or gained!), so thanks for reading!

Photo by <a href="https://unsplash.com/@ronan18?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ronan Furuta</a> on <a href="https://unsplash.com/s/photos/ports?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  