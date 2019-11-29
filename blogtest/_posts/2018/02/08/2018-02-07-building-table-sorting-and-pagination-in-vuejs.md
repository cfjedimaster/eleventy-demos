---
layout: post
title: "Building Table Sorting and Pagination in Vue.js"
date: "2018-02-08"
categories: [javascript]
tags: [vuejs]
banner_image: /images/banners/hannes-egler-369155.jpg
permalink: /2018/02/08/building-table-sorting-and-pagination-in-vuejs
---

Earlier this week I was talking to a good friend of mine (who is also a recent convert to the School of Vue) and he was talking about the troubles he went through in adding table sorting and pagination to a table. He was making use of a particular Vue component that was - to be nice - "undocumented". While I was reasonable certain that other solutions existed, I thought it would be fun to take a stab at writing my own support for table sorting and pagination. Not a generic solution, but just a solution for a particular set of data.

I began with a Vue app that loaded in data via an Ajax call and rendered a table. This initial version has no sorting or pagination, it just loads data and dumps it in the view. Here's the layout:

```markup
<div id="app">
  
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Age</th>
        <th>Breed</th>
        <th>Gender</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="cat in cats">
        <td>{% raw %}{{cat.name}}{% endraw %}</td>
        <td>{% raw %}{{cat.age}}{% endraw %}</td>
        <td>{% raw %}{{cat.breed}}{% endraw %}</td>
        <td>{% raw %}{{cat.gender}}{% endraw %}</td>
      </tr>
    </tbody>
  </table>
  
</div>
```

I've got a table with four columns: Name, Age, Breed, and Gender. And then I simply loop over my cats to render each row. The JavaScript is simple:

```js
const app = new Vue({
  el:'#app',
  data:{
    cats:[]
  },
  created:function() {
    fetch('https://api.myjson.com/bins/s9lux')
    .then(res => res.json())
    .then(res => {
      this.cats = res;
    })
  }
})
```

(As an aside, I say it's simple, but as always, if anything here doesn't make sense, just ask me in the comments below!) While it isn't too exciting, you can see this running below.

<p data-height="400" data-theme-id="dark" data-slug-hash="PQWErq" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Vue - Sortable Table" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/PQWErq/">Vue - Sortable Table</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Alright, so for the first update, I decided to add sorting. I made two changes to the view. First, I added click handlers to my headers so I could do sorting. Secondly, I switched my loop to use `sortedCats`, which I'm going to set up as a Vue computed property. Here's the new HTML:

```markup
<div id="app">
  
  <table>
    <thead>
      <tr>
        <th @click="sort('name')">Name</th>
        <th @click="sort('age')">Age</th>
        <th @click="sort('breed')">Breed</th>
        <th @click="sort('gender')">Gender</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="cat in sortedCats">
        <td>{% raw %}{{cat.name}}{% endraw %}</td>
        <td>{% raw %}{{cat.age}}{% endraw %}</td>
        <td>{% raw %}{{cat.breed}}{% endraw %}</td>
        <td>{% raw %}{{cat.gender}}{% endraw %}</td>
      </tr>
    </tbody>
  </table>
  
  debug: sort={% raw %}{{currentSort}}{% endraw %}, dir={% raw %}{{currentSortDir}}{% endraw %}
</div>
```

On the JavaScript side, I had to do a few things. First, I added properties to keep track of what I was sorting by and in what direction:

```js
data:{
  cats:[],
  currentSort:'name',
  currentSortDir:'asc'
}
```

Next, I added the `sort` method. It has to recognize when we are sorting by the same column and flip the direction:

```js
methods:{
  sort:function(s) {
    //if s == current sort, reverse
    if(s === this.currentSort) {
      this.currentSortDir = this.currentSortDir==='asc'?'desc':'asc';
    }
    this.currentSort = s;
  }
}
```

Finally, I added my computed property, `sortedCats`:

```js
computed:{
  sortedCats:function() {
    return this.cats.sort((a,b) => {
      let modifier = 1;
      if(this.currentSortDir === 'desc') modifier = -1;
      if(a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
      if(a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
      return 0;
    });
  }
}
```

I'm just using the `sort` method of my array with the property being dynamic. The `modifier` bit just handles reversing the numbers based on the direction of the sort. You can test this version below:

<p data-height="400" data-theme-id="dark" data-slug-hash="BYpJgj" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Vue - Sortable Table (2)" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/BYpJgj/">Vue - Sortable Table (2)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

By the way, you'll notice some debug data at the bottom of the view. In a real application I'd remove that, but I used that as a handy way to track values while I was clicking. I could have used Vue DevTools for that, although I'm not certain how well they work with CodePens. 

Woot! Almost there! For the final version I added pagination. I didn't want to add more cats to my JSON data set, so I used a relatively small "page size" of 3. I began by adding buttons to the front end for pagination:

```markup
<p>
<button @click="prevPage">Previous</button> 
<button @click="nextPage">Next</button>
</p>
```

In the JavaScript I made the following changes. First, I added values to track the page size and current page:

```js
data:{
  cats:[],
  currentSort:'name',
  currentSortDir:'asc',
  pageSize:3,
  currentPage:1
},
```

Next, I added the `prevPage` and `nextPage` methods, which were pretty simple:

```js
nextPage:function() {
  if((this.currentPage*this.pageSize) < this.cats.length) this.currentPage++;
},
prevPage:function() {
  if(this.currentPage > 1) this.currentPage--;
}
```

Finally, I modified my computed property to check the page size and current page values when returning data. I did this via a `filter` call:

```js
sortedCats:function() {
	return this.cats.sort((a,b) => {
		let modifier = 1;
		if(this.currentSortDir === 'desc') modifier = -1;
		if(a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
		if(a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
		return 0;
	}).filter((row, index) => {
		let start = (this.currentPage-1)*this.pageSize;
		let end = this.currentPage*this.pageSize;
		if(index >= start && index < end) return true;
	});
}
```

Note the creation of a `start` and `end` value. I almost always screw this up so I created variables instead of a super complex `if` statement. While my code seems to work I'm still not 100% sure that math is right. And here is that final version:

<p data-height="400" data-theme-id="dark" data-slug-hash="yvgvMK" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Vue - Sortable Table (3)" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/yvgvMK/">Vue - Sortable Table (3)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

So that's it. There is definitely room for improvement. I'd like to add `disabled` to the buttons when they are at the 'edge' and I'd like to highlight, somehow, the table headers when sorting, but I'll leave that as an exercise to my readers. ;) (Don't forget you can fork my CodePens and add your own edits!)


<i>Header Photo by <a href="https://unsplash.com/photos/u54GUxav9Hc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Hannes Egler</a> on Unsplash</i>