---
layout: post
title: "Ask a Jedi: Application.cfc, Application variables, and CFLOCK"
date: "2008-07-13T09:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/07/13/Ask-a-Jedi-Applicationcfc-Application-variables-and-CFLOCK
guid: 2930
---

I hope folks will forgive me for not talking about the iPhone again, but here is a good ColdFusion question from Mark:

<blockquote>
<p>
I'm a little confused about using CFLOCK in the Application.cfc file.  Is it needed when writing to Application variables and if so from which function (e.g.
onRequestStart)  Thanks.
</p>
</blockquote>
<!--more-->
Good question. When ColdFusion runs onApplicationStart, it runs it in a single-threaded manner. That means if you have code like this:

<code>
&lt;cfset application.startup = now()&gt;
</code>

You can rest assured that it will run once, and only once, on your applications first hit.

However, that is the only function that is single threaded for Applications. Every other function in your App.cfc file will not be. (Although onSessionStart is single threaded in terms of your session.) That means if you have some operation that modifies Application variables and if you need to ensure you have no race conditions, then you better use CFLOCK. Here are a few more things to consider.

ColdFusion does not provide a way to restart an application. You have to either restart the server or rename the application. Hopefully this is something that will be fixed in CF9. Most folks, though, just want to rerun onApplicationStart. So you will often see code like this in onRequestStart:

<code>
&lt;cfif structKeyExists(url, "reinit")&gt;
  &lt;cfset onApplicationStart()&gt;
&lt;/cfif&gt;
</code>

This lets me rerun the application startup code by just adding ?reinit=1 to the URL. The call will not be single threaded though, and that brings us to the second point.

Don't forget that you only have to care about locking for variables where it really matters. An application startup value is - most likely - not mission critical. If you were to reload the application and someone else did it at the same time, does it really matter if the application.startup is off by 1 second?

Next - if you do need to lock, don't forget that in onSessionEnd, you do not have "direct" access to the Application scope. ColdFusion passes the scope as an argument, and you can certainly modify it via the argument, but you can't do application.x = y. That becomes important when you lock. If you do need to lock your change, you must use a <b>named</b> lock, not a scope lock, within onSessionEnd. And if you use a named lock in one part of your code, than you must obviously use a named lock where you read/write it elsewhere.