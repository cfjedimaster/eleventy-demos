---
layout: post
title: "Vue Components FTW - Toasted"
date: "2019-02-06"
categories: ["javascript"]
tags: ["vuejs","vue components ftw"]
banner_image: /images/banners/toast.jpg
permalink: /2019/02/06/vue-components-ftw-toasted
---

<div style="background-color:#d0d0d0;padding:5px">
<p>
Before I begin this post, a quick bit of context. A few days ago I was reading an excellent post on Vue and Internationalization (<a href="https://medium.freecodecamp.org/how-to-add-internationalization-to-a-vue-application-d9cfdcabb03b">How to add Internationalization to a Vue Application</a>), and while it is a great article in itself, towards the end the author mentions a small, random little component to make it easy to display country flags (<a href="https://www.npmjs.com/package/vue-flag-icon">vue-flag-icon</a>). I was really intrigued by this and thought it would be interesting to start looking into the options available to us as Vue developers. 
</p>
<p>
With that in mind, I hopped on Twitter and asked what folks would think about a regular series where I talk about components. The idea is to focus on small, easy to use components that integrate well into existing projects. "Small" is relative of course, but in my mind, things like <a href="https://vuetifyjs.com/en/">Vuetify</a>) would not apply. (And to be clear, Vuetify is pretty awesome!)
</p>
<p>
I also had one more "rule" that I reserve the right to ignore later. I wanted to focus on components that supported both npm installs as well as script tag use (i.e., add this script tag to your HTML) file. I think folks may disagree with me but I really think it's important for a Vue component to support both "build process" Vue apps (not a great phrase, sorry) as well as simple "I'm dropping Vue into a regular HTML page" use cases. 
</p>
<p>
For now I'm going to try to make this a weekly series, but honestly I think it will be more like twice a month. And I'm going with <b>Vue Components FTW</b> as the tagline because this is my blog and I get to be as silly as I'd like!
</p>
</div>

Ok, sorry for the long preamble! For my first Vue component I'm reviewing [vue-toasted](https://github.com/shakee93/vue-toasted) which is a simple "Toast" library. Don't know what a "toast" is? Don't feel bad. In this content (the web, and not your kitchen), toast is simply a notification that appears and (typically) disappears automatically. Something like, "You've got new mail!". Remember when getting email was cool?

You can see an example of this below - just click the cat. 

<p class="codepen" data-height="600" data-theme-id="0" data-default-tab="result" data-user="cfjedimaster" data-slug-hash="LqOxdY" style="height: 600px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="Vue Toasted Simple">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/LqOxdY/">
  Vue Toasted Simple</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

The component has an easy API but also supports quite a few options out of the box:

* The ability to automatically dismiss.
* The ability to theme the toast.
* The ability to add buttons with different actions to the toast.
* The ability to define 'global' toasts for easy reuse across an application. (And these even support dynamic options so you can create a global error handler, for example, but allow for specific error messages.)
* Integration with popular icon fonts.

Installation is either via npm or by adding a script tag:

```html
<script src="https://unpkg.com/vue-toasted"></script>
```

Once added, you then tell Vue about it:

```js
Vue.use(Toasted)
```

So how easy is it to use? An eternal, never-ending immortal Vampire toast can be created like so:

```js
Vue.toasted.show('meow!');
```

Note that the result of this call is a toast object which you could use to destroy it later. I'd call it `woodenStake` but that's me.

Adding duration is as simple as passing an object with options:

```js
Vue.toasted.show('life is short...', {
	duration: 2000
});
```

And yeah, there's many different options. Here's an example of adding an action button to the toast:

```js
Vue.toasted.show('Just Do It', {
	action: {
		text:'Done',
		onClick:(e, toast) => {
			toast.goAway(0);
		}
	}
});
```

Defining global toasts is also pretty easy - and remember you can define these to take arguments for on the fly customization as well. (This example is taken pretty much as is from the docs.)

```js
Vue.toasted.register('my_app_error', 'Oops.. Something Went Wrong..', {
    type : 'error'
});
// later in your code...
this.$toasted.global.my_app_error();
```

And then finally, an example of using an icon pack. Note that you must include the icon pack before you do this. For my CodePen demo (you'll see it in a bit) I simply added the URL in the CSS panel.

```js
Vue.toasted.show('I forgot to DVR "Arrow"!', {
	duration:2000,
	icon:'dvr',
	type:'error'
});
```

Here's a CodePen demonstrating everything above. It also demonstrates an interesting issue with the component. If you do a toast for "Foo", the component will nicely size it to fit the content. If that toast is still visible and you then toast "My Kingdom for a Beer", you'll notice the earlier toast resizes to match the same size as the new one. I guess that's not a bug but it surprised me a bit.

<p class="codepen" data-height="410" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="OdgNrx" style="height: 410px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="Vue Toasted">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/OdgNrx/">
  Vue Toasted</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Pretty simple, pretty useful, and should be easy to drop into your next Vue project. If you've used [vue-toasted](https://github.com/shakee93/vue-toasted) before, let me know in a comment below. And if you like this series (so far anyway) give me a comment as well!

<i>Header photo by <a href="https://unsplash.com/photos/puO8UBJU1CM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Mani Kim</a> on Unsplash</i>