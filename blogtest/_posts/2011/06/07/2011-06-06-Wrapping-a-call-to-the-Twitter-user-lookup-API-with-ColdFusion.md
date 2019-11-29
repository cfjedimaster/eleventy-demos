---
layout: post
title: "Wrapping a call to the Twitter user lookup API with ColdFusion"
date: "2011-06-07T08:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/06/07/Wrapping-a-call-to-the-Twitter-user-lookup-API-with-ColdFusion
guid: 4260
---

I just wrote a quick UDF (available now on <a href="http://www.cflib.org/udf/getTwitterUser">CFLib</a>) that wraps the call to Twitter's user look up system. Like most Twitter APIs, this one is ridiculously simple, but I need this code for another project I'm working on (technically I need it in Flex, but the ColdFusion version helps me understand how I'll write that) so I thought I'd write it up real quick like. Here is getTwitterUser:
<!--more-->
<p>

<code>
&lt;cffunction name="getTwitterUser" output="false" returnType="struct"&gt;
	&lt;cfargument name="screenname" type="string" required="true"&gt;
	&lt;cfset var httpResult = ""&gt;
	
	&lt;!--- remove the @ if they included it. ---&gt;
	&lt;cfif left(arguments.screenname,1) is "@"&gt;
		&lt;cfset arguments.screenname = right(arguments.screenname, len(arguments.screenname)-1)&gt;
	&lt;/cfif&gt;
	
	&lt;cfset var theUrl = "http://api.twitter.com/1/users/show.json?screen_name=#arguments.screenname#"&gt;
	
	&lt;cfhttp url="#theUrl#" result="httpResult"&gt;
	&lt;cfset var result = deserializeJSON(httpResult.filecontent)&gt;

	&lt;cfreturn result&gt;	
&lt;/cffunction&gt;
</code>

<p>

I'd rather that be in script to be honest, but that wouldn't be difficult to rewrite. Usage then is pretty trivial. If you ask for a user that exists, you get a large structure back. If you get one that does not, you get an error key in the struct. Here's example code:

<p>

<code>
&lt;cfset res = getTwitterUser("cfjedimaster")&gt;
&lt;cfif structKeyExists(res, "name") and structKeyExists(res, "profile_image_url")&gt;
	&lt;cfoutput&gt;
	&lt;p&gt;
	&lt;img src="#res.profile_image_url#" align="left"&gt; #res.name#
	&lt;br clear="left"&gt;
	&lt;/p&gt;
	&lt;/cfoutput&gt;
&lt;/cfif&gt;

&lt;cfdump var="#getTwitterUser('cfjedimaster221920')#"&gt;
</code>

<p>

And the result...

<p>


<img src="https://static.raymondcamden.com/images/ScreenClip109.png" />