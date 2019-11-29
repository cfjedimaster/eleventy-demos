---
layout: post
title: "Handling unknown events in Model-Glue"
date: "2006-11-05T20:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/11/05/Handling-unknown-events-in-ModelGlue
guid: 1634
---

What happens in a Model-Glue application when you pass in an unknown event? An error is thrown. While this makes sense - it may not be desired behavior for an application. For example - I'd probably consider most unknown events to be 404 errors. So how can you handle it?
<!--more-->
Model-Glue lets you define the event to fire when an error occurs. In Model-Glue: Unity you can find this setting in the ColdSpring.xml file

<code>
&lt;property name="defaultExceptionHandler"&gt;&lt;value&gt;exception&lt;/value&gt;&lt;/property&gt;
</code>

The "out of the box" exception event in Model-Glue prints out a few pieces of information from the exception. Obviously you wouldn't have that on a live site. Normally I simply take the exception and mail it to myself (along with the form, url, and session scopes). 

So how did I handle the unknown event? The first thing I did was dump the exception that Model-Glue was throwing. I was hoping a certain code would be thrown, but the only information I could use was the exception message. It was in this form:

<blockquote>
Model-Glue: There is no known event handler for "x".
</blockquote>

So I first added this to my exception file:

<code>
&lt;!--- 
Look for event handler missing.
---&gt;
&lt;cfif findNoCase("Model-Glue: There is no known event handler for", exception.message)&gt;
	&lt;cflocation url="/"&gt;
&lt;/cfif&gt;
</code>

When this didn't work - I did a quick view source and discovered there were two spaces between Model-Glue: and the message. So I quickly changed it to:

<code>
&lt;!--- 
Look for event handler missing.
---&gt;
&lt;cfif findNoCase("Model-Glue:  There is no known event handler for", exception.message)&gt;
	&lt;cflocation url="/"&gt;
&lt;/cfif&gt;
</code>

Obviously you should consider doing more than just sending the user away. You could log the event to the database and see if there is a particular event being called multiple times. 

You could also use logic to check for typos or commonly mistyped URLs. For example - someone keeps trying to load the event, "page.rss/", at <a href="http://www.riaforge.org">RIAForge</a>. Notice the / at the end? I whipped up this code to handle it:

<code>
&lt;cfif findNoCase("Model-Glue:  There is no known event handler for", exception.message)&gt;
	&lt;cfset unknownEvent = rereplace(exception.message, ".*""(.*?)"".*", "\1")&gt;
	&lt;cfif unknownEvent is "page.rss/"&gt;
		&lt;cflocation url="#viewState.getValue("myself")#page.rss" addToken="false"&gt;
	&lt;cfelse&gt;
		&lt;cflocation url="/"&gt;
	&lt;/cfif&gt;
&lt;/cfif&gt;
</code>

By the way - I bugged Joe to consider adding a "Unknown Event" configuration setting to the framework.