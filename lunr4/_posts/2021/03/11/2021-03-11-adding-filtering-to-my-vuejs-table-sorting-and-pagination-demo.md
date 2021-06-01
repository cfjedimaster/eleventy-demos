---
layout: post
title: "Adding Filtering to my Vue.js Table Sorting and Pagination Demo"
date: "2021-03-11"
categories: [javascript]
tags: [vuejs]
banner_image: /images/banners/hannes-egler-369155.jpg
permalink: /2021/03/11/adding-filtering-to-my-vuejs-table-sorting-and-pagination-demo
description: Adding basic filtering to my Vue.js table sorting and paging demo.
---

A few years back I wrote about adding table sorting and paging with Vue.js (["Building Table Sorting and Pagination in Vue.js"](https://www.raymondcamden.com/2018/02/08/building-table-sorting-and-pagination-in-vuejs)). While this post is a bit old, it's still helpful and I know this as a reader reached out to me both thank me for the demo and ask if I could demonstrate filtering. I'm not going to go over everything I did in the [previous post](https://www.raymondcamden.com/2018/02/08/building-table-sorting-and-pagination-in-vuejs) so be sure to give it a quick read.

Alright, so I'm assuming you've read that post written in the Way Before Pre-COVID times. If so, you saw me load an array of cats that contain names, ages, breeds, and gender. Here's an example of a few:

```js
{
    "name": "Fluffy",
    "age": 9,
    "breed": "calico",
    "gender": "male"
},
{
	"name": "Luna",
	"age": 10,
	"breed": "long hair",
	"gender": "female"
},
```

And here's how the old demo rendered:

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="result" data-user="cfjedimaster" data-slug-hash="yvgvMK" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Vue - Sortable Table (3)">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/yvgvMK">
  Vue - Sortable Table (3)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

It's not terribly pretty, but it gets the job done. So given this as a start, how do we add filtering?

I began by adding an input field for my filter:

```html
<input type="search" v-model="filter">
```

I used `type="search"` as it provides a quick way of clearing out values. I added `filter` to my Vue data with a default value of an empty string.

Now comes the fun part. We currently render the table using `sortedCats`. This was a computed property based on the "raw" cats array that handled sorting the data and "filtering" to a particular page.

To support filtering based on a search term, I used a new computed property, `filteredCats`. This new property handles filtering the cats based on user input:

```js
filteredCats() {
	return this.cats.filter(c => {
		if(this.filter == '') return true;
		return c.name.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0;
	})
},
```

Notice that I lowercase both the original value and the user input. Also notice I only filter based on the name. I could absolutely see filtering on name or breed as well. The important thing is the lowercase. This will make it much easier on the end user. 

With this computed property, I then updated `sortedCats` to base it's value on `filteredCats`:

```js
return this.filteredCats.sort((a,b) => {
```

The end result is a Vue computed property based on a Vue computed property, which I knew was possible, but I don't think I've actually used it before. 

<strong>Edit on 3/12/21:</strong> After releasing this blog post yesterday, the reader who originally reached out to me discovered a bug. If you go to page 2 and filter to a value that only has one page, you see an empty page. To fix this, I added a watcher such that when you change the filter value, we reset to page one:

```js
watch: {
  filter() {
    console.log('reset to p1 due to filter');
    this.currentPage = 1;
  }
},
```

Here's the completed CodePen for you to play with:

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="poNqVWP" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Vue - Sortable / Searchable Table">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/poNqVWP">
  Vue - Sortable / Searchable Table</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>