---
layout: post
title: "Suggestions for learning JSON?"
date: "2015-01-29T16:34:54+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2015/01/29/suggestions-for-learning-json
guid: 5603
---

Yesterday a reader asked me a question about one of my blog posts. In the blog post, I described a Cordova application that would retrieve a list of URLs from a server. It would then fetch each URL and download the resource to the device. I casually described the data as "an array of URLs in JSON" and assumed everyone would know what that meant. Of course, not everyone <i>does</i> know what JSON means.
<!--more-->

It got me thinking about how someone would learn more about JSON and become more familiar with it. You can start over at <a href="http://www.json.org/">json.org</a> for a formal definition, but I found the Wikipedia page, specifically the syntax example <a href="http://en.wikipedia.org/wiki/JSON#Data_types.2C_syntax_and_example">here</a>, to be a bit simpler to digest.

At it's heart, JSON is a string format that can represent data. Just like XML, it can take abstract data structures and represent them in a string format that can be sent over the wire. That makes it specifically well suited for APIs. JavaScript has native support for working with it as do loads of other languages (including ColdFusion). Compared to XML, JSON is <i>much</i> slimmer and just as easy to read. 

JSON represents simple values, like strings and numbers, just as they are, so "ray" in JSON is... "ray", and 6 is 6.

Arrays are represented by using brackets and a comma between each item: ["ray", 6, "i am not a number", "etc"]

Objects (ColdFusion folks - think structures) are represented by curly brackets. Each name/value pair is represented by name, colon, value. So: {% raw %}{ name:"Ray", age:41, gender:"awesome"}{% endraw %}.

Working with JSON in JavaScript is relatively trivial. If you use jQuery to make an XHR request then you can simply tell jQuery that a URL returns JSON and you've get a native JavaScript object to work with. Modern browsers also ship with support to create JSON (stringify) and read it (parse). You can read more about that at the excellent MDN docs: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON">JSON</a>.

Knowing the function that creates JSON, a nice way to play with it is to open your browser console and just try a few things out. 

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/01/My_Yahoo.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/01/My_Yahoo.png" alt="My_Yahoo" width="1234" height="318" class="alignnone size-full wp-image-5604" /></a>

Any other suggestions? On a whim, I asked on Twitter how folks learned or were introduced to JSON. I got some fun responses (and hopefully this works, the preview doesn't show replies, but they should be showing up):

<blockquote class="twitter-tweet" data-conversation="none" lang="en"><p><a href="https://twitter.com/raymondcamden">@raymondcamden</a> Coming from JavaScript, when I first saw JSON, I was like, “Oh, it’s JavaScript” :) Which, it’s not. But, made if familiar.</p>&mdash; Ben Nadel (@BenNadel) <a href="https://twitter.com/BenNadel/status/560835592653512705">January 29, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-conversation="none" lang="en"><p><a href="https://twitter.com/raymondcamden">@raymondcamden</a> first heard about JSON at CF meetup in Phx <a href="https://twitter.com/nathanstrutz">@nathanstrutz</a> (I think). Took some time for comfort, just over time with use.</p>&mdash; Brandon Moser (@brandonmoser) <a href="https://twitter.com/brandonmoser/status/560836966199996416">January 29, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-conversation="none" lang="en"><p><a href="https://twitter.com/raymondcamden">@raymondcamden</a> same as <a href="https://twitter.com/BenNadel">@bennadel</a>. Came from a Javascript bg, so it was easy to understand the structure. JSON looks close to js ojects.</p>&mdash; Sean Thompson (@ImSeanThompson) <a href="https://twitter.com/ImSeanThompson/status/560837844365631489">January 29, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-conversation="none" lang="en"><p><a href="https://twitter.com/raymondcamden">@raymondcamden</a> When it was added to the Adobe runtimes, of course ;)</p>&mdash; Joseph Labrecque (@JosephLabrecque) <a href="https://twitter.com/JosephLabrecque/status/560843325133955072">January 29, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-conversation="none" lang="en"><p><a href="https://twitter.com/raymondcamden">@raymondcamden</a> I adopted JSON shortly after learning of it. It just made sense to xfer data in similar syntax to the objects I was coding.</p>&mdash; Eric Leonard (@TheHeretical) <a href="https://twitter.com/TheHeretical/status/560854804902453248">January 29, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-conversation="none" lang="en"><p><a href="https://twitter.com/raymondcamden">@raymondcamden</a> Learned about JSON from REST interfaces. Loved it right away for its terseness and ease of use.</p>&mdash; Robert Munn (@robertdmunn) <a href="https://twitter.com/robertdmunn/status/560864659377754113">January 29, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-conversation="none" lang="en"><p><a href="https://twitter.com/raymondcamden">@raymondcamden</a> RE: JSON, I was working with a new API and it was like love at first sight. So much easier and faster than XML</p>&mdash; Jon Clausen (@jclausen) <a href="https://twitter.com/jclausen/status/560867317714649089">January 29, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>