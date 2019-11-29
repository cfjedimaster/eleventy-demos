---
layout: post
title: "Examples of authentication and ColdFusion 10 WebSockets"
date: "2012-06-01T17:06:00+06:00"
categories: [coldfusion,html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2012/06/01/Examples-of-authentication-and-ColdFusion-10-WebSockets
guid: 4638
---

I've blogged quite a bit about ColdFusion 10 WebSockets, but one topic I haven't touched on yet is authentication. I want to be clear that authentication is one part of a "security process" (does that sound overly dramatic?) in terms of your entire application. I've already blogged about how you need to lock down your WebSocket broadcasts and what you can to secure messages. This post then will focus on just the authentication aspect.
<!--more-->
You have two main options to build in authentication with your ColdFusion WebSocket applications.

The first option is via JavaScript and onWSAuthenticate, a new Application.cfc method. You would use this option if you want your users to login via JavaScript. In other words, they are on your site already, not logged in, and you only care about their identify when they are going to use your WebSockets.

The second option, called "Single Sign On", simply means that you can connect your WebSocket code to an existing login. However - this doesn't work with any old session-based login system. You must be using the ColdFusion "cflogin" feature.

This blog post will focus on the first of these - onWSAuthenticate.

<h2>onWSAuthenticate</h2>

Using onWSAuthenticate is a two step process. First, you have to write JavaScript code to handle the authenticate call. You will pass a username and password. On the server side, you will use onWSAuthenticate as a method of the Application.cfc file along with a CFC handler. This is passed the username and password obviously, but also a connectionInfo structure that you will modify in order to accept or block the login attempt. Let's look at some code.

<script src="https://gist.github.com/2855142.js?file=index.cfm"></script>

There's a lot going on here - so let's tackle it from the bottom up. You can see - as the very last line - my cfwebsocket tag. I'm defining a name for my JavaScript handle and a message handler, but I'm not automatically subscribing to anything. 

I've got two divs. This was my simple way of having two states in the application. The first one, called stepone, is loaded on startup and contains a login form. (Note that it also allows you to select subchannels, but that's not relevant to this blog entry.) 

When you login, I grab the values out of the fields and pass them to the authenticate method of the JavaScript object. This is what will call our server-side code, but let's hold on a minute.

As I've described before, the message handler for WebSockets end up getting <i>everything</i>. This means you must write code in there to handle multiple situations. In my code you will support the subscribe event, the response to authentication, and general chat. Note specifically the code handling authentication results. If it failed (code == -1), we alert the user and give them a hint. If it succeeded, we subscribe them. 

Now lets switch to the server-side, specifically, my Application.cfc.

<script src="https://gist.github.com/2855181.js?file=Application.cfc"></script>

Most of the code here is boilerplate, but pay attention to the new onWSAuthenticate. In order to log a user in, you must edit one particular key of the connectionInfo structure: authenticated. Note that - like other WebSocket calls, we can also place ad hoc data in the structure. My logic puts "starwars" in for all users and an admin key for one particular user. To be clear - that part is totally optional and is just there as a demonstration. The critical part is setting authenticated to true.

Ok... are we done yet? Nope. There is one super critical aspect to this setup that is not quite covered in the docs. If I go into my console and try to send a message, I'll be able to. Why? Because the message handler doesn't check for authentication. We need to lock down both the <b>allowSubscribe</b> event and the <b>allowPublish</b>. You may be wondering - why do I have to worry about allowPublish? You can actually publish an event without subscribing. Subscribing simply means, "I want to hear what you have to say", whereas publishing is you shouting into the channel (so to speak). Let's now look at my handler.

<script src="https://gist.github.com/2855212.js?file=newsHandler.cfc"></script>

As I mentioned above, the two important methods here are allowSubscribe and allowPublish. In each we check the relevant structure and respond accordingly. Previously I thought allowSubscribe was all I needed, but, like all good script kiddies, I did some testing in allowPublish and discovered that this was a hole in my understanding.

<strike>Unfortunately - I don't have a demo of this up yet (slight misconfiguration of my server), but you can download all of the above code below.</strike> You can now test this yourself here: <a href="http://raymondcamden.com/demos/2012/jun/1/">http://raymondcamden.com/demos/2012/jun/1/</a><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2012%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fexample7%{% endraw %}2Ezip'>Download attached file.</a></p>