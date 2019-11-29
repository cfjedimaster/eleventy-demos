---
layout: post
title: "Avoid ColdFusion Scope Names as Arguments"
date: "2012-03-08T09:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/03/08/Avoid-ColdFusion-Scope-Names-as-Arguments
guid: 4554
---

This question came in this morning. Looking at the code below, see if you can determine the issue. (Of course, the title of the blog entry is a bit of a give away.)

<p>
<!--more-->
<code>
&lt;cffunction name="onRequestStart" returntype="boolean" access="public"&gt;
  &lt;cfargument name="url" required="true" type="string"&gt;
  &lt;cfif StructKeyExists(url, "init")&gt;
  &lt;cfset onSessionStart()&gt;
  &lt;/cfif&gt;
  &lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

<p>

This is a fairly simple onRequestStart - and one based on a pattern I use quite a bit - specifically the init URL hook to restart something (normally the Application, but in this case the Session). When run, this gives the following error:

<p>

<blockquote>
You have attempted to dereference a scalar variable of type class java.lang.String as a structure with members.
</blockquote>

<p>

So what's the issue? By accident, the user named the argument to onRequestStart the same as one of ColdFusion's built-in scopes. By telling ColdFusion to pass the requested page as "url", it blew away the URL scope. Instead of a structure, URL was now a simple string.

<p>

Easy enough mistake to make - and I swear I looked at it for five minutes before I noticed it.