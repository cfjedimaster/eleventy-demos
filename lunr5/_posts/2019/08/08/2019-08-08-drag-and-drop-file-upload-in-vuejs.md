---
layout: post
title: "Drag and Drop File Upload in Vue.js"
date: "2019-08-08"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/drop.jpg
permalink: /2019/08/08/drag-and-drop-file-upload-in-vuejs
description: A simple demo of using drag/drop with Vue.
---

This won't be a terribly long post. I had to build a small demo for a friend demonstrating drag/drop along with uploading so I thought I'd share the code for others. Honestly this is mostly for me so that when I need to build this again in a few months I'll Google and end up back here completely surprised that I had already written it.

I'll start off by saying I'm not going to cover the mechanics of drag and drop here. The MDN Web Docs have a great article on this (of course they do): [HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API). In my case, I'm not concerned with making a DOM item dragable but rather making my code respond to drop events. 

For what I need I have to handle two events, `drop` and `dragover`. Handling `drop` makes sense. I'll be honest and say I'm not quite sure why I need to handle `dragover`, but the code is incredibly small as you just need to prevent the default behavior.

Working on this demo also taught me something else about Vue. I'm used to building my Vue apps like so:

```html
<div id="app">
Here is where the awesome happens...
</div>
```

Where my div is then passed to Vue:

```javascript
const app = new Vue({
	el:'#app',
	//lots more stuff here
});
```

However, what if I wanted to do something with `<div id="app">` app itself? Turns out you can add Vue directives there just fine. I guess that makes sense but I'd never tried that before. I was able to specify that my entire Vue application "area" was covered by drag and drop support. 

Ok with that out of the way, let's look at the code. I'll start off wth HTML.

```html
<html>
<body>
<div id="app" v-cloak @drop.prevent="addFile" @dragover.prevent>
  <h2>Files to Upload (Drag them over)</h2>
  <ul>
    <li v-for="file in files">
      {% raw %}{{ file.name }}{% endraw %} ({% raw %}{{ file.size | kb }}{% endraw %} kb) <button @click="removeFile(file)" title="Remove">X</button>
    </li>
  </ul>
  
  <button :disabled="uploadDisabled" @click="upload">Upload</button>
</div>
</body>
</html>
```

On top, you can see my two event handlers. As I said, for `dragover` all we need to do is prevent default behavior which makes that part short and sweet. The `drop` event, `addFile`, is where I'll handle generating the list of files. 

Inside the div I keep track of the files you want to upload. For each I output the name, the size (passed through a filter `kb`), and add a simple button to let you remove the item.

Finally I've got an button to fire off the upload. For my demo I don't bother using a "Loading" widget of any sort, nor do I clear out the files when done. If anyone wants to see that just ask!

Alright, now the code.

```javascript
Vue.config.productionTip = false;
Vue.config.devtools = false;

Vue.filter('kb', val => {
  return Math.floor(val/1024);  
});

const app = new Vue({
  el:'#app', 
  data: {
    files:[]
  },
  computed: {
    uploadDisabled() {
      return this.files.length === 0;
    }
  },
  methods:{
    addFile(e) {
      let droppedFiles = e.dataTransfer.files;
      if(!droppedFiles) return;
      // this tip, convert FileList to array, credit: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
      ([...droppedFiles]).forEach(f => {
        this.files.push(f);
      });
    },
    removeFile(file){
      this.files = this.files.filter(f => {
        return f != file;
      });      
    },
    upload() {
      
      let formData = new FormData();
      this.files.forEach((f,x) => {
        formData.append('file'+(x+1), f);
      });
      
      fetch('https://httpbin.org/post', {
        method:'POST',
        body: formData
      })
      .then(res => res.json())
      .then(res => {
         console.log('done uploading', res);
      })
      .catch(e => {
        console.error(JSON.stringify(e.message));
      });
      
    }
  }
})
```

On top you can see my simple `kb` filter to render the file sizes a bit nicer. Inside the Vue app I've got one data item, `files`, and note how `uploadDisabled` works as a nice computed property. 

In `addFile`, I use the Drag/Drop API to access the files (if any) that were dropped. This demo lets you drag over one file, or 100 (don't do that). I then iterate over each and add them to the `files` value. Remember that when a user intentionally provides a file to a web app you now have read access to it. That's how I'm able to show the file sizes. I could do a lot more here like validate file type, set a max size per file, or even set a total size allowed.

Finally, my `upload` method just hits httpbin.org which will echo back what it was sent. I create a `FormData` object and just append each file. Remember by the user dropping the files on the app we can read from them.

And that's it. I hope this simple demo helps!

<i>Header photo by <a href="https://unsplash.com/@photohunter?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jimmy Chang</a> on Unsplash</i>