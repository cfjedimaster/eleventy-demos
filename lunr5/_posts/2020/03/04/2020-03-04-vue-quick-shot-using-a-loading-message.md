---
layout: post
title: "Vue Quick Shot - Using a Loading Message"
date: "2020-03-04"
categories: ["javascript"]
tags: ["vuejs","vue quick shot"]
banner_image: /images/banners/tip.jpg
permalink: /2020/03/04/vue-quick-shot-using-a-loading-message
description: My next Vue quick shot - adding loading messages while you wait...
---

Well, my grand plan to do one blog post per day of Vue quick tips failed rather quickly, but I can get two out today and get back on track. Honest, I can. While I wasn't planning on making every tip link to the previous one, my first two tips do exactly that. 

My [first tip](https://www.raymondcamden.com/2020/03/02/vue-quick-shot-disabling-a-submit-button-while-waiting-for-an-ajax-call) explained how to disable a submit button while you waited for an Ajax call to finish. (Or any async call, and I actually used `window.setTimeout` instead of Ajax.) Today's tip builds on that by adding a rather simple, but helpful, modification - a loading message.

In the previous example, when you hit the submit button I disabled it while we waited for the result. You can see that in the CodePen below.

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="VwLWRgg" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Disable submit v2">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/VwLWRgg">
  Disable submit v2</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

While the disabled button lets the user know *something* is going on, it would be nice to be a bit more obvious. First, let's add a new conditional div to the layout:

```html
<div id="app" v-cloak>
  <form @submit.prevent="doSearch">
    <input type="search" v-model="term" placeholder="Search">
    <input type="submit" value="Perform Search" :disabled="searchDisabled">
  </form>
  
  <div v-if="searching">
    <p><i>Please stand by, I'm searching...</i></p>
  </div>

  <div v-if="result">
  <p>
    <b>The result: {{ result }}</b>
  </p>
  </div>
</div>
```

Right in the middle you can see a new condition, `v-if="searching"` and a message inside. You could also [generate an Ajax loader](http://www.ajaxload.info/) if you want...

<img src="https://static.raymondcamden.com/images/2020/03/ajax-loader.gif" alt="Ajax loader" class="imgcenter">

I then tweaked my JavaScript a little bit:

```js
Vue.config.productionTip = false;
Vue.config.devtools = false;

const app = new Vue({
  el:'#app',
  data: {
    term:'',
    result:'',
    searchDisabled:false,
    searching:false
  },
  methods:{
    async doSearch() {
     if(this.term === '') return; 
     console.log(`search for ${this.term}`);
     //disable the button
     this.searchDisabled = true;
     // clear previous result
     this.result = '';
     this.searching = true;
     this.result = await searchMyAPI(this.term);
     //re-enable the button
     this.searchDisabled = false;
     this.searching = false;
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

I added a default value for `searching` and within `doSearch`, I set it to true before the search and back to false after. Here's a CodePen you can test with:

<p class="codepen" data-height="400" data-theme-id="default" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="dyozxab" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Loading Message">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/dyozxab">
  Loading Message</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

That's it for this tip. I'll have the next one up later today, and hopefully, one more for Thursday and Friday. Enjoy!