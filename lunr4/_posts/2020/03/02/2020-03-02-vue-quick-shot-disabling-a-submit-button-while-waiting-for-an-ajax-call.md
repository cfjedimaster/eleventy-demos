---
layout: post
title: "Vue Quick Shot - Disabling a Submit Button While Waiting for an Ajax Call"
date: "2020-03-02"
categories: ["javascript"]
tags: ["vuejs","vue quick shot"]
banner_image: /images/banners/tip.jpg
permalink: /2020/03/02/vue-quick-shot-disabling-a-submit-button-while-waiting-for-an-ajax-call
description: First in a series of quick Vue tips - disabling a submit button while waiting for a remote call
---

Welcome to the first of a week long series of quick [Vue.js](https://vuejs.org/) tips. Each day (well, each week day) I'll be posting a real short, but hopefully practical, tip for Vue.js developers. For the first day we'll start with a simple tip but one that almost any application can use.

It is fairly typical for an application to make use of some sort of asynchronous process. Typically this is an Ajax call. (Although not always, and to be clear, today's tip will work with anything asynchronous!) You have a form of some sort. The user hits a button. You make a network call and when that call is done, you render the result. Let's consider a simple example of this.

First, a quick form.

```html
<div id="app" v-cloak>
  <form @submit.prevent="doSearch">
    <input type="search" v-model="term" placeholder="Search">
    <input type="submit" value="Perform Search">
  </form>
  
  <div v-if="result">
  <p>
    <b>The result: {% raw %}{{ result }}{% endraw %}</b>
  </p>
  </div>
</div>
```

My form has one field and a button. On submit I'll run a method named `doSearch`. When I get a result, it will be displayed in a paragraph below. 

Now let's look at the JavaScript:

```js
Vue.config.productionTip = false;
Vue.config.devtools = false;

const app = new Vue({
  el:'#app',
  data: {
    term:'',
    result:''
  },
  methods:{
    async doSearch() {
     if(this.term === '') return; 
     console.log(`search for ${this.term}`);
     // clear previous result
     this.result = '';
     this.result = await searchMyAPI(this.term);
    }
  }
})

async function searchMyAPI(s) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve(`something for ${s}`);
    }, 3000);
  });
}
```

My `doSearch` method checks to see if anything was entered and if so, fires off a call to `searchMyAPI`. The details of `searchMyAPI` aren't relevant, but you can see I'm faking a slow process by making it wait for three seconds before returning the result.

You can test this here:

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="OJVgqwL" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Disable submit v1">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/OJVgqwL">
  Disable submit v1</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

When you test this, note that there's no indication that the search is actually doing anything. There's actually a few things we can do here, but today we're just going to do one - disabling the button while the search is being done.

I'll begin by slightly tweaking the button:

```html
<input type="submit" value="Perform Search" :disabled="searchDisabled">
```

I've added a bound property, `disabled`, that points to a new value, `searchDisabled`. I then modified my JavaScript like so:

```js
Vue.config.productionTip = false;
Vue.config.devtools = false;

const app = new Vue({
  el:'#app',
  data: {
    term:'',
    result:'',
    searchDisabled:false
  },
  methods:{
    async doSearch() {
     if(this.term === '') return; 
     console.log(`search for ${this.term}`);
     //disable the button
     this.searchDisabled = true;
     // clear previous result
     this.result = '';
     this.result = await searchMyAPI(this.term);
     //re-enable the button
     this.searchDisabled = false;
    }
  }
})
```

First I added `searchDisabled`, defaulted to false. Before the search is begun I switch to false and when done, back to true. That's it! You can test this version here:

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="VwLWRgg" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Disable submit v2">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/VwLWRgg">
  Disable submit v2</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

That's it for today's quick tip. As I said, there's one more thing you could do to this form to make it even better and I'll be covering that in tomorrow's tip!
