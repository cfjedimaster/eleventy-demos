---
layout: post
title: "Modifying Prism's Copy Plugin"
date: "2020-05-05"
categories: ["development"]
tags: []
banner_image: /images/banners/wolves.jpg
permalink: /2020/05/05/modifying-prisms-copy-plugin
description: An example of modifying Prism's Copy support to alter the text in the clipboard
---

This post definitely falls into the "I'm Not Sure This is a Good Idea" Department, but I thought I'd share on the wild chance it was useful to others. I've been using [Prism](https://prismjs.com/index.html) for source code blocks for sometime now and I like it fine enough. Recently I was working on a presentation about technical documentation. While working on the slide deck, I came across a code sample that had some line breaks in it:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/spotify.png" alt="Curl example" class="lazyload imgborder imgcenter">
</p>

In the code sample above, the curl command is broken over multiple lines. This isn't valid, but is nicely readable. Compare that to this version:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/05/curl.png" alt="Another curl example" class="lazyload imgborder imgcenter">
</p>

This is also nicely readable, but did you know that Windows users can't use `\` to break commands like that? The main terminal, cmd.exe, uses `^` instead. It's a minor issue, but it's something I'm cognizant of when I write docs. Developers, right or wrong, will copy and paste things as they learn and something small like this could trip them up.

Ok, so back to Prism. It turns out that it has a plugin to support [copy to clipboard](https://prismjs.com/plugins/copy-to-clipboard/) support. When downloading, you simply select that plugin and it will be added to your code samples automatically. There's nothing else you need to do which is pretty nice. While this isn't a Prism tutorial, here's how the HTML looks:

```html
<html>
<head>
<link rel="stylesheet" href="prism.css">
</head>

<body>

<h2>Test</h2>

<pre><code class="language-bash">
curl 
	-x "foo.html"
	-z "doo"
	-B true
	-D {"name":"ray", age: 47, "code":"not real"}
	> output.txt
</code></pre>

<script src="prism.js"></script>
</body>
</html>
```

Note, that is *not* meant to be a real example of a `curl` call. You can see a demo of this here: <https://prismcopytest.now.sh/v1/>.

Cool. So given that Prism can add a "Copy" command to code blocks, can we modify it such that we can show a command line example like we have above but when put in the clipboard it's all one line? Turns out you can.

The first thing I did was redownload Prism *without* the Copy plugin. The [docs](https://prismjs.com/plugins/copy-to-clipboard/) for the plugin include all the code there so I knew I could use that as a base. I did make the mistake of not including the Toolbar plugin. It's required so you need to ensure that option is checked. 

Next, I added the Clipboard.js CDN above my prism.js load like so:

```html
<script src="https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js"></script>
<script src="prism.js"></script>
```

In a second you'll see the Copy plugin code and it actually supports loading this dynamically, but it felt better to include it manually. 

Alright, so looking at the source of the plugin, the portion that handles getting the text to copy is this:

```js
var clip = new ClipboardJS(linkCopy, {
	'text': function () {
		return env.code;
	}
});
```

I surmised that `env.code` was the code block. I confirmed this by adding the plugin code to my page and just adding a console.log message above it. 

With that in place, I then did a quick modification:

```js
var clip = new ClipboardJS(linkCopy, {
	'text': function () {
		return env.code.split('\n').join(' ').replace(/\s+/g,' ');
	}
});
```

Basically, split the code along new lines, join them back together in a string, and then replace whitespace with one space. And... it just plain worked. If you go to the next version (<https://prismcopytest.now.sh/v2/>) and click copy, you'll end up with this in the clipboard:

```
curl -x "foo.html" -z "doo" -B true -D {"name":"ray", age: 47, "code":"not real"} > output.txt 
```

This would (should) work in any operating system and is nicely readable on screen. You could make the argument that a user may try to type it as they see it, which would break, hence me prefixing this entire blog entry with "it may not be a good idea" - but it works. Anyway, what do folks think?

p.s. While I think this is a good example, I typically *despise* places that mess with the clipboard. A lot of places will prefix selected text with something like, "Copied from ..." which I just find incredibly annoying. 

<i>Header photo by <a href="https://unsplash.com/@evablue?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Eva Blue</a> on Unsplash</i>