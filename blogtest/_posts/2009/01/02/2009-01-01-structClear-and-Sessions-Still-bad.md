---
layout: post
title: "structClear and Sessions - Still bad?"
date: "2009-01-02T09:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/01/02/structClear-and-Sessions-Still-bad
guid: 3174
---

In <a href="http://www.raymondcamden.com/index.cfm/2009/1/1/Ask-a-Jedi-cflogout-session-variables-and-the-back-button">yesterday's blog post</a> about cflogout, sessions, and the back button, there was a passing discussion about the structClear function and sessions. Phillip Senn asked if it was safe to use it on the session scope. It seems like it should be as long as you remember that this will not <b>end</b> the session but simply clear the current values.
<!--more-->
In the past, the warnings against structClear used to mention that clearing the session would also cause the "special" session variables: CFID, CFTOKEN, and SESSIONID, to be nuked. You can see that described here in this tech note: <a href="http://kb.adobe.com/selfservice/viewContent.do?externalId=tn_17479">ColdFusion 4.5 and the StructClear(Session) Function</a>

I was convinced that this wasn't the case in ColdFusion 6 and higher, but I whipped up a quick test to check first. I first wrote this code:

<code>
&lt;cfif structKeyExists(url, "clear")&gt;
	&lt;cfset structClear(session)&gt;
&lt;/cfif&gt;
&lt;cfparam name="session.hits" default="0"&gt;
&lt;cfset session.hits++&gt;
&lt;cfdump var="#session#"&gt;
</code>

This should increment a session variable named hits. If I add clear=1 to the URL it will clear the entire session. I ran this code a few times and confirmed it worked fine:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 130.png">

I then added clear=1 and got:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 218.png">

So it looks like the special variables are definitely cleared. However, the code had no problem setting hits back to 0 and then adding one to it. But get this - I reloaded without clear=1 in the URL and got:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 315.png">

Notice that urltoken is returned but not cfid, cftoken, or sessionid. Also notice that urltoken is right. It has the same cfid/cftoken values from before. So is my session screwed? It seems not. If I used cfid/cftoken/sessionid in my code though it would certainly fail (unless I parsed apart session.urltoken). 

I guess the old advice of clearing just want you need, or putting all your custom stuff into a session struct (session.data) and structClearing that, still holds true.