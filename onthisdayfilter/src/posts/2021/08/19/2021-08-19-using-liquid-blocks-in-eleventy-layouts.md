---
layout: post
title: "Using Liquid Blocks in Eleventy Layouts"
date: "2021-08-19T18:00:00"
categories: ["jamstack"]
tags: ["eleventy"]
banner_image: /images/banners/blocks.jpg
permalink: /2021/08/19/using-liquid-blocks-in-eleventy-layouts.html
description: A look at using multiple blocks and having them render in Liquid templates
---

Today's post is based on an interesting question I ran into on StackOverflow: [How do I use LiquidJS Layout Blocks in Eleventy?](https://stackoverflow.com/questions/68834347/how-do-i-use-liquidjs-layout-blocks-in-eleventy) The person asking the question was trying to accomplish the following:

Eleventy makes it super easy to use templates with your work. You create a file, add front matter, and specify a layout file:

```
---
title: Hello World
layout: main
---
```

You can then create a file, `_includes/main.liqdui`, and then render your content like so:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title></title>
	<style>
	main {
		padding: 30px;
		background-color: #c0c0c0;
	}
	</style>
</head>
<body>

<main>
{% raw %}{{ content }}
{% endraw %}</main>

</body>
</html>
```

Layouts work great when your content lands in the middle of some block of HTML. But consider a layout that has a block that needs to be dynamic and that's *not* between a pair of tags?

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title></title>
	<style>
	main {
		padding: 30px;
		background-color: #c0c0c0;
	}

	#footer {
		margin-top: 10px;
	}
	</style>
</head>
<body>

<main>
{% raw %}{{ content }}
{% endraw %}</main>

<footer>
	This is the footer.
</footer>

</body>
</html>
```

In the example above, we've added a footer element that right now is hard coded, but we'd like to have our page templates pass in content. So for example:

```html
<footer>
{% raw %}{{footer}}
{% endraw %}</footer>
```

So, one quick solution is to just use front matter!

```
---
title: Hello World
layout: main
footer: This is the footer!
---
```

That works perfectly fine, but really only works for short blocks of static content. If I wanted something more dynamic, I'd be out of luck. [Computed Data](https://www.11ty.dev/docs/data-computed/) could be a solution, but the StackOverflow user was looking to use a Liquid feature, [Blocks](https://liquidjs.com/tags/layout.html#Blocks). Idealy, this is what they would like to do:

```
---
title: Hello World
layout: main
---

## Hello World!

This is me testing.

{% raw %}{% block footer %}
This will be used in the footer.
{% endblock %}
{% endraw %}
```

The result is not what you would expect:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/08/block1.jpg" alt="The web page rendered the footer in the main content" class="lazyload imgborder imgcenter">
</p>

Ok, so what now? I did some Googling and found this Eleventy issue: [Using Nunjucks blocks from within Markdown](https://github.com/11ty/eleventy/issues/1467). In the issue, they described that in order to do this with Nunjucks, you can't use Eleventy layouts, but must specify the layout with Nunjucks itself.

Alright, so I tried that in `test1.md`:

```html
---
title: Test 1
---

{% raw %}{% layout main %}

## Hello World!

This is me testing.

{% block footer %}
This will be used in the footer.
{% endblock %}
{% endraw %}
```

And... it kinda worked. But I noticed a few issues. First, I lost all my output. It looks like when Liquid executed in Markdown, it ended up folowing one of the Markdown rules where code that's tabbed over is meant to be used as *displayed* source code, so it escaped it. I fixed that by removing the tabs in my layout. Annoying, but I can deal. Then, to display my footer, I had to change from:

```html
{% raw %}{{ footer }}
{% endraw %}
```

To:

```html
{% raw %}{% block footer %}{% endblock %}
{% endraw %}
```

I'm ok with that change as it lets me specify a default value for footer as well. Now I've got this:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/08/block2.jpg" alt="Footer displayed, not the content" class="lazyload imgborder imgcenter">
</p>

And if you think about it, the missing "main" content makes sense. I'm no longer using Eleventy to do my layout, so in `layout.liquid`, `{% raw %}{{ content }}{% endraw %}` doesn't exist. (Well the code is there of course, I mean the *value* of content isn't set.) 

So how do we fix this now? Use blocks again. Here's `layout.liquid` now:


```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title></title>
<style>
main {
	padding: 30px;
	background-color: #c0c0c0;
}

#footer {
	margin-top: 10px;
}
</style>
</head>
<body>
{% raw %}
<main>
{% block content %}{% endblock %}
</main>

<footer>
{% block footer %}{% endblock %}
</footer>{% endraw %}

</body>
</html>
```

And then back in `test1.md`:

```html
---
title: Test 1
---
{% raw %}
{% layout main %}

{% block content %}
## Hello World!

This is me testing.
{% endblock %}

{% block footer %}
This will be used in the footer.
{% endblock %}{% endraw %}
```

Woot! Now it's perfect! Except my *other* site pages don't work!

<p>
<img data-src="https://static.raymondcamden.com/images/2021/08/block3.jpg" alt="Main content is gone" class="lazyload imgborder imgcenter">
</p>

On a page using Eleventy's built in layout processing, my content isn't working. Dangit. Luckily there's an easy, if somewhat hackish, solution:

```html
<main>
{% raw %}{% block content %}{% endblock %}
{{ content }}
{% endraw %}</main>
```

On pages not using the footer block, the `content` variable will be declared. On pages using it, the `content` *block* will exist.

Whew. 

So.... this *works*, and honestly it isn't too terribly ugly. But then I remembered something. A few weeks ago I [blogged](https://www.raymondcamden.com/2021/07/12/creating-an-additive-capture-shortcode-in-eleventy) about creating "additive" capture blocks in Eleventy. Basically, I wanted to wrap content two or more times and have it append to one variable. I'd then display that variable.

In that blog post, I created two shortcodes, one called `mycapture` and one called `displaycapture`. My code worked by storing the values so that I could add to it and then display it. Today I discovered a bug in that implementation (fixed in this post and will be fixed in the old post by the time you read this) but was able to quickly correct it. So here's my `.eleventy.js` with my shortcodes:

```js
module.exports = function(eleventyConfig) {

	let _CAPTURES;
	eleventyConfig.on('beforeBuild', () => {
		//I need this to wipe _CAPTURES when editing pages, wouldn't be an issue in prod
		_CAPTURES = {};
	});
	
	
	eleventyConfig.addPairedShortcode("mycapture", function (content, name) {
		if(!_CAPTURES[this.page.inputPath]) _CAPTURES[this.page.inputPath] = {};
		if(!_CAPTURES[this.page.inputPath][name]) _CAPTURES[this.page.inputPath][name] = '';
		_CAPTURES[this.page.inputPath][name] += content;
		return '';
	});
	
	eleventyConfig.addShortcode("displaycapture", function(name) {
		if(_CAPTURES[this.page.inputPath] && _CAPTURES[this.page.inputPath][name]) return _CAPTURES[this.page.inputPath][name];
		return '';
	});

};
```

So while we don't need *additive* shortcodes, we can now do this (in `test2.md`):

```html
---
title: Test 2
layout: main2
---

## Second Test

This is me testing more.

{% raw %}{% mycapture "footer" %}
This is my footer!
{% endmycapture %}
{% endraw %}
```

You'll notice I'm using `main2.liquid` for the layout. That's closer to my original version, but uses my shortcode for the footer:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title></title>
	<style>
	main {
		padding: 30px;
		background-color: #c0c0c0;
	}

	#footer {
		margin-top: 10px;
	}
	</style>
</head>
<body>

{% raw %}	<main>
	{{ content }}
	</main>

	<footer>
	{% displaycapture "footer" %}
	</footer>{% endraw %}

</body>
</html>
```

I like this solution as it removes some of the complexity around the blocks and lets me keep using "normal" Liquid layouts. Anyway, as always, I'd love to hear what you think. You can find this solution here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/blockquestion>

Photo by <a href="https://unsplash.com/@michaelfousert?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Michael Fousert</a> on <a href="https://unsplash.com/s/photos/block?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  