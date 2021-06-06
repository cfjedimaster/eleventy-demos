---
layout: post
title: "Integrating Navigation Search with Lunr and Eleventy"
date: "2021-02-22"
categories: ["JavaScript","Static Sites"]
tags: ["eleventy"]
banner_image: /images/banners/search.jpg
permalink: /2021/02/22/integrating-navigation-search-with-lunr-and-eleventy
description: How to use navigation search forms and Lunr
---

Forgive me for what may be a slightly confusing title. I've previously talked about integrating [Lunr](https://lunrjs.com/) and [Eleventy](https://www.11ty.dev/) (["Adding Search to your Eleventy Static Site with Lunr"](https://www.raymondcamden.com/2019/10/20/adding-search-to-your-eleventy-static-site-with-lunr) and the more recent ["Using Pre-Built Lunr Indexes with Eleventy"](https://www.raymondcamden.com/2021/01/22/using-pre-built-lunr-indexes-with-eleventy)). In both of those blog posts I had a simple home page with a search for embedded directly on it:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/02/el1.jpg" alt="Example of search displayed results on home page" class="lazyload imgborder imgcenter">
</p>

For my simple demo, this was sufficient, but I wanted something that was a bit more realistic. In many sites, the navigation itself has a small form field where a user can enter a term, hit a button (or Enter), and then takes them to a search page with results. So for example, imagine this as your top navigation bar:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/02/el2.jpg" alt="Example of search field in header" class="lazyload imgborder imgcenter">
</p>

The expectation is that I can enter a term there, hit the button, and on the search page, it should already be performing a query for my input. As you can probably guess, with Lunr this involves noticing the search term in the query string and automatically performing the search. Here's how I did that.

First, I'm not going to go over how the site was built, I did that in my [first post](https://www.raymondcamden.com/2019/10/20/adding-search-to-your-eleventy-static-site-with-lunr) on the topic. If you didn't read it and don't have time, the basic procedure was:

* I told Eleventy to take the data from one collection (a set of GI Joe characters) and generated a JSON version of it.
* My search code reads the JSON and builds a Lunr index from it.
* I used Vue to build a simple search interface that interacted with the index.

I used that demo as my source and then modified it quite a bit. First, I added Bootstrap to the UI. Look how pretty it is now:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/02/el3.jpg" alt="Example of demo with Bootstrap applied" class="lazyload imgborder imgcenter">
</p>

I also removed the search application from the home page and instead made a dedicated page for it (`search.liqud`):

<p>
<img data-src="https://static.raymondcamden.com/images/2021/02/el4.jpg" alt="Search page example" class="lazyload imgborder imgcenter">
</p>

Here's how I enabled the search in the navigation to correctly default the search. First, I made sure my search form was using `GET`, this will include the term in the query string. Here's the relevant code from my layout:

```html
<form class="d-flex" action="/search" method="get">
	<input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" name="q">
	<button class="btn btn-outline-success" type="submit">Search</button>
</form>
```

I then made a slight modification to my existing Vue code (the complete code is both in the previous blog entry and the GitHub repo I'll share at the end):

```js
async created() {

	const qs = new URLSearchParams(window.location.search);
	this.term = qs.get('q');

	let result = await fetch('/index.json');
	docs = await result.json();
	// assign an ID so it's easier to look up later, it will be the same as index
	this.idx = lunr(function () {
		this.ref('id');
		this.field('title');
		this.field('content');

		docs.forEach(function (doc, idx) {
			doc.id = idx;
			this.add(doc); 
		}, this);
	});
	this.docs = docs;

	if(this.term) this.search();

},
```

The changes are at the beginning and end of the `created` method. I start off by looking at the query string and checking for the `q` parameter (matching the name of the form field). At the end, if I have a value, I fire off a request to search. This means you land on the page and after it loads the JSON file and makes the index it will then perform the search. Of course, you can change the search term after and perform new searches.

You can demo this here: <https://lunr3.vercel.app/>. Try "cobra" as a search term. Or simply go here: <https://lunr3.vercel.app/search?q=cobra> This small change lets you link people directly to searches as well.

The full source may be found here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/lunr3>

For the heck of it, and since everyone isn't a Vue user, I also built a "vanilla" JavaScript version available at `/search-vanilla` (and `search-vanilla.liquid` on the repo above). Here's that template.

```html
---
layout: main
title: Search
---

<h1>Search</h1>

<div id="app">
	<div class="row">
		<div class="col">
			<input type="search" id="term" class="form-control"> 
		</div>
		<div class="col">
			<button class="btn btn-primary" id="searchBtn">Search</button>
		</div>
	</div>

	<div id="results" class="mt-3"></div>

</div>

<script>
document.addEventListener('DOMContentLoaded', init, false);
let idx, docs;
let field, resultsDiv;

async function init() {

	let result = await fetch('/index.json');
	docs = await result.json();
	// assign an ID so it's easier to look up later, it will be the same as index
	idx = lunr(function () {
		this.ref('id');
		this.field('title');
		this.field('content');

		docs.forEach(function (doc, idx) {
			doc.id = idx;
			this.add(doc); 
		}, this);
	});

	document.querySelector('#searchBtn').addEventListener('click', search);

	field = document.querySelector('#term');

	const qs = new URLSearchParams(window.location.search);
	let term = qs.get('q');

	resultsDiv = document.querySelector('#results');

	if(term) { field.value = term; search(); }

}

function search() {
	let search = field.value.trim();
	if(!search) return;
	console.log(`search for ${search}`);

	let results = idx.search(search);

	let resultsHTML = '<p><strong>Search Results</strong></p>';

	if(!results.length) {
		resultsHTML += '<p>Sorry, there were no results.</p>';
		resultsDiv.innerHTML = resultsHTML;
		return;
	}

	resultsHTML += '<ul>';

	// we need to add title, url from ref
	results.forEach(r => {
		let title = docs[r.ref].title;
		let url = docs[r.ref].url;
		resultsHTML += `<li><a :href="${url}">${ title }</a></li>`;

	});

	resultsHTML += '</ul>';
	resultsDiv.innerHTML = resultsHTML;
}
</script>
```

It's pretty similar to the Vue version except I've got to build the HTML in JavaScript, which I don't care for but template strings make a hell of a lot better. Anyway, I hope this helps!