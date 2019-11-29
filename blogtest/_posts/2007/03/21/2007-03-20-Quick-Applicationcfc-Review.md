---
layout: post
title: "Quick Application.cfc Review"
date: "2007-03-21T09:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/03/21/Quick-Applicationcfc-Review
guid: 1909
---

A user sent in a request for me to look over some code he would like to use for his Application.cfc file. (As an aside, don't forget my online <a href="http://www.raymondcamden.com/downloads/app.pdf">Application.cfc</a> template you can use.) The template looked nice but had one main issue that I noticed. Since the user got the template from someone else, I won't post the whole thing as it isn't my code, but I will demonstrate the problem I saw.
<!--more-->
First is the onSessionStart:

<code>
&lt;cffunction name="onSessionStart" output="false"&gt; 
      &lt;cfscript&gt;
session.started = now();
      &lt;/cfscript&gt;
      
      &lt;cflock
scope="application" timeout="5" type="Exclusive"&gt;
         &lt;cfset
application.sessions = application.sessions + 1&gt;
      &lt;/cflock&gt;
&lt;/cffunction&gt;
</code>

Notice that he is keeping count of the sessions, a <a href="http://ray.camdenfamily.com/index.cfm/2007/3/15/Counting-Sessions-with-Applicationcfc">topic</a> I covered last week. Most importantly though - notice his lock. He is using a scope based lock to ensure his update of the application variable is single threaded. Now lets move on to the onSessionEnd method:

<code>
&lt;cffunction name="onSessionEnd" output="false"&gt;
&lt;cfargument name = "sessionScope" required=true/&gt;
&lt;cfargument name =
"applicationScope" required=true/&gt;
       &lt;cfset var sessionLength =
TimeFormat(Now() - sessionScope.started, "H:mm:ss")&gt;
       
       &lt;cflock
name="AppLock" timeout="5" type="Exclusive"&gt;
            &lt;cfset
arguments.applicationScope.sessions = arguments.applicationScope.sessions - 1&gt;
&lt;/cflock&gt;
&lt;/cffunction&gt;
</code>

(Forgive the bad formatting - this came in via email.) Notice the problem? Try to figure it out before reading on.

He correctly uses a lock again to update the session count. But he can't use a scope lock since the application scope isn't available directly in onSessionEnd. That's why he has to use the application scope passed in via arguments. 

So the problem then is that in one case he has a scope based lock and in another case he has a named based lock. He needs to use one or the other. Since he can't use a scope lock in onSessionEnd he should use the named based lock only.

p.s. A few other small things that I'll point out that are minor but bug me: I don't like using cfscript as he did here, just for one line of code. He also forgot the arguments prefix for sessionScope in onSessionEnd. I tend to be anal about using the arguments prefix in my methods.