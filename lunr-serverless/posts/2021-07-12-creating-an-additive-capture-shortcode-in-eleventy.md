---
layout: post
title: "Creating an Additive Capture Shortcode in Eleventy"
date: "2021-07-12T18:00:00"
categories: ["javascript", "static sites"]
tags: "post"
description: Creating a capture shortcode that appends insteads of replacing
---

**Edit on August 19, 2021: I found an issue with my code where a shortcode for 'foo' on page 1 would be shared with the same name on other pages. I corrected it by using the current page scope. Fixes are inline.**

Ok, so let me start off by saying that a) I'm not sure this is a good idea and b) it may already exist and I just don't know about it. This all came about from me doing some research on an [Eleventy tagged question](https://stackoverflow.com/questions/tagged/eleventy) on StackOverflow. If you aren't aware, Liquid has a tag built in called capture. It looks like so:

```html
{% raw %}
{% capture my_variable %}
I am being captured.
{% endcapture %}
{% endraw %}
```

This then lets you output `my_variable`. Having paired shortcodes like this makes it easier to capture dynamic output and save it to a variable. So for example:

```html
{% raw %}
{% capture my_variable %}
I am being captured at {{ "now" | date: "%Y-%m-%d %H:%M" }}.
{% endcapture %}
{% endraw %}
```

One interesting aspect of the capture shortcode though is that it always sets the value to what you capture. If you had something in that variable already, it gets overwritten. I think that's expected and not bad, but here's an example of that as well:

```html
{% raw %}{% capture my_variable %}I am being captured.{% endcapture %}
{% capture my_variable %}MORE captured.{% endcapture %}{% endraw %}
```

If you output `my_variable`, you will only get `MORE captured.` Again, I think this is expeted. But it got me thinking - what if we built a shortcode that appended, rather then replaced, content? This is what I came up with:

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

This `.eleventy.js` file defines two shortcodes - `mycapture` and `displaycapture`. I define a global variable (I'll explain `beforeBuild` in a sec) named `_CAPTURES` that stores key value pairs. In order to keep a key, `foo`, local to one page, I use the current page's `inputPath` value. (This is something I edited after the initial blog post.)  When using `mycapture`, the text inside the shortcode get passed to the `content` variable and when I actually write the shortcode, I include the `name` argument. Here's an example:

```html
{% raw %}{% mycapture "foo" %}
<p>
This is test i think 1
</p>
{% endmycapture %}

{% mycapture "foo" %}
<p>
This is test i think 2 
</p>
{% endmycapture %}
{% endraw %}
```

Here I've captured `"foo"` twice. And then to output it, I do:

```html
{% raw %}<p>
And here is my demo, should show two parts:
    {% displaycapture "foo" %}
</p>
{% endraw %}
```

And that's it. Using the sample above you get:

```html
<p>
This is test i think 1
</p>
<p>
This is test i think 2
</p>
```

So one thing weird I noticed is that the content began to duplicate itself. So instead of two paragraphs, I'd had four. From what I could gather, Eleventy was not rerunning `.eleventy.js` on me editing a page, so it didn't clear the variable. I initially had:

```js
const _CAPTURES = {};
```

I kept getting inconsistent results that would go away if I killed the Eleventy CLI and ran from scratch. I finally figured out what happened and that's when I added the `beforeBuild` event. In theory it's not needed in production as you aren't refrefshing there, but it doesn't hurt being there as is I think. 

If you want a copy of this, you can find it here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/additive>

Photo by <a href="https://unsplash.com/@jakobowens1?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jakob Owens</a> on <a href="https://unsplash.com/s/photos/capture?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>