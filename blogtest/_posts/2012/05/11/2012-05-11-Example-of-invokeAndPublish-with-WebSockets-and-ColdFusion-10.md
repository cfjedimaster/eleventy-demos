---
layout: post
title: "Example of invokeAndPublish with WebSockets and ColdFusion 10"
date: "2012-05-11T15:05:00+06:00"
categories: [coldfusion,html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2012/05/11/Example-of-invokeAndPublish-with-WebSockets-and-ColdFusion-10
guid: 4615
---

While preparing for my <a href="http://www.raymondcamden.com/index.cfm/2012/5/9/Recording-slides-and-code-from-my-WebSockets-presentation">presentation</a> earlier this week on WebSockets and ColdFusion 10, I ran into an issue trying to wrap my head around one of the features: invokeAndPublish. The docs describe it like so:
<!--more-->
<blockquote>
Invokes a specified method in a CFC file to generate the message that has to be published. Used in scenarios where you have raw data (that needs to be processed) to create a message.
</blockquote>

They then go on to discuss the JavaScript-side of the feature but not the ColdFusion feature. I couldn't quite get what was going on here until I built a simple demo. Now - it makes sense. 

As described above - you would use invokeAndPublish when you need ColdFusion to manipulate the message data. Remember, WebSockets are not just for simple messages. You can easily send more complex data as well. (And I'm hoping to do some blog posts showing this soon.) So imagine for a moment you need something that JavaScript can't do (or can't do quickly) that is trivial in ColdFusion. You can use invokeAndPublish to run your CFC method and have it generate the result to the other listeners  on the WebSocket. Let's look at a somewhat trivial example of this.

First - I've got my Application.cfc that sets up my recognized WebSocket channels. If you didn't attend my presentation, or haven't read the docs yet, this is simply how we enumerate what channels are available to be used.

<script src="https://gist.github.com/2661583.js?file=gistfile1.cfm"></script>

There are a few things in here I want you to ignore for right now so for now - let's carry on. Next up is our front end. This is an incredibly simple chat type application. You enter text - it gets broadcast - and when messages come in they get printed to screen. That's it.

<script src="https://gist.github.com/2661637.js?file=gistfile1.cfm"></script>

You can demo this now here: <a href="http://fivetag-cf10beta.securecb1cf10.ezhostingserver.com/websocketmay11/">http://fivetag-cf10beta.securecb1cf10.ezhostingserver.com/websocketmay11/</a>

Ok - so what about invokeAndPublish? This is a method on the JavaScript object. It takes 5 arguments:

<ul>
<li>The websocket channel.
<li>CFC name. <b>This is dot notation and NOT a relative path. This is crucial!</b> Remember in my Application.cfc where I made a root CF mapping? I did that because I have to use a mapping to refer to my CFC. So imagine I want to hit chat.cfc in the same folder. Instead of simply using "chat", which the docs seem to imply would work, I must use "root.chat". 
<li>CFC method. 
<li>Array of arguments for the CFC. Not a structure, but an array. You will want to ensure you nicely list out your arguments in the method. This is optional.
<li>A structure of custom headers. Almost all your WebSocket operations allow for custom headers. This can include a selector as well as anything else you want to send along the wire.
</ul>

The other <b>very critical</b> thing you want to know is that the CFC is cached. Hence the "URL hook" in my Application.cfc file to handle reloads. Every time you work on the CFC file you will want to reload the application. 

Let's consider a simple example where we want to use ColdFusion to count the length of a string. Yes - you can easily do this in JavaScript. I built a CFC that has a method to accept a string and return the length plus the original string:

<script src="https://gist.github.com/2661698.js?file=gistfile1.cfm"></script>

Nothing too crazy there, right? One things the docs don't make clear is that your CFC should return the value. You don't use wsPublish. Anything you return from the CFC is broadcast like a regular message. (And to be clear, you can also return complex values here.) On the front end, the change is minimal:

<script src="https://gist.github.com/2661726.js?file=gistfile1.cfm"></script>

A grand total of one line changed. Instead of myWS.publish() I've got myWS.invokeAndPublish. My code that listens for responses didn't need to change. Basically, all we've done is said, "Hey, I need ColdFusion to quickly modify stuff before the rest of the world gets it." 

You can demo this version by hitting the big ole demo button below. Hope this helps!

<a href="http://fivetag-cf10beta.securecb1cf10.ezhostingserver.com/websocketmay11/index2.cfm"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>