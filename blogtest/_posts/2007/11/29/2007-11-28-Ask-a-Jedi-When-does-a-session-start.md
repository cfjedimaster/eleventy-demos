---
layout: post
title: "Ask a Jedi: When does a session start?"
date: "2007-11-29T09:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/29/Ask-a-Jedi-When-does-a-session-start
guid: 2503
---

Darren asks:

<blockquote>
<p>
I want to use on sessionstart to initiate a session variable and then use that value in a function call to to set the default language for a site but I get an error saying the session var isn't there. Does the session start after the first request? Should I use on application start instead?
</p>
</blockquote>

No and no. onSessionStart will definitely fire before onRequestStart. Turns out - Darren had another problem. He had written his Application.cfc <i>without</i> the session variables in his onSessionStart, he had hit his site, and then he had modified the onSessionStart. Since his session had already started, the method didn't run again.

There are a few ways to get around this. One simple way is to quickly rename your Application. If you had:

<code>
&lt;cfset this.name="findparishiltonsdignitysite"&gt;
</code>

You can quickly rename it like so:

<code>
&lt;cfset this.name="findparishiltonsdignitysite2"&gt;
</code>

This is kind of hacky, but it will truly force ColdFusion to restart the application next time you hit it.

Another option, and what I typically use, is a URL hack:

<code>
&lt;cfif structKeyExists(url,"reset")&gt;
 &lt;cfset onSessionStart()&gt;
&lt;/cfif&gt;
</code>

This will <b>not</b> be single threaded, but during development, you typically don't care about it. I use this same hook to rerun onApplicationStart as well. In fact, during development I'll typically <i>always</i> run the code by appending OR 1 to the end.

Of course, the Nuclear Option is to restart ColdFusion, but even with ColdFusion 8 being super fast, that's overkill.