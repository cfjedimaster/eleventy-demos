---
layout: post
title: "Vue Quick Shot - Form Field Character Counters"
date: "2020-09-14"
categories: ["javascript"]
tags: ["vuejs","vue quick shot"]
banner_image: /images/banners/tip.jpg
permalink: /2020/09/14/vue-quick-shot-form-field-character-counters
description: How to use Vue.js to count the characters in a form field
---

A common user interface feature you'll see on sites is a counter by form fields to let you know how much you've typed. Typically this is when a certain minimum or maximum number of characters are required. Instead of simply displaying an error ("You haven't typed enough, dangit!"), this feature will give you a "live" update as you type of how many characters have been typed so far. Here's a quick example of how to do this in Vue.js.

First, let's consider a use case where we require a certain number of characters. You can start with a simple HTML field:

```html
<input type="text" v-model="description" minlength=10>
```

Even though I'm not going to do a traditional form submission, I wanted to use `minlength` anyway as it's a well-supported feature of HTML forms. I've bound the field to a Vue data value named `description`. Now let's show the field with the rest of the layout.

```html
<div id="app" v-cloak>
  Enter a minimum of 10 characters please:
  <input type="text" v-model="description" minlength=10>
  {{ currentLength }} characters
</div>
```

I've added a bit of descriptive text to clearly tell the user what they need to do but I've also added a character counter after the field itself. Now let's look at the JavaScript:

```js
const app = new Vue({
  el:'#app',
  data:{
    description:''
  },
  computed: {
    currentLength() {
      return this.description.length;
    }
  }
})
```

As you can see `description` is just simple data, but `currentLength` is a computed property based on the field itself. 

And that's it. Simple. But let's make it a bit more fancy. 

<p>
<img data-src="https://static.raymondcamden.com/images/2020/09/fancycat.jpg" alt="Fancy cat is fancy" class="lazyload imgborder imgcenter">
</p>

Here I've modified the character count to add a span with some classes applied:

```html
<span class="count" :class="{bad:isBad}">
{% raw %}{{ currentLength }} characters{% endraw %}
</span>
```

Notice that the `bad` class is only applied when `isBad` is true. Here's the CSS I used:

```css
.count {
  font-style: italic;
}

.bad {
  color: red;
}
```

And my new computed property:

```js
isBad() { return this.currentLength < 10; }
```

Now when the user has less than ten characters, the `bad` class is applied and clearly signifies that the data isn't ready yet. You can play with the completed version below:

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="MWyBEVa" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Char Count (minimum)">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/MWyBEVa">
  Char Count (minimum)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Now let's flip it and write count that flags a maximum number of characters. First, the HTML:

```html
<div id="app" v-cloak>
  Enter a maximum of 100 characters please:
  <input type="text" v-model="description" maxlength=100>
  <span class="count" :class="{bad:isBad}">
  {{ currentLength }} characters
  </span>
</div>
```

Note the help text and the use of `maxlength`. Unlike `minlength` which won't have any impact unless the user submits the form, this time the user will immediately be stopped typing when they hit the max. So while most of the code is the same, I modified `isBad` like so:

```js
isBad() { return this.currentLength > 90; }
```

Now it returns true when the length is greater than 90. Instead of being a flag of "you have incorrect data", it's more of a warning that you're about to hit your max. Here's a demo of that version:

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="PoNBJRX" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Char Count (maximum)">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/PoNBJRX">
  Char Count (maximum)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>