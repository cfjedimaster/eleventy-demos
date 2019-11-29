---
layout: post
title: "ColdFusion Quickie - Run something no more than once every N minutes"
date: "2010-03-18T14:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/03/18/ColdFusion-Quickie-Run-something-no-more-than-once-every-N-minutes
guid: 3754
---

A <a href="http://www.cfsilence.com/">buddy</a> and I were chatting yesterday about a particular piece of logic he needed to implement. He wanted to have some particular code run on a page request, but no more than once every five minutes. Because it needed to happen on a page request, cfschedule would not have fit the bill. Therefore it needed to be bound to a particular request. I suggested the following simple bit of code.
<!--more-->
<p/>
<code>
&lt;cfcomponent output="false"&gt;

	&lt;cfset this.name = "demo"&gt;

	&lt;cffunction name="onApplicationStart" returnType="boolean" output="false"&gt;
		&lt;cfset application.lastprocess = now()&gt;
		&lt;cfreturn true&gt;
	&lt;/cffunction&gt;

	&lt;cffunction name="onRequestStart" returnType="boolean" output="false"&gt;
		&lt;cfargument name="thePage" type="string" required="true"&gt;

		&lt;cfif datediff("n", application.lastprocess, now()) gt 3&gt;
			&lt;cflog file="application" text="I'm doing that thing you asked me to do every few minutes."&gt;
			&lt;cfset application.lastprocess = now()&gt;
		&lt;/cfif&gt;

		&lt;cfif structKeyExists(url, "init") &gt;
			&lt;cfset onApplicationStart()&gt;
		&lt;/cfif&gt;

		&lt;cfreturn true&gt;
	&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>
<p/>
Not exactly rocket science, but the basic idea is to simply record the last time the process was run. This defaults to the application start up time. If more than 3 minutes (not 5 as I said earlier, wanted to make it easier to test) have passed, we run the process again and update the application variable. In this example the "process" is a cflog command, but it could really be anything. If your process is more than one line of code though you would want to abstract it out into it's own method. 
<p/>
So what's the big thing missing from this? Locking. The onRequestStart method is not single threaded. It is possible that two, or more, requests may end up running my process. So why didn't I lock it? I think it is important to remember that just because something <i>can</i> be run more than once, it doesn't alway simply that it is important enough to lock. I'll probably get some push back on that (bring it on, baby!) but if your process is something not impacted by multiple requests, then do you need to bother worrying about it? 
<p/>
That being said, if you did want to ensure that only one request ran the process, it wouldn't necessarily be a lot more work. Here is the modified version (just the onRequestStart method).
<p/>
<code>
&lt;cffunction name="onRequestStart" returnType="boolean" output="false"&gt;
	&lt;cfargument name="thePage" type="string" required="true"&gt;
	&lt;cfset var needToRunProcess = false&gt;
		
	&lt;cflock scope="application" type="readonly" timeout="30"&gt;
		&lt;cfif datediff("n", application.lastprocess, now()) gt 3&gt;
			&lt;cfset needToRunProcess = true&gt;	
		&lt;/cfif&gt;
	&lt;/cflock&gt;
	&lt;cfif needToRunProcess&gt;
		&lt;cflock scope="application" type="exclusive" timeout="30"&gt;
			&lt;cfif datediff("n", application.lastprocess, now()) gt 3&gt;
				&lt;cflog file="application" text="I'm doing that thing you asked me to do every few minutes."&gt;
				&lt;cfset application.lastprocess = now()&gt;
			&lt;/cfif&gt;			
		&lt;/cflock&gt;
	&lt;/cfif&gt;

	&lt;cfif structKeyExists(url, "init") &gt;
		&lt;cfset onApplicationStart()&gt;
	&lt;/cfif&gt;

	&lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>
<p/>
Certainly a bit more verbose, eh? The readOnly lock is a "gentler" lock that won't slow down the application quite as much. The exclusive lock is where the magic happens. Why do I duplicate the CFIF condition? It's possible that two threads can come in and set needToRunProcess to true. Only one thread can access the <i>inside</i> of the exclusive lock. I check it again because an earlier thread may have finished the update.