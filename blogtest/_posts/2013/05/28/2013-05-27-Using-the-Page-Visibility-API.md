---
layout: post
title: "Using the Page Visibility API"
date: "2013-05-28T10:05:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2013/05/28/Using-the-Page-Visibility-API
guid: 4945
---

A few weeks ago at MAX I had the pleasure of giving half a presentation with Greg Wilson on "Cutting Edge HTML". One of the APIs I demonstrated to the audience was the <a href="http://www.w3.org/TR/page-visibility/">Page Visibility API</a>. As you can probably guess, this is a basic API to let you know if your page is visible to the end user. It doesn't have complete support yet, but it is (yet again) another great example of something you can add to your code with relative ease to enhance the experience for your end users.
<!--more-->
So how well is it supported? The embed below comes from the excellent <a href="http://www.caniuse.com">CanIUse</a> and will be up to date no matter when you are reading this blog entry:

<iframe src="http://caniuse.com/pagevisibility/embed/" width="600" height="400"></iframe>

I think you could summarize this as "good desktop support, poor mobile". That being said, the API is simple to use and doesn't cause any harm to your code if the end user's browser doesn't support it. Let's consider a simple example.

In the script below, I've got an AJAX call being run every (approximately) 2 seconds to fetch a news feed from the server.

<script src="https://gist.github.com/cfjedimaster/5662957.js"></script>

I assume the code above is trivial enough to not really need any explanation, but if I'm wrong, just let me know in the comments. Now let's look at an updated version making use of the API.

<script src="https://gist.github.com/cfjedimaster/5662976.js"></script>

Let's tackle this bit by bit. First, note the use of the event handler in the document.ready block. The Page Visibility events are still prefixed so I built in support for the unprefixed, Chrome, and Mozilla versions. (Remember that IE supports this so in theory, I could add in the IE prefix too if necessary. I'd love it if someone could check to see if IE has this prefixed or not.) 

Speaking of prefixes, I built a function, isVisible, that wraps the checks to the document.hidden property. This is the main way we can tell if our document is visible. 

What about the active variable? Since we're dealing with AJAX calls and asynchronous crap, we've got a delicate situation. We may, or may not, have an ongoing AJAX call being fired when visibility changes. If we've gone from hidden to visible, but we had an existing AJAX call already, we don't want to fire one now. If we do have one active, the callback handler will handle scheduling the next call. In this way we ensure that we don't double up our AJAX calls or forget to start the process again. 

Be sure to check the <a href="http://www.w3.org/TR/page-visibility/">specification</a> I linked to above. They have an interesting demo as well. Instead of stopping their AJAX calls they simply slow them down. I can see both ways of handling this being effective.

You can demo this here: <a href="http://raymondcamden.com/demos/2013/may/28/crap.html">http://raymondcamden.com/demos/2013/may/28/crap.html</a>. If you want, you can also demo the pre-Page Visibility version here: <a href="http://raymondcamden.com/demos/2013/may/28/pre_crap.html">http://raymondcamden.com/demos/2013/may/28/pre_crap.html</a>

Pardon the file names. I'm not sure what I was thinking there.

There is only one real drawback to this API that I can think of. According to the specification, the browser should report as hidden when minimized. In my testing, this was not true. In fact, it doesn't report as hidden if you put another application in front. It only reported hidden when I switched to another tab. Again though, I figure this is better than nothing and the additional code (10 lines?) is trivial enough to make it worth your time. <b>EDIT:</b> FYI, Firefox <strong>does</strong> notice it when you minimize the application. Way to go, Firefox.

Later today (most likely tonight, I've got a big presentation this afternoon), I'm going to show another example of this using <a href="http://html.adobe.com/edge/animate/">Edge Animate</a>.