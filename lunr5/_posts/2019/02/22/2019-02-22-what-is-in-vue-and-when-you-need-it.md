---
layout: post
title: "What is $nextTick in Vue and When You Need It"
date: "2019-02-22"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/tick.jpg
permalink: /2019/02/22/what-is-nexttick-in-vue-and-when-you-need-it
---

I've been using Vue heavily for a while now and this week I ran into an issue that I've never seen before. It's something documented and pretty well known (when I tweeted about it I got a reply in about 60 seconds) but I just had not hit it before. Before I get into $nextTick, let me explain what I was doing and what went wrong.

I have a hidden form on a page that needs to have a dynamic action value. Consider this markup:

```html
<div id="app" v-cloak>
  <form :action="myAction" method="post" ref="myForm">
    <button @click.prevent="testAction">Test</button>
  </form>
</div>
```

And this code:

```js
Vue.config.productionTip = false;
Vue.config.devtools = false;

const app = new Vue({
  el:'#app',
  data: {
    myAction:null
  },
  methods:{
    testAction() {
      this.myAction = 'http://www.raymondcamden.com';
      this.$refs.myForm.submit();
    }
  }
})
```

Looks simple enough, right? Probably the only interesting thing here is the use of `ref` and `this.$refs` to handle accessing the DOM directly with Vue. I call it fancy because it isn't something I usually need to do with Vue. So what happens when you test this? Try it yourself and see:

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="omrPpP" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="what the tick?!?!">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/omrPpP/">
  what the tick?!?!</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Instead of POSTing to my server, it sends the POST directly to CodePen, and just today I discovered they support echoing back the data which is kind of cool! (Note, in the embedded CodePen above, the POST echo doesn't work. It may not be a feature of the embed.) 

Alright, so what the heck went wrong? Well, if you're like me, you may not have read the "Internals" section of the Vue.js documentation, specifically this part: [Async Update Queue](https://vuejs.org/v2/guide/reactivity.html#Async-Update-Queue). 

<blockquote>
In case you haven’t noticed yet, Vue performs DOM updates asynchronously.
</blockquote>

Raise your hand if you hadn't noticed this yet.

<img src="https://static.raymondcamden.com/images/2019/02/raisehand.jpg" alt="Ray raising his hand" class="imgborder imgcenter">

Luckily there's a simple fix for this and if you actually read the title of this post, you have an idea of what it is: `this.$nextTick`. This function lets you provide a callback to execute when Vue is done propagating your changes to the DOM and it's safe to assume it reflects your new data. The fix is pretty simple:

```js
this.$nextTick(() => this.$refs.myForm.submit());
```

And if fat arrow functions still confuse you a bit (nothing wrong with that!), here's a simpler version:

```js
this.$nextTick(function() {
	this.$refs.myForm.submit();
});
```

You can see the corrected version in the CodePen below.

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="vbqzpb" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="what the tick?!?! (fixed)">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/vbqzpb/">
  what the tick?!?! (fixed)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

So to answer the question of "when" - I guess I'd say when you need to ensure the DOM 100% reflects your data and in this case it's kind of obvious - I needed my form POST to use the correct URL. Out of all the times I've used Vue this is the first time I needed this precise level of control but I'm sure I'll run into more examples. If you can, please share an example of when you've used it in the comments below!

<i>Header photo by <a href="https://unsplash.com/photos/n-pqXQ9YsBg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Franck V</a> on Unsplash</i>