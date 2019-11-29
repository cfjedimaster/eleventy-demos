---
layout: post
title: "Reminder on File Inputs, JavaScript, and Read Access"
date: "2018-03-29"
categories: [javascript]
tags: []
banner_image: /images/banners/book.jpg
permalink: /2018/03/29/reminder-on-file-inputs-javascript-and-read-access
---

Let me begin by stating that what I'm covering today isn't actually new. It's stuff I've covered here before. But after a conversation with a reader via email I had to write up a quick test to confirm it myself. I don't believe this is a security issue, but I was kinda surprised and therefore I figured it was best to whip up a quick blog post.

Let's begin with some basics. I assume you know that JavaScript running in the browser does not have access to your file system. That's a really, *really* good thing. Chrome used to support a file system API (and it may still support it, but it's definitely deprecated) that gave you access to a sandboxed file system, but it certainly was not allowed to touch the user's main file system. Now that binary support in IndexedDB is well supported, there isn't really a need for *writing* files to the disk. 

However, JavaScript can *read* files that the user selects via an file type input field. You can see a simple demo of this below:

<p data-height="300" data-theme-id="0" data-slug-hash="ZxrqEz" data-default-tab="result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="File Read demo" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/ZxrqEz/">File Read demo</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Be sure to select a text file only, but you can also read binary data too. (The code would just need to adjust for it.) Also, I apologize for not using Vue. I feel bad. ;)

So here is where the interesting little tidbit came up. In one of my [earlier demos](https://www.raymondcamden.com/2014/04/14/MultiFile-Uploads-and-Multiple-Selects-Part-2/), I showed selecting images and getting previews. It also supported multiple selections. So you could pick one image. Then pick another. And so on. 

What that demo showed, and what didn't really click with me, is that **once a user selects a file, you have read access to it, even after they select another file.** As I said, I can see why that works, and it isn't a security issue per se. I mean, the user did select the file. But it kinda surprised me that after I cleared my selection, I could still read it. This CodePen demonstrates this, a bit poorly (I'll explain why in a second):

<p data-height="300" data-theme-id="0" data-slug-hash="MVrLNo" data-default-tab="jresult" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Testing multi file upload" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/MVrLNo/">Testing multi file upload</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

This demo lets you pick a file, then some more, then more (etc.), and finally upload them all to Postman. Postman doesn't seem to handle the result very well, but from what I can see in DevTools, all files are definitely being uploaded. 

I guess that's all I have to say about it. Is anyone else surprised or is it just me?

<i>Header photo by <a href="https://unsplash.com/photos/5bzMOpMTDRM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Kiwihug</a> on Unsplash</i>