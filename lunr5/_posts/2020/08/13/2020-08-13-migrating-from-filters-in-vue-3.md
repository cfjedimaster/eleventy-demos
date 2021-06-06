---
layout: post
title: "Migrating from Filters in Vue 3"
date: "2020-08-13"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/coffee_filter.jpg
permalink: /2020/08/13/migrating-from-filters-in-vue-3
description: An example of how to rewrite Vue 2 filters for Vue 3
---

I've been holding off on learning (and playing) with Vue 3 until it's gotten closer to release, but with Vue 3 in RC it feels like an appropriate time to start digging into it. The [docs](https://v3.vuejs.org/) are in a pretty good state and there is a *really* well done [migration guide](https://v3.vuejs.org/guide/migration/introduction.html) that clearly defines the changes and how to update your code.

One of the changes that I'm not a fan of is the removal of filters. Filters provide a way to format text in your display and were one of my favorite Vue.js features. (To be fair, I've got more than one "favorite" Vue feature. ;) In case you haven't seen this feature yet, let's look at a quick example. 

First, I set up an application with data:

```js
Vue.config.productionTip = false;
Vue.config.devtools = false;

const app = new Vue({
  el:'#app', 
  data: {
    bio: 'This is a very long line of text that will go on and on and not really be helpful to anyone reading it outside of possibly boring them inti some stupified zombie-like trance which may be desirable in these trying times.'
  }
})
```

In my DOM, I want to display the bio, but I want to limit the size of it. I can add this to my Vue application:

```js
filters: {
	trim(s) {
		if(s.length < 50) return s;
		return s.substring(0,50-3) + '...';
	}
}
```

Which then allows this syntax in my DOM:

```html
<div id="app" v-cloak>
{% raw %} My Bio: {{ bio | trim }}
{% endraw %}</div>
```

Now maybe it's my experience with HTML template languages, but that pipe syntax looks completely natural to me. Here's a complete CodePen of this in play:

<p class="codepen" data-height="393" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="gOrPGLo" style="height: 393px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Filter 1">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/gOrPGLo">
  Filter 1</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Filters also support optional arguments allowing for syntax like so:

```html
<div id="app" v-cloak>
{% raw %}  My Bio: {{ bio | trim(10) }}
{% endraw %}</div>
```

The filter has to be updated of course:

```js
trim(s,len) {
	if(!len) len = 50;
	if(s.length < len) return s;
	return s.substring(0,len-3) + '...';
}
```

Here's another CodePen for you to play with:

<p class="codepen" data-height="393" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="jOqWGVX" style="height: 393px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Filter 2">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/jOqWGVX">
  Filter 2</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

So as I said - I dig this! But it's being removed from Vue 3. Why? The migration guide says this:

<blockquote>
While this seems like a convenience, it requires a custom syntax that breaks the assumption of expressions inside of curly braces being "just JavaScript," which has both learning and implementation costs.
</blockquote>

This makes sense. I don't like filters going away as a feature, but I can see the logic in this decision. To keep using this logic in a Vue 3 application, you can simply move the filter to a method. Here's how it looks in a Vue 3 application:

```js
const app = {
	data() {
		return {
			bio: 'This is a very long line of text that will go on and on and not really be helpful to anyone reading it outside of possibly boring them inti some stupified zombie-like trance which may be desirable in these trying times.'
		}
	},
	methods: {
		trim(s,len) {
			if(!len) len = 50;
			if(s.length < len) return s;
			return s.substring(0,len-3) + '...';
		}
	}
};

Vue.createApp(app).mount('#app')
```

You have to change the DOM of course:

```html
<div id="app" v-cloak>
{% raw %}  My Bio: {{ trim(bio) }}{% endraw %}
</div>
```

And here's an example with a custom length:

```html
<div id="app" v-cloak>
{% raw %}  My Bio: {{ trim(bio, 12) }}{% endraw %}
</div>
```

The end result is the same of course. You can see it here:

<p class="codepen" data-height="398" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="YzqwrVQ" style="height: 398px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="non filter filter">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/YzqwrVQ">
  non filter filter</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

What happens if you forget and use the pipe operator? Vue 3 treats it as a [bitwise OR](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR) operator leading to unexpected results. 

This isn't the only way to move from filters of course. If you knew for a fact that you were always displaying the bio value in a trimmed fashion, you could trim it when the value is retrieved. In my example the value is hard coded, but typically it would be dynamic. Of course, having the original value lets you do things like displaying it in a trimmed fashion and letting the user click to expand.

Be sure to check the [Vue 3 migration guide on Filters](https://v3.vuejs.org/guide/migration/filters.html#filters) for more examples and I'll be blogging more about Vue 3 as I start playing with it more. 

<span>Photo by <a href="https://unsplash.com/@nate_dumlao?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Nathan Dumlao</a> on <a href="https://unsplash.com/s/photos/filter?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>