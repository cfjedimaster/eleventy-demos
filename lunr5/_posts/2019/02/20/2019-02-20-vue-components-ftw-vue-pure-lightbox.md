---
layout: post
title: "Vue Components FTW - vue-pure-lightbox"
date: "2019-02-20"
categories: ["javascript"]
tags: ["vuejs","vue components ftw"]
banner_image: /images/banners/lightbox.jpg
permalink: /2019/02/20/vue-components-ftw-vue-pure-lightbox
---

<div style="background-color:#d0d0d0;padding:5px">
This post is part of a series of articles looking at simple, easy to use components that
can be added to your Vue.js application. You can view the entire series <a href="/tags/vue+components+ftw">here</a> and drop me a line with suggestions!
</div>

Today's simple Vue component is [vue-pure-light](https://github.com/DCzajkowski/vue-pure-lightbox), a *very* lightweight and simple "lightbox" component. If you don't know what a lightbox is, it's the UI/UX feature where a picture can take over the entire screen to let you focus on it. You've probably seen it on real estate listings or art sites. The component supports npm installation as well as directly dropping in a CSS and JS tag in your HTML:

```html
<!-- In <head> -->
<meta rel="stylesheet" href="https://unpkg.com/vue-pure-lightbox/dist/vue-pure-lightbox.css">
<!-- In <body>, after Vue import -->
<script src="https://unpkg.com/vue-pure-lightbox/dist/vue-pure-lightbox.js"></script>
```

Once installed, you can then use the `<lightbox>` tag in your application. There's a grand total of three arguments - one for the thumbnail (the initial image), one for an array of image URLs, and an alternate text value. 

And that's it. You can also provide a custom loader but I found the one out of the box easy enough to use. So here's a CodePen example provided by the author:

<p class="codepen" data-height="400" data-theme-id="0" data-default-tab="result" data-user="DCzajkowski" data-slug-hash="rzOErW" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="vue-pure-lightbox demo">
  <span>See the Pen <a href="https://codepen.io/DCzajkowski/pen/rzOErW/">
  vue-pure-lightbox demo</a> by Dariusz Czajkowski (<a href="https://codepen.io/DCzajkowski">@DCzajkowski</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Pay special attention to the CSS panel. While the docs mention there's custom styles in place it doesn't actually enumerate them. The CSS panel here is a handy reference as to what you can customize. Also, he used cats, so therefore I love him. Case closed.

How about a slightly more advanced example? (And I really mean, "slightly"...) I began with the following markup:

```html
<div id="app" v-cloak>
  
  <lightbox
    thumbnail="https://www.placecage.com/200/200"
    :images="images"
  >
     <lightbox-default-loader slot="loader"></lightbox-default-loader> 
  </lightbox>

</div>
```

If you don't recognize the URL for the thumbnail, I'm using [PlaceCage](http://www.placecage.com/), a placeholder image service comprised entirely of Nicolas Cage pictures. I've specified that my images are being sourced from data in the Vue instance, so let's take a look at that.

```js
Vue.config.silent = true;

Vue.use(Lightbox);

const app = new Vue({
  el:'#app',
  data() {
    return {
      images:[]
    }
  },
  mounted() {
    for(let i=0;i<10;i++) {
      this.images.push(`https://www.placecage.com/c/${600 + (i*10)}/${600 + (i*10)}`);
    }
  }
})
```

In this case I've just created 10 dynamically sized images from the service. You can run this example here:

<p class="codepen" data-height="400" data-theme-id="0" data-default-tab="result" data-user="cfjedimaster" data-slug-hash="aXMwGG" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="vue-pure-lightbox">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/aXMwGG/">
  vue-pure-lightbox</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

So while writing up this blog post I discovered that my favorite placeholder service, [placekitten](https://placekitten.com/), is back up and running! Screw Nicolas Cage! Here's a fork of the previous example with kittens. MUCH BETTER!

<p class="codepen" data-height="400" data-theme-id="0" data-default-tab="result" data-user="cfjedimaster" data-slug-hash="RvOeWo" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="vue-pure-lightbox (2)">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/RvOeWo/">
  vue-pure-lightbox (2)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Isn't that nicer? As always - if you have any comments or suggestions about this series, drop me a comment below.

<i>Header photo by <a href="https://unsplash.com/photos/J4hxSsDZ8Lc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Dane Kelly</a> on Unsplash</i>