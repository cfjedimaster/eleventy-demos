---
layout: post
title: "Quick Web Dev Tip Everyone Knows"
date: "2017-09-13T08:59:00-07:00"
categories: [development]
tags: []
banner_image: 
permalink: /2017/09/13/quick-web-dev-tip-everyone-knows
---

This is something that's been on my mind to write up for a few weeks now. It is *strongly* in the "I'm sure everyone knows this" category, but I've always felt like the things everyone knows are precisely the kind of things that everyone doesn't know. This particular tip may be a bit *too* obvious, but here goes.

Imagine you're working on something involving forms. Let's say a basic Ajax-based search where you take user input and on a button click, you load in remote data to render on screen. 

That isn't too difficult, but you may find yourself working a bit to get the layout just right, handle rendering the total number of results, and so forth.

While working on this, your flow may be like this:

* Figure out what you need to fix, change.
* Write some code.
* Reload the page.
* Type 'foo' and hit enter.
* Look at results and repeat.

You can automate that page reload thing if you want of course to make it a bit smoother, but you get the idea. Let's say that search field looks like so:

<pre><code class="language-markup">&lt;input type="search" id="search" placeholder="Search!"&gt;
</code></pre>

Ok, so here's my tip. You can save sometime by doing this:

<pre><code class="language-markup">&lt;input type="search" id="search" placeholder="Search!"
value="foo"
&gt;
</code></pre>

So... right now some people are probably shaking their heads and wondering why I even bothered to blog this. But even today I'll find myself doing a "write/reload/type/hit button/test" cycle for a few minutes before I remember I can set a default to speed things up a bit. I'll normally include line breaks as I did above to remind myself to remove it later. 

I know there's browser extensions that can also pre-fill forms, but this is quicker and simpler to set up.

So there ya go. I hope this helps.