---
layout: post
title: "Quick Hack for Reveal.js Presentations"
date: "2021-01-29"
categories: ["development"]
tags: []
banner_image: /images/banners/projector.jpg
permalink: /2021/01/29/quick-hack-for-revealjs-presentations
description: How to modify your speaker notes in Reveal.js for readability
---

I go back and forth between creating presentations in PowerPoint and [Reveal.js](https://revealjs.com/). Both have features I really like a lot, but as I'm primarily talking about web development, I tend to prefer Reveal.js as it isn't quite as jarring to go from slide to code/demonstration as it is when PowerPoint is displaying. 

Like PowerPoint, Reveal.js has a "notes" feature that lets you add notes to individual slides. I use this a lot as I tend to write less text on my slide and rely on the fact that - hello - I'm talking and my slide should only support my talk, not be a replacement for the awesomeness that is my speaking ability. (I'm kidding by the way.)

In Reveal.js, slide notes are written in an `aside` tag that is hidden from view in the presentation. Here's a real example from the talk I just gave.

```html
<section>
<h2>Demo</h2>
<p>
<a href="https://github.com/cfjedimaster/eleventy_algolia" target="_new">github.com/cfjedimaster/eleventy_algolia</a><br/>
<a href="https://eleventyalgolia.netlify.app/" target="_new">eleventyalgolia.netlify.app/</a>
</p>
<aside class="notes">
This is my particular solution using Netlify and algolia-indexing
go to eleventy_algolia 
show that its a blog
.functions/deploy-succeeded
</aside>
</section>
```

Note that in the notes above, I used line breaks to seperate each "part" of my note. Mentally I read that as a timeline to go along with the current slide. 

When giving a Reveal.js presentation, you can open up the speaker view in another window by just hitting the `S` key. Here's how that slide looks.

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/r1.jpg" alt="Speaker view for Reveal.js" class="lazyload imgborder imgcenter">
</p>

It may be a bit hard to see in the screen shot above, so here's another one focused on the lower right side panel:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/r2.jpg" alt="Zoom in on speaker notes" class="lazyload imgborder imgcenter">
</p>

Notice what happened? My notes are all on one line. If you think about it, that makes sense. Reveal.js is HTML based and while I treated the notes area like I would have in PowerPoint, it's still HTML, which means a line break is meaningless outside a `pre` tag. 

I could easily fix that by adding some `br` tags, but honestly, when I'm in the "flow" of working on a good presentation, I don't want to have to worry about that. That's one thing PowerPoint does really well - as a slide authoring environment it's incredible. 

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/typing.gif" alt="Real picture of Ray typing" class="lazyload imgborder imgcenter">
<figcaption>Real picture of Raymond working on a presentation.</figcaption>
</p>

Since I knew I couldn't rely on me remembering to include proper HTML, I turned to the solution every developer turns to when they want to <strike>break</strike>"enhance" HTML - JavaScript! I added this quick snippet right before I initialize Reveal.js:

```js
let notes = document.querySelectorAll('aside.notes');
notes.forEach(n => {
	let html = n.innerHTML;
	html = html.trim().replace(/\n/g, '<br/>');
	n.innerHTML = html;
});
```

This could be done in one line but I'm not currently doing a technical code test so why bother pretending. The result is a slighly better view:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/01/r3.jpg" alt="Notes with line breaks" class="lazyload imgborder imgcenter">
</p>

There's probably a nicer way of doing this, but it works for me! 

<span>Photo by <a href="https://unsplash.com/@alexlitvin?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Alex Litvin</a> on <a href="https://unsplash.com/s/photos/presentation?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>