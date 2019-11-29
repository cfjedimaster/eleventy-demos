---
layout: post
title: "Stop using jQuery!! (all the time...)"
date: "2012-10-23T10:10:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2012/10/23/Stop-using-jQuery-all-the-time
guid: 4765
---

I apologize for the link bait. I feel bad doing it. But - at least you know I'm not a slimy SEO person and there is something useful in this article. ;)

Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2012/10/22/Simple-POC--Dynamically-select-an-element-from-a-list-and-skip-the-last-chosen">blogged</a> a simple little POC (Proof of Concept) that demonstrated adding a class to a random list element. As I said in the post yesterday, this was rather trivial code, but I wanted to share it because of the use of LocalStorage.

About an hour or so after I posted it, something began to bug me. I opened up the template and looked at the Network requests in Chrome dev tools.
<!--more-->
<img src="https://static.raymondcamden.com/images/ScreenClip144.png" />

Just in case it isn't obvious, let me break it down for you. My HTML document was a bit over 1.5K. The jQuery library, compressed, was 33K. To be fair, my HTML was limited to what was required for the demo, but even if I increased the size of my document ten fold, it would still be less than the size of the jQuery library.

Don't get me wrong. I love jQuery. I <i>love</i> what it has done for my development, my career, and my skin care. (Um, ok.) That being said, you don't <i>need</i> jQuery as much as you think. Consider what my demo did:

<ul>
<li>Run a function when the DOM was loaded.
<li>Find some DOM items via CSS selectors.
<li>Remove a class from one thing, add it to another.
</ul>

That's it. Surely I could do that without an entire library, right? First, I switched to listening for the DOMContentLoaded event.

<script src="https://gist.github.com/3938884.js?file=gistfile1.js"></script>

For finding DOM items, I made use of <a href="https://developer.mozilla.org/en-US/docs/DOM/Document.querySelector">querySelector</a> and <a href="https://developer.mozilla.org/en-US/docs/DOM/Document.querySelectorAll">querySelectorAll</a>. 

<script src="https://gist.github.com/3938897.js?file=gistfile1.js"></script>

For adding and removing classes, I made use of the <a href="https://developer.mozilla.org/en-US/docs/DOM/element.classList">classList</a> property.

<script src="https://gist.github.com/3938904.js?file=gistfile1.js"></script>

After these changes, the size of my application was pretty much next to nothing.

<img src="https://static.raymondcamden.com/images/ScreenClip145.png" />

Here is the complete template. Any questions?

<script src="https://gist.github.com/3938913.js?file=gistfile1.html"></script>