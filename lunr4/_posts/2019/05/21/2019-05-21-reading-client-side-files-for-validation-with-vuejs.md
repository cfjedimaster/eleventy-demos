---
layout: post
title: "Reading Client-Side Files for Validation with Vue.js"
date: "2019-05-21"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/validation.jpg
permalink: /2019/05/21/reading-client-side-files-for-validation-with-vuejs
description: A look at reading client-side files with Vue.js.
---

Folks new to web development may not know that form inputs using the `file` type are read only. For good reason of course. You wouldn't want nefarious (I've been waiting a while to use that word) JavaScript programs setting the value of the field and doing uploads behind the scenes - it would be a great way to steal information off your computer. However, just because the field is read only doesn't mean we can't do cool stuff with it. In fact, once a user has select a file (or files, remember the `multiple` attribute!), you can not only see the file type, name, and size, you can read it as well. This offers you some interesting possibilities.

Let's pretend you've got a form for a mailing service. You want to seed a list of recipients with a set of email addresses. You could allow the user to select a text file from their machine and upload it. Before they do so, however, you could pre-emptively check the file and display the names to the end user.

Another option would be a form that allows for uploads of JSON-formatted data. Before that file is sent to the server, you could read it, check for valid JSON data, and then potentially render out the information. You could also do other checks, so for example, maybe you require your JSON data to be an array of objects with keys `name` and `gender` being required while `age` is optional. 

As always, you need to have server side validation for anything your users send, but being able to pre-emptively check files and provide feedback to the user could save them a lot of time. I thought I'd share a few examples of this using Vue.js, but of course, you could this with any (or no) framework at all.

### Reading a File

For the first example, let's just consider a super simple example where we - 

* note when a file is selected in the input field
* check to see if it's a text file
* read in the contents and display it

For my HTML, I keep it nice and simple:

```html
<div id="app" v-cloak>
  
  <input type="file" ref="myFile" @change="selectedFile"><br/>
  <textarea v-model="text"></textarea>

</div>
```

This is pretty standard Vue stuff, but note the `ref` usage. This is how we'll read the value later.

Now the JavaScript:

```js
Vue.config.productionTip = false;
Vue.config.devtools = false;

const app = new Vue({
  el:'#app',
  data: {
    text:''
  },
  methods:{
    selectedFile() {
      console.log('selected a file');
      console.log(this.$refs.myFile.files[0]);
      
      let file = this.$refs.myFile.files[0];
      if(!file || file.type !== 'text/plain') return;
      
      // Credit: https://stackoverflow.com/a/754398/52160
      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload =  evt => {
        this.text = evt.target.result;
      }
      reader.onerror = evt => {
        console.error(evt);
      }
      
    }
  }
})
```

So the main action here is the `selectedFile` method. This is run whenever the input field fires a `change` event. I use `this.$refs.myFile` to refer to the original DOM element I had used and to read the value. Notice that this is an array so I grab the first value only to keep things simple. In theory the end user could use dev tools to add `multiple` and then select multiple files, but I won't have to worry about that.

Next, I use the `FileReader` API to read in the file. This is asynchronous and you can see two handlers to respond to the `onload` and `onerror` events. For `onload`, I simply pass the value to `this.text` which will render in the textarea. You can see this in action in the CodePen below.

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="qGPrJY" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="vue file 1">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/qGPrJY/">
  vue file 1</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### A List of Names

Imagine you've been wronged. Badly wronged. And you've got a list of names. People who have it coming to them. Just as an example, let's call you Arya. 

<img src="https://static.raymondcamden.com/images/2019/05/arya.jpg" alt="Arya Stark, don't get on her bad side" class="imgborder imgcenter">

To help process this list of names, let's build some code that will read in a text file of names, report on the total length, and show the top ten. The list may be incredibly huge but by showing a small subset, the user can quickly determine if the file was correctly setup, or lord forbid, they selected the wrong file. Here's a simple example of this in action.

```html
<div id="app" v-cloak>
  
  <h2>Upload List of Names</h2>
  <input type="file" ref="myFile" @change="selectedFile"> 
  <input type="submit" value="Upload File" />
  <div v-if="allNames.length">
    <p>Your file contains {% raw %}{{allNames.length}}{% endraw %} names. Here's the first ten names.</p>
    <ul>
	  {% raw %}<li v-for="name in names">{{name}}</li>{% endraw %}
    </ul>
  </div>
  
</div>
```

The top portion prompts for the file and uses similar attributes to the first example. Next I've got the display. I print out how many names were in the file and then iterate over a `names` value. This is going to be a virtual property of just the first ten values. (By the way, I don't like using `allNames.length`. While I appreciate Vue lets me do a bit of logic in my HTML, I would have preferred to use a simple boolean instead for the `v-if` and another value for the length.) 

Alright, so here's the JavaScript:

```js
Vue.config.productionTip = false;
Vue.config.devtools = false;

const app = new Vue({
  el:'#app',
  data: {
    allNames:[]
  },
  computed:{
    names() {
      return this.allNames.slice(0,10);
    }
  },
  methods:{
    selectedFile() {
      console.log('selected a file');
      console.log(this.$refs.myFile.files[0]);
      
      let file = this.$refs.myFile.files[0];
      if(!file || file.type !== 'text/plain') return;
      
      // Credit: https://stackoverflow.com/a/754398/52160
      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      
      reader.onload = evt => {
        let text = evt.target.result;
        this.allNames = text.split(/\r?\n/);
        //empty string at end?
        if(this.allNames[this.allNames.length-1] === '') this.allNames.pop();
      }
      
      reader.onerror = evt => {
        console.error(evt);
      }
      
    }
  }
})
```

In general, the only interesting bits are in the `reader.onload` event. I'm still checking the file type, but now when I read it in split it on newlines and remove the file value is blank. This will set the `allNames` value. The `names` value is in the `computed` block and only consists of the first ten values. You can play with this below - just make your own list of names. Please do not include my name on it.

<p class="codepen" data-height="300" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="dEVvgq" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="vue file 2">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/dEVvgq/">
  vue file 2</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### The Cat File


<img src="https://static.raymondcamden.com/images/2019/05/catfile.gif" alt="A cat filing its nails" class="imgborder imgcenter">

Look, it's a cat file. Get it? Sorry, I've been waiting a long time to use that gif. So in this scenario I'm going to demonstrate an example that parses a JSON file. It will first check to see if the file contains JSON text, and then if so render the results. Unlike the previous example I'm just going to render every row of data. The data will be an array of cat. Did you know a group of cats is called an Awesome? It is - I read it on wikipedia.

Here's the layout:

```html
<div id="app" v-cloak>
  
  <h2>Upload Cat Data</h2>
  <input type="file" ref="myFile" @change="selectedFile"> 
  <input type="submit" value="Upload File" />
  <div v-if="cats">
    <h3>Data Preview</h3>
    <table border="1">
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Gender</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cat in cats">
          <td>{% raw %}{{cat.name}}{% endraw %}</td>
          <td>{% raw %}{{cat.age}}{% endraw %}</td>
          <td>{% raw %}{{cat.gender}}{% endraw %}</td>
        </tr>
      </tbody>
    </table>
  </div>
  
</div>
```

I'm using a table to render the cats and yeah that's it. Here's the JavaScript:

```js
Vue.config.productionTip = false;
Vue.config.devtools = false;

const app = new Vue({
  el:'#app',
  data: {
    cats:null
  },
  methods:{
    selectedFile() {
      console.log('selected a file');
      console.log(this.$refs.myFile.files[0]);
      
      let file = this.$refs.myFile.files[0];
      if(!file || file.type !== 'application/json') return;
      
      // Credit: https://stackoverflow.com/a/754398/52160
      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      
      reader.onload =  evt => {
        let text = evt.target.result;
        try {
          this.cats = JSON.parse(text);
        } catch(e) {
          alert("Sorry, your file doesn't appear to be valid JSON data.");
        }
      }
      
      reader.onerror = evt => {
        console.error(evt);
      }
      
    }
  }
})
```

The important bits here are how I test for valid JSON, a simple `try/catch` around `JSON.parse`. And that's it. You could definitely do more checks here:

* Is the valid JSON data an array?
* Is it at least one row?
* Do we have required columns?
* If we have extra data, like a "isFeisty" boolean, do we consider that an error?

And so forth. Feel free to fork the CodePen below and go cat crazy!

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="JqrJeR" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="vue file 3">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/JqrJeR/">
  vue file 3</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

So as always, I'd love to hear if people are using these techniques. Drop me a comment below and share what you've done!

<i>Header photo by <a href="https://unsplash.com/photos/2Nca6Aum17o?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Manki Kim</a> on Unsplash</i>