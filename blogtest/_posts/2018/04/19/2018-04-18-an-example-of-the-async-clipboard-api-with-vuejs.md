---
layout: post
title: "An Example of the Async Clipboard API with Vue.js"
date: "2018-04-19"
categories: [javascript]
tags: [vuejs]
banner_image: /images/banners/clipboard.jpg
permalink: /2018/04/19/an-example-of-the-async-clipboard-api-with-vuejs
---

A few days ago Google shipped Chrome 66 and one of the new features enabled in that version was the [Async Clipboard API](https://www.w3.org/TR/clipboard-apis/#async-clipboard-api). As you can guess, this provides access to the user's clipboard (both read and write) and is surprisingly easy to use. 

You can read a good introduction to the API here, [Unblocking Clipboard Access](https://developers.google.com/web/updates/2018/03/clipboardapi), but don't do what I did and stop reading as soon as you see the code. The example looks really simple:

```js
navigator.clipboard.writeText('Text to be copied')
  .then(() => {
    console.log('Text copied to clipboard');
  })
  .catch(err => {
    // This can happen if the user denies clipboard permissions:
    console.error('Could not copy text: ', err);
  });
```

That's writing to the clipboard in case it isn't obvious. When I tried this code it failed and the error was very vague ("Undefined"). Reading more on the article above, you'll see this is actually documented:

<blockquote>
As with many new APIs, navigator.clipboard is only supported for pages served over HTTPS. To help prevent abuse, clipboard access is only allowed when a page is the active tab.
</blockquote>

And then a bit later...

<blockquote>
Since Chrome only allows clipboard access when a page is the current active tab, you'll find some of the examples here don't run quite right if pasted directly into DevTools, since DevTools itself is the active tab.
</blockquote>

I feel bad missing that, but it's not like this is the first time I saw code and stopped reading so I could play with it right away.

So - want to see an example using Vue.js? Of course you do! Imagine a scenario where we have generated a code for our user. We want to make it easier to use so when we can, we'll provide a button to copy it into their clipboard. First, the HTML:

```markup
<div id="app" v-cloak>
  Your cool code:
  <input v-model="code">
  <button v-if="supportsCB" @click="copy">Copy</button>
  <div v-if="message">{% raw %}{{message}}{% endraw %}</div>
</div>
```

Make note of the button. It's checking a property to see if it should show up. Now let's look at the JavaScript.

```js
const app = new Vue({
  el:'#app',
  data() {
    return {
      code:'vueIsBetterThanPBJ',
      supportsCB:false,
      message:''
    }
  },
  created() {
    if(navigator.clipboard) {
      this.supportsCB = true;
    }
  },
  methods:{
    copy() {
      navigator.clipboard.writeText(this.code)
        .then(() => {
          console.log('Text is on the clipboard.');
          this.message = 'Code copied to clipboard.';
        })
      .catch(e => {
        console.error(e);
        this.message = 'Sorry, unable to copy to clipboard.'
      });    
    }
  }
})
```

I begin by using the `created` hook to see if  `navigator.clipboard` exists. If so, I then enable the button by setting the `supportsCB` property to true. Note that I could make this a bit more secure by checking with the permissions API as well. 

Next - I define my `copy` method using the `writeText` call. When done, either successfully or with a failure, I edit a message to let the user know. That may be overkill, but I figured a confirmation would be nice. You can play with this below, but obviously you'll want to use Chrome 66.

<p data-height="265" data-theme-id="0" data-slug-hash="JvjpYp" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="vue async clipboard" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/JvjpYp/">vue async clipboard</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>  

<i>Header photo by <a href="https://unsplash.com/photos/hVDXjKmDVJc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">rawpixel.com</a> on Unsplash</i>