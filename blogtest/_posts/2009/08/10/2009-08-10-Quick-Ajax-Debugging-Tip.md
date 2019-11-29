---
layout: post
title: "Quick Ajax Debugging Tip"
date: "2009-08-10T17:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/10/Quick-Ajax-Debugging-Tip
guid: 3480
---

Ok, so this has been bugging me for the past few hours so I thought I'd share a quick hack. I've got a prototype I'm working on for a client that has a bit of Ajax in it. My Application.cfc code comes from a snippet I have in ColdFusion Builder and has the following onError:

<code>
&lt;cffunction name="onError" returnType="void" output="false"&gt;
	&lt;cfargument name="exception" required="true"&gt;
	&lt;cfargument name="eventname" type="string" required="true"&gt;
	&lt;cfdump var="#arguments#"&gt;&lt;cfabort&gt;
&lt;/cffunction&gt;
</code>

Short and simple. An ugly dump is fine for testing. However, when an Ajax called was made, Firebug displayed a butt load of HTML (the dump) and it was difficult to find the exact message. I just changed it to the following code and it was incredibly helpful. Still not something I'd recommend on production, but I may change my snippet to support this:

<code>
&lt;cffunction name="onError" returnType="void" output="false"&gt;
	&lt;cfargument name="exception" required="true"&gt;
	&lt;cfargument name="eventname" type="string" required="true"&gt;
	&lt;cfif structKeyExists(url, "method")&gt;
		&lt;cfoutput&gt;
		message=#arguments.exception.message#
		detail=#arguments.exception.detail#
		&lt;/cfoutput&gt;
		&lt;cfabort&gt;
	&lt;cfelse&gt;
		&lt;cfdump var="#arguments#"&gt;&lt;cfabort&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;
</code>

Basically, if method exists in the URL, assume it's Ajax. (I could also check the headers, as described <a href="http://www.insideria.com/2009/04/jqueryserver-side-tip-on-detec.html">here</a>.)