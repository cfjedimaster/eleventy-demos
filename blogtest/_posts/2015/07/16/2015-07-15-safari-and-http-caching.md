---
layout: post
title: "Safari and HTTP Caching"
date: "2015-07-16T09:38:36+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2015/07/16/safari-and-http-caching
guid: 6410
---

Well, this was a weird one. Yesterday I was working on a project where I made multiple requests to the <a href="https://randomuser.me/">Random User API</a>. It worked perfectly in Chrome, and Android, but in Safari, I noticed something odd. Even though I made multiple requests, every result was the same, not unique. Here is a simplified version of what I built.

<!--more-->

<pre><code class="language-javascript">
for(var i=0;i&lt;10;i++) {

	$.ajax({
	  url: 'http://api.randomuser.me/',
	  dataType: 'json',
	  success: function(data){
	    console.log(JSON.stringify(data.results[0].user.name));
	  }
	});

}</code></pre>

My code was somewhat more complex (it had Angular, Promises, even kittens thrown in), but this gives you the basic idea. Running this in Chrome I get what I'd expect, 10 random users in the console:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot14.png" alt="shot1" width="393" height="193" class="aligncenter size-full wp-image-6411 imgborder" />

And ten requests in the Network panel:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot21.png" alt="shot2" width="700" height="319" class="aligncenter size-full wp-image-6412 imgbordder" />

So far so good. However, in Safari (well, Mobile Safari at first, but today I tested in Safari), something odd happened. Instead of ten random users, I got the same one again and again. (And before someone asks, no, it isn't the for loop or anything like that.)

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot3.png" alt="shot3" width="700" height="228" class="aligncenter size-full wp-image-6413 imgborder" />

Naturally I thought - ok - Safari is caching the response. But here is what threw me for a loop. I went into the Timelines panel, turned on Recording, and this is what I saw:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot4.png" alt="shot4" width="700" height="224" class="aligncenter size-full wp-image-6414 imgborder" />

Looking at this, you can see Safari made one network request, which I suppose makes sense, but here is what ticks me off. Nowhere in this panel is <strong>any</strong> indication that it simply ignored my Ajax calls and used a cache result.

To be clear, I'm <i>totally</i> fine with Safari ignoring my request to an API that is random and deciding it knew better and should cache. Fine. What upsets me is that the dev tools do zero to let the developer know what's going on here. It should report the other 9 requests and flag them as being from a cache or some such. I guess I'll go file a bug report for this (no, I <strong>will</strong>, because that's the right thing to do), but damn was this frustrating.

For folks curious, I simply added "?safaricanbiteme="+Math.random() to the URL - just like I used to do for older IE.