---
layout: post
title: "Sanitizing HTML in Vue.js"
date: "2019-11-26"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/clean.jpg
permalink: /2019/11/26/sanitizing-html-in-vuejs
description: How to remove and restrict HTML in Vue.js
---

As part of my goal to learn more about Vue (and, honestly, find things to blog about), I came across this interesting StackOverflow post: [How to Sanitize HTML Received from an API Call in Vue.js](https://stackoverflow.com/questions/59057780/how-to-sanitize-html-received-from-an-api-call-in-vuejs/59057815#59057815). I did a quick Google search and came across a nice little library that makes this easy - [vue-sanitize](https://www.npmjs.com/package/vue-sanitize). I thought it would be nice to give it a try (especially since I was suggesting it as a solution) so I whipped up a quick demo.

Before I start though, it's good to remember how Vue treats HTML in data in general. Consider the following data:

```js
message:`
My <strong>milkshake</strong> brings all the boys to the yard<br/>
And <i>they're</i> like, it's better than yours
`
```

This is a string with three HTML tags in it. Nothing scary, but let's see what happens if you try to output it:

```html
<template>
  <div>
    {% raw %}{{ message }}{% endraw %}
  </div>
</template>
```

This will return:

	My <strong>milkshake</strong> brings all the boys to the yard<br/> 
	And <i>they're</i> like, it's better than yours 

As you can see, the HTML is escaped. Not ideal, right? If you know you can trust the data, you can use the `v-html` directive:

```html
<template>
  <div>
    <span v-html="message"></span>
  </div>
</template>
```

This will return what you expect. Cool! But... it's very black and white. You either escape all HTML or allow all HTML. What if you want something in between? This is where [vue-sanitize](https://www.npmjs.com/package/vue-sanitize) comes in. Not only will it allow you to use a whitelist of "safe" HTML tags, it will remove disallowed tags rather than escaping them. 

Using it is pretty simple and covered in the docs. Add the NPM package, and once done, you can then add it to your Vue.js code. From what I can see there's no support for "script tag Vue", so you'll need to have a proper Vue application. 

Outside of that, there's only one main API, `this.$sanitize(someVariable)`. This will return a string with unsafe HTML tags removed. You still need to use `v-html` to render the safe HTML of course. 

The docs don't mention the defaults, but as the library wraps another library, [sanitize-html](https://github.com/apostrophecms/sanitize-html), you can check *their* docs for the defaults:

<img src="https://static.raymondcamden.com/images/2019/11/sani.png" alt="List of defaults options" class="imgborder imgcenter">

Let me demonstrate an example before I show how you can customize the defaults. First, my main.js, which just loads in the library.

```js
import Vue from "vue";
import App from "./App.vue";

import VueSanitize from "vue-sanitize";

Vue.use(VueSanitize);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
```

And now my test:

```html
<template>
  <div>
    Escaped: {% raw %}{{ message }}{% endraw %}
    <p/>
    <span v-html="message"></span>
    <hr/>
    <span v-html="cleanMessage"></span>
  </div>
</template>

<script>

export default {
  name: "App",
  data() {
    return {
      message:`
        My <strong>milkshake</strong> brings all the boys to the yard<br/>
        And <i>they're</i> like, it's better than yours
      `
    }    
  },
  computed:{
    cleanMessage() {
      return this.$sanitize(this.message);
    }
  }
};
</script>
```

So I begin with two simple tests related to what I said before - the default behavior in Vue and the use of `v-html`. I don't use the sanitize code until `cleanMessage`. I've got that bound to a computed value that returns the sanitized version. The output is:

<img src="https://static.raymondcamden.com/images/2019/11/sani2.png" alt="Output with sanitized" class="imgborder imgcenter">

In this case, there's no difference between the built-in version and the sanitize version. I only used three simple HTML tags. Let's see what happens when we change the defaults. 

In order to change the defaults, you create your own object containing the defaults you would like. The main [sanitize-html](https://github.com/apostrophecms/sanitize-html#readme) site has some good examples on how to slightly modify the built in defaults. For my testing, I wanted to allow everything the defaults allowed, *except* for the `<strong>` tag. This is how I did it.

```js
import Vue from "vue";
import App from "./App.vue";

import VueSanitize from "vue-sanitize";

let defaults = VueSanitize.defaults;

defaults.allowedTags = defaults.allowedTags.filter(t => {
  return t !== 'strong';
});

Vue.use(VueSanitize,defaults);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");

```

Basically - loop through the array of `allowedTags` and remove when the tag name is `strong`. It's easier if you just want to define a short list of tags you want - just pass an array of strings. 

The result is as you expect:

<img src="https://static.raymondcamden.com/images/2019/11/sani3.png" alt="Now the output shows strong removed" class="imgborder imgcenter">

Notice though that the `<strong>` tag wasn't escaped, it was removed. That's much better than escaping it (typically). I could see this being really useful for allowing all the format tags but removing `<a>` for example. (And `<iframe>` and probably other's I've forgotten.) 

Anyway, I hope this is helpful. I've got a CodeSandbox with this running and you can play with it below.

<iframe
     src="https://codesandbox.io/embed/vue-template-025et?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Vue Sanitize Example"
     allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
     sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
   ></iframe>

<i>Header photo by <a href="https://unsplash.com/@4themorningshoot?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Oliver Hale</a> on Unsplash</i>