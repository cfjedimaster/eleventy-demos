---
layout: post
title: "Accessing Eleventy Data on the Client Side"
date: "2021-01-18"
categories: ["static sites"]
tags: ["eleventy"]
banner_image: /images/banners/space.jpg
permalink: /2021/01/18/accessing-eleventy-data-on-the-client-side
description: Accessing Eleventy data files in your JavaScript code
---

This is something I've demonstrated before but haven't had a chance yet to write about it by itself. As you know, one of the best features of Eleventy is support for [data files](https://www.11ty.dev/docs/data/). This feature lets you define JSON or JavaScript logic to return data your templates can use. But along with using data in your templates, you may want to use the same information in your client-side JavaScript code. So how can you do that?

Let's start off with some sample data. (I'll be sharing a link to the repository with all this code at the end.) For my demo I'll use two samples, first a static JSON file named `site.json`:

```json
{
	"name":"Demo Site",
	"email":"raymondcamden@gmail.com",
	"cats":true
}
```

And then a more dynamic JavaScript file named `starWarsFilms.js`:

```js
const fetch = require('node-fetch');

module.exports = async function() {
	let url = `https://swapi.dev/api/films`;
	
	let resp = await fetch(url);
	let data = await resp.json();

	return data.results;

}
```

Just to test, I create an `index.liquid` file that dumps the values out:

```html
---
layout: main
---
{% raw %}
<h1>Testing</h1>

<p>
Output the raw value for "site": {{ site }}
</p>

<hr/>

<p>
Output the raw value for "starWarsFilms" {{ starWarsFilms }}
</p>{% endraw %}
```

Ok, so the first way we can get our `_data` files out is to create a new template. Here's how I output the site data:

```html
---
permalink: site1.json
---
{% raw %}{{ site }}{% endraw %}
```

And that's it. I use the `permalink` front matter to tell Eleventy where to save the file and then just dump out `site`. There's nothing more required. Do note that normally, like in the test file above, I include a space between the front matter and the content of the template. For my JSON file though I removed that to keep the white space down.

That's one example, here's another, this time using EJS:

```js
---
permalink: site2.json
---
<%
siteData = site;
delete siteData.cats;
%><%- JSON.stringify(siteData) %>
```

In this example, I use a bit of logic to remove something from the `site` data that I don't want exposed in my JSON. Obviously every case is different, but you have a choice between just showing the complete value from the original data or modifying it a bit before using it on the client-side site.

Another example of that can be demonstrated in how the Star Wars data is exposed:

```html
---
permalink: films1.json
---
{% raw %}[
{% for film in starWarsFilms %}
	{
		"title":"{{film.title}}",
		"released":"{{film.release_date}}"
	}{% unless forloop.last%},{% endunless %}	
{% endfor %}
]
{% endraw %}
```

In this example I only output two keys from the film data. This makes the client-side data quite a bit smaller and gives better performance on the client-side. 

With these in place, you can then use them as you would any other data. Here's an example (in the repo it's `test1.liquid`):

```html
---
layout: main
---

<div id="siteInfo"></div>

<div id="filmInfo"></div>

<script>
document.addEventListener('DOMContentLoaded', init, false);
async function init() {
	let div = document.querySelector('#siteInfo');
	let resp = await fetch('/site1.json');
	let data = await resp.json();
	let html = `
<p>
The site is named ${data.name} and 
the contact email is ${data.email} and
do we have cats? ${data.cats}
</p>
	`;
	div.innerHTML = html;

	let div2 = document.querySelector('#filmInfo');
	resp = await fetch('/films1.json');
	data = await resp.json();
	html = '<h2>Films</h2><ul>';
	data.forEach(d => {
		html += `<li><strong>${d.title}</strong>, released on ${d.released}.</li>`;
	});
	html += '</ul>';
	div2.innerHTML = html;

}
</script>
```

Nice and easy, right? Let's consider another example. Recently Eleventy released support for [events](https://www.11ty.dev/docs/events/) that your code can tie into. One of them is [afterBuild](https://www.11ty.dev/docs/events/#afterbuild), which as you can guess runs after every build is complete. We can use this event hook to copy our data to our output directory. Unfortunately, at the time I wrote this you do not have programatic access to the output directory setting. This [GitHub issue comment](https://github.com/11ty/eleventy/pull/1143#issuecomment-687192877) shows a way of handling that and in general it's a known issue. I'd also like access to the values from `_data` directory. If our templates can use the value, I think the event should have access to it as well. 

That being said though we can hard code some values, make note of it, and handle it simply:

```js
/*
No access to output directory, or configured data, so we have code for now.

This shows an example of handling this nicer: https://github.com/11ty/eleventy/pull/1143#issuecomment-687192877
*/
const dataDir = './_data/';
const outputDir = './_site/';
const fs = require('fs');

module.exports = function (eleventyConfig) {

	eleventyConfig.on('afterBuild', () => {
		fs.copyFileSync(dataDir + 'site.json', outputDir + 'site3.json');	
	});

};
```

All I do is copy the JSON file from it's source directory to the output directory. I could do some transformations here as well. Honestly I don't know if this option is any better than the earlier versions, but it gives you another option.

You can find the complete source for this here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/data_to_client>. Let me know if you've used these techniques below, and especially if you've done it differently!

<span>Photo by <a href="https://unsplash.com/@nasa?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">NASA</a> on <a href="https://unsplash.com/s/photos/data?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>