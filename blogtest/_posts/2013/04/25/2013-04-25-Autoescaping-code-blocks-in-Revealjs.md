---
layout: post
title: "Auto-escaping code blocks in Reveal.js"
date: "2013-04-25T12:04:00+06:00"
categories: [development,html5]
tags: []
banner_image: 
permalink: /2013/04/25/Autoescaping-code-blocks-in-Revealjs
guid: 4919
---

Warning - this falls into the "Cool, but may not be a good idea category." I'm a huge fan of the <a href="https://github.com/hakimel/reveal.js/">Reveal.js</a> framework for HTML-based presentations and I've already posted a few of my utilities/tips/etc for making it work better (or at least better for me). One issue I've run into a few times lately is escaping HTML for code slides.
<!--more-->
Reveal.js has great support for code coloring (color coding?). Here's a quick screen shot of an example:
 
<img src="https://static.raymondcamden.com/images/Screenshot_4_25_13_10_20_AM.png" />

In general this works simple enough. Here is how a typical code slide would look.

<script src="https://gist.github.com/cfjedimaster/5460558.js"></script>

But if you want to include HTML in your slide then you run into a problem. As you might expect, your HTML will be rendered as, well, HTML, not source code. Typically this isn't a huge deal. Code samples are short and if you type fast, you can replace &lt; and &gt; in a few minutes, but after doing this a few times, and preparing to do some slides focused on HTML5 development, I thought there might be a cooler way.

By default, Reveal.js initializes itself immediately. I modified the code to do this after the DOMContentLoaded event and did some hacking:

<script src="https://gist.github.com/cfjedimaster/5460602.js"></script>

As you can see, I simply make use of querySelectorAll to find all of my code blocks. (I could make that selector a bit more precise.) I then simply grab the HTML, escape the &lt; and &gt; characters, and then update the innerHTML property.

Voila!

<img src="https://static.raymondcamden.com/images/Screenshot_4_25_13_10_28_AM.png" />