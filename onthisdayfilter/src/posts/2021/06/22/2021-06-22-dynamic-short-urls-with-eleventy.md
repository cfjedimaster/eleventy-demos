---
layout: post
title: "Dynamic Short URLs with Eleventy"
date: "2021-06-22T18:00:00"
categories: ["javascript","jamstack"]
tags: ["eleventy"]
banner_image: /images/banners/directions.jpg
permalink: /2021/06/22/dynamic-short-urls-with-eleventy.html
description: Creating URL aliases dynamically with Eleventy
---

One feature that some CMS systems have is the ability to handle short URLs that map to pages on the site. I'm not talking about services like TinyURL, but internal systems specific to a site. So for example, Adobe.com supports "go" URLs where you can go to this url: <https://adobe.com/go/coldfusion> and it maps to <https://www.adobe.com/products/coldfusion-family.html>. I decided to see if I could implement this with Eleventy. My demo is using Netlify but in theory could work anywhere that lets you specify redirects via a file. 

So, first off, if you want a simple hard coded system for handling redirects like this, you can simply edit your `_redirects` file and specify your aliases. So for example:

```
/go/cats	/documentation/animals/cats
```

While this format is pretty simple and a non-technical person could probably handle that just fine, what I wanted to create was a system where the page itself could define it's redirect. So for example, I've got a page located at `/docs/gettingstarted.md`. Here's the contents:

```html
---
layout: main
title: Getting Started
go: gs
---

This is the Getting Started page.
```

In this page, I defined a front matter variable, `go`, that defines the alias for this particular page. So how did I make this work?

Before I show how, let me quickly thank [Zach Leatherman](https://twitter.com/zachleat) for this solution. My initial version worked but his idea made my code much simpler. I begin by first creating a custom collection that contains every page with a `go` value:

```js
eleventyConfig.addCollection("goPages", collectionApi => {
	return collectionApi.getAll().filter(p => {
		if(p.data.go) return true;
		return false;
	});
});
```

This new collection, `goPages`, can then be used in my redirects file. Netlify requires it to be named `_redirects`, but remember that Elevently lets you output to anything, so I created `_redirects.liquid`:

```
---
permalink: /_redirects
---

#old home page
/home / 301

{% raw %}{% for page in collections.goPages %}
/go/{{ page.data.go }}	{{ page.url }}
{% endfor %}
{% endraw %}
```

Notice I've got "regular" redirects on top and then my custom ones output beneath. The important bits are the `permalink` setting which writes to the right place for Netlify and then the loop over `goPages`. All I do is map the alias provides in the front matter to the 'real' URL. 

I saved this demo in my Eleventy demos repo here (<https://github.com/cfjedimaster/eleventy-demos/tree/master/gourls>) and deployed it to Netlify here: <https://gourltest.netlify.app/>. You can test the alias by going here: <https://gourltest.netlify.app/go/gs>. To be fair, it isn't that much shorter than the real URL, but for a larger site with more nested subdirectories, it could be a handy shorthand. Personally, I love how I can set this up from the content page itself.

This could be nicer. For example, I could support passing a list of creating one redirect for each value. Also, I could see building a shortcode such that when run, it either returns the alias version if it exists or just the regular URL. Anyway, let me know if this is helpful!

Photo by <a href="https://unsplash.com/@soymeraki?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Javier Allegue Barros</a> on <a href="https://unsplash.com/s/photos/directions?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  