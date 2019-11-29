---
layout: post
title: "Ask a Jedi: Preventing direct access to a CFC"
date: "2007-07-19T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/19/Ask-a-Jedi-Preventing-direct-access-to-a-CFC
guid: 2202
---

Chad asks:

<blockquote>
I am using a CFC
for an AJAX-based shopping cart and it works great.  But along comes a customer
who is behind a proxy.  The proxy is trying to request the CFC through a GET
request (instead of a POST).  Of course, when you try to access a CFC directly,
it redirects the browser to the ColdFusion Component Browser.  I have tried
everything I know to keep the proxy from trying to access this page directly,
but nothing seems to work.  Any suggestions?
</blockquote>

For folks who don't get what Chad is talking about, ColdFusion has a feature where if you access a CFC in your browser, you get a nicely formatted HTML page that describes the CFC and what it can do. (If you authenticate first.) You only get this if you don't specify a specific method. While this is nice and all, it may not be what you desire. You may - for example, want to share the documentation for a CFC and have it be something you wrote yourself. This way folks don't need your CF Admin password.

So what's cool about this question is that there is a really simple, very trivial solution. <a href="http://www.markdrew.co.uk/blog/">Mark Drew</a> used this for his SnipEx code and it's just brilliant. I mean it's obvious - but it never occurred to me! Consider the simple CFC below:

<code>
&lt;cfcomponent output="false"&gt;

&lt;cffunction name="sayHi" access="remote" returnType="string" output="false"&gt;
	&lt;cfargument name="name" type="string" required="false" default="Nameless"&gt;
	
	&lt;cfreturn "Hello, #arguments.name#"&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

If you view this CFC in your browser and do not pass a method in the query string, you will get prompted to authenticate to your CF Admin and then you will get the nice documentation. But now look at this version:

<code>
&lt;cfcomponent output="false"&gt;

&lt;cfif not structKeyExists(url, "method")&gt;
	&lt;cfset url.method = "sayHi"&gt;
&lt;/cfif&gt;

&lt;cffunction name="sayHi" access="remote" returnType="string" output="false"&gt;
	&lt;cfargument name="name" type="string" required="false" default="Nameless"&gt;
	
	&lt;cfreturn "Hello, #arguments.name#"&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

All I've done here is add code to notice the lack of a method in the query string. If it is missing, a default method is specified. Simple, right? Of course this disables the "auto-documentation", but it may be exactly what you want to do.