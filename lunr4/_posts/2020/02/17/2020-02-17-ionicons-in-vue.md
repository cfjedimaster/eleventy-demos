---
layout: post
title: "Ionicons in Vue.js"
date: "2020-02-17"
categories: ["javascript"]
tags: ["ionic","vuejs"]
banner_image: /images/banners/icons.jpg
permalink: /2020/02/17/ionicons-in-vue
description: A quick look at using Ionicons in Vue.js
---

It's been a long time since I've written about [Ionic](https://ionicframework.com/). In general, I haven't done much in the hybrid mobile space over the past few years. I pay attention to their updates though ([version 5](https://ionicframework.com/blog/announcing-ionic-5/) looks impressive) and noticed recently they did a [major update](https://ionicframework.com/blog/announcing-ionicons-5/) to their [Ionicons](https://ionicons.com/) project. 

<img src="https://static.raymondcamden.com/images/2020/02/io1.png" alt="Screen shot of the Ionicon site" class="imgborder imgcenter">

I've only used Ionicons with Ionic project, and while not required, it was useful as hell to have a robust icon library to use when building mobile apps. I knew that the project could be used outside of Ionic but I hadn't actually tested it out. On a whim, I thought I'd take a quick look at what you need to do to use it in a Vue app.

Spoiler - it was ridiculously easy.

I started off with a Vue application on CodePen. And by "application", I mean just a CodePen with the Vue script tag added. I then setup some data for testing:

```js
Vue.config.productionTip = false;
Vue.config.devtools = false;

const app = new Vue({
  el:'#app',
  data: {
    drinks: [
    	{"name":"Abita","type":"beer"},
    	{"name":"Merlot","type":"wine"},
    	{"name":"Saint Arnold","type":"beer"},
    	{"name":"Red Something","type":"wine"}
      ]
  }
})
```

I've got an array of drinks where each one has a name and type. To make things a bit simpler, the types also happen to correspond to icons supported by Ionicons. 

To add support, and pay attention, this is really complex, I added this script src: https://unpkg.com/ionicons@5.0.0/dist/ionicons.js.

And that's it. Done. Ionicons make use of [web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) to add in support for the icons. (For unsupported browsers, polyfills should be used. I did a quick test with IE11 and it worked fine.) Using them then is as simple as this:

```html
<ion-icon name="something"></ion-icon>
```

where "something" refers to the icon you want to load. You may not notice it at first but the home page has a search field that lets you quickly look for a particular icon by name. The [usage](https://ionicons.com/usage) page also details how to use variants, like filled icons versus outlined. You can even specify per platform (ios versus android) like so:

```html
<ion-icon ios="heart-outline" md="heart-sharp"></ion-icon>
```

My guess it that every single browser outside of Safari will use the `md` version. In my quick test on my Windows machine, Firefox used the `md` version.

So given my data, I wanted to render my drinks and use the right icon based on the drink type. This is what I used. 

```html
<div id="app" v-cloak>
  <ul>
    <li v-for="drink in drinks">
      {% raw %}{{drink.name}}{% endraw %} <ion-icon :name="drink.type"></ion-icon>
    </li>
  </ul>
</div>
```

And here's the result:

<p class="codepen" data-height="400" data-theme-id="default" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="GRJRYqw" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Vue plus Ionic Icons">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/GRJRYqw">
  Vue plus Ionic Icons</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

So yeah, I love it when I decide to test something to see if it works, and it just does, and it doesn't get complex in any way whatsoever. I had not thought of Ionicons at all recently but now I'm absolutely going to use it in my Vue apps where it makes sense. 

### Oops, One More Thing

I had my buddy and Ionic devrel [Mike Hartington](https://mhartington.io/) do a quick sanity check on the post. He wondered why I didn't run into the "Unknown custom element" issue. Turns out, I *had* run into it, just hadn't noticed. It's an warning thrown in the console, not an error, and it takes all of two seconds to fix. Basically, you tell Vue to calm down and don't worry about it like so:

```js
Vue.config.ignoredElements = ['ion-icon'];
```

My CodePen above has this added.

<i>Header photo by <a href="https://unsplash.com/@aquatium?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Harpal Singh</a> on Unsplash</i>