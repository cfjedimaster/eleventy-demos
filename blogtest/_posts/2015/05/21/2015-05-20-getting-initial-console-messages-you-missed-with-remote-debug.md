---
layout: post
title: "Getting initial console messages you missed with remote debug"
date: "2015-05-21T10:09:18+06:00"
categories: [development,mobile]
tags: [cordova]
banner_image: 
permalink: /2015/05/21/getting-initial-console-messages-you-missed-with-remote-debug
guid: 6195
---

This falls in the "I'm sure it is obvious and no one will find it useful" category, but typically those <i>are</i> the posts that end up being useful so here goes nothing. Imagine you are using remote debugging (and if you don't know how, here are two articles - <a href="http://css.dzone.com/articles/overview-mobile-debugging">Part One</a> and <a href="http://css.dzone.com/articles/overview-mobile-debugging-2?mz=27249-mobile">Part Two</a>) and have a few console messages that appear early in the app cycle. For example:

<!--more-->

<pre><code class="language-javascript">console.log("in the beginning there was the console...");
document.addEventListener("deviceready", init, false);</code></pre>

If you send this to your device, or even the simulator, and then pop open your remote debugger, you'll not see the console message as it has already been passed. There's a quick way around this. In the iOS Web Inspector, click on "Resources", and then the reload button:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/blog1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/blog1.png" alt="blog1" width="800" height="517" class="aligncenter size-full wp-image-6196" /></a>

Then, obviously, switch back to the console:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/blog2.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/blog2.png" alt="blog2" width="800" height="517" class="aligncenter size-full wp-image-6197" /></a>

Yeah, lame, but as I tend to spend most of my time in the console and network tabs, I kinda forget about the DOM areas and this is something useful. You could get the same effect perhaps by using something like window.location.reload() (and I'm typing that from memory so I'm probably wrong), but clicking twice is a bit faster for me.

In case your curious, Chrome does <i>not</i> have this issue, so it really isn't a concern. Also, <a href="https://www.genuitec.com/products/gapdebug/">GapDebug</a> will also have this issue too. While GapDebug will save you from having to reopen the darn Safari debug window again (that by itself makes GapDebug useful as heck), you will still miss early console messages.