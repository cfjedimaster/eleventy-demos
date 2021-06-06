---
layout: post
title: "Vue Quick Shot - Fullscreen API"
date: "2020-09-04"
categories: ["javascript"]
tags: ["vuejs","vue quick shot"]
banner_image: /images/banners/tip.jpg
permalink: /2020/09/04/vue-quick-shot-fullscreen-api
description: Using the Fullscreen API and Vue.js
---

After yesterday's [quick shot](https://www.raymondcamden.com/2020/09/03/vue-quick-shot-using-page-visibility), today's should be simpler - using the [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API). This is one of the simplest and most useful API's out there. If a browser supports it (currently at near [100%](https://caniuse.com/#feat=fullscreen)) than all you need to enable fullscreen on your web page is the `requestFullscreen` DOM method.

For example:

```js
document.querySelector('#myCat').requestFullScreen();
```

The [API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API) supports more options (events and exiting fullscreen mode via code), but let's look at a simple example with Vue.js.

Let's begin with our HTML. I'm going to include an image and a button to enable fullscreen access. The button will only show up if the Fullscreen API is enabled. Note the use of `ref` on the image so I can grab it easier via Vue later.

```html
<div id="app" v-cloak>
  <h2>Cats</h2>
  <img src="https://placekitten.com/400/200" ref="catpic"><br/>
  <button v-if="showFSButton" @click="fullscreenCats">Full Screen Cats</button>
</div>
```

Now let's look at the JavaScript:

```js
const app = new Vue({
  el:'#app',
  data: {
    showFSButton:false
  },
  created() {
    if(document.fullscreenEnabled) this.showFSButton = true;
  },
  methods:{
    fullscreenCats() {
      this.$refs.catpic.requestFullscreen();
    }
  }
})
```

So my data just includes the boolean for whether or not the button will show up. My `created` method checks if the feature exists and if so will set the value to true. 

Finally, the button's click event uses the API to open the image in fullscreen mode. And that's it! Here's a full demo in CodePen, and yes the button works in the embed.

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="oNxoQEG" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Vue + Fullscreen">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/oNxoQEG">
  Vue + Fullscreen</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

As always, let me know if this helps you!
