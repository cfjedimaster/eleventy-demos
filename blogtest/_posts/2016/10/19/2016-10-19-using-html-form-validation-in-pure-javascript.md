---
layout: post
title: "Using HTML Form Validation in Pure JavaScript"
date: "2016-10-19T08:11:00-07:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2016/10/19/using-html-form-validation-in-pure-javascript
---

I'm a big fan of <a href="https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Data_form_validation">HTML form validation</a> because it replaces JavaScript code I've been writing for nearly twenty years. Unfortunately it still <a href="http://caniuse.com/#feat=form-validation">isn't supported</a> in Safari (don't get me started on Apple and their priorities when it comes to the web), but I love the idea of being able to do stuff in HTML itself. In fact, a site recently launched that demonstrates many examples of this: <a href="http://youmightnotneedjs.com/">You Might Not Need JavaScript</a>. If you haven't checked it out, definitely give it a read. It is a great example of how HTML, and CSS, can replace JavaScript snippets we've used over the years.

<!--more-->

So given all of that, this morning I thought of something that was exactly the *opposite* of moving from JavaScript to HTML. Can we use HTML-based form validation in a purely JavaScript form? Turns out you can (again, if the browser itself supports it). Given that you can dynamically create DOM items via <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement">createElement</a>, could you use that to add easy email validation in JavaScript? Looks like you can:

<pre><code class="language-javascript">
var element = document.createElement('input');
element.setAttribute('type','email');
element.value = 'foo@foo.com';
console.log(element.validity.valid);
</code></pre>

All this snippet does is create a virtual input element, set the type to email, and then sets a particular value. It then simply outputs the valid state. You can rewrite this into a simple function:

<pre><code class="language-javascript">
var elm;
function isValidEmail(s) {
  if(!elm) {
    elm = document.createElement('input');
    elm.setAttribute('type', 'email');
  }
  elm.value = s;
  return elm.validity.valid;
}

console.log(isValidEmail('foo'));
console.log(isValidEmail('goo@goo.com'));
console.log(isValidEmail('zoo'));
</code></pre>

I don't like the fact that I set a global variable, but I thought it was a nice way to cache the DOM element. If this were wrapped up in a module then I'd store it local to that. 

So again, it won't work in non-supported browsers, but it sure as heck is pretty simple, right? You could also use this to validate a URL and other values. Any comments on this approach?

You can run a JSBin of it here: https://jsbin.com/diqepa/edit?js,console