---
layout: post
title: "Page Level URL Fetching with Eleventy"
date: "2021-07-30T18:00:00"
categories: ["javascript","jamstack"]
tags: ["eleventy"]
banner_image: /images/banners/plank-bridge.jpg
permalink: /2021/07/30/page-level-url-fetching-with-eleventy.html
description: Making a network request on a page with Eleventy
---

Let me begin by being very clear. This is not a very good idea. I just got back from a much delayed honeymoon with my wife (apparently right before the mask mandates all come crashing back) and haven't written code for a while so perhaps I was a bit desperate to create something useless. That being said, working on this did let me kick the tires a bit on a few Eleventy things and that's *always* a good idea. 

So - the background for this was a recently released article on Astro over on css-tricks: ["A Look at Building with Astro
"](https://css-tricks.com/a-look-at-building-with-astro/). It was an interesting article and I'm hoping to get some time to play with Astro more later in the year, but one aspect in particular stood out to me.

Astro supports loading remote data via front matter. Here's an example from the article:

```
---
import Card from '../components/Card.astro';
import Header from '../components/Header';

const remoteData = await fetch('https://css-tricks.com/wp-json/wp/v2/posts?per_page=12&_embed').then(response => response.json());
---
```

This then lets you use `remoteData` as page level data represented by the network call used. Now... I see that and it's like I have two immediate responses... "that's cool" and "I'm not sure I like that". That's a fairly typical response I think. Not every feature that looks good on a first impression is actually a sensible idea. But seeing that got me thinking about how something like that could be done in Eleventy.

Right now, you could easily fetch data and use it in your pages using either global or page level data files. So if I didn't want to add to the "global" data variable space in Eleventy, I could do something like so:

```js
const fetch = require('node-fetch');

module.exports = async () => {

	let data = await fetch('https://swapi.dev/api/starships');
	let json = (await data.json()).results;

	return { ships: json }

}
```

If I name this `foo.11tydata.js` and place it in the same folder as `foo.liquid` (or any other template), then my page would have access to a `ships` value. 

This is what I'd do.

But again - I wanted to see if I could get it working *just* on the page itself.

For my first attempt, I tried to use [JavaScript front matter](https://www.11ty.dev/docs/data-frontmatter/#javascript-front-matter), this let's you define functions in your front matter that your template can use. Here's the example from the doc I just linked to:

```html
---js
{
  title: "My page title",
  currentDate: function() {
    // You can have a JavaScript function here!
    return (new Date()).toLocaleString();
  }
}
---
<!doctype html>
<html>
<!-- … -->
<body>
  {% raw %}
  <h1>{{ title }}</h1>
  <p>Published on {{ currentDate() }}</p>
  {% endraw %}
```

But, as the docs point out, you can't use `{% raw %}{{ currentDate() }}{% endraw %}` in Liquid. However, you can use an IIFE if you want:

```html
---js
{
  title: "My page title",
  currentDate: (function() {
    // You can have a JavaScript function here!
    return (new Date()).toLocaleString();
  }
})()
---
<!doctype html>
<html>
<!-- … -->
<body>
{% raw %}
<h1>{{ title }}</h1>
<p>Published on {{ currentDate }}</p>
{% endraw %}
```

Which is fine if you want it executed one time only when the page is being built. However, you can't do things like `const fetch = require('node-fetch');` in there - I tried. 

But then I tried another tact... shortcodes. I wrote a filter that let's you pass a URL and a variable. The filter will call the URL and return the results in the variable you created. Here's an example:

```html
{% raw %}
{% fetch 'https://swapi.dev/api/starships' 'ships3' %}
{% for ship in page.ships3.results %}
    ship test, {{ ship.name }}<br/>
{% endfor %}
{% endraw %}
```

And here's the filter:

```js
eleventyConfig.addShortcode("fetch", async function(url, name, filter) {
    let resp = await fetch(url);
    let data = await resp.json();
    if(filter) data = data[filter];
    this.page[name] = data;
});
```

All it does it take the URL you sent, request it, and return it. Shortcodes have access to page level data so I use the second argument as a way to name the place to store the value. Finally, a lot of APIs will return top level meta or page data and then results, so I included a `filter` argument as a quick way to get just what you want:

```html
{% raw %}
{% fetch 'https://swapi.dev/api/starships' 'ships4' 'results' %}
{% for ship in page.ships4 %}
    ship test, {{ ship.name }}<br/>
{% endfor %}
{% endraw %}
```

So um... yeah. That works... I just don't think I'd ever actually do that. ;) I can say the idea of a shortcode creating data you can use again is interesting so I'd love to hear if folks have more... sensible ways to make use of this. Let me know!

Photo by <a href="https://unsplash.com/@bendavisual?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Benjamin Davies</a> on <a href="https://unsplash.com/s/photos/dangerous?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  