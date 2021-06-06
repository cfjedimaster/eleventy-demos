---
layout: post
title: "Updating (and Supporting) URL Parameters with Vue.js"
date: "2021-05-08T18:00:00"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/lens_filter.jpg
permalink: /2021/05/08/updating-and-supporting-url-parameters-with-vuejs
description: Making use of URL parameters in a Vue.js application
---

Today's article is something that's been kicking around in my head for a few months now, and seeing a recent article ([Update URL query parameters as you type in the input using JavaScript](https://www.amitmerchant.com/update-url-query-parameters-as-you-type-in-the-input-using-javascript/)) encouraged me to finally get around to writing it. The basic idea is to make it easier for a person to share or bookmark the current state of an application. Let's start with a basic example.

<p>
<img data-src="https://static.raymondcamden.com/images/2021/05/vu1.jpg" alt="Demo layout of application, list of items with filters" class="lazyload imgborder imgcenter">
</p>

There's a list of items which consist of people, cats, and a dog. Each item has a name and type. On top there are filters for the name and type. If you enter any text, the items that match the name (ignoring case) will be shown. If you select one or more of the types, only those matching will be shown.

<p>
<img data-src="https://static.raymondcamden.com/images/2021/05/vu2.jpg" alt="Items filtered by name and type" class="lazyload imgborder imgcenter">
</p>

Let's look at the code. First the HTML:

```html
<html>
<head>
</head>

<body>

<div id="app">
	<h2>Items</h2>

	<p>
	<input type="search" placeholder="Filter by name" v-model="filter"> 
	<input type="checkbox" value="person" id="personType" v-model="typeFilter"> 
	<label for="personType">Only People</label>
	
	<input type="checkbox" value="cat" id="catType" v-model="typeFilter"> 
	<label for="catType">Only Cats</label>

	<input type="checkbox" value="dog" id="dogType" v-model="typeFilter"> 
	<label for="dogType">Only Dogs</label>
	</p>

	<ul>
	{% raw %}
		<li v-for="item in items">{{ item.name }} ({{item.type }})</li>
	{% endraw %}
	</ul>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="vue_url.js"></script>
</body>
</html>
```

And here's the JavaScript.

```js
// hard coded for simplicity...
const ITEMS = [
	{ name: "Ray", type: "person" },
	{ name: "Lindy", type: "person" },
	{ name: "Jacob", type: "person" },
	{ name: "Lynn", type: "person" },
	{ name: "Noah", type: "person" },
	{ name: "Jane", type: "person" },
	{ name: "Maisie", type: "person" },
	{ name: "Carol", type: "person" },
	{ name: "Ashton", type: "person" },
	{ name: "Weston", type: "person" },
	{ name: "Sammy", type: "cat" },
	{ name: "Aleese", type: "cat" },
	{ name: "Luna", type: "cat" },
	{ name: "Pig", type: "cat" },
	{ name: "Cayenne", type: "dog" }
]

const app = new Vue({
	el:'#app',
	data: {
		allItems: ITEMS,
		filter:'',
		typeFilter:[]
	},
	computed: {
		items() {
			return this.allItems.filter(a => {
				if(this.filter !== '' && a.name.toLowerCase().indexOf(this.filter.toLowerCase()) === -1) return false;
				if(this.typeFilter.length && !this.typeFilter.includes(a.type)) return false;
				return true;
			});
		}
	}
});
```

As you can see, the items referenced in HTML comes from the 'raw' data, `allItems`, and is filtered in a computed property. Here's a CodePen if you want to see it in action.

<p class="codepen" data-height="500" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="gOmpPmg" style="height: 500px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Vue Blog Post about URL Params">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/gOmpPmg">
  Vue Blog Post about URL Params</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Alright, so that's the application in it's initial state. Now imagine you've filtered the data, like the results, and want to bookmark it, or share it? To do that we need to do two things:

* When you filter, in any way, change the URL in a way that doesn't reload the page
* When you request the page, check the URL for query params and default our filters

Let's tackle the second one first:

```js
created() {
	let qp = new URLSearchParams(window.location.search);
	let f = qp.get('filter');
	if(f) this.filter = qp.get('filter');
	let tf = qp.get('typeFilter');
	if(tf) this.typeFilter = tf.split(',');
},
```

I make use of the `created` event to look at the current URL query parameters. If I have a value for filter, I can simply pass it use it as is in `this.filter`. For `typeFilter`, it will be an array of values which in a query string will be comma delimited. So if it exists, I turn it into an array using `split`. I could test this by manually changing the URL, htting enter, and seeing the page load with the right values.

Now we need to handle updating the URL when you filter. While Vue supports a `watchers` feature, it only lets you associate a handler with one variable at a time, which means I'd need a watcher for both `filter` an `typeFilter`. Vue 3 fixes this. (See more on this [here](https://stackoverflow.com/questions/42737034/vue-js-watch-multiple-properties-with-single-handler).) 

As my application was using a computed value that already executed when either of my filters updated, I added a call to a new function there:

```js
computed: {
	items() {
		this.updateURL();
		return this.allItems.filter(a => {
			if(this.filter !== '' && a.name.toLowerCase().indexOf(this.filter.toLowerCase()) === -1) return false;
			if(this.typeFilter.length && !this.typeFilter.includes(a.type)) return false;
			return true;
		});
	}
},
```

And here is `updateURL`:

```js
updateURL() {
	let qp = new URLSearchParams();
	if(this.filter !== '') qp.set('filter', this.filter);
	if(this.typeFilter.length) qp.set('typeFilter', this.typeFilter);
	history.replaceState(null, null, "?"+qp.toString());
}
```

I create new, blank URL params and build it up based on the values of my filter. I then use `history.replaceState` to update the URL without actually reloading the page. Unforunately I can't show this on CodePen as it doesn't let you change the URL, but I have the complete code up on [this pen](https://codepen.io/cfjedimaster/pen/KKWpVqe). I put a demo here if you want to kick the tires a bit:

<https://cfjedimaster.github.io/vue-demos/urlthing/vue_url.html?>

And here's an example with some filters:

<https://cfjedimaster.github.io/vue-demos/urlthing/vue_url.html?filter=a&typeFilter=cat>

Photo by <a href="https://unsplash.com/@srkraakmo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Stephen Kraakmo</a> on <a href="https://unsplash.com/s/photos/filter?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  