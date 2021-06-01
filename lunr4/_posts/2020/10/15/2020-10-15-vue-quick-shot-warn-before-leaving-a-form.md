---
layout: post
title: "Vue Quick Shot - Warn Before Leaving a Form"
date: "2020-10-15"
categories: ["javascript"]
tags: ["vuejs","vue quick shot"]
banner_image: /images/banners/tip.jpg
permalink: /2020/10/15/vue-quick-shot-warn-before-leaving-a-form
description: Using Vue to warn a user before they leave an edited form.
---

Welcome to another [Vue Quick Shot](https://www.raymondcamden.com/tags/vue+quick+shot/) - my series of posts of quick (kinda) solutions for common web development issues with Vue.js. Today's Quick Shot is an interesting one. First off, I'm not entirely sure what I'm sharing makes sense. I always encourage folks to leave comments with their suggestions but even more so for today's post - if what I'm sharing is problematic, I really want to know.

The tip today is how to warn a user before they leave a form that hasn't been submitted. So imagine a form where a user has entered some data, but then they get distracted. 

<p style="text-align: center">
<img data-src="https://static.raymondcamden.com/images/2020/10/cat1.jpg" alt="Real picture of me being distrated" class="lazyload imgborder imgcenter">
<i>Real picture of Raymond being distracted.</i>
</p>

Instead of submitting the form, they instead hit some other link on your site, leaving the form without realizing that they forgot to finish what they had started. So how can we handle this?

Modern browsers support an [onbeforeunload](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload) event, which as you can imagine is fired before the current page is unloaded, either via navigation or reload. According to MDN, your handler should look as follows:

```js
window.addEventListener('beforeunload', function (e) {
  // Cancel the event
  e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
  // Chrome requires returnValue to be set
  e.returnValue = '';
});
```

As you can see, you prevent the default behavior as well as set a `returnValue` property for just Chrome. In theory, `returnValue` lets you specify a message to show to the user, but since this can be abused badly, many browsers will ignore the value set here and just use a default. But the existence of the value is enough to trigger what you want - prompting before the user leaves. Just to be clear, you can't stop the user (which is a good thing), but you get to throw up a prompt to at least let them know. 

While this seems simple enough (kinda), now we have to figure out another problem. When do we use this? We need a way to determine when a form is "dirty" and has edited values. Here's what I figured out.

First, I began with a form:

```html
<div id="app" v-cloak>
  <form>
    <p>
    <label for="name">Name</label>
    <input type="text" id="name" v-model="name">
    </p>
    <p>
    <label for="comments">Comments</label>
    <textarea id="comments" v-model="comments"></textarea>
    </p>
    
    <p>
      <input type="submit">
    </p>
  </form>
  
  <p>
    <a href="https://www.starwars.com">StarWars.com</a>
  </p>
  
</div>
```

The form consists of two fields, a submit button, and then I include a link as a way for a user to skip out of submitting the form. Now let's look at the code:

```js
Vue.config.productionTip = false;
Vue.config.devtools = false;

const app = new Vue({
  el:'#app',
  data:{
    name:'',
    comments:'',
    handler:null
  },
  created() {
    this.$watch(function() { return this.name + this.comments }, function(newVal,oldVal) {
      //do we need to add?
      if(oldVal === '' && newVal !== '') {
        this.handler =  function (e) {
          // Cancel the event
          e.preventDefault(); 
          // Chrome requires returnValue to be set
          e.returnValue = '';
        };
        window.addEventListener('beforeunload',this.handler);
        console.log('add watcher'); 
      } else if(newVal === '' && oldVal !== '') {
        window.removeEventListener('beforeunload',this.handler);
        this.handler = null;
        console.log('remove watcher');
      }
    });
  }
})
```

In my `created` function, I use `$watch` instead of `watchers` because I want to define my own function for recognizing a change. In my case, I create a string version of all the form fields and append them together. If you change anything in any field, it will fire off the watcher value.

Inside the watcher handler, I then have to handle two cases:

* Our form did not have content, and now it does.
* Our form had content, and now it doesn't.

The first part of the `if` block handlers going from no content to some content. I create the handler in the `this` scope so I can use it later. Later is the `else` block where I remove the handler. 

Now technically, a form could *default* to having values and you may edit it to be blank. In that case you could determine an initial value on load and compare the new values against that. 

There's one last aspect we have to handle. When you submit the form, the `beforeunload` event is going to fire. To handle that, can we listen for the submit button click event. First, we'll add a handler to the HTML:

```html
<input type="submit" @click="removeHandler">
```

And then our code:

```js
methods:{
	removeHandler() {
		if(this.handler) window.removeEventListener('beforeunload',this.handler);
		return true;
	}
}
```

Basically - if we setup the handler, remove it. Now, in theory, if you edit the form and try to leave via the link, you'll get a prompt:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/10/cat2.jpg" alt="Prompt before leaving web page" class="lazyload imgborder imgcenter">
</p>

This is certainly not a perfect solutio, but it may help prevent a user from accidentally losing changes. If you've done this better (most likely!), please share your solution below! Here's a CodePen with the entire solution.

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="VwjeqPp" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Warn on Page Leave">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/VwjeqPp">
  Warn on Page Leave</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>