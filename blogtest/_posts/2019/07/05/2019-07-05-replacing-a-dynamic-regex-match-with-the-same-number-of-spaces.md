---
layout: post
title: "Replacing a Dynamic Regex Match with the Same Number of Spaces"
date: "2019-07-05"
categories: ["javascript"]
tags: ["javascript"]
banner_image: /images/banners/html.jpg
permalink: /2019/07/05/replacing-a-dynamic-regex-match-with-the-same-number-of-spaces
description: 
---

This post is 100% thanks to my friend [Peter Cooper](https://twitter.com/peterc). I couldn't find any solutions online (or I may have Googled poorly) so I wanted to write this up in case other folks have the same problem. Imagine you have a string of HTML and you want to remove the tags. An easy solution would be something like this:

```js
let s = `
<p>
This is Ray and I'm <i>very</i> cool. I sometimes am <b><i>super</i></b> cool!
</p>
<code>
this is bad code!
and lots and lots
</code>
<ul>
<li>more</li>
<li>more</li>
</ul>
`.trim();

// replace all html
s = s.replace(/<.*?>/g,'');
console.log(s);
```

This works perfectly well, but my situation was a bit different. I needed to pass the result of this to a tool that reported on misspellings. When it did, it would report on line numbers and columns. With my initial solution, the string no longer had text in the same spaces as it did before. It was close, but in a large file the differences became worse towards the end.

So my question how - given a regex that is dynamic in size (`<.*?>`), was there a way to replace with space characters of the same length? 

When I searched for a solution, my focus was on a regex expression of some sort that could help. Turned out the answer was simple. As Peter pointed out, the [replace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter) function lets you specify a substring for the replacement or a function. This function is passed the matched string (along with other arguments) so you can easily check the length and return the right number of spaces. Here's an example:

```js
s = s.replace(/<.*?>/g,function(match) {
  return " ".repeat(match.length);
});
```

Peter's solution was actually a bit more concise. I love arrow functions, but when teaching, I still like to show the "old" way first. I still remember when arrow function syntax confused the heck out of me:

```js
s = s.replace(/<.*?>/g, _=> ' '.repeat(_.length) );
```

You can test this in the CodePen below. 

<p class="codepen" data-height="355" data-theme-id="0" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="mZGEVo" style="height: 350px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="replace code and html (1)">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/mZGEVo/">
  replace code and html (1)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Anyway, that's it, and I hope this helps! Also take this as my one millionth time reminding my readers that the [MDN Web Docs](https://developer.mozilla.org/en-US/) are the best damn resource on the Internet.

<i>Header photo by <a href="https://unsplash.com/@rxspawn?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Florian Olivo</a> on Unsplash</i>