---
layout: post
title: "Ask a Jedi: Debugging Application.cfc Issues"
date: "2006-03-22T11:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/22/Ask-a-Jedi-Debugging-Applicationcfc-Issues
guid: 1162
---

Brian asks:

<blockquote>
I'm
trying to use the onSessionEnd function within my Application.cfc.  I have
followed all the rules and syntax but cannot get it to work properly.  I've read
numerous threads, blogs, tutorials, etc.  When using the object test method I
receive this error...

&quot;Element APPSCOPE.USERDATA.ID is undefined in
ARGUMENTS&quot;

userData is a session structure I use throughout a user's
&quot;session&quot;.  What I want to do is save any changes to this data
(particularly a logout timestamp) when the user times out or closes the browser
window without actually logging out.  As for the latter, I realize I need to be
using J2EE sessions.

Any ideas?
</blockquote>

Welcome to the wonderful world of non-interactive debugging. By that I mean since the onSessionEnd event fires on the server only, and not in your browser, it is a real pain in the rear to debug. What I recommend in this case is a very slow, and very simple approach.

First off - do nothing, yes nothing, in your onSessionEnd. Be anal and ensure that a empty method isn't throwing an error. Of course it won't, but as I said, you want to take it slow. Once you confirm that is running ok, the safest thing to do is inspect the session data passed in. I'd first try this (and this assumes you named the session scope sessionScope):

<code>
&lt;cflog file="myapp" output="The keys in the session scope are: #structKeyList(arguments.sessionScope)#"&gt;
</code>

If you see userData, than repeat this for arguments.sessionScope.userData.

By the way Brian, I noticed you said "appData". In my <a href="http://ray.camdenfamily.com/downloads/app.pdf">Application.cfc</a> reference data, notice that both the Application and Session scope are passed in to onSessionEnd. Are you using the right argument? It sounds like you are examining the application data, and not the session data. Again, the structKeyList will help you debug this.