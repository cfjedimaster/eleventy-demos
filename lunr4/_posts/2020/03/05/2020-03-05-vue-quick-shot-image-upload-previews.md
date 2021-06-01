---
layout: post
title: "Vue Quick Shot - Image Upload Previews"
date: "2020-03-05"
categories: ["javascript"]
tags: ["vuejs","vue quick shot"]
banner_image: /images/banners/tip.jpg
permalink: /2020/03/05/vue-quick-shot-image-upload-previews
description: Adding an image preview to file upload controls
---

Welcome to the fourth entry of my Vue Quick Shots. Be sure to check out [part one](https://www.raymondcamden.com/2020/03/02/vue-quick-shot-disabling-a-submit-button-while-waiting-for-an-ajax-call), [part two](https://www.raymondcamden.com/2020/03/04/vue-quick-shot-using-a-loading-message), and [part three](https://www.raymondcamden.com/2020/03/04/vue-quick-shot-copy-to-the-clipboard). Today's entry is slightly more complex than the previous ones - adding an image preview to file upload controls. 

This is something I've covered before, but not with Vue.js. Let's start with the HTML:

```html
<div id="app" v-cloak>
  <p>
  <input type="file" accept="image/*" ref="myFile" @change="previewFile">
  </p>
  <img v-if="imgsrc" :src="imgsrc" class="imgpreview">
</div>
```

In my input field, pay attention to the attributes:

* `accept="image/*` tells the browser to filter files that can be selected to images of any type. However, the user can switch this filter to any file. 
* I then use `ref="myFile"` so Vue can have access to it. You'll see how in a bit.
* Finally, I specify the when the file input is changed, it should run the `previewFile` method.

Below the input field I have an img tag that will display the image when one is selected.

Alright, now let's look at the JavaScript:

```js
const app = new Vue({
  el:'#app',
  data: {
    imgsrc:''
  },
  methods:{
    previewFile() {
      let file = this.$refs.myFile.files[0];
      if(!file || file.type.indexOf('image/') === -1) return;
      let reader = new FileReader();

      reader.onload = e => {
        this.imgsrc = e.target.result;
      }

      reader.readAsDataURL(file);
    }
  }
})
```

My `previewFile` method checks the file input field via $refs and looks at the first file available. If there's one, and it's an image, we then use a `FileReader` object to read in the data and create a data url. This then gets assigned to `imgsrc` so that the image can render it. 

And that's it! Here's a live version you can play with:

<p class="codepen" data-height="400" data-theme-id="default" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="gOpGKZG" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Vue Image Preview">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/gOpGKZG">
  Vue Image Preview</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

I hope you enjoyed this quick shot - only one more to go!