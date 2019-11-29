---
layout: post
title: "Ask a Jedi: Different Session Timeouts"
date: "2005-12-16T13:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/16/Ask-a-Jedi-Different-Session-Timeouts
guid: 973
---

Alan asks an interesting question about sessions:

<blockquote>
Raymond, here's a follow up to the application.cfc deal.  If I have an extranet site and I want external users' sessions to time out, but I don't want internal users to time out, can I put a call to reset a session in the onSessionEnd() event for my internal users that will re-establish their session?
</blockquote>

So to be clear, you can call onSessionEnd() (and onApplicationEnd()) all you want, but it won't be a "real" end of session type action. As far as I know, there is no way to say, this user's session will expire in N minutes, and this user's session will expire in M minutes. I think you could address this with some custom coding. 

First off - I assume when the user logs on, you have some kind of marker for internal versus external users. Next - I'd add a marker that represents their last hit. So in onRequestStart you could do:

<code>
&lt;cfset session.lastHit = now()&gt;
</code>

Now you know the last time the user hit the site. So to handle extranet users and their smaller time frame, you would check the dateDiff from their last hit to now. If it is greater than the smaller time frame, you can log them out.

How do you log them out? That depends on your application. If you are using session.loggedin to mark a user as being authenticated, simply remove that variable. In theory, that should cover it. If your onSessionEnd does other stuff, like maybe log a file, you may want to abstract that to another method. Let's call it sessionCleanUp. Then both onSessionEnd, and your onRequestStart can call the same method when they need to.

I really feel like I'm not being clear here - but do folks get my drift? Have people had to deal with something like this before?