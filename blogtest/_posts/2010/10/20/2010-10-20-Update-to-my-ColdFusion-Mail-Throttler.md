---
layout: post
title: "Update to my ColdFusion Mail Throttler"
date: "2010-10-20T22:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/10/20/Update-to-my-ColdFusion-Mail-Throttler
guid: 3977
---

Last week I wrote a quick proof of concept that demonstrated a simple mail throttler for ColdFusion. The idea was that you may have some automatic mail process that you do not want to get overwhelmed with. Read the <a href="http://www.raymondcamden.com/index.cfm/2010/10/14/Proof-of-Concept--Throttling-automatic-emails-in-ColdFusion">previous blog entry</a> for full details and the original code. <a href="http://blog.pengoworks.com/">Dan Switzer</a> commented that my method for "merging" dynamic emails (with a regex) could be done much simpler if I allowed people to simply name the emails. So with that in mind I've added the support for a cachename value. This actually takes priority over regex as the more I think about it, the more I think folks will prefer it over the regex option. Here is the new component.
<!--more-->
<code>
&lt;cfcomponent output="false"&gt;

&lt;cfset variables.cache = {}&gt;

&lt;cffunction name="throttleSend" access="public" output="false" returnType="boolean"&gt;
	&lt;cfargument name="mail" type="struct" required="true" hint="Structure of args for the mail."&gt;
	&lt;cfargument name="limit" type="numeric" required="true" hint="Number of minutes to wait before sending again."&gt;
	&lt;cfargument name="cachename" type="string" required="false" hint="Used to name the email in terms of uniqueness. If used, the email contents won't be used to check for uniqueness."&gt;	
	&lt;cfargument name="regex" type="string" required="false" hint="This regex is performed on your mail body. Helps remove items that may be dynamic in the body but should not be considered for caching."&gt;	
	
	&lt;!--- used for required mail tags ---&gt;
	&lt;cfset var reqlist = "to,from,subject,body"&gt;
	&lt;cfset var l = ""&gt;
	&lt;cfset var body = ""&gt;
	&lt;cfset var cacheBody = ""&gt;
	&lt;cfset var hashKey = ""&gt;
	
	&lt;!--- quickly validate the mail object ---&gt;
	&lt;cfloop index="l" list="#reqlist#"&gt;
		&lt;cfif not structKeyExists(arguments.mail, l)&gt;
			&lt;cfthrow message="mail object is missing required key #l#"&gt;
		&lt;/cfif&gt;
	&lt;/cfloop&gt;
	
	&lt;!--- Ok, first, create the hash ---&gt;
	&lt;cfset body = arguments.mail.body&gt;
	&lt;cfif structKeyExists(arguments, "cachename")&gt;
		&lt;cfset hashKey = arguments.cachename&gt;
	&lt;cfelseif structKeyExists(arguments, "regex")&gt;
		&lt;cfset cacheBody = rereplace(body,regex,"","all")&gt;
		&lt;cfset hashKey = hash(arguments.mail.to & " " & arguments.mail.subject & " " & cacheBody)&gt;
	&lt;cfelse&gt;
		&lt;cfset hashKey = hash(arguments.mail.to & " " & arguments.mail.subject & " " & body)&gt;
	&lt;/cfif&gt;
	

	&lt;!--- If we already sent it and it hasn't expired, don't do squat ---&gt;
	&lt;cfif structKeyExists(variables.cache, hashKey) and dateCompare(now(), variables.cache[hashKey]) is -1&gt;
		&lt;cfreturn false&gt;
	&lt;/cfif&gt;

	&lt;!--- Ok, so we need to mail ---&gt;
	&lt;cfmail attributecollection="#arguments.mail#"&gt;#body#&lt;/cfmail&gt;

	&lt;cfset variables.cache[hashKey] = dateAdd("n", arguments.limit, now())&gt;
	&lt;cfreturn true&gt;
	
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

<p/>

And here is a new test script that shows all three options .

<p/>

<code>

&lt;cfapplication name="mtdemo"&gt;

&lt;cfif not structKeyExists(application, "throttler") or structKeyExists(url,"init")&gt;
	&lt;cfset application.throttler = new mailthrottle()&gt;
&lt;/cfif&gt;

&lt;cfset mailOb = {
	to="ray@camdenfamily.com",
	from="ray@camdenfamily.com",
	subject="Error about X!",
	body="This is the body of the email."
}&gt;

&lt;cfset res = application.throttler.throttleSend (mailOb,2)&gt;

&lt;cfoutput&gt;result was #res#&lt;/cfoutput&gt;
&lt;p/&gt;

&lt;cfset mailOb = {
	to="ray@camdenfamily.com",
	from="ray@camdenfamily.com",
	subject="Error about X!",
	body="This is the body of the email. Random: #randRange(1,100)#"
}&gt;

&lt;cfset res = application.throttler.throttleSend (mail=mailOb,limit=2,regex="Random: [0-9]{% raw %}{1,3}{% endraw %}")&gt;

&lt;cfoutput&gt;result was #res#&lt;/cfoutput&gt;

&lt;p/&gt;

&lt;cfset mailOb = {
	to="ray@camdenfamily.com",
	from="ray@camdenfamily.com",
	subject="Error about Y!",
	body="This is the body of the email. Random: #randRange(1,100)#"
}&gt;

&lt;cfset res = application.throttler.throttleSend (mail=mailOb,limit=2,cacheName="Error Email Y")&gt;

&lt;cfoutput&gt;result was #res#&lt;/cfoutput&gt;
</code>

<p/>

The final example shows the cacheName in action. Useful?