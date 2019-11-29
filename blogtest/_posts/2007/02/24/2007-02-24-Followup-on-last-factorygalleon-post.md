---
layout: post
title: "Followup on last factory/galleon post"
date: "2007-02-24T14:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/02/24/Followup-on-last-factorygalleon-post
guid: 1858
---

In my <a href="http://ray.camdenfamily.com/index.cfm/2007/2/22/Baby-steps-in-Factory-Land-right-over-the-edge-of-a-cliff">last post</a> on object factories, I talked about how my attempt to use an object factory for Galleon had led to infinite loop. More than one person told me to switch to ColdSpring and rethink my CFC setup in general (which I <b>agree</b> with), but at the same time I was curious as to why the factory didn't work when I expected it to. Rob Gonda (who had provided the original code) was able to figure out the issue.
<!--more-->
Let me quickly go over again the process I was using. This is a simplified version of what Galleon is doing and it will lead to demonstrating the bug. 

First off - the factory's general methodology is to make a CFC and return it to you. However, it is smart enough to create singletons. By that I mean the factory would cache the CFC in the variables so on the 2nd-N calls it would return the cached version.

So when Galleon was starting up, it did this:

<ol>
<li>Ask for Message.cfc.
<li>Factory would make a new instance and begin to set things inside it.
<li>One of those things was the Thread CFC.
<li>Thread CFC needs a copy of Message.cfc. It would ask the factory and a new one was made since back in step 1 the process never got finished.
<li>Loop until CPU goes ape-you-know-what.
</ol>

So the important thing to note is that because the <i>first</i> process (Ask for Message.cfc) never finished, when Thread asked for a new copy, it didn't load from the cache. That was the problem. 

If you take the above process and change it a bit...

<ol>
<li>Ask for Message.cfc.
<li>Factory would make a new instance and <b>place in cache</b>
<li>Begin to set things inside it.
<li>One of those things was the Thread CFC.
<li>Thread CFC needs a copy of Message.cfc. It would ask the factory and the cached one is returned.
</ol>

Like most bugs - now that I see it (thanks again Rob), it is so obvious I can't believe I missed it. I still need to rework Galleon's CFCs, but I can at least get the new release out. (Look for it tonight.)