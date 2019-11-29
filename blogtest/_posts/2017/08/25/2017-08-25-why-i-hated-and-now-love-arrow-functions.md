---
layout: post
title: "Why I Hated (and Now Love) Arrow Functions"
date: "2017-08-25T07:18:00-07:00"
categories: [javascript]
tags: [javascript]
banner_image: /images/banners/arrow_functions.jpg
permalink: /2017/08/25/why-i-hated-and-now-love-arrow-functions
---

Earlier this week I gave a presentation (I'll share the links for that in a post later today) about the changing nature of JavaScript and as part of that, I quickly mentioned a few modern features that I really dig. One of them was arrow functions. A follower on Twitter asked if I could spend a bit more time on them so I thought I'd whip up a quick blog post. Let me start though with why I absolutely hated them.

Arrow functions have two main aspects. First, they are a new way of writing functions. Secondly, they handle "This" scope issues. The later is something I was fully behind. If you've ever seen `that.x = this.x`, then you'll recognize the issue. (And I'll share an example later.) The former though... filled me with deep and utter rage. Ok, I'm being a bit over the top, but at least to me, the syntax change in arrow functions was *so* radical that I had a mental block just trying to read them. It felt like one of those things developers do to be "cute"/"cool" without any real practical benefit. 

Let me share an example. 

<pre><code class="language-javascript">document.addEventListener('DOMContentLoaded', e => {
  console.log('dom loaded like a boss');
}, false);</code></pre>

If you've never seen an arrow function before, that can be near incomprehensible. I'd see code using this form and my brain would come to an immediate stop while it attempted to "rewrite" it in the old school form. In order to really appreciate them, I had to start writing them, and every time I used one, I felt more and more comfortable with it and appreciated the terseness. I said earlier it felt like it was being cute for no real reason, but now it feels as natural as array shorthand (x = [1,2,]). 

To understand arrow functions, let's consider an sample function and then rewrite it.

<pre><code class="language-javascript">function hello(name) {
	return "Hi, "+name;
}
</code></pre>

(As an aside, I normally use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals">template literals</a> when building strings in JavaScript now, but I don't want to put too much new syntax in a sample at once.) The code sample above defines a function named hello that takes one argument and has one line of body code. Remember that a function can also be defined like so:

<pre><code class="language-javascript">hello = function(name) {
	return "Hi, "+name;
}
</code></pre>

Ok, so the first thing you do when switching to an arrow function is dump the word function:

<pre><code class="language-javascript">hello = (name) {
	return "Hi, "+name;
}
</code></pre>

Next, you add the arrow. 

<pre><code class="language-javascript">hello = (name) => {
	return "Hi, "+name;
}
</code></pre>

And you're done. But arrow functions let you go even simpler. If you only have one argument, you can drop the parens:

<pre><code class="language-javascript">hello = name => {
	return "Hi, "+name;
}
</code></pre>

And if you only have one statement, you can remove the brackets:

<pre><code class="language-javascript">hello = name => "Hi, "+name;
</code></pre>

Notice I also removed the return. The execution of `"Hi, "+name` returns a string and a function will automatically return the last statement result. 

Remember though that the only *required* aspects of an arrow function are the removal of the word function and the addition of the arrow. If that last version looks too short to you, you can add the brackets back in. Also, maybe your function has one statement now but you're pretty confident it is going to grow. For example, you have a function that returns a boolean and for now you just want to return true. 

Here is an example of a function that takes two arguments - both before and after:

<pre><code class="language-javascript">
function greet(greeting, name) {
	return greeting + " " + name;
}

greet = (greeting, name) => greeting + " " + name;
</code></pre> 

Here is another example where the function is multiple lines:

<pre><code class="language-javascript">
function greet(greeting, name) {
	var tempString = greeting + " " + name;
	if(tempString.length > 50) tempString = tempString.substr(0,50);
	return tempString;
}

greet = (greeting, name) => {
	var tempString = greeting + " " + name;
	if(tempString.length > 50) tempString = tempString.substr(0,50);
	return tempString;
}
</code></pre> 

I'm also ignoring another modern feature, `let`, in the code above, because I don't want to put too much in front of you at once.

Arrow functions work really well, in my opinion, in call backs. The very first example I gave demonstrated this, but here it is again, along with the "old" version:

<pre><code class="language-javascript">
document.addEventListener('DOMContentLoaded', function(e) {
  console.log('dom loaded like a boss');
}, false);

document.addEventListener('DOMContentLoaded', e => {
  console.log('dom loaded like a boss');
}, false);
</code></pre>

It isn't a huge change, but it feels more compact, and since callbacks like this are littered everywhere in most JavaScript files, the shorter syntax really feels like a boon. 

The other benefit of arrow functions are how they correct issues with `this`. If you've ever written a call back and realized that this.something inside wasn't working correctly, this is something you'll appreciate. For an example, I'm going to "borrow" the one MDN uses (I'll be linking to it in a moment). Consider this code:

<pre><code class="language-javascript">function Person() {
  // The Person() constructor defines `this` as an instance of itself.
  this.age = 0;

  setInterval(function growUp() {
    this.age++;
  }, 1000);
}

var p = new Person();
</code></pre>

If you run this and inspect the value of `p`, you'll see that age never increases. That's because the `this` in the callback is it's own scope, not the one for the Person function. A common fix was to simply add `that = this` and refer to `that.age`. But that's smelly. Consider the arrow function version:

<pre><code class="language-javascript">function Person(){
  this.age = 0;

  setInterval(() => {
    this.age++; // {% raw %}|this|{% endraw %} properly refers to the person object
  }, 1000);
}

var p = new Person();
</code></pre>

Boom - just plain works. By the way, if the `(() => {` part confuses you, remember that the `()` portion is the argument list, which in this case is empty.

So yeah - I love these things now. I'll be honest - they still don't quite flow off the tongue (or off my fingers) as fast as "old school" functions, but they are getting more and more familiar to me. Alright, how about some resources?

* Once again, MDN has the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions">best documentation</a>.
* Next, check out Dr. Axel's post: <a href="http://2ality.com/2012/04/arrow-functions.html">ECMAScript 6: arrow functions and method definitions</a>. Note the age of that post - 2012. Yep, these may seem new, but they've been discussed for a while.
* Finally, read this great article by Eric Elliott - <a href="https://medium.com/javascript-scene/familiarity-bias-is-holding-you-back-its-time-to-embrace-arrow-functions-3d37e1a9bb75">Familiarity Bias is Holding You Back: It’s Time to Embrace Arrow Functions</a>

I'd love to hear from my readers. Are you using this yet? If so, what do you think, and if not, why?