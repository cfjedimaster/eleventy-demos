---
layout: post
title: "Checking (and Upgrading) Template Engines in Eleventy"
date: "2020-02-07"
categories: ["javascript","static sites"]
tags: ["eleventy"]
banner_image: /images/banners/liquid.jpg
permalink: /2020/02/07/checking-and-upgrading-template-engines-in-eleventy
description: How to check the version of embedded template engines in Eleventy
---

Yesterday a follower on Twitter encountered an interesting issue with [Eleventy](https://www.11ty.dev/) that turned into a bit of a bigger issue. Let's start with his question.

<blockquote class="twitter-tweet" data-conversation="none" data-theme="dark"><p lang="en" dir="ltr">So it seems like LiquidJS added support for where filters <a href="https://t.co/nYFmA328WF">https://t.co/nYFmA328WF</a> but maybe that hasn&#39;t been rolled into Eleventy yet? <a href="https://t.co/4Ovu4aP8I0">https://t.co/4Ovu4aP8I0</a></p>&mdash; Richard Herbert (@richardherbert) <a href="https://twitter.com/richardherbert/status/1225342539823226880?ref_src=twsrc%5Etfw">February 6, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The `where` filter in Liquid provides a simple way to select values in an array by simple property matching. So consider this array:

```js
[
	{"name":"Fred","gender":"male"},
	{"name":"Ginger","gender":"female"},
	{"name":"Bob","gender":"male"},
	{"name":"Lindy","gender":"female"}
]
```

I've got four cats with names and genders. By using the where filter on gender, I could select different cats like so:

```html
{% raw %}{% assign male_cats = cats | where: "gender", "male" %}
{% assign female_cats = cats | where: "gender", "female" %}
{% endraw %}
<h3>Male Cats</h3>
{% raw %}{% for cat in male_cats %}{% endraw %}
	{% raw %}{{ cat.name }}, {{ cat.gender }}{% endraw %}<br/>
{% raw %}{% endfor %}
{% endraw %}
<p/>

<h3>Female Cats</h3>
{% raw %}{% for cat in female_cats %}
	{{ cat.name }}, {{ cat.gender }}<br/>
{% endfor %}
{% endraw %}
```

If you run this in Eleventy though, you get this:

<img src="https://static.raymondcamden.com/images/2020/02/eleventy1.png" alt="All cats, not filtered" class="imgborder imgcenter">

The `assign` works fine, but there's no filtering. 

Why?

Turns out Eleventy ships with an older version of the Liquid template engine. This then leads to the question, how do you know what version Eleventy ships with? If you go to the docs for [Liquid in Eleventy](https://www.11ty.dev/docs/languages/liquid/), you'll see it isn't mentioned. I raised an [issue](https://github.com/11ty/eleventy/issues/906) on this saying the docs should make it more clear (for each engine obviously). It could actually be in the docs and I don't see it of course.

Luckily though you can provide your own version of Liquid (or Nunjucks, or Handlebars, etc) by using `eleventyConfig.setLibrary` in your `.eleventy.js` file. The docs show this example:

```js
module.exports = function(eleventyConfig) {
  let liquidJs = require("liquidjs");
  let options = {
    extname: ".liquid",
    dynamicPartials: true,
    strict_filters: true,
    root: ["_includes"]
  };

  eleventyConfig.setLibrary("liquid", liquidJs(options));
};
```

I gave this a shot. I made a new directory, did `npm i liquidjs`, and tried this code, but it threw an error. I checked the [docs](https://github.com/harttle/liquidjs) for liquidjs and saw that their initialization code was a bit different. I copied their code and ended up with this:

```js
module.exports = eleventyConfig => {
	let { Liquid } = require('liquidjs');
	let engine = new Liquid();

	eleventyConfig.setLibrary("liquid", engine);

}
```

<img src="https://static.raymondcamden.com/images/2020/02/eleventy2.png" alt="All cats, filtered" class="imgborder imgcenter">

Woot! But huge caveat here. Eleventy passes in it's own default options for Liquid. In my sample above I passed none so I'm using the liquidjs defaults instead. This could lead to backwards compatibility issues. This is discussed in another [issue](https://github.com/11ty/eleventy/issues/469). 

So what version of Liquid does Eleventy ship? The user @DirtyF commented that by using `npm outdated` in a repo with Eleventy you can see the following:

	Package      Current  Wanted  Latest  Location
	ejs            2.7.4   2.7.4   3.0.1  @11ty/eleventy
	handlebars     4.7.1   4.7.3   4.7.3  @11ty/eleventy
	liquidjs       6.4.3   6.4.3   9.6.2  @11ty/eleventy
	mustache       2.3.2   2.3.2   4.0.0  @11ty/eleventy

You could use this as a way to figure out exactly what features you have available when using your desired template language. 

As I raised in my [issue](https://github.com/11ty/eleventy/issues/906), I think Eleventy needs some kind of "statement" or plan about how it does upgrades, when/how it handles backwards compatibility, etc. I don't think there is an easy solution for this but I'm hoping to be able to help the project with this effort. (If you can't tell, I'm rather enamored with it. ;) 

### An Alternative

So what if you don't want to muck with how Liquid works in Eleventy? Well you've got options, lots of em!

One way is to just use a conditional:

```html
{% raw %}{% for cat in cats %}
	{% if cat.gender == "female" %}
	{{ cat.name }}, {{ cat.gender }}<br/>
	{% endif %}
{% endfor %}
{% endraw %}
```

While this implies looping over every record, keep in mind this is *only* done in development. In production it's just a plain static HTML file.

Another option is to use filters. Liquid filters support arguments, so you could build this generic utility:

```js
eleventyConfig.addFilter("where2", function(value, prop, val) {
	// assumes value is an array
	return value.filter(p => p[prop] == val);
});
```

I named it `where2` just for testing but you would probably want something else. This lets you use the same format that the newer Liquid uses:

```js
{% raw %}{% assign test_cats = cats | where2: "gender", "female" %}
{% endraw %}
```

Finally, as yet another option, consider switching engines. What do I mean by that? While Liquid is definitely my preferred engine, [EJS](https://www.11ty.dev/docs/languages/ejs/) is *incredibly* flexible when it comes to code in your template. To be honest, it's too flexibly imo and encourages you to do stuff in your templates I think you should do elsewhere. But that flexibility could be a lifesaver, and one of the most awesome features of Eleventy is that you can easily switch one document to another engine by just changing the extension. 

<i>Header photo by <a href="https://unsplash.com/@yogidan2012?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Daniel Levis Pelusi</a> on Unsplash</i>