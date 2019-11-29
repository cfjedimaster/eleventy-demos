---
layout: post
title: "Sharing ColdFusion WebSockets among different applications"
date: "2013-08-08T16:08:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2013/08/08/Sharing-ColdFusion-WebSockets-among-different-applications
guid: 5001
---

This question came in today and I thought it was pretty interesting:

<p/>

<blockquote>
<p>
We are building a family of applications (using Coldfusion and Coldbox), all of which run off the same database - for a client. I've also built a chat system (using coldfusion Websockets) for one of the apps. So, people logged on to that app can chat with one another. 
</p>
<p>
But we think it would be cool if the chat system could be extended across all the sister apps. That is, a person logged on to any one app could chat with a person logged on to another sister app. Since we define websocket channels at the application level, it seems channels cannot span across multiple applications (but that's what we want to achieve). 
</p>
</blockquote>
<!--more-->
<p/>

So, in case you don't quite get it, ColdFusion 10's websockets are specific to one application. Given a websocket channel named "chat" in application one, if you have one with the same name in application two they won't share messages.

<p/>

One of the first things I did was recommend Node.js. And no - I wasn't saying to give up ColdFusion. You can easily use Node.js services along side ColdFusion. If you were to set up a Node.js websocket server on - say - port 8888 - then your apps could all make use of it. (I first saw <a href="http://simb.net/">Simeon Bateman</a> demo this.)

<p/>

But outside of that - I suggested using a simple iframe. Dropping in an iframe would let you quickly include your chat application inside it. I built a quick demo of this. I created two apps (and by apps I mean one page with a dump of the Application scope) and then simply added an iframe to the chat app:

<p/>

<script src="https://gist.github.com/cfjedimaster/6187906.js"></script>

<p/>

The result is pretty much what you expect. As an FYI, my chat demo wasn't really built for an iframe. It could be improved.

<p/>

<img src="https://static.raymondcamden.com/images/Screenshot_8_8_13_2_35_PM.png" />

<p/>

So... there's that. But I was curious about doing something a bit more than chat. What if you wanted the iframe to communicate with the parent window? Turns out that's slightly complex due to browser security issues, but that may not impact you depending on your use case. (For <strong>the</strong> book on the topic, see <a href="http://www.raymondcamden.com/index.cfm/2013/6/23/Book-Review-ThirdParty-JavaScript">Third-Party JavaScript</a>.) 

<p/>

I began with a simple example where all apps were hosted on the same domain:

<p/>

foo.com/app1<br/>
foo.com/app2<br/>
foo.com/chat<br/>

<p/>

In that case, your chat app could communicate to the parent rather easily:

<p/>

if(window.parent.msgHook) window.parent.msgHook(message.data.chat);

<p/>

Where in app1 I may have:

<p/>

<script src="https://gist.github.com/cfjedimaster/6187961.js"></script>

<p/>

I'm not actually doing anything with the message, but you get the idea.

<p/>

Moving to different domains though gets tricky. Imagine you have these domains:

<p/>

x.foo.com<br/>
y.foo.com<br/>
chat.foo.com<br/>

<p/>

If you want x and y to be able to iframe the chat server and receive messages, you have to use something like <a href="https://developer.mozilla.org/en-US/docs/Web/API/window.postMessage">postMessage</a>. In compatible browsers, this lets you add event listeners for messages being broadcast from one iframe to a parent (or vice versa). 

<p/>

As an example, I added this bit of code in my app:

<p/>

<script src="https://gist.github.com/cfjedimaster/6187997.js"></script>

<p/>

And then my chat server broadcasted a message using postMessage. Note that I'm using * for the targetOrigin. I can make this more specific to my domains.

<p/>

window.parent.postMessage({% raw %}{"msg":"foo"}{% endraw %},"*");
 
<p/>

Make sense? I've included all 3 iterations of the app as an attachment to this entry.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2013%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fmultiappws%{% endraw %}2Ezip'>Download attached file.</a></p>