---
layout: post
title: "Building Table Sorting and Pagination in Vue.js - with Async Data"
date: "2020-02-01"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/hannes-egler-369155.jpg
permalink: /2020/02/01/building-table-sorting-and-pagination-in-vuejs-with-async-data
description: Paging and sorting remote data with Vue.js
---

Nearly two years ago I wrote a blog post ([Building Table Sorting and Pagination in Vue.js](https://www.raymondcamden.com/2018/02/08/building-table-sorting-and-pagination-in-vuejs)) that detailed how to paginate and sort a set of client-side data with Vue.js. A day or so ago a reader asked how you would handle the same thing using data loaded from a remote API. Specifically, data where every sort, and page, is loaded from a remote API. I worked on a demo of this and while doing so learned something new about Vue. So here are my solutions and as always, let me know what you think.

### The Data

For both of my demos, I used the API at [Open Brewery DB](https://www.openbrewerydb.org/). This is a free API that doesn't require a key and supports CORS. Even better, their [brewery list](https://www.openbrewerydb.org/documentation/01-listbreweries) API supports both paging and sorting which made it perfect for my tests. 

### Version One

For the first version, I updated the layout to show the name, city, and state values of breweries. The API supports more of course but I wanted to keep it simple. All three values can be sorted and the entire data set paginated. Here's the updated layout code:

```html
<div id="app" v-cloak>
  
  <table>
    <thead>
      <tr>
        <th @click="sort('name')">Name</th>
        <th @click="sort('city')">City</th>
        <th @click="sort('state')">State</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="b in breweries">
        <td>{% raw %}{{b.name}}{% endraw %}</td>
        <td>{% raw %}{{b.city}}{% endraw %}</td>
        <td>{% raw %}{{b.state}}{% endraw %}</td>
      </tr>
    </tbody>
  </table>
  <p>
  <button @click="prevPage" :disabled="cantGoBack">Previous</button> 
  <button @click="nextPage">Next</button>
  </p>
  
{% raw %}  debug: sort={{currentSort}}, dir={{currentSortDir}}, page={{currentPage}}, {{ sortStr }}
{% endraw %}
</div>
```

The table itself isn't too different from the previous versions, I just changed the names of stuff, and obviously we iterate over new data, `breweries`. The pagination buttons are slightly different this time. I've added the ability to disable the previous button, but not the next one. Why? The brewery API doesn't return the total number of records, so there's no easy to way to know when we are at the end. It *is* something you could handle by simply seeing if the request for the next page returns no results, but for this demo I just ignored the issue.

Now let's look at the code.

```js
const app = new Vue({
  el:'#app',
  data:{
    breweries:[],
    currentSort:'name',
    currentSortDir:'asc',
    pageSize:20, 
    currentPage:1
  },
  created:function() {
    this.loadBreweries();
  },
  methods:{
    async loadBreweries() {
      let data = await fetch(`https://api.openbrewerydb.org/breweries?page=${this.currentPage}&per_page=${this.pageSize}&sort=${this.sortStr}`);
      this.breweries = await data.json();  
    },
    sort:function(s) {
      //if s == current sort, reverse
      if(s === this.currentSort) {
        this.currentSortDir = this.currentSortDir==='asc'?'desc':'asc';
      } else this.currentSortDir = 'asc';
      this.currentSort = s;
      this.loadBreweries();
    },
    nextPage:function() {
      this.currentPage++;
      this.loadBreweries();
    },
    prevPage:function() {
      if(this.currentPage > 1) this.currentPage--;
      this.loadBreweries();
    }

  },
  computed:{
    cantGoBack() {
      return this.currentPage === 1;
    },
    sortStr() {
      let s = '';
      if(this.currentSortDir === 'desc') s += '-';
      return s + this.currentSort;
    }
  }
})
```

The most important part is the `loadBreweries` method. It requests data and contains information about what page to get, how many to get, and how to sort. The API asks that you sort by column name and include `-` when you want to sort descending, so I built a utility method, `sortStr`, to handle that for me. Now when the app loads, I immediately call the API to load my breweries and when you sort and page, all I do is change the current values for them. This version is actually easier than my previous ones since paging and sorting data is all handled by the API.

And that's it! I should absolutely add a "loading" UI of some sort, but I'll leave that as an exercise for the reader.

<p class="codepen" data-height="400" data-theme-id="default" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="dyPBwqg" style="height: 400x; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Vue - Sortable Table Aync 1">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/dyPBwqg">
  Vue - Sortable Table Aync 1</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### Version Two

So after finishing the first version, I noticed that I had used code that processed changes (paging, sorting) and then fired off a method, and it occurred to me that I should simply be using computed properties. Duh. So I went ahead and change the previous code such that `breweries` wasn't an array but a computed property... and then discovered that you can't do async computed properties. Duh. I mean everyone knows that, right?

Err, no, I didn't. I'm sure I read that at some point, but this was the first time I ran into it. When you try, you don't get any errors, or warnings, but it just doesn't work. 

However, we're in luck! There's a plugin that makes this easy, [vue-async-computed](https://github.com/foxbenjaminfox/vue-async-computed). You add this and then you can literally move code from a `computed` block to an `asyncComputed` block. The plugin also supports returning a "loading" value which is pretty neat. 

I added the script to my codepen and then modified my JavaScript like so:

```js
Vue.use(AsyncComputed);

const app = new Vue({
  el:'#app',
  data:{
    currentSort:'name',
    currentSortDir:'asc',
    pageSize:20, 
    currentPage:1
  },
  methods:{
    sort:function(s) {
      //if s == current sort, reverse
      if(s === this.currentSort) {
        this.currentSortDir = this.currentSortDir==='asc'?'desc':'asc';
      } else this.currentSortDir = 'asc';
      this.currentSort = s;
    },
    nextPage:function() {
      this.currentPage++;
    },
    prevPage:function() {
      if(this.currentPage > 1) this.currentPage--;
    }
  },
  asyncComputed: {
    async breweries() {
      let data = await fetch(`https://api.openbrewerydb.org/breweries?page=${this.currentPage}&per_page=${this.pageSize}&sort=${this.sortStr}`);
      let result = await data.json(); 
      return result;
    }
  },
  computed:{
    cantGoBack() {
      return this.currentPage === 1;
    },
    sortStr() {
      let s = '';
      if(this.currentSortDir === 'desc') s += '-';
      return s + this.currentSort;
    }
  }
})
```

Note that now when I change paging and sorting, I no longer need to call my method to load breweries, it happens automatically. Here's the demo:

<p class="codepen" data-height="400" data-theme-id="default" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="QWwewmj" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Vue - Sortable Table Async 2">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/QWwewmj">
  Vue - Sortable Table Async 2</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Remember that both demos still should use a loading indicator of some sort to let the user know what's going on. Leave me a comment if you've got any feedback!