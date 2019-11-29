---
layout: post
title: "Using jQuery to conditionally load requests"
date: "2012-04-05T16:04:00+06:00"
categories: [development,javascript,jquery]
tags: []
banner_image: 
permalink: /2012/04/05/Using-jQuery-to-conditionally-load-requests
guid: 4582
---

Here's an interesting question - what if you wanted to fetch a resource using Ajax, let's say a large zip file - but you only wanted to do it if the zip has been updated since the user last requested it. How would you do that?
<!--more-->
<p>

I've been using jQuery for my Ajax applications for years now, and while I've used both $.get and $.post a bit, I only use the real engine behind it, $.ajax, every now and then. Both $.get and $.post are easy to use, but they also hide you from a lot of the cooler options the lower-level function provides you. One of them is the ability to use different HTTP verbs. Now this support is limited to what your browser itself can handle, but any modern browser should be able to perform a HTTP HEAD request.

<p>

You can think of a HEAD request as a "trial" for a real request. You get all the proper response bodies from the request but none of the actual data. It's like ordering from Amazon and just getting an empty package. We can use this feature to ask the server when the file was last updated. Combining this with localStorage on the client side, we can use a few lines of code to support only getting the resource when it's been updated. Here's the example I built.

<p>

<script src="https://gist.github.com/2313466.js"></script>

<p>

The code begins with a simple variable representing my test resource. In this case it's a large 25 meg zip file. I begin by checking to see if I have a value in localStorage called "resourcemodified." If I do, I then use $.ajax to perform the HEAD request. In the success function I can ask for the Last-Modified header and compare it. If the value is different, I then call a function named getResource(). If the localStorage value didn't exist at all, we do the same.

<p>

getResource also uses $.ajax, but instead makes use of a GET request. In its success method we store the Last-Modified header so that our future requests can check it. (Note that in this example I'm not actually doing anything with the file.)

<p>

Here's a look at the Network tool in Chrome when I first run my code:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip67.png" />

<p>

And here is the next request:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip68.png" />

<p>

As you can see, we don't do the second request since we recognize that the file hasn't changed. If I modify the value (here is a <a href="http://stackoverflow.com/questions/51435/windows-version-of-the-unix-touch-command">great tip</a> on how to do "touch" in Windows) and rerun my page, it recognizes the change and fetches the file.

<p>

If you are like me (a bit slow ;), you may be confused by the Size value in the HEAD request. I couldn't understand why it was so large when it should be just getting the headers. After <a href="https://plus.google.com/115106614688778962135/posts/UKRamt7saKU">asking</a> for clarification on Google+, Jason Dean and Matthew Turland clued me in to the fact that this is perfectly normal. Essentially, it is the server saying, "If you had done a <b>real</b> request dude, this is how big it would be." Using the Amazon analogy above, it would be an empty box of the right size and marked weight... just empty. 

<p>

So - useful? I think so - especially for something I'll be sharing tomorrow. I'm also curious to see if this could be used to support <a href="http://www.petefreitag.com/item/236.cfm">If-Modified-Since</a> to reduce the network requests.