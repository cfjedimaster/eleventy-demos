---
layout: post
title: "Another Example of Vue.js and Vuex - an API Wrapper"
date: "2018-01-05"
categories: [development,serverless]
tags: [javascript,vuejs,openwhisk]
banner_image: 
permalink: /2018/01/05/another-example-of-vuejs-and-vuex-an-api-wrapper
---

Hi! Welcome to my first post of 2018! If you are a new reader, please consider [subscribing](https://feedburner.google.com/fb/a/mailverify?uri=RaymondCamdensBlog) to my blog feed and leaving me a comment below! A few weeks back I blogged about my first experience using Vue.js and Vuex: ["An Example of Vuex and State Management for Vue.js"](https://www.raymondcamden.com/2017/12/20/an-example-of-vuex-and-state-management-for-vuejs/). One of things I mentioned in that post was how my mental model for [Vuex](https://vuex.vuejs.org/en/) was Angular's Provider feature. It's definitely not the *best* mental model, but it's how I'm thinking about it for now. One of the biggest differences that I can see is that in Vuex you get the ability to automatically update your components with new data. Everything is kept in sync with little to no work on your part. That's a big difference compared to Providers, but I'm not an Angular expert and that may be something natively supported. 

For this post, I wanted to look at using Vuex to wrap an API provider. Basically using the store as an abstraction over a remote API. For my demo I decided to use the [Goodreads API](https://www.goodreads.com/api/). This is an OK API. The docs are good, but the actual implementation leaves a bit to be desired. One of the biggest flaws is not supporting JSON well, but I got around that. For my demo I decided to support 2 basic operations:

<ol>
<li>Search for Books: Given a term, find the first ten books that match it.</li>
<li>Search for Related Books: Given a book, ask the API for books related to it.</li>
</ol>

That second operation isn't actually a feature of the API. Instead, it is returned in one of the book detail APIs. However, I simply used Apache OpenWhisk (and IBM Cloud Functions) to build my own wrappers. I also converted the ugly XML into proper JSON results. This isn't a serverless post so I won't go into the details, but you can find both actions up on my GitHub repo: https://github.com/cfjedimaster/Serverless-Examples/tree/master/goodreads. 

I began by creating the demo without Vuex at all. Let's begin by looking at the HTML. My idea for the layout was a simple vertical list of results on the left side and related books displayed to the right. 

```html
<div id="app">
  <input v-model="search" type="search">
  <input type="button" @click="doSearch" value="Search">
  <br clear="left">
  <div v-if="searching"><i>Searching...</i></div>

  <div class="allResults">
    <div v-if="books.length" >
      <h2>Results</h2>
      <p><i>Click the cover to find similar books...</i></p>
      <div v-for="book in books" class="bookResult">
        <img :src="book.image_url" class="bookResult" @click="findSimilar(book)">
        {% raw %}{{book.title}}{% endraw %}
      </div>
    </div>

    <div v-if="relatedBooks.length">
      <h2>Books Related to {% raw %}{{ selectedBook.title }}{% endraw %}</h2>
      <div v-for="book in relatedBooks" class="bookResult">
        <img :src="book.image_url" class="bookResult" @click="findSimilar(book)">
        {% raw %}{{book.title}}{% endraw %}
      </div>
    </div>

  </div>
  
</div>
```

Nothing too fancy there. You can see a few conditionals to handle displaying loading conditions, lists of books, etc. Now let's look at the JavaScript:

```js
const app = new Vue({
  el:'#app',
  data:{
    search:'',
    books:[],
    relatedBooks:[],
    searching:false,
    selectedBook:null
  },
  methods:{
    doSearch() {
      if(this.search === '') return;
      this.searching = true;
      this.books = [];
      this.relatedBooks = [];
      console.log('search for '+this.search);
      fetch(`https://openwhisk.ng.bluemix.net/api/v1/web/rcamden{% raw %}%40us.ibm.com_My%{% endraw %}20Space/goodreads/search.json?search=${% raw %}{encodeURIComponent(this.search)}{% endraw %}`)
      .then(res=>res.json())
      .then(res => {
        this.searching = false;
        this.books = res.result;
      });
    },
    findSimilar(book) {
      this.selectedBook = book;
      this.relatedBooks = [];
      console.log('find books similar to '+book.id);
      fetch(`https://openwhisk.ng.bluemix.net/api/v1/web/rcamden{% raw %}%40us.ibm.com_My%{% endraw %}20Space/goodreads/findSimilar.json?id=${% raw %}{encodeURIComponent(book.id)}{% endraw %}`)
      .then(res=>res.json())
      .then(res => {
        this.relatedBooks = res.result;
      });

    }
  }
})
```

Again, not too complex. Make note of the `data` section and `methods`. My code handles updating various different data variables based on the current action. This isn't too bad at all I think. You can view the complete source, and run it as a demo, in the embed below. Note that I do *not* use a loading widget for loading related books and the APIs have been a bit slow today. Give it a minute when you click.

<p data-height="470" data-theme-id="dark" data-slug-hash="eyGWqq" data-default-tab="result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Vue and GoodReads API" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/eyGWqq/">Vue and GoodReads API</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Alright, so how can I modify this to use Vuex? Let me share the updated JavaScript (the markup didn't change at all, which is kick butt) and then I'll walk through the differences.

```js
const api = new Vuex.Store({
  state:{
    books:[],
    relatedBooks:[],
    searching:false
  },
  mutations:{
    books(state,books) {
      state.books = books;
    },
    relatedBooks(state,books){
       state.relatedBooks = books;
    },
    searching(state,bool) {
      state.searching = bool;
    },
    clearBooks(state) {
      state.books = [];
    },
    clearRelatedBooks(state) {
      state.relatedBooks = [];
    }    
  },
  actions:{
    searchBooks(context,term){
      context.commit('searching',true);
      context.commit('clearBooks');
      context.commit('clearRelatedBooks');
      context.searching = true;
      fetch(`https://openwhisk.ng.bluemix.net/api/v1/web/rcamden{% raw %}%40us.ibm.com_My%{% endraw %}20Space/goodreads/search.json?search=${% raw %}{encodeURIComponent(term)}{% endraw %}`)
      .then(res=>res.json())
      .then(res => {
        context.commit('books',res.result);
        context.commit('searching',false);
      });
    },
    relatedBooks(context,book) {
      context.commit('clearRelatedBooks');
      console.log('find books similar to '+book.id);
      fetch(`https://openwhisk.ng.bluemix.net/api/v1/web/rcamden{% raw %}%40us.ibm.com_My%{% endraw %}20Space/goodreads/findSimilar.json?id=${% raw %}{encodeURIComponent(book.id)}{% endraw %}`)
      .then(res=>res.json())
      .then(res => {
        context.commit('relatedBooks',res.result);
      });
      
    }
  }
});

const app = new Vue({
  el:'#app',
  store:api,
  data:{
    search:'',
    selectedBook:null
  },
  computed:{
    books() {
      return api.state.books;      
    },
    relatedBooks() {
       return api.state.relatedBooks;
    },
    searching() {
      return api.state.searching;
    }
  },
  methods:{
    doSearch() {
      if(this.search === '') return;
      api.dispatch('searchBooks',this.search);
    },
    findSimilar(book) {
      this.selectedBook = book;
      api.dispatch('relatedBooks',book);
    }
  }
})
```

Ok, do me a favor and start from the bottom. Right away you can see that the main application code is quite a bit simpler. I've updated my data to use `computed` for stuff that the store is handling. (Note that I've called my store 'api'.) Now the books, related books, and searching state, all come from Vuex. My methods also are much simpler as they ask the store to do the heavy lifting.

The store itself consists of it's state values, mutations, and actions. Actions are how you handle asynch actions on a store and you can see the Ajax calls have been moved in there. The actions use `commit` calls to tell the store to save new values. In general, it should all be pretty obvious what's going on, but definitely ask me a question in the comments below.

So what's the net result? The Vuex version actually has twice the code as the original version. However - just looking at it, it *feels* like a much better architected version of the code. I like the Vue app is basically "hands off" in terms of how the API works and I like how my Vuex store is nicely organized by itself. I could easily use this store in other Vue apps whereas the previous version everything was mixed in together.

You can view the full source code, and demo, below:

<p data-height="470" data-theme-id="dark" data-slug-hash="MrExOW" data-default-tab="result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Vue and GoodReads API (with Vuex)" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/MrExOW/">Vue and GoodReads API (with Vuex)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Let me know what you think in the comments below, and as always, I invite Vue experts to come in and give me suggestions on how I could improve this!