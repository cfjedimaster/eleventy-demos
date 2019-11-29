---
layout: post
title: "Ask a Jedi: Two Application.cfc Questions"
date: "2005-09-19T17:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/19/Ask-a-Jedi-Two-Applicationcfc-Questions
guid: 788
---

Two questions today regarding Application.cfc. Here is the first one:

<blockquote>
From what I have read, it seems that CFC's should be unaware of APPLICATION and SESSION scopes unless passed as function arguments. But in all the Application.cfc. examples I have seen, people use APPLICATION, SESION, FORM, and REQUEST scopes without any of that jazz. Is Application.cfc an exception to the rule? Or is my best-practices understanding off base? Thanks!
</blockquote>

Here is a job for you. Join the <a href="http://www.cfczone.org/listserv.cfm">CFCZone mailing list</a> and ask about best practices. Let me know when you return sometime after Windows Vista ships. ;) All joking aside - there <i>are</i> some things that CFC developers tend to agree on. One of them is to <i>not</i> refer to any "outside" scope inside a CFC. This would include all the scopes you listed above, along with URL, SERVER, COOKIE (why are we in all caps again), and CGI. I agree with that. (Although like most rules it isn't 100% always right.) That being said, yes, Application.cfc is a special case. It is certainly ok to work with all of those scopes, and in fact, you probably will need to or you wouldn't even need the file. The entire point of the Application.cfc is to control your application, so it makes perfect sense that you would be working with the various scopes and how they interact with your application. Now let's go to the next question:

<blockquote>
What is the best way to manually/programmatically expire an Application.cfc based application and it's application scoped variables? I have an application that is set to to timeout after 1 hour, but the application scope variables never seem to expire. Is there something I am missing regarding the lifespan of an application?
</blockquote>

First off - as for why your application isn't timing out, I do not have a good answer on that. I'd suggest using the onApplicationEnd method and cflog to see if it really <i>is</i> ending and you just don't realize it. Another thing to look out for - in CFMX7 there is a bug where sessions will not expire unless you set the session timeout. The server default simply doesn't get applied. If you aren't specifying an application timeout, you may want to.

That being said, there is no built-in way to force an application to end, outside of restarting your ColdFusion server. What I typically do is build a "hook" in my onRequestStart function. If a URL variable is defined (like "reinit"), I'll call onApplicationStart directly. Here is an example:

<div class="code"><FONT COLOR=MAROON>&lt;cfif isDefined(<FONT COLOR=BLUE>"url.reinit"</FONT>)&gt;</FONT><br>
  <FONT COLOR=MAROON>&lt;cfset onApplicationStart()&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT></div>

There are some very important things you should note though. The "natural" onApplicationStart is threadsafe. This manual call is not. However, 99 times out of a 100, all my onApplicationStart does is set a bunch of application variables. I could care less if it was threadsafe or not. Also note that this will not restart any sessions. You basically only want to use this to reset Application variables. In fact, during development, I'll normally have code like so:

<div class="code"><FONT COLOR=MAROON>&lt;cfif isDefined(<FONT COLOR=BLUE>"url.reinit"</FONT>) or 1&gt;</FONT><br>
  <FONT COLOR=MAROON>&lt;cfset onApplicationStart()&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT></div>

This basically forces a restart on every request. It is a bit slow, but saves me from the trouble of having to force a restart.