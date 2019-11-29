---
layout: post
title: "WebSocket example with keyword highlighting"
date: "2012-08-06T11:08:00+06:00"
categories: [coldfusion,html5,javascript]
tags: []
banner_image: 
permalink: /2012/08/06/WebSocket-example-with-keyword-highlighting
guid: 4695
---

In the keynote this morning at <a href="http://www.riacon.com">RIACon</a>, I talked about a few ColdFusion 10 technologies that I found especially interesting. I began with WebSockets. I've blogged about WebSockets and ColdFusion 10 many times already, but I built something interesting for the keynote that I'd like to share.
<!--more-->
I began with a simple chat application - the one I've demoed a few times before. 

<img src="https://static.raymondcamden.com/images/screenshot16.png" />

You can check out my earlier entries (or download the zip) if you want to see how this is built, but for the most part, it's simply shuttling simple text messages back and forth over the channel.

One of the features of this chat room is automatic HTML replacement. If you try to send &lt;b&gt;Foo&lt;/b&gt;, server-side code removes the HTML before the message is sent out to others. This is done using the beforePublish method of the CFC handler I have associated with the WebSocket. Here is a snippet of the code. 

message.chat=rereplace(message.chat, "<.*?>","","all");

I thought it would be cool if we could do something a bit more intelligent with this method. If we can remove HTML, we can also do other things with messages.

Imagine for a minute that our chat app is a help desk for ColdFusion users. What if we could automatically notice when someone asks about a ColdFusion tag or function?

I found a source of docs in HTML format (thanks Pete Freitag!) and saved a copy to my demo. In my Application startup I did a quick scan of the files and cached them in the Application scope. 

<script src="https://gist.github.com/3274961.js?file=gistfile1.cfm"></script>

The file names match the function/tag spec exactly so I can use the filename minus the extension as a simple key pointing to the actual file. (And on reflection, I really don't need to store the extension either!)

Once I have these functions and tags in memory, I can update beforePublish to check for these keywords:

<script src="https://gist.github.com/3274979.js?file=gistfile1.cfm"></script>

Essentially - split by word, see if the word exists as a ColdFusion function or tag, and if so, wrap it with some HTML I'll notice later. I make use of a data attribute to store the URL of the documentation page.

Back in my front end then it's trivial to use a bit of JavaScript to detect clicks on those links:

<script src="https://gist.github.com/3274986.js?file=gistfile1.js"></script>

To test this, head over to the demo (big button below) and try talking about cfsetting, or cfoutput, or any of the other ColdFusion tags and functions.

<a href="http://www.raymondcamden.com/demos/2012/aug/6/"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2012%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fwebsocket1%{% endraw %}2Ezip'>Download attached file.</a></p>