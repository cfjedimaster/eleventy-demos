---
layout: post
title: "Adding an Absolutely Positioned Header to Reveal.js"
date: "2014-04-01T11:04:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2014/04/01/Adding-an-Absolutely-Positioned-Header-to-Revealjs
guid: 5190
---

<p>
I'm a big fan of <a href="http://lab.hakim.se/reveal-js/">reveal.js</a>. It is a lightweight HTML-based presentation framework that just works well for me. I switched over to it a while ago and enjoy working with it. Every now and then though I run into an issue that is a bit hard to handle with it. Yesterday I was working on my <a href="http://www.cfobjective.com">cfObjective</a> presentation and created the slide you see below.
</p>
<!--more-->
<p>
<img src="https://static.raymondcamden.com/images/Leving_Up_at_JavaScript.png" />
</p>

<p>
As you can see, the most important part of the slide is covered by the header. This is unacceptable! Unfortunately, it is difficult to reposition the h1 (or h2) element within a Reveal.js slide. If you set the position to absolute and use 0/0 for top and left, you end up at the top left of the section element, not the top left of the screen. You can use negative values, but that felt wrong to me, and I was worried about what would happen on a smaller screen when I presented. 
</p>

<p>
I raised the issue on Twitter (where all important things should be discussed, am I right?) and <a href="http://iviewsource.com/">Rey Villalobos</a> (@planetoftheweb) came up with a good solution. He was ok with me sharing this on my blog, but note that any mistakes in the description are entirely <strike>his</strike>my fault.
</p>

<p>
First, you need to add an element to handle the header, but place it <strong>outside</strong> the div for your slides.
</p>

<pre><code class="language-markup">&lt;!-- In between the &lt;div=&quot;reveal&quot;&gt; and the &lt;div class=&quot;slides&quot;&gt;--&gt;
&lt;header style=&quot;position: absolute;top: 50px; left: 100px; z-index:500; font-size:100px;background-color: rgba(0,0,0,0.5)&quot;&gt;&lt;/header&gt;
&lt;!-- In between the &lt;div=&quot;reveal&quot;&gt; and the &lt;div class=&quot;slides&quot;&gt;--&gt;</code></pre>

<p>
(Note - those top and left values are a bit arbitrary. Ditto for the RGBA color.)
</p>

<p>
Then - for each slide - use CSS to specify the content for the element.
</p>

<pre><code class="language-markup">&lt;section data-state=&quot;header1&quot;&gt;
&lt;style&gt;.header1 header:after {% raw %}{ content: &quot;Header 1 Example&quot;; }{% endraw %}&lt;/style&gt;
&lt;p&gt;header1 example&lt;/p&gt;
&lt;/section&gt;</code></pre>

<p>
Note - when you add a state attribute to a slide in Reveal, the framework automatically applies the state name to the class of the div wrapping all the slides, which means it also impacts that earlier header. As soon as you leave that slide, the class is removed, which means the content dynamically added via CSS (you did know you could do that, right?) is also removed.
</p>

<p>
Here is the updated slide.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Leving_Up_at_JavaScript2.png" />
</p>

<p>
There is one small caveat to this post that I don't have an answer for yet (but check the comments, going to bug Rey until he can figure out a fix) - how to modify the position of the header so it is right aligned. You could probably just use a second DOM element (a div perhaps) but that seems wrong.
</p>