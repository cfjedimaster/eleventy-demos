---
layout: post
title: "Ask a Jedi: Preventing logins from other machines"
date: "2010-11-05T10:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/11/05/Ask-a-Jedi-Preventing-logins-from-other-machines
guid: 4002
---

Brad Newman (any relation to Victor?) asks:
<p>
<blockquote>
I am working with a legacy app at the moment. The original developer sets most identities in the client scope in the application.cfm file. I need to make sure that clients are unable to login from separate locations and make sure that sessions are destroyed when the browser is closed. I am trying to create some tight security for users. Any suggestions about how I should go about this? Maybe I haven't dug around enough.
</blockquote>
<!--more-->
<p>
There are a couple of questions here and I'd like to start off by tackling the simplest. First - you mentioned storing in the client scope. I assume that was a mistake as any client based login would be a permanent login.  If I'm not mistaken, well then you definitely need to move to session variables. Let's assume that was just incorrectly worded though. The next easy question then is how to make the session close when the browser closes. This is trivial. You can simply Enable J2EE Sessions in your ColdFusion Administrator:

<p>

<img src="https://static.raymondcamden.com/images/screen39.png" />

<p>

Once enabled you will get the behavior you want. It bears repeating though that this won't technically end the session, but will rather give the user a new session when he opens his browser again. So with the easy ones out of the way, let's turn our focus to the more difficult question - preventing logins from separate locations...

<p>

The only way to determine a user's location (as far as I know) is to make use of cgi.remote_addr. This is the IP address of the request. It may be a proxy but it will most likely be unique for your users. You have a few options of how you could use it but here is one idea. When the user logs in you want to store their IP address. Storing the IP address on login means that the <b>next</b> time they login you can look at this again and compare. Now obviously that by itself isn't enough. You may login once on Monday and again on Friday halfway around the world. So you also need a time based marker as well. However - you can't simply mark the login time. If you login at 12:00PM you may actively use the site for hours. What you need instead is to mark the time for every request. Luckily there is a simple enough way to do this - make use of onRequestEnd. This adds a bit of overhead to your request, but you can also store another really useful piece of information - the page they are accessing as well. (Popular analytics tools like Google Analytics can give you reports on the last page your user's hit so this is a pretty important stat.) By recording the time of their last hit on every request, you can then check that on login. Based on your application's timeout (check your This scope settings in your Application.cfc, or if not there, the default Session timeout in the ColdFusion Administrator) you can simply see if an active session is still in place.

<p>

This is not perfect. I may use your site on my laptop, close up and get on my mobile device. You may want to consider simply <b>warning</b> your users. That's what GMail does and it seems to work well. You also want to ensure that if you have a logout process that you remove the lasttimehit value (or add a lastlogout value) so that a user could immediately logout and switch to another device.

<p>

So now that I've answered Brad's question - I'm curious to hear if anyone out there is doing anything like this and what their experience has been.