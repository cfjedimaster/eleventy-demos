---
layout: post
title: "Dynamically replacing Gists with raw content for jQuery Mobile"
date: "2012-04-14T13:04:00+06:00"
categories: [coldfusion,development,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2012/04/14/Dynamically-replacing-Gists-with-raw-content-for-jQuery-Mobile
guid: 4590
---

I've recently begun making uses of Gists to host my code blocks. I like the formatting - I like that folks can take the code and fork it - I just like it in general. Plus, all the cool kids are using it so why shouldn't I? However, I realized yesterday that the Gist embeds were not working on my <a href="http://www.raymondcamden.com/mobile">mobile</a> site. Why? Let's look at a simple example and it will soon make sense.

<p>

Consider the following simple jQuery Mobile page:

<script src="https://gist.github.com/2385587.js?file=test.html"></script>

It's a one page template with an embedded Gist as well. Notice the two links at the bottom. If we open this up it will work just fine. Your browser sees the script tag and executes it. You can test this yourself here (but don't try the buttons just yet):

<p>

<a href="http://www.raymondcamden.com/demos/2012/apr/14/test.cfm">http://www.raymondcamden.com/demos/2012/apr/14/test.cfm</a>

<p>

Now - let's look at the first page, the one I called testa.cfm. This page is "faking" dynamic content with some static text on top that is then output within our page. While I'm using ColdFusion to demonstrate that, please note this is not a ColdFusion issue. 

<script src="https://gist.github.com/2385615.js?file=testa.cfm"></script>

<p>

If you were to click the first button, you will see the page load, but no gist will show up:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip70.png" />

<p>

What happened? jQuery Mobile uses Ajax to load in your additional pages. When Ajax is used to load content and it includes a script block like that, it is <b>not</b> executed. This isn't jQuery Mobile issue - it's just how Ajax calls like are going to work. We could get around this by telling jQuery Mobile to not use Ajax for its link - that's super simple too: &lt;a href="something.html" data-ajax="false"&gt;. But that felt wrong to me. 

<p>

So I began thinking of a solution. First - I discovered that the Gist service has an API: <a href="http://developer.github.com/v3/gists/">Gists API</a>. This API allows you to fetch the raw content of a Gist along with other metadata. I now had a conundrum. Do something client-side or server-side? While I figured I could do it client-side, something told me it made sense to handle this on the server instead. It would let me have a server-wide cache and possibly do other manipulations to make the content more appropriate for a mobile platform. <b>I'm not sold on this needing to be server-side.</b> 

<p>

My solution then was rather simple. Given an input, we could use a regular expression to look for Gist embeds. For each we find, perform a HTTP call to the API to fetch the raw content and embed that into the document instead.

<p>

Obviously the additional HTTP call will be expensive. With that in mind I decided to employ caching. This is another good solution for the server as anyone who hits the page after the first user will also get the benefit of the cached version. This does - of course - mean that if the Gist is updated the cache will be stale. For simplicity's sake I'm just going to not worry about that now. 

<p>

Here is my solution. It's ColdFusion-based, but simple enough that anyone could rewrite this in PHP, Ruby, etc.

<script src="https://gist.github.com/2385721.js?file=replaceGistWithRaw.cfm"></script>

If we take it step by step, you can see the regex used to find gists. I then loop over them (backwards because it is possible a gist may include an example of a gist, this blog post does!) and do some simple replacements. If the raw data isn't cached, we perform a HTTP request and cache the result after processing the JSON. This <i>really</i> needs some try/catches though. Finally - we wrap the result in some pre tags (which you customize) and insert it into the original string. Here's an example of a jQuery Mobile page making use of this API.

<p>

<script src="https://gist.github.com/2385753.js?file=test2.cfm"></script>

You can test this by going back to my <a href="http://www.raymondcamden.com/demos/2012/apr/14/test.cfm">demo</a> and trying the "Good" demo.

<p>

Thoughts? As just an FYI, this is <b>not</b> being used on my mobile site yet. I'm hoping my readers provide some feedback to let me know how well this works (or doesn't).