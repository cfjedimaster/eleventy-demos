---
layout: post
title: "Quick Tips for Eleventy and Vercel"
date: "2021-03-27"
categories: ["static sites"]
tags: ["eleventy"]
banner_image: /images/banners/tip.jpg
permalink: /2021/03/27/quick-tips-for-eleventy-and-vercel
description: A quick tip for folks using Eleventy and Vercel together.
---

I primarily use [Netlify](https://www.netlify.com) for my Jamstack hosting service, but I also make use of [Vercel](https://vercel.com/) quite a bit as well. Vercel's CLI is quite nice and tends to be a bit more intelligent about figuring out your site's requirements with little to no configuration. Other things, like their [serverless functions](https://vercel.com/docs/serverless-functions/introduction), are a bit easier to use as well. That being said, I've recently run into a small issue with Eleventy and Vercel that I thought I'd share in case others hit as well. It isn't a bug, but a combination of a few things together that may trip you up.

To start, I create a two file Eleventy site. It's got a home page:

```html
{% raw %}
<h1>Cats</h1>

<ul>
{% for cat in cats %}
<li>{{cat.name}}</li>
{% endfor %}
</ul>
{% endraw %}
```

All I'm doing here is iterating over an array of cats. That data comes from `_data/cats.json`:

```json
[
	{"name":"Luna"},
	{"name":"Cracker"},
	{"name":"Pig"},
	{"name":"Aleese"},
	{"name":"Sammy"}
]
```

Just to confirm it works, I ran `eleventy --serve` and hit the page in my browser.

<p>
<img data-src="https://static.raymondcamden.com/images/2021/03/ve1.jpg" alt="HTML listing of cats" class="lazyload imgborder imgcenter">
</p>

Awesome, right? Ok, so if I want to run this with Vercel and use it's local dev server, I'd probably try: `vercel dev`. However, doing so will result in this:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/03/ve2.jpg" alt="The CLI doesn't know the framework." class="lazyload imgborder imgcenter">
</p>

Notice how it doesn't recognize the framework? That's because, at least for me, I use my globally installed Eleventy CLI and do not install it locally. I may be in the minority for that, but that's typically how I role. Luckily it's easy enough to fix. First I'll do an `npm init -f` to create a blank package.json. Next I'll do a `npm i --save @11ty/eleventy` to set Eleventy as a dependency. Now if I run `vercel dev`, it recognizes that I'm using Eleventy.

<p>
<img data-src="https://static.raymondcamden.com/images/2021/03/ve3.jpg" alt="CLI picks up on Eleventy" class="lazyload imgborder imgcenter">
</p>

Cool! Except when it starts, I get this:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/03/ve4.jpg" alt="Error on startup" class="lazyload imgborder imgcenter">
</p>

It may be a bit hard to read in the screen shot, but here's some of the relevant bits:

```
{% raw %}
`TemplateContentRenderError` was thrown
> Having trouble compiling template ./node_modules/liquidjs/README.md

{% endraw %}
```

Notice how the error is being thrown in a file in node_modules? Why? 

By default, Eleventy ignores the node_modules folder, which is a good thing. However, if you have a .gitignore file, this feature isn't enabled (unless it's empty). This is [documented](https://www.11ty.dev/docs/ignores/#node_modules-exemption) of course. So what happened? The Vercel CLI creates a .gitignore file if you don't have one. It does this to tell Git to ignore the .vercel folder it creates. 

So now you have a .gitignore file and Eleventy won't ignore node_modules anymore. The fix, of course, is to just add it:

```
.vercel
node_modules
```

This will also speed up your development server as it's ignoring the ten billion or so files under node_modules.

As I said, none of this is a bug, but it's tripped me up a few times now so I thought I'd share!