---
layout: post
title: "Adding QR Codes to Your Jamstack Site"
date: "2022-02-11T18:00:00"
categories: ["javascript","jamstack"]
tags: ["eleventy"]
banner_image: /images/banners/qrcodes.jpg
permalink: /2022/02/11/adding-qr-codes-to-your-jamstack-site.html
description: A look at adding QR codes to your Jamstack site.
---

QR codes have been around for some time now, but I have to admit, when I think about QR codes, I normally think of one thing:

<iframe width="560" height="315" src="https://www.youtube.com/embed/Pubd-spHN-0" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="display:block;margin:auto;margin-bottom:25px"></iframe>

Honestly, I really don't think too much about them, but I've definitely noticed since COVID, I'm seeing an uptick in their usage, especially at restaurants as a way to skip handing out disease-covered menus. (Which is fine by the way, but if your going to do this, stop using a PDF as your menu.) 

A few days ago, [Dan Fascia](https://twitter.com/danfascia) suggested I take a look at it, and honestly, it ended up being so darn simple I was a bit surprised. 

I did a quick search and came across [node-qrcode](https://www.npmjs.com/package/qrcode), a simple to use Node library for generating QR codes. It supports CLI usage, browser, *and* Node usage too which is nice to see. It can output the result as binary, SVG, or even to a data URL. 

I decided to go the data URL route as I figured it would be the simplest. I wouldn't need to figure out where to store the image and ensure it would be available in the production build.

So - I began with a simple Eleventy site that displayed a list of cats. 

<p>
<img data-src="https://static.raymondcamden.com/images/2022/02/qr1.jpg" alt="List of cats" class="lazyload imgborder imgcenter">
</p>

This was driven by a static JSON file:

```json
[

	{
		"name":"Luna",
		"gender":"female",
		"age":12,
		"picture":"https://placekitten.com/900/900"
	},
	{
		"name":"Elise",
		"gender":"female",
		"age":14,
		"picture":"https://placekitten.com/800/800"
	},
	{
		"name":"Pig",
		"gender":"female",
		"age":9,
		"picture":"https://placekitten.com/600/600"
	},
	{
		"name":"Crackers",
		"gender":"male",
		"age":5,
		"picture":"https://placekitten.com/450/450"
	},
	{
		"name":"Zelda",
		"gender":"female",
		"age":8,
		"picture":"https://placekitten.com/700/700"
	}
]
```

I then built a pagination template for my cats:

```html
{% raw %}---
layout: main
pagination:
    data: cats
    size: 1
    alias: cat
permalink: "cats/{{ cat.name | slug }}/"
eleventyComputed:
    title: "{{cat.name }}"
---

<h2>{{ cat.name }}</h2>

<p>
<img src="{{ cat.picture }}" width="300" height="300">
</p>

<p>
{{ cat.name }} is {{ cat.gender }} and is {{ cat.age}} years old.
</p>

{% comment %}
page.url is just the last part, so we use a data variable for the host.
{% endcomment %}
{% assign url = site.host | append: page.url  | append: "?fromqr=1" %}
<p/>

<p>
Scan the code below to share the link with others:<br/>
<img src="{{ url | qrcode }}" alt="QR code for this URL.">
</p>

<p>
<a href="/">Home</a>
</p>{% endraw %}
```

This is pretty boilerplate pagination stuff for Eleventy, but take special note of the comment. As it says, Eleventy provides a URL value for a page, but it's just the path, so for example, `/cats/fluffy/`. In order to create a "full" URL, I ended up making a new data file called `site.json` that simply has my host:

```json
{
	"host":"https://eleventy-qrcodes.netlify.app"
}
```

You could probably use a JavaScript file instead and generate the host dynamically, but this was simpler and worked just fine. 

Back to the template, I create a `url` variable consisting of that host, the current page, and a query string value. I figure marketers will want to know when a page is loaded from a QR code so I added that to the end. 

I then output the image and use a shortcode, `qrcode`, to get my data. As my `.eleventy.js` is really small, I'll share the entire thing:

```js
const qrCode = require('qrcode');

module.exports = function(eleventyConfig) {

	eleventyConfig.addFilter("qrcode", async function(value) {

		return await qrCode.toDataURL(value);

	});

};
```

Yeah, that's about as simple as you can get. Here's how the page renders:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/02/qr2.jpg" alt="Page with rendered QR code" class="lazyload imgborder imgcenter">
</p>

You can see this for yourself here: <https://eleventy-qrcodes.netlify.app/> I pointed my camera at one of the cat pages and the camera picked up on the code right away. 

As I said, this felt ridiculously easy, which is a good thing, right? You can peruse the complete code here, <https://github.com/cfjedimaster/eleventy-demos/tree/master/qrcodes>. Let me know what you think!

Photo by <a href="https://unsplash.com/@aka_opex?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Mitya Ivanov</a> on <a href="https://unsplash.com/s/photos/qr-codes?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  