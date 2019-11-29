---
layout: post
title: "Settings cookies (with expiration, etc) in CFScript"
date: "2010-06-17T14:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/06/17/Settings-cookies-with-expiration-etc-in-CFScript
guid: 3850
---

From the department of "Code I will write once and forget about in a day" comes the setCookie UDF. Inspired by a question on Stack Overflow (<a href="http://stackoverflow.com/questions/3059924/how-to-set-expiration-date-on-a-cookie-in-cfscript">how to set expiration date on a cookie in cfscript</a>), the UDF allows you to set cookies in cfscript that have expiration dates. You can actually pass <i>all</i> the arguments if you want, like domain, httpOnly (CF9), etc. Here is the UDF:
<!--more-->
<p>

<code>
&lt;cffunction name="setCookie" access="public" returnType="void" output="false"&gt;
	&lt;cfargument name="name" type="string" required="true"&gt;
	&lt;cfargument name="value" type="string" required="false"&gt;
	&lt;cfargument name="expires" type="any" required="false"&gt;
	&lt;cfargument name="domain" type="string" required="false"&gt;
	&lt;cfargument name="httpOnly" type="boolean" required="false"&gt;
	&lt;cfargument name="path" type="string" required="false"&gt;
	&lt;cfargument name="secure" type="boolean" required="false"&gt;
	&lt;cfset var args = {}&gt;
	&lt;cfset var arg = ""&gt;
	&lt;cfloop item="arg" collection="#arguments#"&gt;
		&lt;cfif not isNull(arguments[arg])&gt;
			&lt;cfset args[arg] = arguments[arg]&gt;
		&lt;/cfif&gt;
	&lt;/cfloop&gt;

	&lt;cfcookie attributecollection="#args#"&gt;
&lt;/cffunction&gt;
</code>

<p>

And a few examples - although the first two calls are a bit silly - you wouldn't need the UDF for them:

<p>

<code>
&lt;cfscript&gt;
	if(!structKeyExists(cookie, "hitcount")) setCookie("hitcount",0);
	setCookie("hitcount", ++cookie.hitcount);
	setCookie("foreverknight",createUUID(),"never"); 
&lt;/cfscript&gt;

&lt;cfdump var="#cookie#"&gt;
</code>

<p>

Two small notes: First, if I were to add support to this in ColdFusion, I'd make it much easier. Just simply allow structs as values for cookies: cookie.booger = {% raw %}{ value="something", expires="never"}{% endraw %}. ColdFusion should be smart enough to translate that. Secondly - I noticed today that when a cookie is set to never, it gets set to a date in 2040. Anyone else realize that that date isn't that far away? Shoot - it's only a few days after HTML5 will be done. (I kid!)