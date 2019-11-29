---
layout: post
title: "Is it ever appropriate to hide an async process behind a sync one?"
date: "2016-05-13T05:46:00-07:00"
categories: [development]
tags: []
banner_image: /images/banners/question.jpg
permalink: /2016/05/13/is-it-ever-appropriate-to-hide-an-async-process-behind-a-sync-one
---

So this is something I'd consider posting to [StackOverflow](http://www.stackoverflow.com), but it feels like it may not be 100% appropriate for SO and as we know, if you ask something not appropriate, you get knocked down pretty quickly. While this is a technical question, it is also an *opinion* one as well, so I'm not sure. I figure if I'm not sure, I might as well just ask here and not worry about the SO Overlords approving of my question. I approve, and that's all that matters. ;)

<!--more-->

Ok, so let me start with some background. Almost two years ago I created a simple Cordova app that demonstrated writing to a file: [Cordova Example: Writing to a file](https://www.raymondcamden.com/2014/11/05/Cordova-Example-Writing-to-a-file/). I won't repeat all of that code here, but this is the simple utility function I wrote to support a basic logging system.

<pre><code class="language-javascript">
function writeLog(str) {
    if(!logOb) return;
    var log = str + " [" + (new Date()) + "]\n";
    console.log("going to log "+log);
    logOb.createWriter(function(fileWriter) {
        
        fileWriter.seek(fileWriter.length);
        
        var blob = new Blob([log], {% raw %}{type:'text/plain'}{% endraw %});
        fileWriter.write(blob);
        console.log("ok, in theory i worked");
    }, fail);
}
</code></pre>

<code>logOb</code> is a File object made on startup. This method simply takes input, like "Button clicked", prefixes it with a timestamp and then writes it to the end of a file. Notice, and this is crucial, it has no result. It just does its work and ends. To me, that's appropriate for a logging system, you don't really care when it finished.

Until you do...

Back on that earlier post, someone noticed an issue when they did:

<pre><code class="language-javascript">
writeLog("actionOne fired 00000");
writeLog("actionOne fired AAAAA");
writeLog("actionOne fired BBBBB");
</code></pre>

Basically only one or two items were being appended. Looking at the code now, it is pretty obvious why. Since the logic is async, the multiple calls to it firing at the same time mean the file object is being manipulated by multiple calls at the same time, leading to random, unreliable results.

So the fix is easy, right? Add a callback to <code>writeLog</code> or perhaps a Promise (shiny). Then it is the user's responsibility to ensure they never fire call #2 till call #1 is done. Maybe something like this:

<pre><code class="language-javascript">
writeLog('msg').then(function() {
	writeLog('msg2');
}).then(function() {
	writeLog('msg3');
});
</code></pre>

That's not too bad, but here's where my question comes in. What if we made <code>writeLog</code> (and pretend for a moment that I have it in a module) more intelligent so it simple queued up writes? So in other words, if I did N calls, it would simply handle storing the 2-N calls in an array and processing them one by until done. I'd essentially hide the async nature from the caller.

Now everything about me says that smells wrong, but on the other hand, I'm curious. Is there ever a time where you would think this is appropriate? Certainly for a logging system it seems ok. At worse I send 100K calls to it and the app dies before it can finish, but in theory, we could live with that.

Thoughts?