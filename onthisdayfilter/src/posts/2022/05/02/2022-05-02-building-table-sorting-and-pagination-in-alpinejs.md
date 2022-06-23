---
layout: post
title: "Building Table Sorting and Pagination in Alpine.js"
date: "2022-05-02T18:00:00"
categories: ["JavaScript"]
tags: ["alpinejs"]
banner_image: /images/banners/hannes-egler-369155.jpg
permalink: /2022/05/02/building-table-sorting-and-pagination-in-alpinejs.html
description: Building a sortable, paged, dynamic table in Alpine.js
---

A few months back, I realized that one of my most popular blog posts ([Building Table Sorting and Pagination in Vue.js](https://www.raymondcamden.com/2018/02/08/building-table-sorting-and-pagination-in-vuejs)) would be an excellent opportunity to update for a more plain (or vanilla if you will) JavaScript version. That post ([Building Table Sorting and Pagination in JavaScript](https://www.raymondcamden.com/2022/03/14/building-table-sorting-and-pagination-in-javascript/)) was pretty fun to write. As much as I enjoyed using Vue over the past few years, I find myself more and more trying to rely less on external frameworks and sticking to simpler methods of getting things done. That being said... I am also **really** intrigued by [Alpine.js](https://alpinejs.dev/). 

Alpine is lightweight (2 methods, 6 properties, and 15 attributes you sprinkle in your HTML) and considers itself the "jQuery for the modern web". I was introduced to Alpine by an old friend from the ColdFusion community, [Luis Majano](https://twitter.com/lmajano), and decided about five minutes into his presentation that I wanted to learn more. 


As part of that journey, I thought an update to the "table sorting and paging" code would be an excellent way to get some practice writing Alpine code. It should be obvious, but I'm new at this so please do not consider it the best example of Alpine, although honestly Alpine is so simple I feel (mostly) confident I did this right. That being said - reach out with improvements and comments. 

For my demos, I'll be using a simple serverless function that returns an array of cats. You can hit that endpoint here ([raymondcamden.com/.netlify/functions/get-cats](https://www.raymondcamden.com/.netlify/functions/get-cats)) to see the complete list, or look at a subset below:

```json
[
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
  {
    "name": "Cracker",
    "age": 8,
    "breed": "fat",
    "gender": "male"
  }
]
```
## Version One - Just Rendering

In the first version, I'm just going to load the data and render it in a table. Alpine lets you decorate your HTML to bind it to data and custom functionality. Here's the HTML:

```html
<table id="catTable" x-data="catData">
  <thead>
    <tr>
      <th>Name</th>
      <th>Age</th>
      <th>Breed</th>
      <th>Gender</th>
    </tr>
  </thead>
  <tbody>
    <template x-if="!cats">
      <tr><td colspan="4"><i>Loading...</i></td></tr>
    </template>
    <template x-for="cat in cats">
      <tr>
        <td x-text="cat.name"></td>   
        <td x-text="cat.age"></td>   
        <td x-text="cat.breed"></td>   
        <td x-text="cat.gender"></td>   
      </tr>
    </template>
  </tbody>
</table>
```

In the code above, the `x-data` line is the most important as it binds the table to Alpine data. Alpine lets you define code right inside the attribute, but I find that a bit messy. It's possible... I just don't like it. 

Next note the two template tags. The first will show or hide the loading table row based on whether or not my data has loaded. Next, I loop over my data (you'll see this defined in a bit) to render the various cat properties. There are two big differences here between Alpine and Vue. In Alpine, your IF/FOR constructs must be on a template tag. Secondly, you don't use mustache style interpolation for values, but instead, use either `x-text` or `x-html`. 

Now for the JavaScript:

```js
document.addEventListener('alpine:init', () => {
  Alpine.data('catData', () => ({
    cats:null,
    async init() {
      let resp = await fetch('https://www.raymondcamden.com/.netlify/functions/get-cats');
      this.cats = await resp.json();
    },
  }))
});
```

In this relatively simple example, I only have one piece of data, a `cats` array, and I use `init` to automatically fetch my data and store it. 

As a quick aside, before I share the CodePen below, one of the things I struggled with was a 'chicken and egg' problem around the document event (`alpine:init`) and Alpine being loaded via the CodePen JavaScript settings. You'll notice that I use a script tag in the HTML (I didn't share that above) to get around this issue. Before that I kept having issues with Alpine being unable to 'find' `catData` and it was just plain annoying. Anyway, here's the complete demo:

<p class="codepen" data-height="500" data-default-tab="html,result" data-slug-hash="YzePpKP" data-user="cfjedimaster" style="height: 500px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/YzePpKP">
  Alpine Sortable Table</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## Version Two - Sorting
For the next version, let's add sorting. Sorting will be enabled by clicking on a table header. Clicking once will sort in one direction, clicking again will reverse the sort. First, I added click events to the header:

```html
<thead>
<tr>
  <th @click="sort('name')">Name</th>
  <th @click="sort('age')">Age</th>
  <th @click="sort('breed')">Breed</th>
  <th @click="sort('gender')">Gender</th>
</tr>
</thead>
```

Note the use of the shorthand, `@click`. Alpine also supports the longer `x-on:click` style as well. I see no reason to use that. Now for the updated JavaScript:

```js

document.addEventListener('alpine:init', () => {
  Alpine.data('catData', () => ({
    cats:null,
    sortCol:null,
    sortAsc:false,
    async init() {
      let resp = await fetch('https://www.raymondcamden.com/.netlify/functions/get-cats');
      this.cats = await resp.json();
    },
    sort(col) {
      if(this.sortCol === col) this.sortAsc = !this.sortAsc;
      this.sortCol = col;
      this.cats.sort((a, b) => {
        if(a[this.sortCol] < b[this.sortCol]) return this.sortAsc?1:-1;
        if(a[this.sortCol] > b[this.sortCol]) return this.sortAsc?-1:1;
        return 0;
      });
    }
  }))
});
```

I added two new pieces of data, `sortCol` and `sortAsc`. This helps me keep track of the current sort as well as the current direction. I then added the `sort` function which handles... well, sorting. And that's it. There is something I forgot to do here so be sure to keep reading. Here's the demo:

<p class="codepen" data-height="500" data-default-tab="html,result" data-slug-hash="VwQYmRP" data-user="cfjedimaster" style="height: 500px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/VwQYmRP">
  Alpine Sortable Table (with sorting)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## Version Three - Paging

And now for the grand finale - adding pagination to the data. Because my data set isn't terribly big, I'm going to use a relatively small "page" size of 4. To handle that, and keep track of the current page, I added two values to my data:

```js
pageSize:4,
curPage:1,
```

Back in my HTML, I first added a new `div` wrapper to my code:

```html
<div x-data="catData">
```

I did this because my application is now larger than just the table, it has to accommodate two new buttons for paging:

```html
<button @click="previousPage">Previous</button> <button @click="nextPage">Next</button>
```

I realized that I was going to need a new way to loop over the cats and that would involve a virtual property. Alpine doesn't have that, but it supports getter functions for values so it ends up being the same. I'll share the entire JavaScript and then explain the changes:

```js

document.addEventListener('alpine:init', () => {
  Alpine.data('catData', () => ({
    cats:null,
    sortCol:null,
    sortAsc:false,
    pageSize:4,
    curPage:1,
    async init() {
      let resp = await fetch('https://www.raymondcamden.com/.netlify/functions/get-cats');
      // Add an ID value
      let data = await resp.json();
      data.forEach((d,i) => d.id = i);
      this.cats = data;
    },
    nextPage() {
      if((this.curPage * this.pageSize) < this.cats.length) this.curPage++;
    },
    previousPage() {
      if(this.curPage > 1) this.curPage--;
    },
    sort(col) {
      if(this.sortCol === col) this.sortAsc = !this.sortAsc;
      this.sortCol = col;
      this.cats.sort((a, b) => {
        if(a[this.sortCol] < b[this.sortCol]) return this.sortAsc?1:-1;
        if(a[this.sortCol] > b[this.sortCol]) return this.sortAsc?-1:1;
        return 0;
      });
    },
    get pagedCats() {
      if(this.cats) {
        return this.cats.filter((row, index) => {
          let start = (this.curPage-1)*this.pageSize;
          let end = this.curPage*this.pageSize;
          if(index >= start && index < end) return true;
        })
      } else return [];
    }
  }))
});
```

So first off, `nextPage` and `previousPage` handle moving the user back and forth among the pages of data. The really important bit is `pagedCats`. It handles figuring out what 'slice' of the data should be returned. It also has to handle the data not being there yet. I didn't think I needed that as I thought `init` would fire before any read to data, but without it, I got an error. Hence me returning a simple empty array if my cats aren't in yet.

Now, I mentioned in part two I had forgotten something and I take care of it here. Notice this bit in `init`:

```js
let resp = await fetch('https://www.raymondcamden.com/.netlify/functions/get-cats');
// Add an ID value
let data = await resp.json();
data.forEach((d,i) => d.id = i);
this.cats = data;
```

Like Vue, Alpine recommends specifying a [key value](https://alpinejs.dev/directives/for#keys) when iterating over data that can change. I should have done that in step two as well, but at least I got it here. Since my API doesn't return a key, I manually create one based on the array index. Back in HTML, I then switch to using the new virtual data and the key:

```html
<template x-for="cat in pagedCats" :key="cat.id">
```

Here's the complete demo:

<p class="codepen" data-height="500" data-default-tab="html,result" data-slug-hash="ExQaZQZ" data-user="cfjedimaster" style="height: 500px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/ExQaZQZ">
  Alpine Sortable Table (with sorting and paging)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## Wrap Up

Alright, so I've now done the same thing in [Vue](https://www.raymondcamden.com/2018/02/08/building-table-sorting-and-pagination-in-vuejs), [vanilla (i.e. no framework) JavaScript](https://www.raymondcamden.com/2022/03/14/building-table-sorting-and-pagination-in-javascript/) and Alpine. It is not difficult, or a lot of work, to build this without a framework, and I'd probably use that option for a simple thing like enhancing a table. That being said, looking at both Vue and Alpine, I really liked building it in Alpine and appreciated not having to handle the DOM updates myself. With Alpine being so much lighter and simpler than Vue, in a case like this, I'd pick Alpine. As always, let me know what *you* think!