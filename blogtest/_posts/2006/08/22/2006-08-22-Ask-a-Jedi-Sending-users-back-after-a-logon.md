---
layout: post
title: "Ask a Jedi: Sending users back after a logon"
date: "2006-08-22T19:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/08/22/Ask-a-Jedi-Sending-users-back-after-a-logon
guid: 1487
---

This must be security week. Chris asked this:

<blockquote>
Is there a simple way to redirect users after login to the page they came from? 
</blockquote>

Sure is. Let's use a concrete example from <a href="http://ray.camdenfamily.com/projects/galleon">Galleon</a> . Galleon lets users browse the site but they can't write new posts until they sign in. I wanted to make it so that if you were viewing a thread and decided to login, you would be returned to that thread when done. Here is how I did it.

First I created a variable for the current page:

<code>
&lt;cfset thisPage = cgi.script_name & "?" & reReplace(cgi.query_string,"logout=1","")&gt;
</code>

Notice that I use the currently query string in order to get any URL variables. However, I use a URL variable to log people out so I have code to remove that. (This may not apply to your own site.) I then create a complete link to the login page:

<code>
&lt;cfset link = "login.cfm?ref=#urlEncodedFormat(thisPage)#"&gt;
</code>

The link contains a URL variable, ref, that is a pointer back to where I came from. My logon form is written to ensure it doesn't lose any URL variables. On a good logon, I then simply send the user back:

<code>
&lt;cfif request.udf.isLoggedOn()&gt;
	&lt;cfif isDefined("url.ref")&gt;
		&lt;cflocation url="#url.ref#" addToken="false"&gt;
	&lt;cfelse&gt;
		&lt;cflocation url="index.cfm" addToken="false"&gt;
	&lt;/cfif&gt;
</code>

Easy as pie, and I'm sure there are a hundred other ways of doing this as well.