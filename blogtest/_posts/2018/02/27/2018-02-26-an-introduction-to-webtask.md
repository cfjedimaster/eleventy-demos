---
layout: post
title: "An Introduction to Webtask"
date: "2018-02-27"
categories: [serverless]
tags: [webtask]
banner_image: /images/banners/webtask1.jpg
permalink: /2018/02/27/an-introduction-to-webtask
---

Welcome to my first post on [Webtask](https://webtask.io/)! Webtask is the serverless platform from [Auth0](https://auth0.com/). It powers extensibility behind our identity product as well as [Extend](https://auth0.com/extend). I'm assuming by now most of my readers have a basic grip on what serverless implies in general, so instead I'd like to focus on some of the coolest aspects of Webtask.

Online Editor
===

First, while it has a CLI and you can use it to do everything, it also has a really nice online editor. As a dedicated koolaid drinking Visual Studio Code person I'll always default to my own editor, but this past weekend I needed to use the online editor (I had forgotten to commit a file to source control before leaving home) and found it really well done. 

![Online editor](https://static.raymondcamden.com/images/2018/2/wt1.jpg)

It isn't obvious from a static screenshot, but like any other modern editor you get intellisense, keyboard shortcuts, and more. You can also run tests directly from the editor as well.

Source Options
===

Ok, this may not be something you would use very often, but on top of being able to source your webtask from a file locally, you can also source it from a URL. So at first blush that may not sound too interesting, it's just copying from a URL versus a local file. But you can set it up so that the source is read from the URL every time the webtask is executed. What this means is that you can use GitHub to host the code for the webtask and know that whenever you commit your code, the webtask will be updated as well.

Express Support
===

So I've seen Express run on serverless platforms before and I'm still not sold on *why* you would do that. But after seeing it working with webtask... I'm kinda intrigued. I can see why folks may want to consider doing that. 

Storage
===

This is easily my favorite feature. Webtask supports a lightweight [storage](https://webtask.io/docs/storage) system. This is absolutely not meant to replace a proper persistence system, but for small, lightweight data operations, you can make use of it to store data between executions. (I'll show an example in a bit.) So for example, maybe you just want to remember the last time a webtask ran and what the result was. This would support that very easily. It also supports handling write conflicts, both allowing you to handle them dynamically or letting you set a "just write and screw conflicts" mode. 

Show Me Some Darn Code
===

The basic structure of a webtask looks like so:

```js
module.exports = function (context,cb) {
	// do stuff here
	cb(null, {% raw %}{message:'hello world'}{% endraw %});
}
```

The [context](https://webtask.io/docs/context) argument contains things like parameters and secret keys whereas the cb argument is your callback to return results. If you aren't using the online editor, you deploy it like so:

	wt create test1.js

Webtask will automatically name your task based on the filename, but you can change that with a flag.

![CLI output](https://static.raymondcamden.com/images/2018/2/wt2.jpg)

You can copy that URL and open it up in your browser of course: https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.run.webtask.io/test1

Returning non-JSON results is also pretty simple:

```js
'use strict';
module.exports = function (context, req, res) {
    res.writeHead(200, {% raw %}{ 'Content-Type': 'text/html '}{% endraw %});
    // https://www.placecage.com/c/200/300
    let w = getRandomInt(100, 600);
    let h = getRandomInt(100, 600);
    let img = `https://www.placecage.com/c/${% raw %}{w}{% endraw %}/${% raw %}{h}{% endraw %}`;
    res.end(`<img src="${% raw %}{img}{% endraw %}">`);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
```

You can try this one here: https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.run.webtask.io/test2

As an example of the storage support, here is a simple counter:

```js
module.exports = function (context,cb) {

	context.storage.get((error,data) => {
		data = data {% raw %}|| { hits:0 }{% endraw %};
		data.hits++;

		context.storage.set(data, {% raw %}{force:1}{% endraw %}, error => {
			if(error) return cb(error);
			cb(null, {% raw %}{hits:data.hits}{% endraw %});
		});
	});
}
```

As I said above, remember that you can handle write conflicts manually instead of ignoring it as I did here. While not as exciting as the previous demo, you can test this one here: https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.run.webtask.io/counter

Wrap Up
===

So this was just a very quick look at Webtask and there is a heck of a lot more you can do. Take a look at the [docs](https://webtask.io/docs/101) and let me know what you think. My plan is to migrate some of my OpenWhisk actions (specifically the Serverless Superman and RandomComicBook twitter bots) and I'll share how that process goes. I'll also be sharing more general How To stuff in the future. 

<i>Header photo by <a href="https://unsplash.com/photos/woE3oGb8kDs?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Christian Battaglia</a> on Unsplash</i>