---
layout: post
title: "Counting Sessions with Application.cfc"
date: "2007-03-15T13:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/03/15/Counting-Sessions-with-Applicationcfc
guid: 1893
---

A few days ago I <a href="http://ray.camdenfamily.com/index.cfm/2007/3/12/Counting-Sessions-with-Applicationcfm">posted</a> about how you could use ColdFusion to track the number of sessions in an application. One of themes of that post was how much easier Application.cfc makes this process. If you haven't read the first <a href="http://ray.camdenfamily.com/index.cfm/2007/3/12/Counting-Sessions-with-Applicationcfm">post</a>, please do so now. I'll wait.
<!--more-->
So first lets look at the Application.cfc file:

<code>
&lt;cfcomponent output="false"&gt;

&lt;cfset this.name = "sessioncounter2"&gt;
&lt;cfset this.sessionManagement = true&gt;

&lt;cffunction name="onApplicationStart" returnType="boolean" output="false"&gt;
	&lt;cfset application.sessions = structNew()&gt;
	&lt;cfreturn true&gt;
&lt;/cffunction&gt;

&lt;cffunction name="onSessionStart" returnType="void" output="false"&gt;
	&lt;cfset application.sessions[session.urltoken] = 1&gt;
&lt;/cffunction&gt;

&lt;cffunction name="onSessionEnd" returnType="void" output="false"&gt;
	&lt;cfargument name="sessionScope" type="struct" required="true"&gt;
	&lt;cfargument name="appScope" type="struct" required="false"&gt;
	
	&lt;cfset structDelete(arguments.appScope.sessions, arguments.sessionScope.urltoken)&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

The first method I have is onApplicationStart. Note that, outside of the cffunction and return tags, it is one line. For the heck of it, here is the code from the Application.cfm version:

<code>
&lt;cfset needInit = false&gt;
&lt;cflock scope="application" type="readOnly" timeout="30"&gt;
   &lt;cfif not structKeyExists(application,"sessions")&gt;
      &lt;cfset needInit = true&gt;
   &lt;/cfif&gt;
&lt;/cflock&gt;

&lt;!--- Yes, I do need to make it. ---&gt;
&lt;cfif needInit&gt;
   &lt;cflock scope="application" type="exclusive" timeout="30"&gt;
      &lt;cfif not structKeyExists(application,"sessions")&gt;
         &lt;cfset application.sessions = structNew()&gt;
      &lt;/cfif&gt;
   &lt;/cflock&gt;
&lt;/cfif&gt;
</code>

Which do you prefer? So just to be clear - the onApplicationStart method creates the structure we will use to count the sessions. We could use a list, but a structure makes it easy to insert/delete items. 

Moving on - the next method, onSessionStart, handles writing our session key to the Application structure. Again - notice that it is one line. This isn't much different from the Application.cfm file - but - there is one <b>crucial</b> difference. Because ours is in onSessionStart, it gets executed one time only. 

The last method, onSessionEnd, handles removing the session key from the application structure. If you remember from the last post I had to handle that myself in the sessionCount UDF. Now I don't need to worry about it. I simply remove myself from the Application structure. Do remember though that onSessionEnd can only access the Application scope via the passed in argument.

Ok - so lastly, let's look at the sessionCount UDF:

<code>
&lt;cffunction name="sessionCount" returnType="numeric" output="false"&gt;
	&lt;cfreturn structCount(application.sessions)&gt;
&lt;/cffunction&gt;
</code>

Nice, eh? You may ask - wny bother? I could certainly just output the result of the structCount myself. But the UDF is nice. What if I change from using an Application structure to a list? Or what if I store active sessions in the database? The UDF gives me a nice layer of abstraction.