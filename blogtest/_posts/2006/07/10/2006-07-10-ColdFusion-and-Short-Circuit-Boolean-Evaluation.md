---
layout: post
title: "ColdFusion and Short Circuit Boolean Evaluation"
date: "2006-07-10T17:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/07/10/ColdFusion-and-Short-Circuit-Boolean-Evaluation
guid: 1389
---

So this is <i>very</i> old news, but I discovered recently that not everyone may know about this. ColdFusion uses short circuit boolean evaluation. Ok, so what in the heck does that mean? What it means is when ColdFusion is evaluating an expression, if it finds a way to end quicker, it will. So, in English, consider this statement:

<blockquote>
Johnny 5 is a robot and is alive.
</blockquote>
<!--more-->
If you wanted to check if that statement was true, and immediately discovered that Johnny 5 was actually a cucumber, you don't need to test the second half of the condition, right? Anything FALSE AND TRUE will equal FALSE. (I actually had an entire class on boolean logic in college. One of the few classes I actually use in my day to day job.) 

So let's look at a ColdFusion example. What if you wanted to check for the existence of a key inside a structure that is also inside a structure? Consider this code sample:

<pre><code class="language-markup">&lt;cfif structKeyExists(myscope, "mydata") and structKeyExists(myscope.mydata, "johnny5")&gt;
</code></pre>

Pay attention to the <b>second</b> half of the expression. If mydata was not a valid key in myscope, you would get an error, right? Well since ColdFusion uses short circuit boolean evaluation, it will never get to the second expression if the first one doesn't evaluate to true. This is handy as it saves us from quite a bit of typing. It also let me reference cheesy 80s robot movies in my blog which is always a good thing. Now I just need a way to get <a href="http://en.wikipedia.org/wiki/Maximillian_(robot)">Maximillian</a> into an entry.