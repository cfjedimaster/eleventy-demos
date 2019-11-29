---
layout: post
title: "Interesting Model-Glue \"Feature\" to watch out for"
date: "2007-03-28T00:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/03/27/Interesting-ModelGlue-Feature-to-watch-out-for
guid: 1925
---

So I ran into an odd issue with Model-Glue a few weeks ago and forgot to blog about it at the time. Luckily the issue cropped up today in training. First, let me ask you what you think the following code would do in your controller:

<code>
var theval = arguments.event.getValue("dharma");
var thevalagain = arguments.event.getValue("dharma","blackrock");
</code>

Assuming dharma did not exist, I thought the result would be: 

(empty string)<br />
blackrock

By default the getValue method of the event object returns an empty string if the value didn't exist. If you specify a value to use for the default it will return that instead. So in simpler terms, the code block above should work like so:

<blockquote>
Ray: Model-Glue, grab me the value for dharma.

Model-Glue: It doesn't exist, Ray, old buddy, so I'll give you a blank string.

Ray: Model-Glue, I know I just asked for dharma, but would you mind getting it again, and if it doesn't exist, return 'blackrock'. Thanks my good man, I appreciate it it.

Model-Glue: Well, Ray, it still doesn't exist, so I'll return 'blackrock' to you.

Ray: Thanks. We really need to do lunch some time. Say hi to Marge and the kids.
</blockquote>

Unfortunately that <b>isn't</b> what happens. Instead, Model-Glue will <b>set</b> the default value to the event if it doesn't exist. So I get this back instead:

(empty string)<br />
(empty string)

Why? Because behind the scenes, this is what really is going on:


<blockquote>
Ray: Model-Glue, grab me the value for dharma.

Model-Glue: It doesn't exist, Ray, old buddy, so I'll give you a blank string since you didn't specify a default. I'm also going to add dharma to the event object with that default. I do this because of my unending respect and love for my developers.

Ray: Model-Glue, I know I just asked for dharma, but would you mind getting it again, and if it doesn't exist, return 'blackrock'. Thanks my good man, I appreciate it it.

Model-Glue: Well, Ray, it does actually exist now. You asked for it before and since I didn't have it, I created a default value for it of an empty string.

Ray: Thanks. We really need to do lunch some time. Say hi to Marge and the kids.
</blockquote>

So I don't know about you - but that was totally unexpected. To me, a "get" shouldn't set anything. It should just fetch. However, if you look at the docs...

<blockquote>
Default (optional) - If the value does not exist, a default value to set into the viewstate and then return
</blockquote>

Ok, so it's documented. But did you expect it to work that way? But wait - it gets better. Do the same code with the viewState object in a view and it works as I expected it!

<code>
&lt;cfset x = viewState.getValue("dharma")&gt;
&lt;cfset x2 = viewState.getValue("dharma","blackrock")&gt;
</code>

But the docs for the viewState.getValue match what you see for the Event object. Bug!