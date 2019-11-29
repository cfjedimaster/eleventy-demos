---
layout: post
title: "Datalists with Vue.js"
date: "2018-04-12"
categories: [javascript]
tags: [vuejs]
banner_image: /images/banners/code.jpg
permalink: /2018/04/12/datalists-with-vuejs
---

This isn't necessarily a very exciting post, but a few days back someone asked me about integrating Vue.js with [datalist](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) tags. The datalist tag is one of my favorite HTML tags and something I've [blogged about a few times](https://www.raymondcamden.com/search/?q=datalist) in the past. If you aren't familiar with it, it basically provides a "autosuggest" style experience to an input tag. 

The HTML is pretty simple. Here is the example used in the MDN article I linked to above:

```html
<label for="myBrowser">Choose a browser from this list:</label>
<input list="browsers" id="myBrowser" name="myBrowser" />
<datalist id="browsers">
  <option value="Chrome">
  <option value="Firefox">
  <option value="Internet Explorer">
  <option value="Opera">
  <option value="Safari">
  <option value="Microsoft Edge">
</datalist>
```

Basically - you create a `<datalist>` element and supply options. You then take your input and add the `list="id of the list"` attribute. Now when the user types, they will get suggestions based on the list and what they've typed in. It's pretty well supported (basically everyone but Safari and Mobile Safari, because of course) and fails gracefully (the user can still type anything they want). How would you combine this feature with Vue.js? Let's look at a static example. First, the HTML:

```html
<div id="app">
  <input type="text" v-model="film" list="films">
  <datalist id="films">
    <option v-for="film in films">{% raw %}{{film}}{% endraw %}</option>
  </datalist>
</div>
```

You can see the input field and the list. The `option` tag is tied to a variable called `films`. Now let's look at the JavaScript:

```js
const app = new Vue({
  el:'#app',
  data() {
    return {
      film:'',
      films:[
        "A Throne Too Far",
        "The Cat Wasn't Invited",
        "You Only Meow Once",
        "Catless in Seattle"
	    ]
	}
  }
})
```

Not too exciting, but it works rather well. You can test it below:

<p data-height="400" data-theme-id="0" data-slug-hash="PRvZyG" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Static Datalist" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/PRvZyG/">Static Datalist</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

How would you make it dynamic? Simple - just change how the data is generated. Here's an example of that:

```js
const app = new Vue({
  el:'#app',
  data() {
    return {
      film:'',
      films:[]
    }
  },
  created() {
    fetch('https://swapi.co/api/films/')
    .then(res => res.json())
    .then(res => {
      this.films = res.results.map(f => {
        return f.title;
      })
    })
  }
})
```

All I did was add in a `created` event handler and hit the [Star Wars API](https://swapi.co) for my data. You can test the result below:

<p data-height="400" data-theme-id="0" data-slug-hash="KoYrrg" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Dynamic Datalist" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/KoYrrg/">Dynamic Datalist</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

I may be biased - but everything is better in Vue.

<i>Header photo by <a href="https://unsplash.com/photos/OqtafYT5kTw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ilya Pavlov</a> on Unsplash</i>