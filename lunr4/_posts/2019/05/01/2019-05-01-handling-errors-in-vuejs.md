---
layout: post
title: "Handling Errors in Vue.js"
date: "2019-05-01"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/error.jpg
permalink: /2019/05/01/handling-errors-in-vuejs
description: A look at handling errors in your VueJS applications
---

I've been spending the last year working with, writing about, and presenting on my favorite framework, Vue.js, and realized that I had yet to look into error handling with Vue. I'd like to say that's because I write perfect code, but I think we all know the truth of that. I spent some time the last few days playing around with various error handling techniques provided by Vue and thought I'd share my findings. Obviously this won't cover every scenario out there, but I hope it helps!

## The Errors!

In order to test out the various error handling techniques, I decided to use three different kinds of errors (initially anyway). The first was simply referring to a variable that doesn't exist:

```html
<div id="app" v-cloak>
  Hello, {% raw %}{{name}}{% endraw %}
</div>
```

This example will not display an error to the user but will have a `[Vue warn]` message in the console. 

<img src="https://static.raymondcamden.com/images/2019/05/ve1a.png" alt="Error messages" class="imgborder imgcenter">

You can view this example here:

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="qweOKB" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="Error1A">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/qweOKB/">
  Error1A</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

For a second example, I tried a variable bound to a computed property that would throw an error:

```html
<div id="app" v-cloak>
  Hello, {% raw %}{{name2}}{% endraw %}
</div>

<script>
const app = new Vue({
  el:'#app',
  computed:{
    name2() {
      return x;
    }
  }
})
</script>
```

This throws both a `[Vue warn]` and a regular error in the console and doesn't show anything to the user.

<img src="https://static.raymondcamden.com/images/2019/05/ve1.png" alt="Error messages" class="imgborder imgcenter">


Here's an embed for this.

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="BEXoOw" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="Error1B">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/BEXoOw/">
  Error1B</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

For my third error, I used a method that would throw an error when executed.

```html
<div id="app" v-cloak>
	<button @click="doIt">Do It</button>
</div>

<script>
const app = new Vue({
  el:'#app',
  methods:{
	  doIt() {
		  return x;
	  }
  }
})
</script>
```

Like the last one, this error will be thrown twice in the console, one warning and one proper error. Unlike last time, the error is only thrown when you actually click the button.

<img src="https://static.raymondcamden.com/images/2019/05/ve2.png" alt="Error with the click handler" class="imgborder imgcenter">

And here's the embed for this one:

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="oOKjJb" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="Error1C">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/oOKjJb/">
  Error1C</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Ok, before we go on, I just want to be clear that this isn't representative of every type of error you can create, it's just a baseline of a few that I think would be common in Vue.js applications. 

Ok, so how *do* you handle errors in Vue applications? I have to say I was a bit surprised that the main [Vue Guide](https://vuejs.org/v2/guide/) did not have a clearly defined section on error handling. 

<img src="https://static.raymondcamden.com/images/2019/05/ve3.png" alt="Results for Error" class="imgborder imgcenter">

Yes, there is one in the guide, but the text is short enough to fit in a quote:

<blockquote>
If a runtime error occurs during a component's render, it will be passed to the global Vue.config.errorHandler config function if it has been set. It might be a good idea to leverage this hook together with an error-tracking service like Sentry, which provides an official integration for Vue.
</blockquote>

In my opinion, this topic should really be called out a bit more in the docs. (And frankly that's on me to see if I can help the docs!) In general, error handling in Vue comes down to these techniques:

* errorHandler
* warnHandler
* renderError
* errorCaptured
* window.onerror (not a Vue-specific technique)

Let's dig in.

## Error Handling Technique One: errorHandler

The first technique we'll look at is [errorHandler](https://vuejs.org/v2/api/#errorHandler). As you can probably guess, this is a generic error handler for Vue.js applications. You assign it like so:

```js
Vue.config.errorHandler = function(err, vm, info) {

}
```

In the function declaration above, `err` is the actual error object, `info` is a Vue specific error string, and `vm` is the actual Vue application. Remember that you can have multiple Vue applications running on one web page at a time. This error handler would apply to all of them. Consider this simple example:

```js
Vue.config.errorHandler = function(err, vm, info) {
  console.log(`Error: ${err.toString()}\nInfo: ${info}`);
}
```

For the first error, this does nothing. If you remember, it generating a *warning*, not an error. 

For the second error, it handles the error and reports:

	Error: ReferenceError: x is not defined
	Info: render

Finally, the third example gives this result:

	Error: ReferenceError: x is not defined
	Info: v-on handler

Note how the info in the two previous examples is pretty helpful. Now let's check the next technique.

## Error Handling Technique Two: warnHandler

The [warnHandler](https://vuejs.org/v2/api/#warnHandler) handles - wait for it - Vue warnings. Do note though that this handler is ignored during production. The method handler is slightly different as well:

```js
Vue.config.warnHandler = function(msg, vm, trace) {

}
```

Both `msg` and `vm` should be self-explanatory, but `trace` would be the component tree. Consider this example:

```js
Vue.config.warnHandler = function(msg, vm, trace) {
  console.log(`Warn: ${msg}\nTrace: ${trace}`);
}
```

The first error example now has a handler for it's warning and returns:

	Warn: Property or method 'name' is not defined on the instance but referenced during render. Make sure that this property is reactive, either in the data option, or for class-based components, by initializing the property. See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.
	Trace: 

	(found in <Root>)

The second and third examples do not change. You can view embeds for all three below:

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="oOKxEa" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="Error1A with Handler">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/oOKxEa/">
  Error1A with Handler</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

<p/>

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="PgMNao" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="Error1B with Handler">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/PgMNao/">
  Error1B with Handler</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

<p/>

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="wZVGEK" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="Error1C with Handler">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/wZVGEK/">
  Error1C with Handler</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Error Handling Technique Three: renderError

The third method I'll demonstrate is [renderError](https://vuejs.org/v2/api/#renderError). Unlike the previous two, this technique is component specific and not global. Also, like `warnHandler`, this is disabled in production. 

To use, you add it to your component/app. This example is modified from a sample in the docs.

```js
const app = new Vue({
  el:'#app',
  renderError (h, err) {
    return h('pre', { style: { color: 'red' }}, err.stack)
  }
})
```

If used in the first error example, it does nothing, which if you think about it *kinda* makes sense as the first one is throwing a warning, not an error. If you test it in the second one where the computed property throws an error, it is rendered. You can see it in the embed below.

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="result" data-user="cfjedimaster" data-slug-hash="NmQrwa" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="Error1B with renderError">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/NmQrwa/">
  Error1B with renderError</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

To be honest, I'm not sure why I'd use this when the console would be more appropriate, but if your QA team or other testers aren't familiar with the browser console, having a simpler error message on screen may help. 

## Error Handling Technique Four: errorCaptured

For the final (Vue-specific) technique, we have [errorCaptured](https://vuejs.org/v2/api/#errorCaptured), AKA the technique that confused the heck out of me and frankly still confuses me a bit. The docs have this to say:

<blockquote>
Called when an error from any descendent component is captured. The hook receives three arguments: the error, the component instance that triggered the error, and a string containing information on where the error was captured. The hook can return false to stop the error from propagating further.
</blockquote>

Based on my research (and again, I'm definitely shaky on this), this error handler is only to be used by a "parent" component handling an error from a "child" component. It can't, as far as I know, be used in a main Vue instance, but only in a component with children. 

In order to test this I created a parent/child set of components like so:

```js
Vue.component('cat', {
  template:`
<div><h1>Cat: {{name}}</h1>
  <slot></slot>
</div>`,
  props:{
    name:{
      required:true,
      type:String
    }
  },
   errorCaptured(err,vm,info) {
    console.log(`cat EC: ${err.toString()}\ninfo: ${info}`); 
     return false;
  }

});

Vue.component('kitten', {
  template:'<div><h1>Kitten: {% raw %}{{ dontexist() }}{% endraw %}</h1></div>',
  props:{
    name:{
      required:true,
      type:String
    }
  }
});
```

Notice how the `kitten` component has an error in it. Now if I try to use it like so:

```html
<div id="app" v-cloak>
  <cat name="my cat">
      <kitten></kitten>
  </cat>
</div>
```

I'll get a message from the handler:

	cat EC: TypeError: dontexist is not a function
	info: render

You can view this in the embed below.

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="MRMbYJ" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="Error1">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/MRMbYJ/">
  Error1</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

So yeah... interesting feature. I'm guessing it would mostly be used by people building component libraries with parent/child type relationships. More a "library developer" feature than a "regular developer" feature if that makes sense. But again - that's just my initial impression of the feature. 

## The One Technique to Rule Them All: window.onerror

<img src="https://static.raymondcamden.com/images/2019/05/ring.png" alt="Obligatory LOTR reference ring" class="imgcenter">

The final (and most powerful) option is to use [window.onerror](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror), a global error handler for *anything* that can possibly go wrong with your JavaScript. The handler takes the form of:

```js
window.onerror = function(message, source, line, column, error) {

}
```

Probably the only thing you can't guess above would be `source` which is the URL of the script. 

Here's where things get interesting though. If you define this, and do *not* use `Vue.config.errorHandler`, then this will not help. Vue expects you to define the darn thing and if you don't, will not propagate the error outside itself. I ... guess that makes sense? I don't know - to me that doesn't necessarily make sense. Even odder, let's say your Vue error handler has an error itself. That won't propagate to window.onerror either. 

Here's an example CodePen. I've commented out the error in the `errorHandler`, but if you remove the comment, you'll see the global error handler isn't run. The only you can see the global handler run is if you click the second button.

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="WWVowN" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="Error1C with Handler (window)">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/WWVowN/">
  Error1C with Handler (window)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Wrap Up

I hope this made sense. As I said in the beginning, this was my first foray into the topic so I'm definitely looking for comments, suggestions, and corrections. I'd love to hear how people are using these techniques in their own apps!

<i>Header photo by <a href="https://unsplash.com/photos/G85VuTpw6jg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">David Kovalenko</a> on Unsplash</i>