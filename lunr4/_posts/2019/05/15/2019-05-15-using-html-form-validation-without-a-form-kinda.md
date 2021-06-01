---
layout: post
title: "Using HTML Form Validation without a Form (Kinda)"
date: "2019-05-15"
categories: ["html5","javascript"]
tags: []
banner_image: /images/banners/typewriter.jpg
permalink: /2019/05/15/using-html-form-validation-without-a-form-kinda
description: Using HTML form validation purely (mostly) in JavaScript
---

This will be a quick one. I've been a *huge* fan of [HTML-based form validation](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation) for some time now. Even though it is far from perfect (and must always be coupled with server-side validation), I love the fact that it can catch errors early in the submission process and create a better experience for users. My first experience with server-side programming was writing Perl scripts to handle forms so anything that improves the process is pretty freaking important to me.

While thinking about *another* demo I wanted to write (and I sure as hell hope I wrote it down in Trello because I'm drawing a blank on it now) I realized that I'd need to validate some email addresses. While I was fine with a "not perfect" solution, I was curious if there was some way to tie into the browser's email validation when using:

```html
<input type="email" name="forUsToSpamYou" required />
```

Basically, I wanted the exact same validation as the field provides, but without using user input and a real form. Turns out you can, and it's rather easy, but you still have to use a form.

First, I added a field, and then hid it with CSS, because CSS is awesome like that:

```html
<input type="email" id="testEmail">

<style>
#testEmail {
  display: none;
}
</style>
```

I then create a set of data. This is hard coded, but imagine it comes from some other process.

```js
let tests = [
  "foo@foo.com",
  "foo",
  "goo@goo.com",
  "zoo"
];
```

Then to test these values, I just got a reference to the field, set the value, and ran `checkValiditity` on it:

```js
let emailField = document.querySelector("#testEmail");

tests.forEach(t => {
  emailField.value = t;
  console.log(t, emailField.checkValidity());
});
```

According to MDN, `checkValidity` does this: "Returns true if the element's value has no validity problems; false otherwise. If the element is invalid, this method also causes an invalid event at the element."

And here is the result, modified to write out results to a div tag:

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="ZNBjYJ" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="js check field">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/ZNBjYJ/">
  js check field</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

To be clear, this is *not* meant to be perfect email validation. Every time I blog about anything related to the topic, folks point out the 500 edge cases that break it. Again, I'm just looking for something to do more of a "soft" validation on the input. And as I said, I was curious if I could "chain" into the HTML logic without using a real (visible) form. Has anyone used anything like this in production? Let me know in a comment please!

### Round Two!

I wrote this blog post last night, but didn't actually promote it online. I was planning on doing that today. But after I posted, all around smart guy [Šime Vidas](https://twitter.com/simevidas) posted a great tip in the comments below. I keep forgetting you can create HTML elements in JavaScript. He modified my code such that there is *no* HTML form field and no CSS required and you simply create the field in JavaScript like so:

```js
let emailField = document.createElement('input');
emailField.type = 'email';
```

Here's his CodePen:

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="simevidas" data-slug-hash="JqWWzo" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="js check field">
  <span>See the Pen <a href="https://codepen.io/simevidas/pen/JqWWzo/">
  js check field</a> by Šime Vidas (<a href="https://codepen.io/simevidas">@simevidas</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Thanks Šime!


<i>Header photo by <a href="https://unsplash.com/photos/aGUndxz-VRw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Klaas</a> on Unsplash</i>