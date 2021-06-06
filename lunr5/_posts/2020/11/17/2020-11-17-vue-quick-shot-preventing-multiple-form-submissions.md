---
layout: post
title: "Vue Quick Shot - Preventing Multiple Form Submissions"
date: "2020-11-17"
categories: ["javascript"]
tags: ["vuejs","vue quick shot"]
banner_image: /images/banners/tip.jpg
permalink: /2020/11/17/vue-quick-shot-preventing-multiple-form-submissions
description: How to use prevent users from submitting a form twice
---

Good morning! Before I begin, a quick note. I was about to write this post yesterday when I discovered that it was actually very close to another one I wrote a few months back, which was my very first [Vue Quick Shot](https://www.raymondcamden.com/tags/vue+quick+shot) - ["Vue Quick Shot - Disabling a Submit Button While Waiting for an Ajax Call"](https://www.raymondcamden.com/2020/03/02/vue-quick-shot-disabling-a-submit-button-while-waiting-for-an-ajax-call).

In that post, I describe how to modify a form that performs a network call to an API such that you can't submit the request until the first request is done. Today's post is very similar. I was inspired by a post earlier this week on the topic, ["HTML Forms: How (and Why) to Prevent Double Form Submissions"](https://www.bram.us/2020/11/04/preventing-double-form-submissions/). 

In today's post, the difference is rather slight. Instead of a form used to collect data before making an Ajax call, it's going to be a "regular" form that just posts to an action, leaving the current page completely. The solution is incredibly similar, but as it's my blog I figure I'm allowed to do that. ;)

I also want to point out that if this is the *only* thing you're doing on a page, Vue's going to be overkill. Just use vanilla JS instead (and see my note at the end). But if you're already using Vue,perhaps for some complex client-side validation, then the following tip will help. 

I started off building a [Pipedream workflow](https://pipedream.com/@raymondcamden/slow-html-form-test-p_LQCq6z/edit) that merely outputs HTML after a four second wait. This You can test this yourself if you view it yourself: <https://enz7ceue7sb4c7j.m.pipedream.net>. I'm not doing any form validation or handling, I'm just waiting four seconds and responding. 

I then built a simple form:

```html
<form action="https://enz7ceue7sb4c7j.m.pipedream.net/" method="post">
  <label for="name">Name:</label>
  <input type="text" name="name" id="name">
  <input type="submit">
</form>
```

And then I submitting the form, clicking rapidly to send multiple requests. Pipedream records executions of workflows, and I could see multiple firing at once:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/11/pd1.png" alt="List of multiple executions" class="lazyload imgborder imgcenter">
</p>

So let's fix it! Again, I want to stress that if this is the only thing you're doing on a page, Vue is going to be overkill. First, I modified the HTML a bit:

```html
<div id="app" v-cloak>
  
  <form action="https://enz7ceue7sb4c7j.m.pipedream.net/" method="post" @submit="setSubmitting">
    <label for="name">Name:</label>
    <input type="text" name="name" id="name">
    <input type="submit" :disabled="submitting">
  </form>
  
</div>
```

I've got a `submit` handler on the form and my submit button has a `disabled` property tied to a variable. And then here's the simple Vue.js code:

```js
const app = new Vue({
  el:'#app',
  data:{
    submitting:false
  },
  methods: {
    setSubmitting() { 
      this.submitting = true; 
    }
  }
})
```

Yeah, pretty trivial. But effective. Test it out here:

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="html,result" data-user="cfjedimaster" data-slug-hash="QWEoBpX" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Block Multiple Submission">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/QWEoBpX">
  Block Multiple Submission</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>