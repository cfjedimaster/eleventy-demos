---
layout: post
title: "Vue Quick Shot - Uploading a File"
date: "2020-09-20"
categories: ["javascript"]
tags: ["vuejs","vue quick shot"]
banner_image: /images/banners/tip.jpg
permalink: /2020/09/20/vue-quick-shot-uploading-a-file
description: How to post a file upload using Vue.js
---

Welcome to the last Vue [Quick Shot](https://www.raymondcamden.com/tags/vue+quick+shot/), and when I say last, I mean the last one I've got in my queue of blog ideas. Today's tip demonstrates how a Vue application can upload a file via a form post operation. I started off with an incredibly simple form - one text field and one file field.

```html
<form method="post" enctype="multipart/form-data" action="https://postman-echo.com/post">
	Text field: <input type="text" name="something"><br/>
	File field: <input type="file" name="fileToUpload"><br/>
	<input type="submit">
</form>
```

How can we convert this to let Vue take over and do the post for us?

First, I did some modifications to the HTML:

```html
<form method="post" enctype="multipart/form-data" 
      @submit.prevent="upload">
	Text field: <input type="text" v-model="something"><br/>
	File field: <input type="file" ref="fileToUpload"><br/>
	<input type="submit" :disabled="uploading">
</form>
```

First, I specified a submit action as well as ensure it prevented the default behavior. I then changed the text field to use v-model. I did not do the same for the file type because file types are a bit special when it comes to Vue. Instead of using v-model, I used the `ref` attribute so I could read the data manually later. (Basically, you can't use v-model because Vue, or JavaScript in general, can't write to a file field type for security reasons.) The last change was to add a `disabled` attribute so I can prevent multiple submissions of the form while data is uploading.

Now let's look at the Vue side. Here's the entire script:

```js
Vue.config.productionTip = false;
Vue.config.devtools = false;

const app = new Vue({
  el:'#app',
  data: {
    uploading:false,
    something:'',
    result:null
  },
  methods: {
    async upload() {
      
      this.uploading = true;
      let data = new FormData();
      data.append("something", this.something);
      if(this.$refs.fileToUpload.files.length) {
        data.append("fileToUpload", this.$refs.fileToUpload.files[0]);
      }
 
      let resp = await fetch('https://23198ad96949.ngrok.io/', {
        method: 'POST',
        body: data
      });
      this.result = await resp.json();
      this.uploading = false;
    }
  }
})
```

For data, I've got one data value for the text field, a boolean to flag when uploading, and a result value. The `upload` method makes use of [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) API and FormData. Fetch makes it super easy to different types of network calls and FormData makes it easy to build a form post request. The only weird thing possibly is how I address the file field: `this.$refs.fileToUpload.files[0]`. The `this.$refs.fileToUplaod` part simply connects to the file field in the DOM. The `files[0]` aspect handles references selected files in the field. It's an array because you can add `multiple` to a file field and then the user can select multiple files. 

I post to a local Node server I had running via [ngrok](https://ngrok.com/), a super-useful tool that lets you expose servers running on your local development machine. Because this is a temporary tunnel, my code will not actually work for you, so please keep that in mind when playing with my CodePen below.

My Node server simply echoes data back that I render as is in the template. Here's an example of how that looks:

```js
{ 
	"fields": { "something": "p" }, 
	"files": { "fileToUpload": 
		{ "size": 515954, 
			"path": "/tmp/upload_390d2c9ac7149c559f85ba934f996dde", 
			"name": "Untitled.png", 
			"type": "image/png", 
			"mtime": "2020-09-19T17:29:44.644Z" 
		} 
	} 
}
```

In a real application you wouldn't do that of course. In the end though, Fetch and FormData do all the heavy work for us! Here's the complete application below, and please remember that you won't be able to actually submit.

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="GRZYBMw" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Vue File Upload Test">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/GRZYBMw">
  Vue File Upload Test</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>



