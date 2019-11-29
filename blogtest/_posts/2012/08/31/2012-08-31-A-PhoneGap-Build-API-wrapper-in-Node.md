---
layout: post
title: "A PhoneGap Build API wrapper in Node"
date: "2012-08-31T12:08:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2012/08/31/A-PhoneGap-Build-API-wrapper-in-Node
guid: 4720
---

Yesterday I worked on a PhoneGap Build API wrapper for Node. This already exists - <a href="https://github.com/germallon/phonegapbuildapi">https://github.com/germallon/phonegapbuildapi</a> - but I thought it would be a fun experiment. The <a href="https://build.phonegap.com/docs/api">Build API</a> is <i>real</i> simple so I assumed my code would also be pretty simple. It was... at first.
<!--more-->
I began by working on the Read portions of the API. This allows for things like getting apps, icons, downloads, etc. PhoneGap allows you to request a token or pass the authentication information in every hit. I took the easy way out and simply passed the auth with each request. I was able to wrap up most of the logic for all of the API calls with two utility functions:

<script src="https://gist.github.com/3554735.js?file=gistfile1.js"></script>

The core function here is doCall, which expects a path to the API. All the API calls share the same base URL, so I made it simpler by just passing the additional part needed. HTTP calls in Node are a bit more complex than CF because they are asynchronous, but not difficult. You can probably guess what is going on here. I open a request which gets a result object. The result object has a data event which means crap streamed in. I append it to a variable. There is an end event which fires - you guessed it - at the end. I can then just parse the result and fire off a success handler.

So as an example, here is the API to get all apps:

<script src="https://gist.github.com/3554840.js?file=gistfile1.js"></script>

And finally, here is how a Node app could make use of it:

<script src="https://gist.github.com/3554854.js?file=gistfile1.js"></script>

Most of the code I wrote for the read API follows this format - ask for crap and pass a success/fail handler. 

So - as I said - this was all pretty simple. I think I burned through the Read API in about 30 minutes or so. It was Unicorns and Rainbows fun all around. Then I began to work on the Write API and hit a brick wall. Why? The Write API, or rather the part I was working on - creating apps - allows you to upload files when defining the new application. You can also point new apps at a repository but I wanted to work on the file version first. (Call me a glutton for punishment - I knew it would be trouble.) Turns out that uploading files is a <b>major pain in the rear</b>. As in - there is no real built in support in the core Node.js libraries. Googling was really difficult as well since almost every result was about <i>processing</i> a file upload, not <i>making</i> a file upload request. 

After even more furious Googling (and a quick Diablo 3 break), I found this <a href="http://onteria.wordpress.com/2011/05/30/multipartform-data-uploads-using-node-js-and-http-request/">post</a>. I'd love to actually name the guy or gal - but his About page doesn't actually say who he or she is. Therefore I've decided this person is...

<img src="https://static.raymondcamden.com/images/5028859259_81bcfb811b.jpg" />

... just because s/he/it was so damn helpful. I incorporated some of his logic into my final code, and while I'm not terribly happy with the mashup, it is working correctly. Here's an example of the call:

<script src="https://gist.github.com/3555039.js?file=gistfile1.js"></script>

And here it is up on the shiny new PhoneGap Build site...

<img src="https://static.raymondcamden.com/images/ScreenClip115.png" />

Interestingly - browsers have made file uploads in JavaScript much easier with XHR2. If you haven't seen this in action, check out the excellent <a href="http://www.html5rocks.com/en/tutorials/file/xhr2/">HTML5 Rocks</a> article on it.

For folks who want to play with this, I've included the entire pgbuild.js code below. Remember - I've been writing Node.js for about a week - so if you use this in production you have my admiration. 

<script src="https://gist.github.com/3555134.js?file=pgbuild.js"></script>