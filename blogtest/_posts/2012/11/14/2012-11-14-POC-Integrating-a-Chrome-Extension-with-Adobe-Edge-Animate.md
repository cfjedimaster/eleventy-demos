---
layout: post
title: "POC: Integrating a Chrome Extension with Adobe Edge Animate"
date: "2012-11-14T15:11:00+06:00"
categories: [development,html5,javascript]
tags: []
banner_image: 
permalink: /2012/11/14/POC-Integrating-a-Chrome-Extension-with-Adobe-Edge-Animate
guid: 4782
---

I've been fascinated lately by <a href="http://html.adobe.com/edge/animate/">Edge Animate</a>. Not that I plan on creating awesome animations any time in the future but I love how easy the tool is and I'm fascinated by how I could integrate other client-side techniques along with it. (Or in other words, I like to pretend that in an alternate universe where I also have design skills, I can bring the awesome.)

I was thinking this week about a scenario where a designer has created an EA animation and is working on integrating it in a web site. They've done the basics (dropped it in an iframe) and want to do a bit of testing. At this point, they may not be able to make changes in the main tool anymore. What could I do to help them debug/test/etc within the confines of the browser?
<!--more-->
With that in mind, I decided to build a Chrome extension. My Chrome extension would:

<ul>
<li>Notice when an AE animation existed on the page.
<li>Activate an icon to let users know.
<li>Provide a popup that would enumerate AE animations and give basic controls.
</ul>

It took some serious mental wrangling to get it working, but I'm happy to say I've done it. The code is... oh hell, let's not beat around the bushes, the code is a mess. But it was fun to build and I think the final result is interesting. For those who don't care about writing Chrome extensions, you can stop reading after the video. (And I apologize for the slow start. I've got no problem presenting live, but when I record myself, I clam up almost immediately.)

<iframe width="560" height="315" src="http://www.youtube.com/embed/DB_TX9S4ss8" frameborder="0" allowfullscreen></iframe>

For those who want to test this, you can download the zip below. Note that you will need to enable developer options in your Chrome Extensions page and then use the 'load unpacked' option to include the folder. 

So - let's talk details. I ran into a few interesting challenges while writing this extension. The first involved <a href="http://developer.chrome.com/extensions/content_scripts.html">content scripts</a>. Content scripts are code your extension can inject into a page. Your code has access to the DOM, but no JavaScript variables. This is a "good thing" in most respects as it ensures your code won't conflict with the code on the pages. (As an example, you can name a function foo and it won't conflict with a function named foo in the page.) But this was a problem for me. In order to detect AE animations, I was looking for a JavaScript variable in the window scope called AdobeEdge.

To get around this, I used code to inject a file into the current page using the DOM. I found this trick, where else, at StackOverflow (<a href="http://stackoverflow.com/a/4854189/52160">link</a>) and it worked well.

But this created another problem. I needed this injected script to "talk" to my extension. Both to my content script and my background script. Why the background script? That's where you can modify the window icon (turn it on, set the title, etc). To enable this, I made use of <a href="https://developer.mozilla.org/en-US/docs/DOM/window.postMessage">window.postMessage</a>. This was my first time using the API and for the most part, it just worked, but it was a bit tricky to get it all right.

To make things even more interesting, the code in the popup can't talk to the window DOM either. It has to send a message to the background script which sends a message to the content script which sends a message to the injected code. Still with me? That means the basic act of "On the page I know window.foo() exists, so run it with arg 2" involves 4 (I think - things got a bit hairy there) different scripts communicating with each other.

To give you an idea, let's begin with a click handler in the popup, the one that tells EA to run an animation from the start:

<script src="https://gist.github.com/4074649.js?file=gistfile1.js"></script>

The popup has access to the background script via the BG variable. Now let's look at the corresponding code there...

<script src="https://gist.github.com/4074660.js?file=gistfile1.js"></script>

The background script needs to know which tab is active. From what I could tell, there wasn't a direct way of doing that outside of the query (with filter) as you see there. Once I find it, I use a Chrome Extension API to send a message to my content script...

<script src="https://gist.github.com/4074670.js?file=gistfile1.js"></script>

I kept a few of the non-related clauses in here.  You can see where I fire off a postMessage, which is picked up by code in inject.js:

<script src="https://gist.github.com/4074680.js?file=gistfile1.js"></script>

Fun times. Real. Fun. Times. Anyway, let me know what you think.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2012%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fedgeanimate%{% endraw %}2Ezip'>Download attached file.</a></p>