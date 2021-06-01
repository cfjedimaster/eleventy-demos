---
layout: post
title: "Reading Image Sizes and Dimensions with Vue.js"
date: "2019-06-13"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/paintings.jpg
permalink: /2019/06/13/reading-image-sizes-and-dimensions-with-vuejs
description: Using Vue.js to check the size (file size, dimensions) of an image.
---

A few weeks back, I wrote up (["Reading Client-Side Files for Validation with Vue.js"](https://www.raymondcamden.com/2019/05/21/reading-client-side-files-for-validation-with-vuejs)) an example of using JavaScript to check files selected in an input field to perform basic validation. It uses the fact that once a user has selected a file, your code has read access to the file itself. I was thinking about this more earlier this week and thought of another useful example of this - validating a selected image both for file size as well as dimensions (height and width).

The code in this entry is heavily based on my [previous example](https://www.raymondcamden.com/2019/05/21/reading-client-side-files-for-validation-with-vuejs) so be sure to read that blog entry first.

Let's begin by addressing the two main requirements - getting the size of the file and image dimensions. 

File size is easy. Once you've selected a file, it's available in the `size` property of the file object. There's other properties available as well, like the last time it was modified, and you check the [File](https://developer.mozilla.org/en-US/docs/Web/API/File) docs at MDN for more information.

Getting dimensions is also pretty easy, as long as your careful. You can use JavaScript to make a new image object and assign the source:

```js
let img = new Image();
img.src = someUrl;
```

At that point you can immediately check `img.height` and `img.width`, but you will find that you sometimes get `0` for both results. Why? The image hasn't loaded yet! Luckily this is easily fixable:

```js
let img = new Image();

img.onload = () => {
	console.log(`the image dimensions are ${img.width}x${img.height}`);
}

img.src = someUrl;
```

Ok, so given that, let's begin with a simple example that just displays the information. First, the layout:

```html
<div id="app" v-cloak>
  
  <input type="file" ref="myFile" @change="selectedFile" accept="image/*"><br/>

  <div v-if="imageLoaded">
    Image size is {% raw %}{{image.size}}{% endraw %}<br/>
    Image width and height is {% raw %}{{image.width}}{% endraw %} / {% raw %}{{image.height}}{% endraw %}
  </div>

</div>
```

The second `div` tag shows up conditionally and you can see I'm displaying all three properties we care about. Note I've added an `accept="image/*"` to the `input` field. This will help direct the users towards images.

Here's the code and note I'm going to focus on what's different from the previous example.

```js
Vue.config.productionTip = false;
Vue.config.devtools = false;

const app = new Vue({
  el:'#app',
  data: {
    image:{
      size:'',
      height:'',
      width:''
    },
    imageLoaded:false
  },
  methods:{
    selectedFile() {
      this.imageLoaded = false;
      
      let file = this.$refs.myFile.files[0];
      if(!file || file.type.indexOf('image/') !== 0) return;
      
      this.image.size = file.size;
      
      let reader = new FileReader();
      
      reader.readAsDataURL(file);
      reader.onload = evt => {
        let img = new Image();
        img.onload = () => {
          this.image.width = img.width;
          this.image.height = img.height;
          this.imageLoaded = true;
        }
        img.src = evt.target.result;
      }

      reader.onerror = evt => {
        console.error(evt);
      }
      
    }
  }
})
```

First off, the size value is trivial - we just copy it from the file object.  We read the file using `readAsDataURL`, which is different from the previous example. This will return a URL encoded with a base64 version of the image data. Once we have that, we can assign it to a new `Image`, wait for `onload`, and then get the dimensions. You can see this yourself below:

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="QXwEyq" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="vue file image thing">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/QXwEyq/">
  vue file image thing</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Now that you've seen the basics, let's consider an example using validation. We'll specify a max size in bytes, a max width, and a max height. Here's the updated HTML:

```html
<div id="app" v-cloak>
  
  <input type="file" ref="myFile" @change="selectedFile" accept="image/*"><br/>

  <div v-if="imageError" class="imageError">
    {% raw %}{{imageError}}{% endraw %}
  </div>

</div>
```

The only real change here is an optional `div` shown when an error is thrown. Now let's look at the JavaScript.

```js
Vue.config.productionTip = false;
Vue.config.devtools = false;

// max size, 100KB, width and height
const MAX_SIZE = 100000;
const MAX_WIDTH = 500;
const MAX_HEIGHT = 300;

const app = new Vue({
  el:'#app',
  data: {
    image:{
      size:'',
      height:'',
      width:''
    },
    imageError:''
  },
  methods:{
    selectedFile() {
      this.imageError = '';
      
      let file = this.$refs.myFile.files[0];
      
      if(!file || file.type.indexOf('image/') !== 0) return;
      this.image.size = file.size;
      if(this.image.size > MAX_SIZE) {
        this.imageError = `The image size (${this.image.size}) is too much (max is ${MAX_SIZE}).`;
        return;
      }
      
      let reader = new FileReader();
      
      reader.readAsDataURL(file);
      reader.onload = evt => {
        let img = new Image();
        img.onload = () => {
          this.image.width = img.width;
          this.image.height = img.height;
          console.log(this.image);
          if(this.image.width > MAX_WIDTH) {
            this.imageError = `The image width (${this.image.width}) is too much (max is ${MAX_WIDTH}).`;
            return;
          }
          if(this.image.height > MAX_HEIGHT) {
            this.imageError = `The image height (${this.image.height}) is too much (max is ${MAX_HEIGHT}).`;
            return;
          }
          
          
        }
        img.src = evt.target.result;
      }

      reader.onerror = evt => {
        console.error(evt);
      }
      
    }
  }
})
```

For the most part this is pretty similar to the last example, except now we've got checks for the size, width, and height. Note that my code will *only* throw one error, so for example if both the width and height are too big, you'll only see the first error, but that can be changed rather easily too. Here's the code in action:

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="ewmzjX" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="vue file image thing (2)">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/ewmzjX/">
  vue file image thing (2)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

<i>Header photo by <a href="https://unsplash.com/@clemono2?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Clem Onojeghuo</a> on Unsplash</i>