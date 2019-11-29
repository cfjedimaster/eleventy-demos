---
layout: post
title: "CFAbort Still Firing onError"
date: "2005-11-02T22:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/02/CFAbort-Still-Firing-onError
guid: 894
---

So, at MAX I spoke about how cflocation and cfabort could fire the onError method in your Application.cfc error. I could have sworn this was all fixed up in 7.0.1, however, I'm seeing it fire again when I use code like so in my onRequestStart:

<code>
&lt;cfif findNoCase("/admin/", arguments.thePage)&gt;
		
	&lt;cfif not isAuthenticated()&gt;
		&lt;cfinclude template="/#application.mapping#/wwwroot/admin/login.cfm"&gt;
		&lt;cfabort&gt;
	&lt;/cfif&gt;
	
&lt;/cfif&gt;
</code>

Now, obviously I can use the same <a href="http://ray.camdenfamily.com/index.cfm?mode=entry&entry=ED9D4058-E661-02E9-E70A41706CD89724">hacks</a> as before, but it looks like I need to file a new bug report.