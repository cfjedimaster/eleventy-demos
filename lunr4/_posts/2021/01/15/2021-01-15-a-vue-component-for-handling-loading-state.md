---
layout: post
title: "A Vue Component for Handling Loading State"
date: "2021-01-15"
categories: ["JavaScript"]
tags: ["vuejs"]
banner_image: /images/banners/kittens2.jpg
permalink: /2021/01/15/a-vue-component-for-handling-loading-state
description: A simple component that handles it's own loading state.
---

I've been doing some Vue consulting recently with a client and he came up with an interesting scenario. He asked about adding a "loading" state to his UI such that when
a user clicked a button, it was obvious "something" was going on. This is actually something I've covered before in my [Vue Quick Shots](https://www.raymondcamden.com/tags/vue+quick+shot/) series:

[Vue Quick Shot - Disabling a Submit Button While Waiting for an Ajax Call](https://www.raymondcamden.com/2020/03/02/vue-quick-shot-disabling-a-submit-button-while-waiting-for-an-ajax-call)
[Vue Quick Shot - Using a Loading Message](https://www.raymondcamden.com/2020/03/04/vue-quick-shot-using-a-loading-message)

It's fairly simple and basically comes down to the following pseudo-code:

```js
set a flag that tells the UI to disable the button or show a loading msg
do your slow Async process
when done, toggle that flag
```

While that's fairly simple, my client wanted to see if he could turn it into a component. At first I told him this felt like overkill, but he was concerned, rightly so, that if he had multiple buttons on a page doing the same thing, that he didn't want multiple different flags for each one.

Together we built up a simple demo of this and it's interesting, but I'm also unsure of one aspect of it and I'd love to get some feedback. I'll share a link to all the code at the end of this post, but let's start with the component.

First, I named it `AnotherClickWait`. That's a pretty bad name but it will make sense in a minte I think. First let's look at the HTML and style of the component:

```html
<template>
  <button @click="clicked" :disabled="loading">
    <slot></slot>
  </button>
</template>

<style>
button {
  padding: 20px;
}

button:disabled {
  font-style: italic;
}
</style>
```

As you can see it's pretty simple. It's got a click event and a disabled property. The only reason I bothered styling it is that I noticed that the disabled state didn't look very disabled. That could be a CodeSandbox issue (where I have the demo), but I just wanted something more in your face. The `slot` tag lets you pass in the text for the button.

Now for the code:

```js
export default {
  name: "AnotherClickWait",
  data() {
    return {
      loading: false
    }
  },
  methods:{
    clicked() {
      this.loading = true;
      this.$emit('click', () => {
        this.loading = false;
      })
    }
  }
};
```

Ok, so there's a few things to note here. First, I use a flag, `loading`, that will handle, internally, the state of, well, loading. In order for the parent using the component to know the click event happened, I used `this.$emit`, and here's where things get interesting.

How does the parent let the button know that it's done doing whatever it's doing? This is where my client came up with the idea. The event passes a function as an argument that the caller can use to tell the button it's done doing whatever logic it's supposed to be doing.

This part in particular was fascinating to me and also a bit worriesome. I don't know why, it's a good solution, but it's the main reason I'm blogging this as I'd like to get some feedback. 

Using the component looks like so:

```html
<AnotherClickWait style="background-color:#c0c0c0" @click="doFoo">One More Darn Button</AnotherClickWait>
```

And then here's the event handler:

```js
doFoo(done) {
	setTimeout(() => {
		console.log('im done with whatever biz logic');
		done();
	},3000);
}
```

As you can see, I expect to be called with a function that I can run when I'm done. I think what bothers me is that this feels like a bad dependancy, but on the other hand, the client (in this case the code using the component), *has* to be responsible for knowing when things are done.

Make sense?

So yeah, about that name. The client is using [Vuetify](https://vuetifyjs.com/en/) for his UI library and his component actually wrapped `v-btn` instead. This created an odd issue where the props in the parent component, named `ClickWait`, did *not* propagate down to `vue-btn`. 

I asked about this on Twitter and Alex was happy to help me out:

<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">So i have noticed this behavior as well, and i tend to always add a v-bind and v-on so that i am explicitly passing things through. I don&#39;t know why it gets weird about it sometimes.</p>&mdash; Alex Riviere (@fimion) <a href="https://twitter.com/fimion/status/1349865473668689921?ref_src=twsrc%5Etfw">January 14, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

From what we can see, *something* is going wrong, and we have to manually bind the arguments in. Here's the entirety of that component:

```html
<template>
  <v-btn @click="clicked" v-bind="$attrs" :loading="loading">
    <slot></slot>
  </v-btn>
</template>

<script>

export default {
  name: "ClickWait",
  inheritAttrs:"false",
  data() {
    return {
      loading: false
    }
  },
  methods:{
    clicked() {
      this.loading = true;
      this.$emit('click', () => {
        this.loading = false;
      })
    }
  }
};
</script>
```

It's *mostly* the same but we disable prop inheritance and manually bind it. Again, this is *not* what we thought we would have to do, but it worked. Want to see it in action? Try out the CodeSandbox below:

<iframe src="https://codesandbox.io/embed/vibrant-mirzakhani-xwrgv?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vibrant-mirzakhani-xwrgv"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

Again, I'd love to hear what people think of this approach. Leave me a comment below.

<span>Photo by <a href="https://unsplash.com/@dorographie?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Dorothea OLDANI</a> on <a href="https://unsplash.com/s/photos/kitten?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>