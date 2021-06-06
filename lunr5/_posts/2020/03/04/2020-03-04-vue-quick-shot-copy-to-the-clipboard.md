---
layout: post
title: "Vue Quick Shot - Copy to the Clipboard"
date: "2020-03-04T19:00:00.000Z"
categories: ["javascript"]
tags: ["vuejs","vue quick shot"]
banner_image: /images/banners/tip.jpg
permalink: /2020/03/04/vue-quick-shot-copy-to-the-clipboard
description: My third Vue quick shot - copying to the clipboard
---

Welcome to the third of my Vue quick shots. Be sure to check out my [first](https://www.raymondcamden.com/2020/03/02/vue-quick-shot-disabling-a-submit-button-while-waiting-for-an-ajax-call) and [second](https://www.raymondcamden.com/2020/03/04/vue-quick-shot-using-a-loading-message) entries. I'll be posting a quick Vue.js tip every day this week (and let's pretend I was late with yesterday's entry, ok) for you to use in your projects. 

Today's entry is an example of how to add "Copy to Clipboard" functionality for a site. You see this fairly often in developer portals where keys or tokens are shared with developers for their code. A little bit of JavaScript tied to a button or some other UI is added to make it easier to copy the value. Today's tip will show one way of adding this feature.

For this tip I'll be using the [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API). This is a newer way of accessing the clipboard (see this *excellent* [StackOverflow post](https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript) for a look at other methods) that is supported in everything but Internet Explorer and Safari. 

Let's begin with a simple application. I've got a form with two values:

```html
<div id="app" v-cloak>
  <p>
  <label for="appId">App ID: </label>
  <input id="appId" v-model="appId">
  </p>
  
  <p>
  <label for="appToken">App Token: </label>
  <input id="appToken" v-model="appToken">
  </p>  
</div>
```

And here's the application behind it, which for now just sets values for the two fields.

```js
const app = new Vue({
  el:'#app',
  data: {
    appId:'3493993048904',
    appToken:'dksklq33lkj21kjl12lkdsasd21jk'
  }
})
```

Alright, so how can we add a way to copy those values to the clipboard? I'm going to use a simple button that looks like so:

```html
<button v-if="canCopy" @click="copy(something)">Copy</button>
```

The `v-if` portion will handle hiding or showing the button based on if the browser supports the API. The `click` handler will pass the value to be copied. I can add it to the HTML like so:

```html
<div id="app" v-cloak>
  <p>
  <label for="appId">App ID: </label>
  <input id="appId" v-model="appId">
  <button v-if="canCopy" @click="copy(appId)">Copy</button>
  </p>
  
  <p>
  <label for="appToken">App Token: </label>
  <input id="appToken" v-model="appToken">
  <button v-if="canCopy" @click="copy(appToken)">Copy</button>
  </p>  
</div>
```

Now let's look at the JavaScript:

```js
Vue.config.productionTip = false;
Vue.config.devtools = false;

const app = new Vue({
  el:'#app',
  data: {
    appId:'3493993048904',
    appToken:'dksklq33lkj21kjl12lkdsasd21jk',
    canCopy:false
  },
  created() {
    this.canCopy = !!navigator.clipboard;
  },
  methods: {
    async copy(s) {
      await navigator.clipboard.writeText(s);
      alert('Copied!');
    }
  }
})
```

I first added a boolean value for `canCopy` that will handle the toggle for showing the buttons. I then use `created` to check if the API exists. Finally I added the `copy` method. The `clipboard` API is an asynchronous one so I wait for it to finish and then alert the user. Let me just say that I am *not* a fan of using `alert` like this. The API runs so darn quick I think you could skip this part completely, but technically it's possible someone could click and try to paste at lightning speed and not get what they expect. I also think you could do the notification a bit nicer than the alert. You could add some text by the button or someplace else in the UI. Many UI frameworks support a "toast" event that will show a message that automatically dismisses. That would be a great option as well.

You can test this out yourself here:

<p class="codepen" data-height="400" data-theme-id="default" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="rNVGeXa" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Vue Copy to Clipboard">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/rNVGeXa">
  Vue Copy to Clipboard</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

So before I wrap this quick tip, let me point out this functionality could be done a bit nicer as a component or custom directive. If anyone wants to do this and share it in the comments below, please do!