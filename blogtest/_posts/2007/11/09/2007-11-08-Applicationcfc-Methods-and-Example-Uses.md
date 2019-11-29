---
layout: post
title: "Application.cfc Methods and Example Uses"
date: "2007-11-09T11:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/09/Applicationcfc-Methods-and-Example-Uses
guid: 2464
---

A reader commented yesterday that my <a href="http://www.raymondcamden.com/downloads/application.cfc.txt">Application.cfc reference</a> doesn't really say <i>how</i> to use the various methods. Since my reference is intended to be a simple code skeleton, I thought I'd quickly explain each of the methods and possible uses for them. Using my skeleton as a guide, let's cover the methods in order.

<more>

<b>onApplicationStart</b><br />
This method is run when the application starts up. Anything you want to define <b>once</b> in the life cycle of your application should be defined here. Typically this is where you will set your Application variables:

<code>
&lt;cffunction name="onApplicationStart" returnType="boolean" output="false"&gt;
  &lt;cfset application.dsn = "empire"&gt;
  &lt;cfset application.foo = "some other variable"&gt;
  &lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

<b>onApplicationEnd</b><br />
This method is run when the application ends. You could use it for logging. Frankly, I've never used it. It's nice that it is there and all, but I haven't had a practical need for it. Since every hit will reset the application time out, and applications only timeout after two hours, only a site with minimal traffic will ever even run this.

It is important to remember that you can <b>cannot</b> use the Application scope here. The application is over, remember? ColdFusion passes a copy of the Application scope to the method though and you can introspect that.

<b>onMissingTemplate</b><br />
Now this is a nice one. This method is run when a request for a CFM results in a file not found. <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers.org</a> uses this. For a full blog entry on it, see: <a href="http://www.coldfusionjedi.com/index.cfm/2007/7/20/onMissingTemplate-Example">onMissingTemplate Example</a>

<b>onRequestStart</b><br />
This method is run before your request begins. You <i>could</i> use it to include a header, but I think this is a bad idea. I wouldn't mix display code inside your Application.cfc. Also - there may be cases where you don't want a header (like a CFM file that returns XML or JSON). You could use it to cfinclude a UDF library. Thing is - you don't have access to the Variables scope of your page here. So if you do use this method to include a UDF library, be sure to copy your UDFs into the request scope. That's something I like to do anyway since it allows me to call the UDFs from custom tags if I need them.

<b>onRequest</b><br />
AKA "that darn method that breaks CFCS" - onRequest is an odd one. It is run before your requested CFM actually runs, so in a way it is like onRequestStart, but onRequest actually represents the request itself. If you do not actually cfinclude the file that was requested, then nothing will be run. Because of this - you can't easily use onRequest with CFCs. (A bug I wish Adobe would fix.) A work around for this involves sniffing the type of request and actually deleting the methods on the fly (I believe Sean Corfield first described this method):

<code>
&lt;cfif listlast(cgi.path_info,".") is "cfc"&gt;
&lt;cfset StructDelete( THIS, "OnRequest" ) /&gt;
&lt;cfset StructDelete(variables,"onRequest")/&gt;
&lt;/cfif&gt;
</code>

onRequest also has the interesting side effect of copying all the CFC methods into your local Variables scope of your CFC. Not a big deal, but don't be surprised if you cfdump the variables scope. Because of this - if you cfinclude a UDF library here, you don't need to copy them to the request scope.

<b>onRequestEnd</b><br />
This is run when the request ends. You may be tempted to do a footer here - but again, I'd recommend against it. Honestly, I've never found a real good use for this. You could use it to log a user's "path" through your system:

<code>
&lt;cfif not structKeyExists(session, "path")&gt;
  &lt;cfset session.path = arrayNew(1)&gt;
&lt;/cfif&gt;
&lt;cfset arrayAppend(session.path, arguments.thePage)&gt;
</code>

This could be useful for logging metrics. Then again - this same code could be used in onRequestStart.

<b>onError</b><br />
Run when errors occur, you should use this to handle errors for your sites gracefully. Way too many people don't use this and expose errors to your users. That's just plain wrong. It takes all of two seconds to send the error to yourself via email and show a simple "We're sorry" message to your users.

<b>onSessionStart</b><br />
Like onApplicationStart, you would put any code here that should only run once per a user's session. Any session variables that you want to exist should be set here.

<code>
&lt;cffunction name="onSessionStart" returnType="boolean" output="false"&gt;
  &lt;cfset session.hits = 0&gt;
  &lt;cfset session.name = ""&gt;
  &lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

<b>onSessionEnd</b><br />
This is run when the session ends. Like onApplicationEnd, you can't directly access the user's session. You can, however, access a copy passed in as an argument. The Application scope is also passed in asn argument. Unlike onApplicationEnd, onSessionEnd can be very useful. It can help you determine what your user did last before his session expired. I wrote a whole blog entry on this you might find interesting: <a href="http://www.coldfusionjedi.com/index.cfm/2006/10/20/How-ColdFusion-can-save-you-business">How ColdFusion can save your business!</a>

I hope this helps. While writing I found another, even long, excellent article by Ben Nadel. His also goes into the variables you can set in Application.cfc: <a href="http://www.bennadel.com/blog/726-ColdFusion-Application-cfc-Tutorial-And-Application-cfc-Reference.htm"> ColdFusion Application.cfc Tutorial And Application.cfc Reference</a>